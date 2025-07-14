import express from 'express';
import User from '../Models/User.js';
import { configDotenv } from 'dotenv';
import crypto from "crypto";
configDotenv();

const router = express.Router();

const plans = {
    "574871": "pro",
    "576491": "business"
};

router.post('/lemonsqueezy', async (req, res) => {
    const secret = process.env.LEMON_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
    const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
        throw new Error('Invalid signature.');
    }

    try {
        const parsedBody = JSON.parse(req.body.toString("utf8"));
        const { meta, data } = parsedBody
        const userId = meta.custom_data.user_id ;
        const event = meta.event_name;
        const productId = data.attributes.product_id;
        const subscriptionId = data.id;
        const customerId = data.attributes.customer_id;
        const plan = plans[productId] || "free";

        if (["subscription_created", "subscription_updated"].includes(event)) {
            await User.findByIdAndUpdate(
                 userId ,
                {
                    plan,
                    productId,
                    lemonsqueezyCustomerId: customerId,
                    lemonsqueezySubscriptionId: subscriptionId,
                    subscriptionStatus: data.attributes.status,
                    subscriptionRenewsAt: data.attributes.renews_at,
                    subscriptionEndsAt: data.attributes.ends_at,
                },
                { upsert: true }
            );
            console.log("plan updated in mongo")
        }

        if (["subscription_cancelled", "subscription_expired"].includes(event)) {
            await User.findByIdAndUpdate(
                 userId ,
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