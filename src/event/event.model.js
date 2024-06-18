const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: {
            type: String,
            enum:['customer', 'seller']
        },
        required: true 
    },
    eventName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20

    },
    eventDescription: {
        type: String,
        required: true
    },
    
    participants:[{
        userID: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: {
                enum:['customer', 'seller']
            }
           } 
    }],

    eventDate:{
        type: Date,
        required: true
    },

    location:{
        type: String,
        required:true 
    }
});


const Event = mongoose.model("events", eventSchema);


module.exports = Event;
