const express = require('express');
const bodyValidator = require('../middlewares/bodyValidatorMiddleware')();

const visitHandler = require('../models/handlers/VisitHandler');
const codeHandler = require('../models/handlers/CodeHandler');
const infectedControllerFactory = require('../controllers/infectedController');

module.exports = function infectedRouter(rabbitManager) {
  infectedController = infectedControllerFactory(visitHandler(), codeHandler(rabbitManager));
  return express.Router().use(
    '/infected',
    express.Router()
      .post('/', bodyValidator.detectValidations, bodyValidator.validate, infectedController.add)
  );
};
