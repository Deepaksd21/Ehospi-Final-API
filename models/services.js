const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const servicesSchema = new Schema({
  service1: {
    type: String,
    required: true,
  },
  service2: {
    type: String,
    required: true,
  },
  service3: {
    type: String,
    required: true,
  },
  service4: {
    type: String,
    required: true,
  },
  service5: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Services", servicesSchema);
