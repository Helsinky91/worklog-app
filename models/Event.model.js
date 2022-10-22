const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
<<<<<<< HEAD

=======
>>>>>>> c3afecb58bbf20d4a1ad4183f256c6393095ae90
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