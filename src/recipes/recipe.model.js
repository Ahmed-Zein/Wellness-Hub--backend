const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true,
   },
  description: { 
    type: String, 
    required: true 
  },
  ingredients: { 
    type: String, 
    required: true 
  },
  instructions: {  //The Steps to make the recipe
    type: String, 
    required: true 
  },
  calories: {  
    type: Number, 
    required: true 
  },
  protein: {  
    type: Number, 
    required: true 
  },
  fats: {  
    type: Number, 
    required: true 
  },
  carbohydrates: {  
    type: Number, 
    required: true 
  },
  lastUpdated: { 
    type: Date,
    default: () => Date.now(),
    },
  owner: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Customer', 
     required: true 
    },
  images: [String],
  tags: [String],
  rate: [{
    user_ID: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', 
        required:true,
      },
    rate: {
       type: Number, 
       required: true,
        min: 1, 
        max: 5 }
  }],
  finalrate: { 
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
recipeSchema.pre(`save`, function (next) {
   this.UpdatedAt = Date.now();
   next();
 });

// Calculate the average rating before saving the product
recipeSchema.pre('save', function (next) {
  const totalrate = this.rate.reduce((sum, r) => sum + r.rate, 0); //reduce is a funtion in JS to reduce an array to a single value  and its arrgument is a callback function of 2 parameters the first is the  accumulator that accumlates the results of each iteration (el m5zn el bn5zn feh ) while the r represensents each element of the array that while be accumlated 
  this.finalrate = totalrate / this.rate.length || 0; //calculate the average by division and if the rate array is empty it will equal 0
  next();
cs});

module.exports = mongoose.model("recipe", recipeSchema);
