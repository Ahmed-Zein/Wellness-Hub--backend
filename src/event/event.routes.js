

const express = require("express");
const router = express.Router();
const Event = require("./event.model");
const { authenticateToken } = require("../common/jwt");


// GET /events: Get a list of all events
router.get("/", async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
      console.log("Get request successful");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // GET /event/:eventId: Get details of a specific event
router.get("/:eventId", async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ message: "event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// POST /event: Create a new event   
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log("Creating a new event...");

    const newEvent = new Event({
        creator: req.body.creator,
        eventName: req.body.eventName,
        eventDescription: req.body.eventDescription,
        participants: [],
        eventDate: req.body.eventDate,
        location: req.body.location
    });

    console.log(newEvent);

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT / join event
router.put("/:eventId",authenticateToken ,async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ message: "event not found" });
      }
      event.participants.push(req.user);
      await event.save();
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;
