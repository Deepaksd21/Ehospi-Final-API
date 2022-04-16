const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalSchema = new Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  hospitalLocation: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  alldoctors: {
    type: Number,
    required: true,
  },
  allbeds: {
    type: Number,
    required: true,
  },
  ambulances: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Hospital", hospitalSchema);
