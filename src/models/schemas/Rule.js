const mongoose = require("mongoose");

let ruleSchema = mongoose.Schema({
  index: {
    type: Number,
    required: true,
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
  covidRecovered: {
    type: Boolean,
    required: false
  },
  covidRecoveredDaysAgoMax: {
    type: Number,
    required: false
  }
});

const Rule = module.exports = mongoose.model('Rule', ruleSchema);
