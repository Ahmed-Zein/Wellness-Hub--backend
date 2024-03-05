const express = require("express");
const router = express.Router();
const Order = require("./order.model");
const Product = require("../product/product.model");
const Meal = require('../meals/meal.model');
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
        const { userId, items } = req.body;

        // Extract product IDs from the request and convert to ObjectId
        const itemsIds = items.map(item => new Mongoose.Types.ObjectId(item.item));
        console.log(itemsIds);

        // Fetch products from the database based on product IDs
        const productsFromDB = await Product.find({ _id: { $in: itemsIds } });

        // Fetch meals from the database based on item IDs
        const mealsFromDB = await Meal.find({ _id: { $in: itemsIds } });

        // Combine the results from both queries
        const itemsFromDB = [...productsFromDB, ...mealsFromDB];

        console.log(itemsFromDB);

        // Calculate total amount
        let totalAmount = 0;
        items.forEach(item => {
            const matchingItem = itemsFromDB.find(dbItem => dbItem._id.toString() === item.item.toString());
            if (matchingItem) {
                totalAmount += item.quantity * matchingItem.price;
            }
        });

        // Create a new order
        const order = new Order({
            user: userId,
            items, 
            totalAmount,
        });

        
        await order.save();

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        
        console.error(error);

  
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;
