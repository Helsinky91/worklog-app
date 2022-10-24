const { Schema, model } = require("mongoose");
const eventType = require("../utils/event-types")

const eventSchema = new Schema(
  {
    name: String,
    eventType: { 
      type: String,
      enum: eventType
    },
    date: Date,
    place: String,
    description: String,
    //para ver quien ha creado el evento. //!To be used
    adminId: { 
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
})

const Event = model("Event", eventSchema);

module.exports = Event