const express = require("express");
const router = express.Router();
const {
  addHospital,
  findHospital,
  findOne,
  hospitalForm,
  hospitalBed,
  getAllBooking,
  updateBedBooking,
  deleteBooking,
} = require("../controllers/hospital");
const { distanceCalculator } = require("../controllers/distance");
const { cpUpload } = require("../middlewares/hospitalForm");
router.post("/addHospital", addHospital);
router.get("/findHospital", findHospital);
router.get("/findHospitalOne/:id", findOne);
router.post("/hospitalForm", cpUpload, hospitalForm);
router.post("/distance", distanceCalculator);
router.post("/hospitalBedBooking", hospitalBed);
router.get("/getAllBooking", getAllBooking);
router.put("/updateBedBooking", updateBedBooking);
router.delete("/deleteBooking", deleteBooking);
module.exports = router;
