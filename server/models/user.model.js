const { Schema, model: _model } = require("mongoose");
 
 
const User = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "user-data" }
);
 
const model = _model("UserData", User);
 
module.exports = model;
 