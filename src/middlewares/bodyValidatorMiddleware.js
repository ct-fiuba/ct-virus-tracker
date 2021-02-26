const { body , validationResult } = require('express-validator');

module.exports = function bodyValidatorMiddleware() {
  const detectValidations = [
    body(['visits'], "Missing visits").not().isEmpty(),
    body(['visits'], "Visits must be an array").isArray(),
    body(['visits.*.userGeneratedCode'], "Visit must have userGeneratedCode").not().isEmpty(),
  ];

  const addRulesValidations = [
    body(['rules'], "Missing rules").not().isEmpty(),
    body(['rules'], "Rules must be an array").isArray(),
  ];

  const deleteRulesValidations = [
    body(['ruleIds'], "Missing ruleIds").not().isEmpty(),
    body(['ruleIds'], "ruleIds must be an array").isArray(),
  ];

  const updateRulesValidations = [
    body(['rules'], "Missing rules").not().isEmpty(),
    body(['rules'], "Rules must be an array").isArray(),
  ];


  const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let firstError = errors.array()[0];
      return res.status(400).json({ reason: firstError });
    }

    next();
  }

  return {
    detectValidations,
    addRulesValidations,
    deleteRulesValidations,
    updateRulesValidations,
    validate
  };
};
