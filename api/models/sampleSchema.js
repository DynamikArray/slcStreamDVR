const mongoose = require("mongoose");

const SampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Sample = mongoose.model("Sample", SampleSchema);
module.exports = Sample;
