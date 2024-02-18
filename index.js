require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.disable("x-powered-by");

const bodyParser = require("body-parser");
const cors = require("cors");

app.disable("x-powered-by");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Test test");
});

mongoose.connect(process.env.mongoUri).then((result) => {
  app.listen(3000, () => {
    console.log(">> server started");
  });
});
