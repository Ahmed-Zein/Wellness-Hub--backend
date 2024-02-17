const mongoose = require("mongoose");
const config = require("./config/dev");
const express = require("express");
const app = express();

app.disable("x-powered-by");

const bodyParser = require("body-parser");
const cors = require("cors");

app.disable("x-powered-by");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(config.mongoUri).then((result) => {
  app.listen(3000, () => {
    console.log(">> server started");
  });
});
