const express = require("express");
const bcrypt = require("bcrypt");
const dbPromise = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const registerSchema = require("../validation/userValidation");

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

module.exports = router;