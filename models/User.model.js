const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  { 
    firstName: String,
    lastName: String,
    photo: String,
    email: String,
    role: {
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    department: {
        type: String, 
        enum: ["cook", "receptionist", "waiter/waitress", "reservations"]
    },
    interest: {
      type: String,
      enum: ["TIC formation", "Teamlead", "Lenguages formation", "Customer service", "Recreational activities" ]
    },  
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
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
