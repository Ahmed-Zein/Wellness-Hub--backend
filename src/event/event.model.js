const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  description: {
    type: String,
    required: true,
  },
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
      },
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
