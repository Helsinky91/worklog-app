const { Schema, model, default: mongoose } = require("mongoose");

const enventSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    photo: String,
    email: String,
    role: {
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    position: {
        type: String, 
        enum: ["cook", "receptionist", "waiter/waitress", "reservations"]
    },
    interest: [String] //
    
})

const Event = mongoose.