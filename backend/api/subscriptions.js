const express = require("express");
const dbPromise = require("../db");
const { authMiddleware } = require("../middleware/authMiddleware");
const createSubscriptionSchema = require("../validation/subscriptionValidation");

const router = express.Router();

router.post("/subscriptions", authMiddleware, async (req, res) => {

    try {

        const validatedData = await createSubscriptionSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true
        });

        const { subscribed_user_id } = validatedData;

        const db = await dbPromise;

        if (subscribed_user_id === req.user.user_id) {

            return res.status(400).json({
                message: "Cannot subscribe to yourself"
            });
        }

        const user = await db.get(
            `SELECT *
             FROM users
             WHERE user_id = ?`,
            subscribed_user_id
        );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingSubscription = await db.get(
            `SELECT *
             FROM user_subscriptions
             WHERE subscriber_id = ?
               AND subscribed_user_id = ?`,
            req.user.user_id,
            subscribed_user_id
        );

        if (existingSubscription) {

            return res.status(409).json({
                message: "Already subscribed"
            });
        }

        await db.run(
            `INSERT INTO user_subscriptions (
                subscriber_id,
                subscribed_user_id
            )
            VALUES (?, ?)`,
            req.user.user_id,
            subscribed_user_id
        );

        return res.status(201).json({
            message: "Subscribed successfully"
        });

    } catch (error) {

        if (error.name === "ValidationError") {

            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/subscriptions/:uid", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const subscription = await db.get(
            `SELECT *
             FROM user_subscriptions
             WHERE subscriber_id = ?
               AND subscribed_user_id = ?`,
            req.user.user_id,
            req.params.uid
        );

        if (!subscription) {

            return res.status(404).json({
                message: "Subscription not found"
            });
        }

        await db.run(
            `DELETE FROM user_subscriptions
             WHERE subscriber_id = ?
               AND subscribed_user_id = ?`,
            req.user.user_id,
            req.params.uid
        );

        return res.status(204).send();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;