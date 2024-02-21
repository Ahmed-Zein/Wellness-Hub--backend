const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true,
   },
  description: { 
    type: String, 
    required: true 
  },
  quantity: {   //refers to quantity in warehouses later will add when someone places an order this quantity will be decremnted by the bought amount
     type: Number, 
     required: true 
    },
  price: { 
    type: Number,
     required: true 
    },
  lastUpdated: { 
    type: Date,
    default: () => Date.now(),
    },
  owner: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Seller', 
     required: true 
    },
  images: [String],
  tags: [String],
  rate: [{
    user_ID: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer' },
    rate: {
       type: Number, 
       required: true,
        min: 1, 
        max: 5 }
  }],
  size: { // why is this here shouldn't it be in order schema ?
    type: String,
    enum: ['Small', 'Medium', 'Large'] ,
  } ,
  finalRate: { 
    type: Number,
     default: 0 
    },
  reviews: [{
    commentOwner: { 
      type: mongoose.Schema.Types.ObjectId,
       ref: 'Customer'
       },
    content: { 
      type: String,
       required: true 
      }
  }],
});
// a middlware  to update the updatedat attribute before saving the product
// productSchema.pre(`save`, function (next) {
//   this.UpdatedAt = Date.now();
//   next();
// });

// Calculate the average rating before saving the product
//productSchema.pre('save', function (next) {
  //const totalRate = this.rate.reduce((sum, r) => sum + r.rate, 0); //reduce is a funtion in JS to reduce an array to a single value  and its arrgument is a callback function of 2 parameters the first is the  accumulator that accumlates the results of each iteration (el m5zn el bn5zn feh ) while the r represensents each element of the array that while be accumlated 
  //this.finalRate = totalRate / this.rate.length || 0; //calculate the average by division and if the rate array is empty it will equal 0
  //next();
//});

module.exports = mongoose.model("product", productSchema);
