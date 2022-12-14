const { Schema, model } = require("mongoose");
const department = require("../utils/department")
const role = require("../utils/role")
const eventType = require("../utils/event-types")


const userSchema = new Schema(
  { 
    firstName: String,
    lastName: String,
    photo: { 
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqQntImQPYse84fFTOn6j-yeWx5KlQdZdaD5iB_rXqn2hD2xyp0sG3c7WUbIdWXJUpAXc&usqp=CAU"
    },
    email: String,
    role: {
        type: String, 
        enum: role, 
        default: "user" 
    },
    department: {
        type: String, 
        enum: department,
    },
    events: [{
      //feeds from Event.model to select the eventType
        type: Schema.Types.ObjectId, 
        ref: "Event"
    }],  
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    isWorking: {
      type: Boolean,
      default: false
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
