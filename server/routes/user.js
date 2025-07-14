import express, { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../Models/User.js";
import { configDotenv } from "dotenv";
import authMiddleware from "../middleware/auth.js";
import axios from "axios";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

configDotenv();
const token = process.env.LEMON_API_KEY

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
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ message: "Updated Successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

router.post('/create-checkout', async (req, res) => {
  const { variantId, userId, email } = req.body;

  const apiKey = process.env.LEMON_API_KEY;
  if (!apiKey) {
    console.error("LEMONSQUEEZY_API_KEY is not set in your .env file!");
    return res.status(500).json({ error: "API Key is not configured." });
  }
  lemonSqueezySetup({ apiKey });
  const storeId = process.env.LEMON_STORE_ID;
  if (!storeId || !variantId) {
    return res.status(400).json({ error: 'Missing Store ID or Variant ID.' });
  }

  try {
    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: email,
        custom: { userId: userId },
      },
      productOptions: {
        redirectUrl: `${process.env.APP_URL}/success`,
      },
      checkoutOptions: {
        dark: true,
      }
    });
    if (checkout.error) {
      throw new Error(JSON.stringify(checkout.error));
    }

    const checkoutUrl = checkout.data.data.attributes.url;

    console.log("Successfully created checkout URL:", checkoutUrl);
    res.json({ url: checkoutUrl });

  } catch (err) {
    console.error('Error from Lemon Squeezy SDK:', err.message);
    res.status(500).json({ error: 'Failed to create checkout via SDK.', details: err.message });
  }
});
export default router;