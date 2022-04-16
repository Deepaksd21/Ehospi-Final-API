const express = require("express");
const router = express.Router();
const {
  addservices,
  allservices,
} = require("../controllers/servicesControllers");

router.post("/addservices", addservices);
router.get("/allservices", allservices);

module.exports = router;
