import Workspace from "../Models/Workspace.js";
import User from "../Models/User.js";
import PlanConfig from "../Utils/planConfig.js";

export const canUpload = async (req, res, next) => {
  try {
    const { workspaceId} = req.body;
    const userId = req.user.userId;
    const fileSize = req.file.size;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const [user, workspace] = await Promise.all([
      User.findById(userId),
      Workspace.findById(workspaceId).populate("creator"),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const isAuthorized =
      workspace.members.includes(userId) ||
      workspace.creator.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({
        message: "Access denied. Only workspace members or the creator can upload.",
      });
    }
    const size = Number(fileSize);
    if (isNaN(size) || size <= 0) {
      return res.status(400).json({ message: "Invalid file size" });
    }

    const userPlan = workspace.creator.plan;
    const planLimit = PlanConfig[userPlan];

    if ((workspace.storageUsed + size) > planLimit.storagePerWorkspace) {
      return res.status(403).json({ message: "Storage limit exceeded! Upgrade plan" });
    }
    req.workspace = workspace;
    req.user = user;
    next();
  } catch (err) {
    console.error("canUpload middleware error:", err);
    res.status(500).json({ message: "Server error checking upload permissions" });
  }
};
