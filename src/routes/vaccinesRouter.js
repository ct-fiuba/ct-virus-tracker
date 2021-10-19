const express = require('express');
const bodyValidator = require('../middlewares/bodyVaccinesValidatorMiddleware')();

const vaccineHandler = require('../models/handlers/VaccineHandler');
const vaccinesController = require('../controllers/vaccinesController')(vaccineHandler());

module.exports = function rulesRouter() {
  return express.Router().use(
    '/vaccines',
    express.Router()
      .get('/:vaccineId', vaccinesController.getById)
      .get('/', vaccinesController.get)
      .post('/', bodyValidator.addValidations, bodyValidator.validate, vaccinesController.add)
      .put('/:vaccineId', bodyValidator.updateValidations, bodyValidator.validate, vaccinesController.update)
      .delete('/:vaccineId', vaccinesController.remove)      
  );
};
