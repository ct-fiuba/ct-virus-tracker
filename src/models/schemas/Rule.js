const mongoose = require("mongoose");

let ruleSchema = mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  contagionRisk: {
    type: Number,
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
  openSpace: {
    type: Boolean,
    required: false
  },
  n95Mandatory: {
    type: Boolean,
    required: false
  },
  vaccinated: {
    type: Number,
    required: false
  },
  vaccinatedDaysAgoMin: {
    type: Number,
    required: false
  },
  vaccineReceived: {
    type: String,
    required: false
  },
  illnessRecovered: {
    type: Boolean,
    required: false
  },
  illnessRecoveredDaysAgoMax: {
    type: Number,
    required: false
  }
});

const Rule = module.exports = mongoose.model('Rule', ruleSchema);
