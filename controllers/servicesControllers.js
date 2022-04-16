const Joi = require("joi");
const services = require("../models/services");

exports.addservices = async (req, res) => {
  let { service1, service2, service3, service4, service5 } = req.body;
  const servicesSchema = Joi.object({
    service1: Joi.string().required(),
    service2: Joi.string().required(),
    service3: Joi.string().required(),
    service4: Joi.string().required(),
    service5: Joi.string().required(),
  });
  let result = servicesSchema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newService = new services({
    service1,
    service2,
    service3,
    service4,
    service5,
  });
  try {
    const savedServices = await newService.save();
    res.status(201).json(savedServices);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.allservices = async (req, res) => {
  try {
    const findServices = await services.find();
    res.status(200).json(findServices);
  } catch (err) {
    res.status(500).json(err);
  }
};
