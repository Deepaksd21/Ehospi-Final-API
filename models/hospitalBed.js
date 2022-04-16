const { model, Schema } = require("mongoose");

const hospitalBedSchema = new Schema({
  bookingId: {
    type: Number,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = model("hospitalBed", hospitalBedSchema);
