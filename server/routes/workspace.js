import express from "express"
import authMiddleware from "../middleware/auth.js";
import Workspace from "../Models/Workspace.js";
import User from "../Models/User.js";
import Video from "../Models/Video.js";
import canCreateWorkspace from "../middleware/canCreateWorkspace.js";
import { canAddMember } from "../middleware/canAddMember.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { configDotenv } from "dotenv";
import InviteCode from "../Models/InviteCode.js";

configDotenv();

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const workspaces = await Workspace.find({
            $or: [
                { creator: req.user.userId },
                { members: req.user.userId },
            ],
        }).populate("members")
            .populate("creator");
        res.json(workspaces);
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({ message: "Failed to fetch workspaces form bakcend" });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate('members', 'name email username')
            .populate('videos', 'title url')
            .populate('creator', 'name email username');

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userId = req.user.userId;

        const isCreator = workspace.creator._id.toString() === userId;
        const isMember = workspace.members.some(
            (m) => m._id.toString() === userId
        );

        if (!isCreator && !isMember) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(workspace);
    } catch (error) {
        console.error("Error fetching workspace:", error);
        res.status(500).json({ message: "Failed to fetch workspace from backend" });
    }
});

router.post("/", authMiddleware, canCreateWorkspace, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Workspace name is required" });
        const newWorkspace = new Workspace({
            name,
            creator: req.user.userId,
            members: [req.user.userId],
        });
        await newWorkspace.save();
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { workspaces: newWorkspace._id }
        });
        res.json(newWorkspace);
    } catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).json({ message: "Failed to create workspace" });
    }
});


router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });

        // Only creator can rename
        if (workspace.creator.toString() !== req.user.userId)
            return res.status(403).json({ message: "Only creator can rename" });

        workspace.name = name;
        await workspace.save();

        res.json({ message: "Workspace renamed", workspace });
    } catch (err) {
        console.error("Error renaming workspace:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Workspace
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id).populate("videos");
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });
        if (workspace.creator.toString() !== req.user.userId)
            return res.status(403).json({ message: "Only the creator can delete the workspace" });
        for (const video of workspace.videos) {
            video.title = `DELETED_${video.title}`;
            video.deleted = true;
            await video.save();
        }
        await User.findByIdAndUpdate(workspace.creator, {
            $pull: { workspaces: workspace._id }
        });

        // Remove workspaceId from all members
        await User.updateMany(
            { _id: { $in: workspace.members } },
            { $pull: { workspaces: workspace._id } }
        );
        res.json({ message: "Workspace deleted." });
        setImmediate(async () => {
            try {
                for (const video of workspace.videos) {
                    if (video.r2Key) {
                        try {
                            await deleteFromR2(video.r2Key);
                        } catch (err) {
                            console.warn(`Failed to delete R2 key ${video.r2Key}:`, err.message);
                        }
                    }
                }

                await Video.deleteMany({ _id: { $in: workspace.videos.map(v => v._id) } });
                await Workspace.findByIdAndDelete(workspace._id);

                console.log(`Workspace ${workspace._id} and its videos fully deleted`);
            } catch (err) {
                console.error("Background deletion failed:", err);
            }
        });

    } catch (err) {
        console.error("Error deleting workspace:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/:id/invite", authMiddleware, canAddMember, async (req, res) => {
    try {
        const { email } = req.body;
        const wsid = req.params.id;

        if (!email) return res.status(400).json({ message: "Email is required" });

        // Generate JWT
        const token = jwt.sign(
            { workspaceId: wsid, inviteeEmail: email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Short 6-character code from token hash
        const hash = await bcrypt.hash(token, 5);
        const shortCode = hash.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6); // alphanumeric, 6-char

        await InviteCode.create({
            code: shortCode,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        res.json({ code: shortCode });
    } catch (err) {
        console.error("Invite error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/join", authMiddleware, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.userId;
        const userEmail = req.user.email;
        const invite = await InviteCode.findOne({ code });
        if (!invite || invite.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired invite code" });
        }
        const decoded = jwt.verify(invite.token, process.env.JWT_SECRET);
        if (decoded.inviteeEmail !== userEmail) {
            return res.status(403).json({ message: "This code was not made for your email" });
        }
        const workspace = await Workspace.findById(decoded.workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        // Add user to workspace if not already added
        if (!workspace.members.includes(userId)) {
            workspace.members.push(userId);
            await workspace.save();

            await User.findByIdAndUpdate(userId, {
                $addToSet: { workspaces: workspace._id }
            });

            await InviteCode.deleteOne({ code });

            return res.json({ wsid: decoded.workspaceId, message: "Joined workspace successfully" }); // ✅ return here
        } else {
            return res.status(403).json({ message: "You already are a member of this workspace" });
        }
    } catch (err) {
        console.error("Join error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/:id/remove-member", authMiddleware, async (req, res) => {
    try {
        const { memberId } = req.body;
        const userId = req.user.userId;
        const workspaceId = req.params.id;
        console.log(req.params)

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        // Only the creator can remove members
        if (workspace.creator.toString() !== userId) {
            return res.status(403).json({ message: "Only the creator can remove members" });
        }

        // Don't allow removing the creator
        if (memberId === workspace.creator.toString()) {
            return res.status(400).json({ message: "Cannot remove the workspace creator" });
        }

        // Remove member from workspace
        workspace.members = workspace.members.filter((id) => id.toString() !== memberId);
        await workspace.save();

        // Remove workspace from user
        await User.findByIdAndUpdate(memberId, {
            $pull: { workspaces: workspaceId },
        });

        res.json({ message: "Member removed successfully" });
    } catch (err) {
        console.error("Remove member error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;