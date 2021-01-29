const { body , validationResult } = require('express-validator');

module.exports = function bodyValidatorMiddleware() {
  const detectValidations = [
    body(['visits'], "Missing visits").not().isEmpty(),
    body(['visits'], "Visits must be an array").isArray(),
    body(['visits.*.userGeneratedCode'], "Visit must have userGeneratedCode").not().isEmpty(),
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
    validate
  };
};
