import express, { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../Models/User.js";
import { configDotenv } from "dotenv";

const router = express.Router();

configDotenv();
if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is missing in .env. Using a default secret (Not recommended)");
}

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashPassword,
        });

        await user.save();

        const payload = { user: { userId: user._id } };

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
        const username = user.name;

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = { user: { userId: user._id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
            if (err) {
                console.error("JWT Signing Error:", err);
                return res.status(500).json({ message: "Token generation failed" });
            }
            res.json({ token, username });
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
