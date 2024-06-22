const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", 
  legacyHeaders: false,
});

const bodyParser = require("body-parser");
const cors = require("cors");

const customerRoute = require("./src/customer/customer.routes");
const sellerRoute = require("./src/seller/seller.routes");
const productRoute = require("./src/product/product.routes");
const mealsRoute = require("./src/meals/meal.routes");
const orderRoute = require("./src/order/order.routes");
const checkoutRoute = require("./src/checkout/stripe");
const logger = require("./src/common/logger");
const recipeRoute = require("./src/recipes/recipe.routes");
const feedbackRoute = require("./src/feedback/feedback.routes");
const eventRoute = require("./src/event/event.routes");

app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/helloworld", (req, res) => {
  res.send("<h1>Hello World!!</h1>");
});

app.get("/", (req, res) => {
  res.send("<h1>WellnessHub</h1>");
});

/* ROUTES */
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/seller", sellerRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/meals", mealsRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/checkout", checkoutRoute);
app.use("/api/v1/recipies", recipeRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/v1/event", eventRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500;
  logger.error(
    `error: ${err.message}, code: ${statusCode}, type: ${err.type || "na"}`
  );
  res.status(statusCode).send({ error: err.message });
});

module.exports = app;
