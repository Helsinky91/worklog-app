const { Schema, model } = require("mongoose");
const eventType = require("../utils/event-types")

const eventSchema = new Schema(
  {
    name: String,
    eventType: { 
      type: String,
      enum: eventType
    },
    photo: { 
      type: String,
      default: "https://cdn2.iconfinder.com/data/icons/festivalization-and-exhibition-filled-outline/64/event-organizer-manager-planner-operation-staff-512.png"
    },  
    place: String,
    date: {
      type: Date
    },
    hour: String,
    description: String
  })

const Event = model("Event", eventSchema);

module.exports = Event