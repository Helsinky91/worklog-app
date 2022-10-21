const { Schema, model} = require("mongoose");

const logSchema = new mongoose.Schema({
    time: Date.today,
    comment: String,
    validation: { 
        type: String, 
        enum: ["Approved", "Pending", "Denied"], 
        default: "Pending"
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    }
})

const Log = mongoose.model("Log", logSchema);

module.exports = Log;