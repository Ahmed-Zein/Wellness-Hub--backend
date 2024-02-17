const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "Name is too short"],
    maxlength: [50, "Name is too long"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    set: function (password) {
      return bcrypt.hashSync(password, 10); // 10 is the saltRounds parameter
    },
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  phone: {
    required: true,
    countryCode: String,
    phoneNumber: String,
  },
  userImage: { type: String, required: false }, // accepts base64 images
  creditCard: { type: String, required: false }, // this dummy for now
  follows: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },
    },
  ],
  //   communities: [
  //     {
  //       communityId: {
  //         type: Schema.Types.ObjectId,
  //         ref: "Community",
  //         required: true,
  //       },
  //     },
  //   ],
  //   orders: [
  //     {
  //       orderId: {
  //         type: Schema.Types.ObjectId,
  //         ref: "Order",
  //         required: true,
  //       },
  //     },
  //   ],
  // wishlist:[
  //     {
  //         productId:{
  //         type: Schema.Types.ObjectId,
  //         ref: "Product",
  //         required: true,
  //       },
  //     }
  // ],
});

module.exports = mongoose.model("Customer", customerSchema);
