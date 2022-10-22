const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {

    name: String,
    eventType: { 
      type: String,
      enum: ["TIC formation", "Teamlead", "Lenguages formation", "Customer service", "Recreational activities" ]
    },
    date: Date,
    place: String,
    description: String,
    adminId: { 
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
})

const Event = model("Event", eventSchema);

module.exports = Event