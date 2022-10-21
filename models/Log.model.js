const { Schema, model, default: mongoose } = require("mongoose");

const Log = new mongoose.Schema({
    time: Date.today,
    comment: String,
    validation: { 
        type: String, 
        enum: ["Approved", "Pending", "Denied"], 
        default: "Pending"}
}),