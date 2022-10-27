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
      default: "https://sustainablecortland00.files.wordpress.com/2013/07/event-icon.png"
    },  
    place: String,
    date: String,
    hour: String,
    description: String
  })

const Event = model("Event", eventSchema);

module.exports = Event