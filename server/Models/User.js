import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  plan: {
    type: String,
    enum: ["free", "pro", "business"],
    default: "free"
  },
  planActivatedAt: Date,
  planExpiresAt: Date,
  lemonSqueezyCustomerId: String,
  lemonSqueezySubscriptionId: String,

  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
});


export default mongoose.model("User", UserSchema);
