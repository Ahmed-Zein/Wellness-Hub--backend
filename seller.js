const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Phone: {
        type:String,
        minLength:11,
        maxLength:11,
        required: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Password: {
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
    CreatedAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    UpdatedAt: {
        type: Date,
        default: () => Date.now(),
    },
    Tags: {
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
