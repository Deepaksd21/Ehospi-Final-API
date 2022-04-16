const { model, Schema } = require("mongoose");

const hospitalRequest = new Schema({
  requestId: {
    type: String,
    required: true,
  },
  requestStatus: {
    type: String,
    required: true,
  },
  hospitalCode: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    required: true,
  },
  requestNumber: {
    type: String,
    required: true,
  },
});

module.exports = model("hospitalRequest", hospitalRequest);
