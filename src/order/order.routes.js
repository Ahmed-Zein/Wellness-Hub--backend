const express = require("express");
const router = express.Router();
const Order = require("./order.model");
const Product = require("../product/product.model");
const Mongoose = require('mongoose');
const { authenticateToken } = require("../common/jwt");

router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
        console.log("Get is done");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/create-order", async (req, res) => {
    try {
        const { userId, products } = req.body;

        // Extract product IDs from the request and convert to ObjectId
        const productIds = products.map(product => new Mongoose.Types.ObjectId(product.product));
        console.log(productIds);

        // Fetch products from the database based on product IDs
        const productsFromDB = await Product.find({ _id: { $in: productIds } });
        console.log(productsFromDB);

        // Calculate total amount
        let totalAmount = 0;
        products.forEach(product => {
            const matchingProduct = productsFromDB.find(dbProduct => dbProduct._id.toString() === product.product.toString());
            if (matchingProduct) {
                totalAmount += product.quantity * matchingProduct.price;
            }
        });

        // Create a new order
        const order = new Order({
            user: userId,
            products,
            totalAmount,
        });

        // Save the order to the database
        await order.save();

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
