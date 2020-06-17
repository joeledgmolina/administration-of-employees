const graphql = require('graphql');

const {
  GraphQLEnumType,
} = graphql;

const GenderTypeEnum = new GraphQLEnumType({
  name: 'GenderTypeEnum',
  values: {
    M: {
      value: 'Male',
    },
    F: {
      value: 'Female',
    }
  },
});

module.exports = GenderTypeEnum;