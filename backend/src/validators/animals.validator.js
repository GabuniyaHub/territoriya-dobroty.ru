const Joi = require('joi');

const animalSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  gender: Joi.string().valid('male', 'female').required(),
  age: Joi.string().required(),
  traits: Joi.string().required(),
  isPublished: Joi.boolean().required(),
});

module.exports = { animalSchema };
