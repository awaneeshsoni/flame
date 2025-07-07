import User from "../Models/User.js";
import PlanConfig from "../Utils/planConfig.js";

const canCreateWorkspace = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = user.plan || "free";
    const maxWorkspaces = PlanConfig[plan]?.maxWorkspaces || 1;

    const currentWorkspaceCount = user.workspaces.length;

    if (currentWorkspaceCount >= maxWorkspaces) {
      return res.status(403).json({
        message: `Workspace limit reached for your plan (${plan}). Upgrade to create more.`,
      });
    }

    next();
  } catch (err) {
    console.error("canCreateWorkspace error:", err);
    res.status(500).json({ message: "Server error while checking plan limits" });
  }
};

export default canCreateWorkspace;
