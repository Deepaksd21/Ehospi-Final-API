const { model, Schema } = require("mongoose");

const ImageSchema = Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = ImageModel = model("imageModel", ImageSchema);
