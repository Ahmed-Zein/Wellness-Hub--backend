const express = require('express');
const router = express.Router();
const Product = require('./product.model')

// GET /products: endpoint to  Get a list of all products.
router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // GET /products/:productId: endpoint to Get details of a specific product.
router.get('/products/:productId', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST /products: endpoint to Create a new product.
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /products/:productId: endpoint to Update a product.
router.put('/products/:productId', async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true }
      );
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /products/:productId:  endpoint to Delete a product.
router.delete('/products/:productId', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// GET /products/:productId/rating:  endpoint to Get ratings for a product.
router.get('/products/:productId/rating', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ rating: product.finalrate });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /products/:productId/rate: endpoint to give Rate a product.
router.post('/products/:productId/rate', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  //needs testing
      const newrate = { user_ID: req.body.user_ID, rate: req.body.rate };
      product.rate.push(newrate);
  
      await product.save();
      res.status(201).json({ message: 'Product rated successfully', product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  // POST /products/:productId/reviews: endpoint to Add a review to a product.
router.post('/products/:productId/reviews', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      product.reviews.push(req.body);
      await product.save();
      res.status(201).json({ message: 'Review added successfully', product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /products/:productId/reviews/:reviewId:  endpoint to Update a review of a product if you have the product id and the reviewid
router.put('/products/:productId/reviews/:reviewId', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const review = product.reviews.id(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      Object.assign(review, req.body); //The Object.assign() method is used to update the properties of the review object with the values from req.body. After this operation, the review object will have its properties modified according to the values provided in req.body. It's a way to update or modify an existing object with new values from another object.
      await product.save();
      res.status(200).json({ message: 'Review updated successfully', product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // DELETE /products/:productId/reviews/:reviewId: endpoint to delete a review of a product if you have the product id and the reviewid
  router.delete('/products/:productId/reviews/:reviewId', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const review = product.reviews.id(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      review.remove();
      await product.save();
      res.status(200).json({ message: 'Review deleted successfully', product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;
