const { body , validationResult } = require('express-validator');

module.exports = function bodyValidatorMiddleware() {
  const detectValidations = [
    body(['userGeneratedCode'], "Visit must have userGeneratedCode").not().isEmpty(), 
  ];

  const addRulesValidations = [
    body(['rules'], "Missing rules").not().isEmpty(),
    body(['rules'], "Rules must be an array").isArray(),
    body(['rules.*.index'], "Rule must have index").not().isEmpty(),
    body(['rules.*.contagionRisk'], "Rule must have contagionRisk").not().isEmpty(),
    
  ];

  const deleteRulesValidations = [
    body(['ruleIds'], "Missing ruleIds").not().isEmpty(),
    body(['ruleIds'], "ruleIds must be an array").isArray(),
  ];

  const updateRulesValidations = [
    body(['rules'], "Missing rules").not().isEmpty(),
    body(['rules'], "Rules must be an array").isArray(),
    body(['rules.*._id'], "Rule must have _id").not().isEmpty(),
    body(['rules.*.index'], "Rule must have index").not().isEmpty(),
    body(['rules.*.contagionRisk'], "Rule must have contagionRisk").not().isEmpty(),
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
