require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./server");
const logger = require("./src/common/logger");

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then((result) => {
  app.listen(port, () => {
    logger.info(">> server started on port:" + port);
  });
});
