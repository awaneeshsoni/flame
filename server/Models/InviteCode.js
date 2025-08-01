import mongoose from "mongoose";

const InviteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("InviteCode", InviteCodeSchema);
