const { model, Schema } = require("mongoose");

const hospitalSubAdminSchema = new Schema({
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
  duty: {
    type: String,
    required: true,
  },
});

module.exports = model("hospitalSubAdmin", hospitalSubAdminSchema);
