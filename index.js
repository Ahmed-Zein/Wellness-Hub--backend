require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const customerRoute = require("./src/customer/customer.routes");
const sellerRoute = require("./src/seller/seller.router");
const productRoute = require("./src/product/product.routes");
const mealsRoute = require("./src/meals/meal.routes");

app.disable("x-powered-by");

app.use(cors());
app.use(logger("short"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Test test");
});

app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/seller", sellerRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/meals", mealsRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.send({ error: err });
});

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI).then((result) => {
  app.listen(port, () => {
    console.log(">> server started on port:" + port);
  });
});
