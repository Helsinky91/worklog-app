const { Schema, model} = require("mongoose");

const logSchema = new Schema({

    timeIn : { 
        type : Date, 
        default: Date.now 
    },
    timeOut : { 
        type : Date, 
        default: Date.now 
    },
    comment: String,
    validation: { 
        type: String, 
        enum: ["Approved", "Pending", "Denied"], 
        default: "Pending"
    }, 
    user: {
        type: Schema.Types.ObjectId,  
        ref: "User"
    },
   
})

const Log = model("Log", logSchema);

module.exports = Log