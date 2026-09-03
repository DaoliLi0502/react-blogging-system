const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbPromise = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    try {
        const db = await dbPromise;

        const user = await db.get(
            `SELECT user_id, username, password_hash, real_name, avatar_id, is_admin
             FROM users
             WHERE username = ?`,
            username
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                is_admin: user.is_admin
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                username: user.username,
                real_name: user.real_name,
                avatar_id: user.avatar_id,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/logout", authMiddleware, (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 0
    });

    res.status(204).send();
});

module.exports = router;