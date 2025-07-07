import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    text: { type: String, required: true }, 
    ticked: { type: Boolean, default: false },
    deleted: {type: Boolean, default: false},
    timestamp: { type: Number, required: true }, 
    date: { type: Date, default: Date.now }
});

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    filesize: { type: Number },
    isPublic: {type: Boolean , default: false },
    r2Key: { type: String }, 
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true }, 
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [CommentSchema], 
}, { timestamps: true });

export default mongoose.model("Video", VideoSchema);
