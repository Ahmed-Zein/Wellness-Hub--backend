const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [8, "Name is too short"],
    maxlength: [50, "Name is too long"],
  },
  phone: {
    countryCode: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    // set: function (password) {
    //   return bcrypt.hashSync(password, 10); // 10 is the saltRounds parameter
    // },
  },
  creditCard: String, // dummy data
  // userImage: String,
  SSN: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 14,
    maxLength: 20,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  tags: {
    type: [String],
    required: true,
  },
  meals: [mongoose.SchemaTypes.ObjectId],
  products: [mongoose.SchemaTypes.ObjectId],
  //   blog: [mongoose.SchemaTypes.ObjectId],
});

// a middlware  to update the updatedat attribute before saving the seller data
sellerSchema.pre(`save`, function (next) {
  this.UpdatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Seller", sellerSchema);
