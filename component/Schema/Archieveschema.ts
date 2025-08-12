import mongoose, { Schema,models } from "mongoose";

const Archieveschema = new Schema({
  userId  : { type: mongoose.Schema.Types.ObjectId, ref:'User'},
  archievedUserid : { type: mongoose.Schema.Types.ObjectId, ref:'user'},
  category: { type: String, default:'All', required:true }
});

export const Archieve = models.Archieve || mongoose.model("archieve", Archieveschema);