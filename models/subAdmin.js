const { model, Schema } = require("mongoose");

const subAdminSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  duty: {
    type: String,
    required: true,
  },
});

module.exports = model("subAdmin", subAdminSchema);
