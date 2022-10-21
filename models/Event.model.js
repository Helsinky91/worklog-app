const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {

    Name: String,
    EventType: { 
      type: String,
      enum: ["TIC formation", "Teamlead", "Lenguages formation", "Customer service", "Recreational activities" ]
    },
    Date: Date,
    Place: String,
    Description: String,
    AdminId: { 
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
})

const Event = model("Event", eventSchema);

module.exports = Event