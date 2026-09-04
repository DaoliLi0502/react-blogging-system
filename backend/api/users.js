const express = require("express");
const bcrypt = require("bcrypt");
const dbPromise = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const {
    registerSchema,
    updateProfileSchema
} = require("../validation/userValidation");

const router = express.Router();

router.post("/users", async (req, res) => {
    try {
        const validatedData = await registerSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true
        });

        const {
            username,
            password,
            real_name,
            date_of_birth,
            description,
            avatar_id
        } = validatedData;

        const db = await dbPromise;

        const existingUser = await db.get(
            `SELECT user_id
             FROM users
             WHERE username = ?`,
            username
        );

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.run(
            `INSERT INTO users (
                username,
                password_hash,
                real_name,
                date_of_birth,
                description,
                avatar_id
             )
             VALUES (?, ?, ?, ?, ?, ?)`,
            username,
            passwordHash,
            real_name,
            date_of_birth,
            description || null,
            avatar_id || null
        );

        res.status(201).json({
            message: "User registered successfully",
            user: {
                user_id: result.lastID,
                username,
                real_name,
                date_of_birth,
                description: description || null,
                avatar_id: avatar_id || null
            }
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/users/check-username", async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({
            message: "Username is required"
        });
    }

    try {
        const db = await dbPromise;

        const existingUser = await db.get(
            `SELECT user_id
             FROM users
             WHERE username = ?`,
            username
        );

        res.status(200).json({
            available: !existingUser
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.put("/users/me", authMiddleware, async (req, res) => {
    const userId = req.user.user_id;

    try {
        const validatedData = await updateProfileSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true
        });

        const {
            real_name,
            date_of_birth,
            description,
            avatar_id
        } = validatedData;

        const db = await dbPromise;

        await db.run(
            `UPDATE users
             SET real_name = ?,
                 date_of_birth = ?,
                 description = ?,
                 avatar_id = ?
             WHERE user_id = ?`,
            real_name,
            date_of_birth,
            description || null,
            avatar_id || null,
            userId
        );

        res.status(200).json({
            message: "User profile updated successfully"
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/users/me", authMiddleware, async (req, res) => {
    const userId = req.user.user_id;

    try {
        const db = await dbPromise;

        await db.run(
            `DELETE FROM users
             WHERE user_id = ?`,
            userId
        );

        res.status(204).send();

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/users", authMiddleware, async (req, res) => {
    if (req.user.is_admin !== 1) {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    try {
        const db = await dbPromise;

        const users = await db.all(
            `SELECT
                u.user_id,
                u.username,
                u.real_name,
                u.date_of_birth,
                u.description,
                u.avatar_id,
                u.is_admin,
                COUNT(a.article_id) AS article_count
             FROM users u
             LEFT JOIN articles a
                ON u.user_id = a.author_id
             GROUP BY u.user_id
             ORDER BY u.user_id`
        );

        res.status(200).json({
            users
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/users/:uid", authMiddleware, async (req, res) => {
    if (req.user.is_admin !== 1) {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    const { uid } = req.params;

    try {
        const db = await dbPromise;

        await db.run(
            `DELETE FROM users
             WHERE user_id = ?`,
            uid
        );

        res.status(204).send();

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;