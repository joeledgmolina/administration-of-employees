const graphql = require('graphql');
const graphql_iso_date = require('graphql-iso-date');
const gnx = require('@simtlix/gnx');

const {
    GraphQLObjectType, GraphQLString, GraphQLID
} = graphql;

const {
    GraphQLDate,
} = graphql_iso_date;

/**Models */
const Title = require('../models/title').Title;
const Employee = require('../models/employee').Employee;

/**Types */
const EmployeeType = require('./employee');

/**Validations */
const {
    OneEmployeeCantHaveTwoTitlesInTheSameDepartmentName,
    FromDateMustBeSmallerThanToDate
} = require('../validators/title.validator');

const TitleType = new GraphQLObjectType({
    name: 'TitleType',
    description: 'Represent titles',
    extensions: {
        validations: {
          'CREATE' :
          [
            FromDateMustBeSmallerThanToDate,
            OneEmployeeCantHaveTwoTitlesInTheSameDepartmentName,
          ],
          'UPDATE' :
          [
            FromDateMustBeSmallerThanToDate,
            OneEmployeeCantHaveTwoTitlesInTheSameDepartmentName,
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
        title: {type: GraphQLString},
        from_date: {type: GraphQLDate},
        to_date: {type: GraphQLDate},
    }),
});

gnx.connect(Title, TitleType, 'title', 'titles');

module.exports = TitleType;