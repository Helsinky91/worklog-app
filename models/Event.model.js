const { Schema, model } = require("mongoose");

const eventSchema = new mongoose.Schema(
  {

    Name: String,
    EventType: String,
    Date: Date,
    Place: String,
    Description: String,
    AdminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event