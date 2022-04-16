const { model, Schema } = require("mongoose");

const hospitalAdminSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hospitalCode: {
    type: String,
    required: true,
  },
});

module.exports = model("hospitalAdmin", hospitalAdminSchema);
