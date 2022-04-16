const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../controllers/admin");

//--------------------------------------------------------admin----------------------------
router.post("/adminLogin", admin.adminLogin);
router.get("/isAdmin", auth.verifyToken, admin.isAdmin);
router.put("/changeAdminProfile", auth.verifyToken, admin.changeAdminProfile);
router.post("/addSubAdmin", auth.verifyToken, admin.addSubAdmin);
router.get("/getAllSubAdmins", auth.verifyToken, admin.allSubAdmins);
// router.put(
//   "/subAdmin/edit/subAdminPassword",
//   auth.verifyToken,
//   admin.changeSubAdminPassword
// );
router.delete("/deleteSubAdmin", auth.verifyToken, admin.deleteSubAdmin);
router.get(
  "/admin/getHospitalAdmin",
  auth.verifyToken,
  admin.adminGetHospitalAdmin
);
router.post(
  "/admin/addHospitalAdmin",
  auth.verifyToken,
  admin.adminAddHospitalAdmin
);
router.put(
  "/admin/editHospitalAdmin",
  auth.verifyToken,
  admin.adminEditHospitalAdmin
);
router.delete(
  "/admin/deleteHospitalAdmin",
  auth.verifyToken,
  admin.adminDeleteHospitalAdmin
);
router.post(
  "/admin/addHospitalSubAdmin",
  auth.verifyToken,
  admin.adminAddHospitalSubAdmin
);
router.get(
  "/admin/getHospitalSubAdmin",
  auth.verifyToken,
  admin.adminGetHospitalSubAdmin
);
router.put(
  "/admin/editHospitalSubAdmin",
  auth.verifyToken,
  admin.adminEditHospitalSubAdmin
);
router.delete(
  "/admin/deleteHospitalSubAdmin",
  auth.verifyToken,
  admin.adminDeleteHospitalSubAdmin
);
router.get(
  "/admin/getAllBookingRequests",
  auth.verifyToken,
  admin.adminGetBookingRequests
);
router.get(
  "/admin/getPendingBookingRequests",
  auth.verifyToken,
  admin.adminPendingBookingRequests
);
//----------------------------------subadmin----------------------------
router.post("/login/subAdmin", admin.subAdminLogin);
router.get("/isSubAdmin", auth.verifyToken, admin.isSubAdmin);
router.put(
  "/edit/subAdminPassword",
  auth.verifyToken,
  admin.changeSubAdminPassword
);
router.get(
  "/subAdmin/getHospitalAdmin",
  auth.verifyToken,
  admin.subAdminGetHospitalAdmin
);
router.post(
  "/subAdmin/addHospitalAdmin",
  auth.verifyToken,
  admin.subAdminAddHospitalAdmin
);
router.put(
  "/subAdmin/editHospitalAdmin",
  auth.verifyToken,
  admin.subAdminEditHospitalAdmin
);
router.delete(
  "/subAdmin/deleteHospitalAdmin",
  auth.verifyToken,
  admin.subAdminDeleteHospitalAdmin
);
router.post(
  "/subAdmin/addHospitalSubAdmin",
  auth.verifyToken,
  admin.subAdminAddHospitalSubAdmin
);
router.get(
  "/subAdmin/getHospitalSubAdmin",
  auth.verifyToken,
  admin.subAdminGetHospitalSubAdmin
);
router.put(
  "/subAdmin/editHospitalSubAdmin",
  auth.verifyToken,
  admin.subAdminEditHospitalSubAdmin
);
router.delete(
  "/subAdmin/deleteHospitalSubAdmin",
  auth.verifyToken,
  admin.subAdminDeleteHospitalSubAdmin
);
//------------------------------------------------hospitaladmin-------------------------------
router.post("/login/hospitalAdmin", admin.hospitalAdminLogin);
router.get("/isHospitalAdmin", auth.verifyToken, admin.isHospitalAdmin);
router.put(
  "/edit/hospitalAdminPassword",
  auth.verifyToken,
  admin.changeHospitalAdminPassword
);
router.post(
  "/hospitalAdmin/addHospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalAdminAddHospitalSubAdmin
);
router.get(
  "/hospitalAdmin/getHospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalAdminGetHospitalSubAdmin
);
router.put(
  "/hospitalAdmin/editHospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalAdminEditHospitalSubAdmin
);
router.delete(
  "/hospitalAdmin/deleteHospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalAdminDeleteHospitalSubAdmin
);

///-----------------------------Hospital SubAdmin-------------------------------//
router.post("/login/hospitalSubAdmin", admin.hospitalSubAdminLogin);
router.get("/isHospitalSubAdmin", auth.verifyToken, admin.isHospitalSubAdmin);
router.put(
  "/edit/hospitalSubAdminPassword",
  auth.verifyToken,
  admin.changeHospitalSubAdminPassword
);
router.get(
  "/requests/hospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalSubAdminGetRequests
);
router.get(
  "/pendingRequests/hospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalSubAdminPendingRequests
);
router.put(
  "/updateRequest/hospitalSubAdmin",
  auth.verifyToken,
  admin.hospitalSubAdminUpdateRequests
);
module.exports = router;
