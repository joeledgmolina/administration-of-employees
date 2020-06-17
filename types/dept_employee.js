const graphql = require('graphql');
const graphql_iso_date = require('graphql-iso-date');
const gnx = require('@simtlix/gnx');

const {
    GraphQLString, GraphQLID, GraphQLObjectType
} = graphql;

const {
    GraphQLDate,
} = graphql_iso_date;

/**Models */
const Dept_Employee = require('../models/dept_employee').Dept_Employee;
const Employee = require('../models/employee').Employee;
const Department = require('../models/department').Department;

/**Types */
const EmployeeType = require('./employee');
const DepartmentType = require('./department');

/**Validations */
const {
    FromDateMustBeSmallerThanToDate,
    CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTime
} = require('../validators/dept_employee.validator');

const DeptEmployeeType = new GraphQLObjectType({
    name: 'EmployeeDepartmentType',
    description: 'Represent department of employees',
    extensions: {
        validations: {
          'CREATE':
          [
            FromDateMustBeSmallerThanToDate,
            CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTime
          ],
          'UPDATE' :
          [
            FromDateMustBeSmallerThanToDate,
            CantTwoEmployeesAssignedToTheSameDepartmentAtTheSameTime
          ],
        },
      },
    fields: () => ({
        id: {type: GraphQLID},
        employee: {
            type: EmployeeType,
            extensions: {
                relation: {
                connectionField: 'empId',
                embedded: false
                },
            },
            resolve(parent, args) {
                return Employee.findById(parent.empId);
            },
        },
        department: {
            type: DepartmentType,
            extensions: {
                relation: {
                connectionField: 'deptId',
                embedded: false
                },
            },
            resolve(parent, args) {
                return Department.findById(parent.deptId);
            },
        },
        from_date: {type: GraphQLDate},
        to_date: {type: GraphQLDate},
    }),
});

gnx.connect(Dept_Employee, DeptEmployeeType, 'dept_employee', 'dept_employees');

module.exports = DeptEmployeeType;