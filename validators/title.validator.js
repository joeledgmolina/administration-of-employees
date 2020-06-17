const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const {Employee} = require('../models/employee');
const {Title} = require('../models/title');
const {Dept_Employee} = require('../models/dept_employee');

/**The same employee cannot have 2 titles with the same dept_name */
const OneEmployeeCantHaveTwoTitlesInTheSameDepartmentName ={
    validate: async function(typeName, originalObject, materializedObject) {
        const EmployeeFinded =
        await Title.findOne({
            $and : [
                { empId : materializedObject.empId },
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
        if (EmployeeFinded && EmployeeFinded._id != materializedObject.id) {
            throw new OneEmployeeCantHaveTwoTitlesInTheSameDepartmentNameError(typeName);
        }
    }
};
class OneEmployeeCantHaveTwoTitlesInTheSameDepartmentNameError extends GNXError {
    constructor(typeName) {
        super(typeName,'One employee cant have two titles in the same department name', 
                        'OneEmployeeCantHaveTwoTitlesInTheSameDepartmentNameError');
    }
};

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

module.exports ={
    OneEmployeeCantHaveTwoTitlesInTheSameDepartmentName,
    FromDateMustBeSmallerThanToDate
};