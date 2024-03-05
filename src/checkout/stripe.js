const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Product = require('../product/product.model');
const Meal = require('../meals/meal.model');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.get('/test', async (req, res) => {
    res.send('success');
});

router.post('/checkout-session-stripe', async (req, res) => {
    try {
        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ error: 'Items array is required in the request body' });
        }

        const lineItems = await Promise.all(req.body.items.map(async ({ id, quantity }) => {
            let soldItem;
            soldItem = await Product.findById(id);

            if (soldItem === null) {
                // If not found in Product, try finding it in Meal
                soldItem = await Meal.findById(id);
            }

            if (!soldItem || !soldItem.title) {
                throw new Error(`Item with ID ${product} not found or does not have a title`);
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: soldItem.title,
                    },
                    unit_amount: soldItem.price * 100,
                },
                quantity: quantity,
            };
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
