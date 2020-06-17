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
const Dept_Manager = require('../models/dept_manager').Dept_Manager;
const Employee = require('../models/employee').Employee;
const Department = require('../models/department').Department;

/**Types */
const EmployeeType = require('./employee');
const DepartmentType = require('./department');

/**Validations */
const {
    FromDateMustBeSmallerThanToDate,
    CantTwoManagersAssignedToTheSameDepartmentAtTheSameTime
} = require('../validators/dept_manager.validator');

const DeptManagerType = new GraphQLObjectType({
    name: 'ManagersDepartmentType',
    description: 'Represent department of managers',
    extensions: {
        validations: {
          'CREATE':
          [
            FromDateMustBeSmallerThanToDate,
            CantTwoManagersAssignedToTheSameDepartmentAtTheSameTime
          ],
          'UPDATE' :
          [
            FromDateMustBeSmallerThanToDate,
            CantTwoManagersAssignedToTheSameDepartmentAtTheSameTime
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

gnx.connect(Dept_Manager, DeptManagerType, 'dept_manager', 'dept_managers');

module.exports = DeptManagerType;