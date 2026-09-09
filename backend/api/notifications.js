const express = require("express");
const dbPromise = require("../db");

const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/comment-notifications", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const notifications = await db.all(
            `SELECT
                cn.comment_notification_id,
                cn.user_id,
                cn.comment_id,
                cn.is_read,
                c.article_id,
                c.user_id AS commenter_id,
                u.username AS commenter_username,
                a.avatar_id,
                a.image_path AS avatar_path,
                c.content,
                c.created_at
             FROM comment_notifications cn
             JOIN comments c
                 ON cn.comment_id = c.comment_id
             JOIN users u
                 ON c.user_id = u.user_id
             LEFT JOIN avatars a
                 ON u.avatar_id = a.avatar_id
             WHERE cn.user_id = ?
             ORDER BY c.created_at DESC`,
            req.user.user_id
        );

        return res.status(200).json({
            notifications
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.put("/comment-notifications/:cnid", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const notification = await db.get(
            `SELECT *
             FROM comment_notifications
             WHERE comment_notification_id = ?
               AND user_id = ?`,
            req.params.cnid,
            req.user.user_id
        );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found"
            });
        }

        await db.run(
            `UPDATE comment_notifications
             SET is_read = 1
             WHERE comment_notification_id = ?`,
            req.params.cnid
        );

        return res.status(200).json({
            message: "Notification marked as read"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/subscription-notifications", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const notifications = await db.all(
            `SELECT
                sn.subscription_notification_id,
                sn.user_id,
                sn.article_id,
                sn.is_read,
                a.title,
                a.image_path,
                a.author_id,
                u.username AS author_username,
                av.avatar_id,
                av.image_path AS avatar_path,
                a.created_at
             FROM subscription_notifications sn
             JOIN articles a
                 ON sn.article_id = a.article_id
             JOIN users u
                 ON a.author_id = u.user_id
             LEFT JOIN avatars av
                 ON u.avatar_id = av.avatar_id
             WHERE sn.user_id = ?
             ORDER BY a.created_at DESC`,
            req.user.user_id
        );

        return res.status(200).json({
            notifications
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.put("/subscription-notifications/:snid", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const notification = await db.get(
            `SELECT *
             FROM subscription_notifications
             WHERE subscription_notification_id = ?
               AND user_id = ?`,
            req.params.snid,
            req.user.user_id
        );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found"
            });
        }

        await db.run(
            `UPDATE subscription_notifications
             SET is_read = 1
             WHERE subscription_notification_id = ?`,
            req.params.snid
        );

        return res.status(200).json({
            message: "Notification marked as read"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;