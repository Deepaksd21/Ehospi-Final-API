const imagedb = require("../models/image.js");
const multer = require("multer");
exports.uploadImage = (req, res) => {
  const Storage = multer.diskStorage({
    destination: "../uploads",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({
    storage: Storage,
  }).single("upfile");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new imagedb({
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImage
        .save()
        .then(() => res.send("Successfully Uploaded"))
        .catch((err) => console.log(err));
    }
  });
};
