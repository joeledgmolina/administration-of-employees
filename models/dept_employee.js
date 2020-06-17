const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dept_employeeFields = {
    empId: mongoose.Schema.Types.ObjectId,
    deptId: mongoose.Schema.Types.ObjectId,
    from_date: Date,
    to_date: Date,
  };
  
  const dept_employeeSchema = new Schema(dept_employeeFields);
  
  const Dept_Employee = mongoose.model('Dept_Employee', dept_employeeSchema);
  if (!Dept_Employee.collection.collection) {
    Dept_Employee.createCollection();
  }
  module.exports = {Dept_Employee, dept_employeeFields};