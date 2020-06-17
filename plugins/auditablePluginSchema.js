module.exports = function(schema, options) {
    schema.add({updatedAt: {type: Date}});
    schema.add({createdAt: {type: Date}});
    // This line add automatically createdAt and updatedAt
    schema.set('timestamps', true);
  };