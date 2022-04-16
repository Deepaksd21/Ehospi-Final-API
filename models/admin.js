const { model, Schema } = require("mongoose");

const admin = new Schema({
  uid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = model("admin", admin);
