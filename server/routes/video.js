import express from "express"
import authMiddleware from "../middleware/auth.js";
import Video from '../Models/Video.js';
import User from '../Models/User.js';
import Workspace from '../Models/Workspace.js';
import { configDotenv } from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { uploadToR2, deleteFromR2 } from "../Utils/cloudflareConfig.js"
import { canUpload } from "../middleware/canUpload.js";

configDotenv();
const router = express.Router();
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('video');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) return res.status(400).json({ message: 'Workspace ID is required' });
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.members.includes(req.user.userId) && workspace.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied for this workspace. You are neither a member nor the creator' });
    }
    const videos = await Video.find({ workspace: workspaceId });
    res.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    const workspace = await Workspace.findById(video.workspace);
    if (!workspace) {
      return res.status(403).json({ message: 'error fetching workspace' });
    }
    if (!workspace.members.includes(req.user.userId) && workspace.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied. Only workspace members and the creator can upload videos." });
    }

    res.json(video);
  } catch (err) {
    console.error('Error fetching video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get("/share/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }
    const video = await Video.findById(id);
    if (!video) {
      console.log("share / error");
      return res.status(404).json({ message: "Video not found" });
    }
    if (!video.isPublic) {
      return res.status(403).json({
        message: "Video is private",
        statusCode: 403,
      });
    }
    return res.json(video);

  } catch (err) {
    console.error("Error fetching video:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put('/:id/privacy', authMiddleware, async (req, res) => {
  try {
    const { isPublic } = req.body;
    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ message: "Invalid value for isPublic" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    video.isPublic = isPublic;
    await video.save();
    const response = {
      message: "Privacy updated successfully",
      isPublic: video.isPublic
    };
    if (isPublic) {
      response.id = video._id;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error updating privacy:', error);
    return res.status(500).json({ message: 'Failed to update privacy' });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const { name, text, timestamp } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    video.comments.push({ name, text, timestamp });
    await video.save();
    res.json(video.comments);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

router.put('/:id/comments/:cid', authMiddleware, async (req, res) => {
  try {
    const { ticked } = req.body;
    const { id, cid } = req.params;
    const video = await Video.findById(id).populate("workspace");
    if (!video) return res.status(404).json({ message: 'Video not found' });
    const workspace = video.workspace;
    const isMember = workspace.creator.toString() === req.user.userId || workspace.members.includes(req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Not authorized to edit comments' });
    const comment = video.comments.id(cid);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    comment.ticked = ticked;
    await video.save();
    res.json({ message: 'Comment updated', comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
});

// Delete Comment
router.delete('/:id/comments/:cid', authMiddleware, async (req, res) => {
  try {
    const { id, cid } = req.params;

    const video = await Video.findById(id).populate("workspace");
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const workspace = video.workspace;
    const isMember = workspace.creator.toString() === req.user.userId || workspace.members.includes(req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Not authorized to delete comments' });

    const comment = video.comments.id(cid);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    video.comments.pull({ _id: cid });
    await video.save();

    res.json({ message: 'Comment deleted successfully', comments: video.comments });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

router.post("/upload", authMiddleware, uploadStrategy, canUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded." });
    }
    const r2Key = `videos/${Date.now()}_${req.file.originalname}`;
    const blobUrl = await uploadToR2(r2Key, req.file.buffer, req.file.mimetype);
    const video = new Video({
      title: req.file.originalname,
      url: blobUrl,
      r2Key,
      workspace: req.workspace._id,
      uploader: req.user._id,
      filesize: req.file.size,
    });
    await video.save();
    req.workspace.storageUsed += req.file.size;
    await req.workspace.save();
    res.json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Server Error! Failed to upload video.", error: error.message });
  }
});

router.delete("/:videoId", authMiddleware, async (req, res) => {
  try {
    console.log(req.params)
    const video = await Video.findById(req.params.videoId).populate("workspace");
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }
    const workspace = video.workspace;
    const isCreator = workspace.creator.equals(req.user.userId);
    const isMember = workspace.members.includes(req.user.userId);

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this video." });
    }

    video.title = `DELETED_${video.title}`;
    video.deleted = true;
    await video.save();
    await Workspace.findByIdAndUpdate(video.workspace._id, {
      $pull: { videos: video._id },
      $inc: { storageUsed: -video.filesize }
    });
    res.status(200).json({ message: "Video deleted successfully." });
    setImmediate(async () => {
      try {
        if (video.r2Key) {
          try {
            await deleteFromR2(video.r2Key);
          } catch (err) {
            console.warn(`Failed to delete from R2: ${video.r2Key}`, err.message);
          }
        }
        await Video.findByIdAndDelete(req.params.videoId);

        console.log(`Fully deleted video ${req.params.videoId}`);
      } catch (err) {
        console.error("Background deletion of single video failed:", err);
      }
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Error deleting video." });
  }
});

export default router;