const multer = require("multer");
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: Storage,
});
exports.cpUpload = upload.fields([
  { name: "prescription", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "medicalInsurance", maxCount: 1 },
]);
