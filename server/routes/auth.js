import express, { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../Models/User.js";
import { configDotenv } from "dotenv";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

configDotenv();
if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is missing in .env. Using a default secret (Not recommended)");
}

router.get("/verify-token", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(401).json({ message: "Invalid token" });
  res.json({ name: user.name});
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const now = new Date();
        user = new User({
            name,
            email,
            password: hashPassword,
            plan: "free",
            planActivatedAt: now,
            planExpiresAt: null,
        });
        await user.save();
        const defaultWorkspace = new Workspace({
            name: `${name}'s Workspace`,
            creator: user._id,
            members: [user._id],
            storageUsed: 0,
        });
        await defaultWorkspace.save();
        user.workspaces.push(defaultWorkspace._id);
        await user.save();
        const payload = { user: { userId: user._id, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
            if (err) {
                console.error("JWT Signing Error:", err);
                return res.status(500).json({ message: "Token generation failed" });
            }
            res.json({ token });
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password Wrong!' });
        }
        const payload = { user: { userId: user._id,  email: user.email  }};

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
            if (err) {
                console.error("JWT Signing Error:", err);
                return res.status(500).json({ message: "Token generation failed" });
            }
            res.json({ token, user});
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
