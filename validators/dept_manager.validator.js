const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const {Dept_Manager} = require('../models/dept_manager');

/**Restriction: from_date must be smaller than to_date */
function compareDates(date1, date2){
    var from_date = new Date(date1);
    var to_date = new Date(date2);
    if (from_date <= to_date) return true
    else return false;
}

const FromDateMustBeSmallerThanToDate ={
    validate: async function(typeName, originalObject, materializedObject) {
        const DatesAreValids =
        await compareDates(materializedObject.from_date, materializedObject.to_date);
        /**If from_date is greather than to_date then return an error */
        if (!DatesAreValids) {
            throw new FromDateCantBeGreaterThanToDateError(typeName);
        }
    }
};

class FromDateCantBeGreaterThanToDateError extends GNXError {
    constructor(typeName) {
        super(typeName,'from_date cant be greater than to_date', 'FromDateCantBeGreaterThanToDateError');
    }
};

/**Can't be 2 managers assigned to the same department in the same portion of time 
 * Example: if an employee is manager of the software department from 2018-03-31 to 2019-03-31 
 * then another employee cannot be manager of the software department  from 2019-01-01 to 2020-01-01
*/
const CantTwoManagersAssignedToTheSameDepartmentAtTheSameTime = {
    validate: async function(typeName, originalObject, materializedObject){
        const ManagerAssigned = 
        await Dept_Manager.findOne({
            $and : [
                { deptId : materializedObject.deptId },
                { $or : [
                    { $and : [
                        { from_date : { $gt : materializedObject.from_date } }, 
                        { from_date : { $lt : materializedObject.to_date } }    
                    ]},
                    { $and : [
                        { from_date : { $eq : materializedObject.from_date } }, 
                        { to_date : { $eq : materializedObject.to_date } }  
                    ]},
                    { $and : [
                        { to_date : { $gt : materializedObject.from_date } }, 
                        { to_date : { $lt : materializedObject.to_date } }    
                    ]} 
                ]}
            ]
        });
        if (ManagerAssigned && ManagerAssigned._id != materializedObject.id) {
            throw new CantTwoManagersAssignedToTheSameDepartmentAtTheSameTimeError(typeName);
        }
    } 
};

class CantTwoManagersAssignedToTheSameDepartmentAtTheSameTimeError extends GNXError {
    constructor(typeName){
        super(typeName, 'Cant be 2 managers assigned to the same department in the same portion of time',
                        'CantTwoManagersAssignedToTheSameDepartmentAtTheSameTimeError');
    }
};

module.exports ={
    FromDateMustBeSmallerThanToDate,
    CantTwoManagersAssignedToTheSameDepartmentAtTheSameTime
};