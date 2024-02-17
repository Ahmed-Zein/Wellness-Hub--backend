const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type:String,
        minLength:11,
        maxLength:11,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
       type: String,
       required: true,
    },
    creditCard:String, // dummy data
    userImage:String,
    SSN: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 14,
        maxLength: 14,
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
        type:[String],
        required: true,
    },
    // Meals: [mongoose.SchemaTypes.ObjectId],
    //Products: [mongoose.SchemaTypes.ObjectId],
    //Blog: [mongoose.SchemaTypes.ObjectId],
});

userSchema.pre(`save`, function(next){
    this.UpdatedAt = Date.now()
    next()
})

module.exports = mongoose.model("Seller", sellerSchema);
