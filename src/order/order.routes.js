const express = require("express");
const router = express.Router();
const Order = require("./order.model");
const Product = require("../product/product.model");
const { authenticateToken } = require("../common/jwt"); //imported the authenticate token

//get /orders: endpoint to return all orders for testing
router.get("/", async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
      console.log("Get is done");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
// POST /orders/create-order: endpoint to Create a new product.
router.post("/create-order", async (req, res) => {
    try {
      // Create a new product
        const { userId, products } = req.body;
        // const totalAmount = req.totalAmount;
        const order = new Order({
            user: userId,
            products,
            //totalAmount,
          });
          await order.save()
      res.status(201).json({ message: "order created Successfully", order });
    } catch (error) {
      // Handle any errors
      res.status(400).json({ error: error.message });
    }
  });
  module.exports = router;
