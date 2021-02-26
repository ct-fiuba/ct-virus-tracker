const mongoose = require("mongoose");

let ruleSchema = mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true
  },
  contagionRisk: {
    type: String,
    required: true
  },
  durationCmp: {
    type: String,
    required: false
  },
  durationValue: {
    type: Number,
    required: false
  },
  m2Cmp: {
    type: String,
    required: false
  },
  m2Value: {
    type: Number,
    required: false
  },
  spaceValue: {
    type: String,
    required: false
  }
});

const Rule = module.exports = mongoose.model('Rule', ruleSchema);
