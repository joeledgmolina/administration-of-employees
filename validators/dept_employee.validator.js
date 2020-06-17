const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const {Dept_Employee} = require('../models/dept_employee');

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

/**Restriction: Can't be 2 employees assigned to the same department in the same portion of time */
const CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTime = {
    validate: async function(typeName, originalObject, materializedObject){
        const EmployeeAssigned = 
        await Dept_Employee.findOne({
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
        if (EmployeeAssigned && EmployeeAssigned._id != materializedObject.id) {
            throw new CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTimeError(typeName);
        }
    } 
};

class CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTimeError extends GNXError {
    constructor(typeName){
        super(typeName, 'Cant be 2 employees assigned to the same department in the same portion of time',
                        'CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTimeError');
    }
};

module.exports ={
    FromDateMustBeSmallerThanToDate,
    CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTime
};