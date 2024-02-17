const mongoose = require("mongoose");
const config = require("./config/dev");
mongoose
  .connect(config.mongoUri, {})
  .then((result) => {
      console.log(">> server started");
  })
  .catch((err) => {
    console.error(err);
  });