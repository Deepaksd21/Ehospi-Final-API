const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = model("User", userSchema);
