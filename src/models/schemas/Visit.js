const mongoose = require("mongoose");

let visitSchema = mongoose.Schema({
  userGeneratedCode: {
    type: String,
    required: true,
    unique: true
  },
  detectedTimestamp: {
    type: Date,
    required: false
  },
  vaccinated: {
    type: Number,
    default: 0,
    required: true
  },
  vaccineReceived: {
    type: String,
    required: false
  },
  vaccinatedDate: {
    type: Date,
    required: false
  },
  illnessRecovered: {
    type: Boolean,
    default: false,
    required: true
  },
  illnessRecoveredDate: {
    type: Date,
    required: false
  }
});

const Visit = module.exports = mongoose.model('Visit', visitSchema);
