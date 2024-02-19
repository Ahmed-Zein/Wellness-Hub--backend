require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const customerRoute = require("./customer/customer.router");
const sellerRoute = require("./seller/seller.router");

app.disable("x-powered-by");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Test test");
});

app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/seller", sellerRoute);


mongoose.connect(process.env.MONGO_URI).then((result) => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(">> server started");
  });
});
