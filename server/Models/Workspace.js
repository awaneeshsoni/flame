import mongoose from "mongoose";
const WorkspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], 
}, { timestamps: true });

export default mongoose.model("Workspace", WorkspaceSchema);
