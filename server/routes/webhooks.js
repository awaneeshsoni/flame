import express from 'express';
import User from '../Models/User.js';
import { configDotenv } from 'dotenv';
import crypto from "crypto";
configDotenv();

const router = express.Router();

router.post('/lemonsqueezy', async (req, res) => {
    const secret = process.env.LEMON_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(request.rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(request.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
        throw new Error('Invalid signature.');
    }

    try {
        const { meta, data } = req.body;
        const event = meta.event_name;
        const email = data.attributes.user_email;
        const productId = data.relationships.product.data.id;
        const subscriptionId = data.id;
        const customerId = data.relationships.customer.data.id;

        console.log("Webhook Event:", event, "| Email:", email);

        if (!email) return res.status(400).json({ error: "Missing email" });

        const plan = productId === "574871"
            ? "pro"
            : productId === "576491"
                ? "business"
                : "free";

        if (["subscription_created", "subscription_updated"].includes(event)) {
            await User.findOneAndUpdate(
                { email },
                {
                    plan,
                    lemonsqueezyCustomerId: customerId,
                    lemonsqueezySubscriptionId: subscriptionId,
                },
                { upsert: true }
            );
        }

        if (["subscription_cancelled", "subscription_expired"].includes(event)) {
            await User.findOneAndUpdate(
                { email },
                {
                    plan: "free",
                    lemonsqueezySubscriptionId: null,
                }
            );
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
