const express = require("express");
const router = express.Router();
const Product = require("./product.model");
const { authenticateToken } = require("../common/jwt"); //imported the authenticate token

// GET /products: endpoint to  Get a list of all products. /
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
    console.log("Get is done");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /products/:productId: endpoint to Get details of a specific product.
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /products: endpoint to Create a new product.
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Create a new product
    const product = new Product(req.body);
    product.owner = req.user;
    await product.save();
    const seller = await Seller.findById(req.user); //<-- el 7war hena
    seller.products.push(product._id);
    await seller.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    // Handle any errors
    res.status(400).json({ error: error.message });
  }
});

// PUT /products/:productId: endpoint to Update a product.
router.put("/:productId", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    //used for testing compared both values
    //console.log(req.user._id)
    // console.log(String(product.owner))
    if (String(req.user._id) !== String(product.owner)) {
      res
        .status(403)
        .json({
          message: "You can't update this product as you are not the owner",
        });
      return;
    }
    // Update the product
    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.quantity = req.body.quantity || product.quantity;
    product.price = req.body.price || product.price;
    product.tags = req.body.tags || product.tags;
    product.images = req.body.images || product.images;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /products/:productId:  endpoint to Delete a product.
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (String(req.user._id) !== String(product.owner)) {
      return res.status(403).json({
        message: "You can't delete the product as you are not the owner",
      });
    }
    await Product.deleteOne({ _id: req.params.productId });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:productId/rating:  endpoint to Get ratings for a product. // to get the average raiting for the product
router.get("/:productId/rating", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ rating: product.finalrate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /:productId/rate: endpoint to give Rate a product.
router.post("/:productId/rate", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newrate = { user_ID: req.body.user_ID, rate: req.body.rate };
    product.rate.push(newrate);

    await product.save();
    res.status(201).json({ message: "Product rated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// GET /products/:productId/reviews: endpoint to  Get a list of specific product reviews.
router.get("//products/:productId/reviews", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(product.reviews);
    console.log("Get is done");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /products/:productId/reviews: endpoint to Add a review to a product.
router.post("/:productId/reviews", authenticateToken, async (req, res) => {
  try {
    console.log(req.user);
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $push: {
          reviews: { commentOwner: req.user, content: req.body.content },
        },
      },
      { new: true }
    );
    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ error: " Error" });
  }
});

// PUT /products/:productId/reviews/:reviewId:  endpoint to Update a review of a product if you have the product id and the reviewid
router.put(
  "/:productId/reviews/:reviewId",
  authenticateToken,
  async (req, res) => {
    try {
      console.log(String(req.user._id));
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const review = product.reviews.id(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (String(req.user._id) !== String(review.commentOwner)) {
        return res.status(403).json({
          message: "You can't delete the review as you are not the owner",
        });
      }
      review.content = req.body.content;
      await product.save();
      res.status(200).json({ message: "Review updated successfully", product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE /products/:productId/reviews/:reviewId: endpoint to delete a review of a product if you have the product id and the reviewid
router.delete(
  "/:productId/reviews/:reviewId",
  authenticateToken,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const review = product.reviews.id(req.params.reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (String(req.user._id) !== String(review.commentOwner)) {
        return res.status(403).json({
          message: "You can't delete the review as you are not the owner",
        });
      }

      await product.reviews.pull(req.params.reviewId);
      await product.save();

      res.status(200).json({ message: "Review deleted successfully", product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
