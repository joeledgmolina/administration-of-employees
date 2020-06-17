const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const {Department} = require('../models/department');
const {Dept_Employee} = require('../models/dept_employee');
const {Dept_Manager} = require('../models/dept_manager');

/**Restriction: Can't be 2 departments with the same dept_name */
const CantRepeatDeptName ={
    validate: async function(typeName, originalObject, materializedObject) {
        const DepartmentFinded =
        await Department.findOne({ dept_name: materializedObject.dept_name });

        if (DepartmentFinded && DepartmentFinded._id != materializedObject.id) {
            throw new CantExistMoreThanOneDepartmentWithTheSameDeptNameError(typeName);
        }
    }
};

class CantExistMoreThanOneDepartmentWithTheSameDeptNameError extends GNXError {
    constructor(typeName) {
        super(typeName,'Department Name cant be repeated', 'CantExistMoreThanOneDepartmentWithTheSameDeptNameError');
    }
};

/**Can't delete a child from a relation  */
const CantDeleteDepartmentWithAssociatedRelations ={
    validate: async function(typeName, originalObject, materializedObject) {
        const DeptEmployeeFinded = await Dept_Employee.findOne({'deptId': originalObject});
        const DeptManagerFinded = await Dept_Manager.findOne({'deptId': originalObject});

        if (DeptEmployeeFinded) { throw new CantDeleteDepartmentWithDeptEmployeeError(typeName); }
        if (DeptManagerFinded) { throw new CantDeleteDepartmentWithDeptManagerError(typeName); }
    }};
class CantDeleteDepartmentWithDeptEmployeeError extends GNXError {
    constructor(typeName) {
        super(typeName,'The department has an associated dept_employee', 
                        'CantDeleteDepartmentWithDeptEmployeeError');
    }
};
class CantDeleteDepartmentWithDeptManagerError extends GNXError {
    constructor(typeName) {
        super(typeName,'The department has an associated dept_manager', 
                        'CantDeleteDepartmentWithDeptManagerError');
    }
};

module.exports ={
    CantRepeatDeptName,
    CantDeleteDepartmentWithAssociatedRelations
};