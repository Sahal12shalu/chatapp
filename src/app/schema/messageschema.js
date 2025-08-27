import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }); // e.g., '10:30 AM'
      },
    },
    seen:{
      type: Boolean,
      default: false
    }
  },{
    timestamps:true
  }
);

// Mongoose hot-reload issues avoid cheyyan:
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
