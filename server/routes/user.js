import express, { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../Models/User.js";
import { configDotenv } from "dotenv";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10); 
    const user = await User.findByIdAndUpdate(req.params.id, updates, {new: true});
    res.status(200).json({message: "Updated Successfully", user});
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile"  });
  }
});


export default router;