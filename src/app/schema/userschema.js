import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    image: {
      type: String,
    },
    status:{
      type: Boolean,
      default:false
    },
    archieveUsers:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    timestamp: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }); 
      },
    },
  },{
    timestamps:true
  }
);

// Mongoose hot-reload issues avoid cheyyan:
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
