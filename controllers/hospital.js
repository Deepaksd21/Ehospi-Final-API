const Joi = require("joi");
const hospital = require("../models/hospital");
const hospitalForm = require("../models/hospitalForm");
const hospitalBed = require("../models/hospitalBed");
exports.findHospital = async (req, res) => {
  try {
    const HospitalFind = await hospital.find(
      {},
      { _id: 0, __v: 0, latitude: 0, longitude: 0 }
    );
    res.status(200).json(HospitalFind);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.findOne = async (req, res) => {
  try {
    const HospitalFind = await hospital.findById(req.params.id);
    res.status(200).json(HospitalFind);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.addHospital = async (req, res) => {
  const { body } = req;
  const hospitalSchema = Joi.object()
    .keys({
      hospitalName: Joi.string().required(),
      hospitalLocation: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      alldoctors: Joi.number().required(),
      allbeds: Joi.number().required(),
      ambulances: Joi.number().required(),
    })
    .required();
  let result = hospitalSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const hospitalDetails = new hospital(req.body);
      await hospitalDetails.save();
      res.status(201).send("Hospital registered sucessfully");
    } catch (err) {
      res.status(500).send("An error ocurred");
    }
  }
};
exports.hospitalForm = async (req, res) => {
  const { body } = req;
  const hospitalFormSchema = Joi.object().keys({
    bookingId: Joi.string().required(),
    bookingStatus: Joi.string().valid("pending").required(),
    hospitalCode: Joi.string().required(),
    patientName: Joi.string().required(),
    familyMember: Joi.string().required(),
    dob: Joi.date().less("now").greater("01-01-1920").required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    fatherHusbandName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
    email: Joi.string().email().required(),
    nationality: Joi.string().required(),
    religion: Joi.string().required(),
    monthlyIncome: Joi.number().required(),
    occupation: Joi.string().required(),
    altPhone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
    doctorName: Joi.string().required(),
    policyNumber: Joi.string().required(),
    employerName: Joi.string().required(),
    employerId: Joi.string().required(),
  });
  let result = hospitalFormSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const addHospitalForm = new hospitalForm({
        bookingId: req.body.bookingId,
        bookingStatus: "pending",
        hospitalCode: req.body.hospitalCode,
        patientName: req.body.patientName,
        familyMember: req.body.familyMember,
        dob: req.body.dob,
        gender: req.body.gender,
        fatherHusbandName: req.body.fatherHusbandName,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        nationality: req.body.nationality,
        religion: req.body.religion,
        monthlyIncome: req.body.monthlyIncome,
        occupation: req.body.occupation,
        altPhone: req.body.altPhone,
        doctorName: req.body.doctorName,
        policyNumber: req.body.policyNumber,
        employerName: req.body.employerName,
        employerId: req.body.employerId,
        prescription: {
          data: req.files.prescription,
        },
        idProof: {
          data: req.files.idProof,
        },
        medicalInsurance: {
          data: req.files.medicalInsurance,
        },
      });
      await addHospitalForm.save();
      res.send({ status: "Registered sucessful" });
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalBed = async (req, res) => {
  const { body } = req;
  const hospitalBedSchema = Joi.object().keys({
    bookingId: Joi.number().required(),
    hospital: Joi.string().required(),
    date: Joi.date().greater("now").required(),
    time: Joi.string().required(),
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
  });
  let result = hospitalBedSchema.validate(body);
  if (result.error) {
    res.send("Enter valid details");
  } else {
    try {
      const alreadyBooked = await hospitalBed.findOne({
        bookingId: req.body.bookingId,
      });
      if (alreadyBooked) {
        res.send("Bed is already booked for this id");
      } else {
        const addHospitalBed = new hospitalBed(req.body);
        await addHospitalBed.save();
        res.send({ status: "Booked bed sucessfully" });
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.updateBedBooking = async (req, res) => {
  const { body } = req;
  const hospitalBedSchema = Joi.object().keys({
    bookingId: Joi.number().required(),
    date: Joi.date().greater("now").required(),
    time: Joi.string().required(),
  });
  let result = hospitalBedSchema.validate(body);
  if (result.error) {
    res.send("Enter valid details");
  } else {
    try {
      const result = await hospitalBed.findOneAndUpdate(
        { bookingId: req.body.bookingId },
        {
          date: req.body.date,
          time: req.body.time,
        }
      );
      if (result === null) {
        res.send("No data found for boooking id => " + req.body.bookingId);
      } else {
        res.send("Booking updated sucessfully");
      }
    } catch (err) {
      res.send("An error occurred");
    }
  }
};
exports.getAllBooking = async (req, res) => {
  try {
    const result = await hospitalBed.find({}, { _id: 0, __v: 0 });
    if (result.length === 0) {
      res.send("No data found");
    } else {
      res.send(result);
    }
  } catch (err) {
    res.send("An error occurred");
  }
};
exports.deleteBooking = async (req, res) => {
  const { body } = req;
  const hospitalBedSchema = Joi.object().keys({
    bookingId: Joi.number().required(),
  });
  let result = hospitalBedSchema.validate(body);
  if (result.error) {
    res.send("Enter valid details");
  } else {
    try {
      const result = await hospitalBed.findOneAndDelete({
        bookingId: req.body.bookingId,
      });
      if (result == null) {
        res.send("No data found for id =>" + req.body.bookingId);
      } else {
        res.send("Deleted Sucessfully for id =>" + req.body.bookingId);
      }
    } catch (err) {
      res.send("An error occurred");
    }
  }
};
