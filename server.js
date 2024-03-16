const express = require("express");
const morgan = require("morgan");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const customerRoute = require("./src/customer/customer.routes");
const sellerRoute = require("./src/seller/seller.routes");
const productRoute = require("./src/product/product.routes");
const mealsRoute = require("./src/meals/meal.routes");
const orderRoute = require("./src/order/order.routes");
const checkoutRoute = require("./src/checkout/stripe");
const logger = require("./src/common/logger");

app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("<h1>WellnessHub</h1>");
});

app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/seller", sellerRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/meals", mealsRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/checkout", checkoutRoute);

app.use((err, req, res, next) => {
  logger.error(err);
  res.send({ error: err.message });
});

module.exports = app;
