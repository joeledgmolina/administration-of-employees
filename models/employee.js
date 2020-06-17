const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeFields = {
    dni: Number,
    birth_date: Date,
    first_name:String,
    last_name:String,
    gender:String,
    hire_date: Date,
  };
  
  const employeeSchema = new Schema(employeeFields);
  
  const Employee = mongoose.model('Employee', employeeSchema);
  if (!Employee.collection.collection) {
    Employee.createCollection();
  }
  module.exports = {Employee, employeeFields};