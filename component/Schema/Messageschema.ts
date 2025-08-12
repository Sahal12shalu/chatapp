import mongoose, { Schema} from "mongoose";

const Messageschema = new Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: {type : String, default: () =>{
    const now = new Date()
    return now.toTimeString().slice(0,5)
  }},
  seen: { type:Boolean , default:false }
});

export const message =  mongoose.models.message || mongoose.model("message", Messageschema);