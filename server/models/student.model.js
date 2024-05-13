const mongoose = require('mongoose');
const { Schema, model: _model } = mongoose;
 
const requiredString = { type: String, required: true };
 
const Student = new Schema(
  {
    id: { ...requiredString, unique: true },
    firstname: requiredString,
    lastname: requiredString,
    middlename: {type: String},
    course: requiredString,
    year: requiredString,
  },
  { collection: 'StudentData' } 
);
 
const model = _model("StudentData", Student);
 
module.exports = model;