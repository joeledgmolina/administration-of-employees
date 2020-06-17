const graphql = require('graphql');
const graphqlIsoDate = require('graphql-iso-date');

const {
  GraphQLObjectType, GraphQLBoolean, GraphQLString,
} = graphql;

const {
  GraphQLDateTime,
} = graphqlIsoDate;

const AuditableObjectFields = {
  'createdAt': {
    type: GraphQLDateTime,
    description: 'Creation date',
    extensions: {
      readOnly: true,
    },
  },
  'updatedAt': {
    type: GraphQLDateTime,
    description: 'Last edited date',
    extensions: {
      readOnly: true,
    },
  },
};

module.exports = {
  AuditableObjectFields,
};