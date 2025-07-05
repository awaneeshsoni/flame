import express from "express"
import authMiddleware from "../middleware/auth.js";
import Workspace from "../Models/Workspace.js";
import User from "../Models/User.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const workspaces = await Workspace.find({ creator: req.user.userId }).populate("members")
            .populate("creator");
        res.json(workspaces);
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({ message: "Failed to fetch workspaces form bakcend" });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const workspace = await Workspace.findById({ _id: req.params.id })
            .populate('members', 'name email username ') 
            .populate('videos', 'title url')
            .populate('creator', 'name email username ');
        res.json(workspace);
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({ message: "Failed to fetch workspaces form backend" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
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

router.post("/:id/invite", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        const workspace = await Workspace.findById(req.params.id);
        const invitingUser = await User.findById(req.user.userId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });
        if (invitingUser.plan !== "pro") {
            return res.status(403).json({ message: "Upgrade to Pro to invite users" });
        }
        if (workspace.users.includes(userId)) {
            return res.status(400).json({ message: "User is already in the workspace" });
        }
        workspace.users.push(userId);
        await workspace.save();
        res.json({ message: "User invited successfully" });
    } catch (error) {
        console.error("Error inviting user:", error);
        res.status(500).json({ message: "Failed to invite user" });
    }
});

export default router;