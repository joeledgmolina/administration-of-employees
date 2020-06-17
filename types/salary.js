const graphql = require('graphql');
const graphql_iso_date = require('graphql-iso-date');
const gnx = require('@simtlix/gnx');

const {
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat
} = graphql;

const {
    GraphQLDate,
} = graphql_iso_date;

/**Models */
const Salary = require('../models/salary').Salary;
const Employee = require('../models/employee').Employee;

/**Types */
const EmployeeType = require('./employee');

/**Validations */
const {
    FromDateMustBeSmallerThanToDate,
} = require('../validators/salary.validator');

const SalaryType = new GraphQLObjectType({
    name: 'SalaryType',
    description: 'Represent salaries',
    extensions: {
        validations: {
          'CREATE':
          [
            FromDateMustBeSmallerThanToDate,
          ],
          'UPDATE' :
          [
            FromDateMustBeSmallerThanToDate,
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
        salary: {type: GraphQLFloat },
        from_date: {type: GraphQLDate},
        to_date: {type: GraphQLDate},
    }),
});

gnx.connect(Salary, SalaryType, 'salary', 'salaries');

module.exports = SalaryType;

