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
  }
});

const Visit = module.exports = mongoose.model('Visit', visitSchema);
