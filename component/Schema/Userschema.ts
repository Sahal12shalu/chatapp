// models/user.ts
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type:String, require:false },
  nickname: String,
  image: String,
  online:{ type:Boolean,default:false }
});

export const User = models.User || mongoose.model("User", userSchema);
