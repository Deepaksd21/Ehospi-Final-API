const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/imageUpload");
router.post("/uploadPicture", uploadImage);
module.exports = router;
