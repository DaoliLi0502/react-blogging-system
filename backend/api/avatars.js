const express = require("express");
const dbPromise = require("../db");

const router = express.Router();

// Get all avatars
router.get("/avatars", async (req, res) => {
    try {
        const db = await dbPromise;

        const avatars = await db.all(
            `SELECT avatar_id, image_path
             FROM avatars
             ORDER BY avatar_id`
        );

        res.status(200).json({
            avatars
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;