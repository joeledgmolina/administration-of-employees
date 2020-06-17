const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const {Employee} = require('../models/employee');
const {Salary} = require('../models/salary');
const {Title} = require('../models/title');
const {Dept_Employee} = require('../models/dept_employee');
const {Dept_Manager} = require('../models/dept_manager');

/**Restriction : Can't exist more than one employee with the same dni */
const CantRepeatDNI ={
    validate: async function(typeName, originalObject, materializedObject) {
        const EmployeeFinded =
        await Employee.findOne({ dni: materializedObject.dni });
        if (EmployeeFinded && EmployeeFinded._id != materializedObject.id) {
            throw new CantExistMoreThanOneEmployeeWithTheSameDNIError(typeName);
        }
    }
};
class CantExistMoreThanOneEmployeeWithTheSameDNIError extends GNXError {
    constructor(typeName) {
        super(typeName,'DNI cant be repeated', 'CantExistMoreThanOneEmployeeWithTheSameDNIError');
    }
};

/**Restriction : Employee must have more than 18 years old*/
/**Function used in for check if an employee have more than 18 years old */
function calculateEmployeeAge (birth_date){
    /**current date */
    var currentDate= new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();
    /**employee birthday */
    var birth_dateYear = birth_date.getFullYear();
    var birth_dateMonth = birth_date.getMonth() + 1;
    var birth_dateDay = birth_date.getDate();
    /**calculate diff between both dates */ 
    var years, months, days;
    years = currentYear - birth_dateYear;
    months = currentMonth - birth_dateMonth;
    days = currentDay - birth_dateDay;

    if (years > 18 ){
        return true;
    }
    else if(years == 18){
        if (months > 0){
            return true;
        }
        else {
            if (days > 0){
                return true;
            }
            else return false;
        }
    }
    else {
        return false;
    }

}

const EmployeeMustHaveMoreThan18YearsOld ={
    validate: async function(typeName, originalObject, materializedObject) {
        const EmployeeIsGreaterThan18 = await calculateEmployeeAge(materializedObject.birth_date);
        /**If the age is less than 18 */
        if (!EmployeeIsGreaterThan18) {
            throw new CantCreateEmployeeUnderTheAgeOf18Error(typeName);
        }
    }
};
class CantCreateEmployeeUnderTheAgeOf18Error extends GNXError {
    constructor(typeName) {
        super(typeName,'Employee must have more than 18 years old', 'CantCreateEmployeeUnderTheAgeOf18Error');
    }
};

/**Restriction: Can't delete a child from a relation */
const CantDeleteEmployeeWithAssociatedRelations ={
    validate: async function(typeName, originalObject, materializedObject) {
        const SalaryFinded = await Salary.findOne({'empId': originalObject});
        const TitleFinded = await Title.findOne({'empId': originalObject});
        const DeptEmployeeFinded = await Dept_Employee.findOne({'empId': originalObject});
        const DeptManagerFinded = await Dept_Manager.findOne({'empId': originalObject});

        if (SalaryFinded) { throw new CantDeleteEmployeeWithSalaryError(typeName); }
        if (TitleFinded) { throw new CantDeleteEmployeeWithTitleError(typeName); }
        if (DeptEmployeeFinded) { throw new CantDeleteEmployeeWithDeptEmployeeError(typeName); }
        if (DeptManagerFinded) { throw new CantDeleteEmployeeWithDeptManagerError(typeName); }
    }};
class CantDeleteEmployeeWithSalaryError extends GNXError {
    constructor(typeName) {
        super(typeName,'The employee has an associated salary', 'CantDeleteEmployeeWithSalaryError');
    }
};
class CantDeleteEmployeeWithTitleError extends GNXError {
    constructor(typeName) {
        super(typeName,'The employee has an associated title', 'CantDeleteEmployeeWithTitleError');
    }
};
class CantDeleteEmployeeWithDeptEmployeeError extends GNXError {
    constructor(typeName) {
        super(typeName,'The employee has an associated dept_employee', 
                        'CantDeleteEmployeeWithDeptEmployeeError');
    }
};
class CantDeleteEmployeeWithDeptManagerError extends GNXError {
    constructor(typeName) {
        super(typeName,'The employee has an associated dept_manager', 
                        'CantDeleteEmployeeWithDeptManagerError');
    }
};

module.exports ={
    CantRepeatDNI,
    EmployeeMustHaveMoreThan18YearsOld,
    CantDeleteEmployeeWithAssociatedRelations
};