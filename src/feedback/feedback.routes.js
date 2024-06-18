const express = require("express");
const router = express.Router();
const Feedback = require("./feedback.model");
const { authenticateToken } = require("../common/jwt"); //imported the authenticate token

// GET /feedback: endpoint to  Get a list of all feedbacks. /
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
    console.log("Get is done");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// POST /feedback: endpoint to Create a new feedback.
router.post("/", authenticateToken, async (req, res) => {
    try {
      console.log("Feedback Function...");
  
      const newFeedback = new Feedback({
        owner: req.user, // Assuming req.user contains the user's ID
        feedback: req.body.feedback,
      });
  
      console.log(newFeedback);
  
      await newFeedback.save();
      res.status(201).json({ message: "Thanks for your Feedback"});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


module.exports = router;
