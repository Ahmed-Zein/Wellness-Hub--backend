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

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI).then((result) => {
  app.listen(port, () => {
    console.log(">> server started on port:"+ port);
  });
});
