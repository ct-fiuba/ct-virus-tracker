const express = require('express');
const bodyValidator = require('../middlewares/bodyValidatorMiddleware')();

const ruleHandler = require('../models/handlers/RuleHandler');
const rulesController = require('../controllers/rulesController')(ruleHandler());

module.exports = function rulesRouter() {
  return express.Router().use(
    '/rules',
    express.Router()
      .get('/:ruleId', rulesController.getSingleRule)
      .get('/', rulesController.get)
      .post('/', bodyValidator.addRulesValidations, bodyValidator.validate, rulesController.add)
      .delete('/', bodyValidator.deleteRulesValidations, bodyValidator.validate, rulesController.remove)      
      .put('/', bodyValidator.updateRulesValidations, bodyValidator.validate, rulesController.update)
  );
};
