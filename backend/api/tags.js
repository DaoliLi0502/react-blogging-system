const express = require("express");
const dbPromise = require("../db");

const router = express.Router();

router.get("/tags", async (req, res) => {

    try {

        const db = await dbPromise;

        const tags = await db.all(
            `SELECT *
             FROM tags
             ORDER BY name ASC`
        );

        return res.status(200).json({
            tags
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/tags/:tid/articles", async (req, res) => {

    try {

        const db = await dbPromise;

        const tag = await db.get(
            `SELECT *
             FROM tags
             WHERE tag_id = ?`,
            req.params.tid
        );

        if (!tag) {

            return res.status(404).json({
                message: "Tag not found"
            });
        }

        const articles = await db.all(
            `SELECT
                a.article_id,
                a.title,
                a.content,
                a.image_path,
                a.author_id,
                u.username,
                a.created_at
             FROM articles a
             JOIN article_tags at
                 ON a.article_id = at.article_id
             JOIN users u
                 ON a.author_id = u.user_id
             WHERE at.tag_id = ?
             ORDER BY a.created_at DESC`,
            req.params.tid
        );

        return res.status(200).json({
            articles
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;