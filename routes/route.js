const express = require("express");
const router = express.Router();
const hospital = require("./hospital");
const profile = require("./profile");
const login = require("./login");
const admin = require("./admin");
const services = require("./services");
router.use(hospital);
router.use(profile);
router.use(login);
router.use(admin);
router.use(services);
module.exports = router;
