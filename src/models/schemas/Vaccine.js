const mongoose = require("mongoose");

let vaccineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shotsCount: {
    type: Number,
    required: true
  },
});

const Vaccine = module.exports = mongoose.model('Vaccine', vaccineSchema);
