const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dept_managerFields = {
    empId: mongoose.Schema.Types.ObjectId,
    deptId: mongoose.Schema.Types.ObjectId,
    from_date: Date,
    to_date: Date,
  };
  
  const dept_managerSchema = new Schema(dept_managerFields);
  
  const Dept_Manager = mongoose.model('Dept_Manager', dept_managerSchema);
  if (!Dept_Manager.collection.collection) {
    Dept_Manager.createCollection();
  }
  module.exports = {Dept_Manager, dept_managerFields};