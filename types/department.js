const graphql = require('graphql');
const gnx = require('@simtlix/gnx');

const {
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList
} = graphql;

/**Models */
const Department = require('../models/department').Department;
const Dept_Employee = require('../models/dept_employee').Dept_Employee;
const Dept_Manager = require('../models/dept_manager').Dept_Manager;

/**Validations */
const {
    CantRepeatDeptName,
    CantDeleteDepartmentWithAssociatedRelations
} = require('../validators/department.validator');

const DepartmentType = new GraphQLObjectType({
    name: 'DepartmentType',
    description: 'Represent departments',
    extensions: {
        validations: {
          'CREATE':
          [
            CantRepeatDeptName
          ],
          'UPDATE' :
          [
            CantRepeatDeptName,
          ],
          'DELETE' :
          [
            CantDeleteDepartmentWithAssociatedRelations,
          ],
        },
      }, 
    fields: () => ({
        id: {type: GraphQLID},
        dept_name: {type: GraphQLString},
        dept_managers: {
          type: new GraphQLList(DeptManagerType),
          extensions: {
              relation: {
              connectionField: 'deptId',
              embedded: false
              },
          },
          resolve(parent, args) {
            return Dept_Manager.find({'deptId': parent.id});
          },
        },
    }),
});

gnx.connect(Department, DepartmentType, 'department', 'departments');

module.exports = DepartmentType;

const DeptEmployeeType = require ('./dept_employee');
const DeptManagerType = require ('./dept_manager');