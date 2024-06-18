const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    feedback: { 
    type: String, 
    required: true 
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  }
});

module.exports = mongoose.model("feedback", feedbackSchema);
