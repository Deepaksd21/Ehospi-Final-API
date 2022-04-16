const Joi = require("joi");
const admindb = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const subAdmindb = require("../models/subAdmin");
const hospitalAdmindb = require("../models/hospitalAdmin");
const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
const hospitalForm = require("../models/hospitalForm");
const hospitalRequest = require("../models/hospitalRequest");

///--------------------------------------Admin-----------------------------------//

exports.adminLogin = async (req, res) => {
  const { body } = req;
  const adminSchema = Joi.object()
    .keys({
      uid: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();
  let result = adminSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const user = await admindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign({ uid: user.uid }, "123456", {
            expiresIn: "24h",
          });
          res.send({ token: token });
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Invalid credentials");
      }
    } catch (e) {
      console.log(e);
      res.send(e.name);
    }
  }
};
exports.isAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    res.send("Hi admin");
  }
};
exports.changeAdminProfile = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    const { body } = req;
    const adminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required();
    let result = adminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const status = await admindb.findOneAndUpdate(
          { uid: req.user.uid },
          {
            uid: req.body.uid,
            password: hashpassword,
          }
        );
        if (status) {
          res.send("Profile updated sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  }
};
exports.addSubAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    const { body } = req;
    const subAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = subAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await subAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send("Sub admin for this uid already present please make another");
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createSubAdmin = new subAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          duty: req.body.duty,
        });
        await createSubAdmin.save();
        res.send("Added subAdmin sucessfully");
      }
    }
  }
};
exports.allSubAdmins = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const subadmins = await subAdmindb.find(
        {},
        { _id: 0, password: 0, __v: 0 }
      );
      res.send(subadmins);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.deleteSubAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const status = await subAdmindb.findOneAndDelete({ uid: req.body.uid });
      if (status) {
        res.send("sub-admin deleted sucessfully");
      } else {
        res.send("No sub admin found of this id");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminAddHospitalAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalAdmin = new hospitalAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        });
        await createHospitalAdmin.save();
        res.send("Added hospital admin sucessfully");
      }
    }
  }
};
exports.adminGetHospitalAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const allHospitalAdmins = await hospitalAdmindb.find(
        {},
        { _id: 0, __v: 0, password: 0 }
      );
      res.send(allHospitalAdmins);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminEditHospitalAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await hospitalAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        }
      );
      if (user) {
        res.send("Profile updated sucessfully");
      } else {
        res.send("There is no matching uid");
      }
    }
  }
};
exports.adminDeleteHospitalAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const { body } = req;
      const hospitalAdminSchema = Joi.object()
        .keys({
          uid: Joi.string().required(),
        })
        .required();
      let result = hospitalAdminSchema.validate(body);
      if (result.error) {
        res.send("Please enter valid details");
      } else {
        const status = await hospitalAdmindb.findOneAndDelete({
          uid: req.body.uid,
        });
        if (status) {
          res.send("Hospital admin deleted sucessfully");
        } else {
          res.send("No Hospital admin found of this id");
        }
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminAddHospitalSubAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital sub-admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalSubAdmin = new hospitalSubAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
          duty: req.body.duty,
        });
        await createHospitalSubAdmin.save();
        res.send("Added subAdmin sucessfully");
      }
    }
  }
};
exports.adminEditHospitalSubAdmin = async (req, res) => {
  const { body } = req;
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const status = await hospitalSubAdmindb.findOneAndUpdate(
          { uid: req.body.uid },
          {
            password: hashpassword,
            duty: req.body.duty,
            hospitalCode: req.body.hospitalCode,
          }
        );
        if (status) {
          res.send("Hospital subAdmin profile updated sucessfully");
        } else {
          res.send("No hospital subAdmin found of this uid");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  }
};
exports.adminGetHospitalSubAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const allHospitalSubadmins = await hospitalSubAdmindb.find(
        {},
        { _id: 0, __v: 0, password: 0 }
      );
      res.send(allHospitalSubadmins);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminDeleteHospitalSubAdmin = async (req, res) => {
  const admin = await admindb.findOne({ uid: req.user.uid });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const { body } = req;
      const hospitalSubAdminSchema = Joi.object()
        .keys({
          uid: Joi.string().required(),
        })
        .required();
      let result = hospitalSubAdminSchema.validate(body);
      if (result.error) {
        res.send("Please enter valid details");
      } else {
        const status = await hospitalSubAdmindb.findOneAndDelete({
          uid: req.body.uid,
        });
        if (status) {
          res.send("Hospital subAdmin deleted sucessfully");
        } else {
          res.send("No Hospital subAdmin found of this id");
        }
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminGetBookingRequests = async (req, res) => {
  const admin = await admindb.findOne({
    uid: req.user.uid,
  });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const allHospitalRequests = await hospitalForm.find(
        {},
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminPendingBookingRequests = async (req, res) => {
  const admin = await admindb.findOne({
    uid: req.user.uid,
  });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const allHospitalPendingRequests = await hospitalForm.find(
        {
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminHosRequests = async (req, res) => {
  const hospitalAdmin = await admindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalAdmin) {
    res.send("You are not admin");
  } else {
    try {
      const allHospitalRequests = await hospitalRequest.find(
        {},
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.adminHosPendingRequests = async (req, res) => {
  const admin = await admindb.findOne({
    uid: req.user.uid,
  });
  if (!admin) {
    res.send("You are not admin");
  } else {
    try {
      const allHospitalPendingRequests = await hospitalRequest.find(
        {
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
//-----------------------------------------SubAdmin-----------------------------------//
exports.subAdminLogin = async (req, res) => {
  const { body } = req;
  const subAdminSchema = Joi.object()
    .keys({
      uid: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();
  let result = subAdminSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const user = await subAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign({ uid: user.uid }, "123456", {
            expiresIn: "24h",
          });
          res.send({ token: token });
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Invalid credentials");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.isSubAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else {
    res.send("Hi sub Admin");
  }
};
exports.changeSubAdminPassword = async (req, res) => {
  const { body } = req;
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else {
    const passwordSchema = Joi.object()
      .keys({
        password: Joi.string().required(),
      })
      .required();
    let result = passwordSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const status = await subAdmindb.findOneAndUpdate(
          { uid: req.user.uid },
          {
            password: hashpassword,
          }
        );
        if (status) {
          res.send("Password changed sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  }
};
exports.subAdminAddHospitalAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin.duty === "management" && subAdmin) {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalAdmin = new hospitalAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        });
        await createHospitalAdmin.save();
        res.send("Added hospital admin sucessfully");
      }
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminGetHospitalAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    try {
      const allHospitalAdmins = await hospitalAdmindb.find(
        {},
        { _id: 0, __v: 0, password: 0 }
      );
      res.send(allHospitalAdmins);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminEditHospitalAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await hospitalAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        }
      );
      if (user) {
        res.send("Profile updated sucessfully");
      } else {
        res.send("There is no matching uid");
      }
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminDeleteHospitalAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalAdmindb.findOneAndDelete({
        uid: req.body.uid,
      });
      if (user) {
        res.send("Hospital admin deleted sucessfully");
      } else {
        res.send("No Hospital admin found of this id");
      }
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminAddHospitalSubAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital sub-admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalSubAdmin = new hospitalSubAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
          duty: req.body.duty,
        });
        await createHospitalSubAdmin.save();
        res.send("Added hospital admin sucessfully");
      }
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminGetHospitalSubAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    try {
      const allHospitalSubAdmins = await hospitalSubAdmindb.find(
        {},
        { _id: 0, __v: 0, password: 0 }
      );
      res.send(allHospitalSubAdmins);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminEditHospitalSubAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await hospitalSubAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
          duty: req.body.duty,
        }
      );
      if (user) {
        res.send("Hospital subAdmin profile updated sucessfully");
      } else {
        res.send("There is no matching hospital subadmin uid");
      }
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminDeleteHospitalSubAdmin = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({ uid: req.user.uid });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalSubAdmindb.findOneAndDelete({
        uid: req.body.uid,
      });
      if (user) {
        res.send("Hospital subAdmin deleted sucessfully");
      } else {
        res.send("No Hospital subAdmin found of this id");
      }
    }
  } else {
    res.send("you are not allowed");
  }
};
exports.subAdminGetRequests = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    try {
      const allHospitalRequests = await hospitalForm.find(
        {},
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("you are not allowed to see this data");
  }
};
exports.subAdminPendingRequests = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    try {
      const allHospitalPendingRequests = await hospitalForm.find(
        {
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
exports.subAdminHosRequests = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!subAdmin) {
    res.send("You are not hospital sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    try {
      const allHospitalRequests = await hospitalRequest.find(
        {},
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
exports.subAdminHosPendingRequests = async (req, res) => {
  const subAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!subAdmin) {
    res.send("You are not hospital sub admin");
  } else if (subAdmin && subAdmin.duty === "management") {
    try {
      const allHospitalPendingRequests = await hospitalRequest.find(
        {
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
//---------------------------Hospital Admins---------------------------------------------------//
exports.hospitalAdminLogin = async (req, res) => {
  const { body } = req;
  const hospitalAdminSchema = Joi.object()
    .keys({
      uid: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();
  let result = hospitalAdminSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const user = await hospitalAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign({ uid: user.uid }, "123456", {
            expiresIn: "24h",
          });
          res.send({ token: token });
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Invalid credentials");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.isHospitalAdmin = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({ uid: req.user.uid });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    res.send("Hi hospital Admin");
  }
};
exports.changeHospitalAdminPassword = async (req, res) => {
  const { body } = req;
  const hospitalAdmin = await hospitalAdmindb.findOne({ uid: req.user.uid });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    const passwordSchema = Joi.object()
      .keys({
        password: Joi.string().required(),
      })
      .required();
    let result = passwordSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const status = await hospitalAdmindb.findOneAndUpdate(
          { uid: req.user.uid },
          {
            password: hashpassword,
          }
        );
        if (status) {
          res.send("Password changed sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  }
};
exports.hospitalAdminAddHospitalSubAdmin = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({ uid: req.user.uid });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital sub-admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalSubAdmin = new hospitalSubAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: hospitalAdmin.hospitalCode,
          duty: req.body.duty,
        });
        await createHospitalSubAdmin.save();
        res.send("Added subAdmin sucessfully");
      }
    }
  }
};
exports.hospitalAdminEditHospitalSubAdmin = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({ uid: req.user.uid });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    const temp = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
    if (temp) {
      if (result.error) {
        res.send("Please enter valid details");
      } else if (hospitalAdmin.hospitalCode === temp.hospitalCode) {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const user = await hospitalSubAdmindb.findOneAndUpdate(
          { uid: req.body.uid },
          {
            password: hashpassword,
            duty: req.body.duty,
          }
        );
        if (user) {
          res.send("Hospital subAdmin profile updated sucessfully");
        } else {
          res.send("There is no matching hospital subadmin uid");
        }
      } else {
        res.send("you are not allowed");
      }
    } else {
      res.send("No hospital subAdmin found of this id");
    }
  }
};
exports.hospitalAdminGetHospitalSubAdmin = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({ uid: req.user.uid });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    try {
      const allHospitalSubAdmins = await hospitalSubAdmindb.find(
        { hospitalCode: hospitalAdmin.hospitalCode },
        { _id: 0, __v: 0, password: 0 }
      );
      res.send(allHospitalSubAdmins);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalAdminDeleteHospitalSubAdmin = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({ uid: req.user.uid });
  if (!hospitalAdmin) {
    res.send("You are not sub admin");
  } else {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    const result = hospitalSubAdminSchema.validate(body);
    const temp = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
    if (temp) {
      if (result.error) {
        res.send("Please enter valid details");
      } else if (hospitalAdmin.hospitalCode === temp.hospitalCode) {
        const user = await hospitalSubAdmindb.findOneAndDelete({
          uid: req.body.uid,
        });
        if (user) {
          res.send("Hospital subAdmin deleted sucessfully");
        } else {
          res.send("No Hospital subAdmin found of this id");
        }
      } else {
        res.send("you are not allowed to delete this uid");
      }
    } else {
      res.send("No Hospital subAdmin found of this id");
    }
  }
};
exports.hospitalAdminGetRequests = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    try {
      const allHospitalRequests = await hospitalForm.find(
        { hospitalCode: hospitalAdmin.hospitalCode },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalAdminPendingRequests = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    try {
      const allHospitalPendingRequests = await hospitalForm.find(
        {
          hospitalCode: hospitalAdmin.hospitalCode,
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalAdminUpdateRequests = async (req, res) => {
  const { body } = req;
  const hospitalAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    const bookingSchema = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
        bookingStatus: Joi.string().valid("confirmed", "rejected").required(),
      })
      .required();
    let result = bookingSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const status = await hospitalForm.findOneAndUpdate(
          {
            bookingId: req.body.bookingId,
            hospitalCode: hospitalAdmin.hospitalCode,
          },
          {
            bookingStatus: req.body.bookingStatus,
          }
        );
        if (status) {
          res.send("Booking status changed sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  }
};
exports.hospitalAdminAddHosRequests = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    try {
      const { body } = req;
      const hospitalRequestSchema = Joi.object()
        .keys({
          requestType: Joi.string().valid("Bed", "Doctor").required(),
          requestNumber: Joi.number().required(),
        })
        .required();
      let result = hospitalRequestSchema.validate(body);
      if (result.error) {
        res.send("Please enter valid details");
      } else {
        const createHospitalRequest = new hospitalRequest({
          requestId: req.body.requestId,
          requestStatus: "pending",
          hospitalCode: hospitalAdmin.hospitalCode,
          requestType: req.body.requestType,
          requestNumber: req.body.requestNumber,
        });
        await createHospitalRequest.save();
        res.send("Added hospital request sucessfully");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalAdminHosRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital admin");
  } else {
    try {
      const allHospitalRequests = await hospitalRequest.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalAdminHosPendingRequests = async (req, res) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalAdmin) {
    res.send("You are not hospital admin");
  } else {
    try {
      const allHospitalPendingRequests = await hospitalRequest.find(
        {
          hospitalCode: hospitalAdmin.hospitalCode,
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  }
};

//-------------------------------------sub hospital admins--------------------------------------//

exports.hospitalSubAdminLogin = async (req, res) => {
  const { body } = req;
  const hospitalSubAdminSchema = Joi.object()
    .keys({
      uid: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();
  let result = hospitalSubAdminSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign({ uid: user.uid }, "123456", {
            expiresIn: "24h",
          });
          res.send({ token: token });
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Invalid credentials");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.isHospitalSubAdmin = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else {
    res.send("Hi hospital subAdmin");
  }
};
exports.changeHospitalSubAdminPassword = async (req, res) => {
  const { body } = req;
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else {
    const passwordSchema = Joi.object()
      .keys({
        password: Joi.string().required(),
      })
      .required();
    let result = passwordSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const status = await hospitalSubAdmindb.findOneAndUpdate(
          { uid: req.user.uid },
          {
            password: hashpassword,
          }
        );
        if (status) {
          res.send("Password changed sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  }
};
exports.hospitalSubAdminGetRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalRequests = await hospitalForm.find(
        { hospitalCode: hospitalSubAdmin.hospitalCode },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("you are not allowed to see this data");
  }
};
exports.hospitalSubAdminPendingRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalPendingRequests = await hospitalForm.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
exports.hospitalSubAdminUpdateRequests = async (req, res) => {
  const { body } = req;
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    const bookingSchema = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
        bookingStatus: Joi.string().valid("confirmed", "rejected").required(),
      })
      .required();
    let result = bookingSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const status = await hospitalForm.findOneAndUpdate(
          {
            bookingId: req.body.bookingId,
            hospitalCode: hospitalSubAdmin.hospitalCode,
          },
          {
            bookingStatus: req.body.bookingStatus,
          }
        );
        if (status) {
          res.send("Booking status changed sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
    }
  } else {
    res.send("you are not allowed to edit this data");
  }
};
exports.hospitalSubAdminAddHosRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const { body } = req;
      const hospitalRequestSchema = Joi.object()
        .keys({
          requestType: Joi.string().valid("Bed", "Doctor").required(),
          requestNumber: Joi.number().required(),
        })
        .required();
      let result = hospitalRequestSchema.validate(body);
      if (result.error) {
        res.send("Please enter valid details");
      } else {
        const createHospitalRequest = new hospitalRequest({
          requestId: req.body.requestId,
          requestStatus: "pending",
          hospitalCode: hospitalSubAdmin.hospitalCode,
          requestType: req.body.requestType,
          requestNumber: req.body.requestNumber,
        });
        await createHospitalRequest.save();
        res.send("Added subAdmin sucessfully");
      }
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("you are not allowed to add this data");
  }
};
exports.hospitalSubAdminHosRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalRequests = await hospitalRequest.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
exports.hospitalSubAdminHosPendingRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalPendingRequests = await hospitalRequest.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
