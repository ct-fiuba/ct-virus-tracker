const express = require('express');
const bodyValidator = require('../middlewares/bodyValidatorMiddleware')();

const visitHandler = require('../models/handlers/VisitHandler');
const infectedController = require('../controllers/infectedController')(visitHandler());

module.exports = function infectedRouter() {
  return express.Router().use(
    '/infected',
    express.Router()
      .post('/', bodyValidator.detectValidations, bodyValidator.validate, infectedController.add)
  );
};
