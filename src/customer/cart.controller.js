const Customer = require("./customer.model");

const compareUserId = (req, res, next) => {
  if (req.params.userId.toString() !== req.user.toString()) {
    return res.status(403).json({
      message: "unAuthorized access",
    });
  }
  next();
};

exports.getCart = [
  compareUserId,
  async (req, res, next) => {
    if (req.params.userId.toString() !== req.user.toString()) {
      res.status(403).json({
        message: "unAuthorized access",
      });
    }
    try {
      const customer = await Customer.findById(req.user);
      res.status(200).send({ cart: customer.cart });
    } catch (err) {
      next(err);
    }
  },
];
exports.addToCart = [
  compareUserId,
  async (req, res, next) => {
    const { itemId, quantity } = req.body;
    try {
      const customer = await Customer.findById(req.params.userId);

      if (!customer) {
        res.status(404);
        throw Error("Customer not found");
      }
      if (!customer.cart) {
        customer.cart = [];
      }
      let index = -1;
      customer.cart.forEach((item, i) => {
        if (item.itemId.toString() === itemId) {
          index = i;
        }
      });

      if (index === -1) {
        if (quantity <= 0) {
          res.status(400);
          throw Error("quantity must be greater than 0");
        }
        customer.cart.push({ itemId: itemId, quantity: quantity });
      } else {
        if (quantity <= 0) {
          customer.cart.splice(index, 1);
        } else {
          customer.cart[index].quantity = quantity;
        }
      }
      await customer.save();
      res.status(200).send({ ...customer.cart  });
    } catch (err) {
      next(err);
    }
  },
];
exports.deleteFromCart = [
  compareUserId,
  async (req, res, next) => {
    const { itemId } = req.body;
    try {
      const customer = await Customer.findById(req.params.userId);

      if (!customer) {
        res.status(404);
        throw Error("Customer not found");
      }
      if (!customer.cart) {
        customer.cart = [];
      }
      let index = -1;
      customer.cart.forEach((item, i) => {
        if (item.itemId.toString() === itemId) {
          index = i;
        }
      });

      if (index === -1) {
        res.status(404);
        throw Error("Item not found in cart");
      }
      customer.cart.splice(index, 1);
      await customer.save();
      res.status(200).send({ ...customer.cart  });
    } catch (err) {
      next(err);
    }
  },
];
