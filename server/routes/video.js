import express from "express"
import authMiddleware from "../middleware/auth.js";
import Video from '../Models/Video.js';
import User from '../Models/User.js';
import Workspace from '../Models/Workspace.js';
import { configDotenv } from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { uploadFileToAzure, deleteFileFromAzure } from "../Utils/azureConfig.js"

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


router.post("/upload", authMiddleware, uploadStrategy, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(400).json({ message: "User not found." });

        const { workspaceId } = req.body;
        if (!workspaceId) return res.status(400).json({ message: "Workspace ID is required." });

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (!workspace.members.includes(req.user.userId) && workspace.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. Only workspace members and the creator can upload videos." });
        }

        if (!req.file) {
            return res.status(400).send('No video file uploaded.');
        }

        const blobUrl = await uploadFileToAzure(req.file.buffer, req.file.originalname, req.file.mimetype);
        const video = new Video({
            title: req.file.originalname,
            url: blobUrl,
            workspace: workspaceId,
            uploader: user._id,
        });
        await video.save();
        res.json({ message: "Video uploaded successfully", video });
    } catch (error) {
        console.error("Error uploading video:", error);
        res.status(500).json({ message: "Failed to upload video.", error: error.message });
    }
});

router.delete("/delete/:videoId", authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId).populate('workspace');
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }
    
        const workspace = video.workspace;
        const isCreator = workspace.creator.equals(req.user._id);
        const isMember = workspace.members.includes(req.user._id);
        if (!isCreator && !isMember) {
          return res.status(403).json({ message: 'Unauthorized to delete this video.' });
        }
        await deleteFileFromAzure(video.url);
        await Video.findByIdAndDelete(req.params.videoId);
    
    
        res.status(200).json({ message: 'Video deleted successfully.' });
        } catch (error) {
            console.error('Error deleting video:', error);
            res.status(500).json({ message: 'Error deleting video.' });
        }
});


export default router;