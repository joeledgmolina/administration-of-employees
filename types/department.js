const graphql = require('graphql');
const gnx = require('@simtlix/gnx');

const {
    GraphQLObjectType, GraphQLString, GraphQLID
} = graphql;

/**Models */
const Department = require('../models/department').Department;

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
    }),
});

gnx.connect(Department, DepartmentType, 'department', 'departments');

module.exports = DepartmentType;