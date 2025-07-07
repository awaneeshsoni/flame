import Workspace from "../Models/Workspace.js";
import PlanConfig from "../Utils/planConfig.js";

export const canAddMember = async (req, res, next) => {
    try {
        const { wsid } = req.body;
        const workspace = await Workspace.findById(wsid).populate("creator");
        if (!workspace) return res.status(404).json({ message: "Server Error! Workspace not found" });
        req.workspace = workspace;

        if (workspace.creator._id.toString() !== req.user.userId)
            return res.status(403).json({ message: "Only creator can generate invite codes" });

        const userPlan = workspace.creator.plan || "free";
        const planLimit = PlanConfig[userPlan];
        if (workspace.members.length >= planLimit.maxMembersPerWorkspace) {
            return res.status(403).json({ message: "Server Error! Member limit reached for this workspace" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error checking member limit" });
    }
};
