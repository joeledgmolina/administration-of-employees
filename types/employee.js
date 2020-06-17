const graphql = require('graphql');
const graphql_iso_date = require('graphql-iso-date');
const gnx = require('@simtlix/gnx');
const GenderTypeEnum = require('./enums/gender.enum');
const {AuditableObjectFields} = require('./extended_types/auditableGraphQLObjectType');

const {
    GraphQLString, GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList
} = graphql;

const {
    GraphQLDate,
} = graphql_iso_date;

/**Models */
const Employee = require('../models/employee').Employee;
const Salary = require('../models/salary').Salary;
const Title = require('../models/title').Title;
const Dept_Employee = require('../models/dept_employee').Dept_Employee;
const Dept_Manager = require('../models/dept_manager').Dept_Manager;

/**Validations */
const {
    CantRepeatDNI,
    EmployeeMustHaveMoreThan18YearsOld,
    CantDeleteEmployeeWithAssociatedRelations
} = require('../validators/employee.validator');

const EmployeeType = new GraphQLObjectType({
    name: 'EmployeeType',
    description: 'Represent employees',
    extensions: {
        validations: {
          'CREATE':
          [
            CantRepeatDNI,
            EmployeeMustHaveMoreThan18YearsOld,
          ],
          'UPDATE' :
          [
            CantRepeatDNI,
          ],
          'DELETE' :
          [
            CantDeleteEmployeeWithAssociatedRelations,
          ],
        },
      },
    fields: () => Object.assign(AuditableObjectFields, {
        id: {type: GraphQLID},
        dni: {type: GraphQLInt },
        birth_date: {type: GraphQLDate},
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        gender: {type: GenderTypeEnum},
        hire_date: {type: GraphQLDate},
        salary: {
          type: new GraphQLList(SalaryType),
          extensions: {
              relation: {
              connectionField: 'empId',
              embedded: false
              },
          },
          resolve(parent, args) {
            return Salary.find({'empId': parent.id});
          },
        },
        title: {
          type: new GraphQLList(TitleType),
          extensions: {
              relation: {
              connectionField: 'empId',
              embedded: false
              },
          },
          resolve(parent, args) {
            return Title.find({'empId': parent.id});
          },
        },
        dept_employee: {
          type: new GraphQLList(DeptEmployeeType),
          extensions: {
              relation: {
              connectionField: 'empId',
              embedded: false
              },
          },
          resolve(parent, args) {
            return Dept_Employee.find({'empId': parent.id});
          },
        },
        dept_manager: {
          type: new GraphQLList(DeptManagerType),
          extensions: {
              relation: {
              connectionField: 'empId',
              embedded: false
              },
          },
          resolve(parent, args) {
            return Dept_Manager.find({'empId': parent.id});
          },
        },
    }),
});

gnx.connect(Employee, EmployeeType, 'employee', 'employees');

module.exports = EmployeeType;

const SalaryType = require('./salary');
const TitleType = require('./title');
const DeptEmployeeType = require ('./dept_employee');
const DeptManagerType = require ('./dept_manager');