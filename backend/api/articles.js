const express = require("express");
const dbPromise = require("../db");

const router = express.Router();

router.get("/articles", async (req, res) => {
    const {
        search,
        match,
        sort,
        order
    } = req.query;

    try {
        const db = await dbPromise;

        const sortColumns = {
            title: "a.title",
            username: "u.username",
            date: "a.created_at"
        };

        const sortColumn = sortColumns[sort] || sortColumns.date;
        const sortOrder = order === "asc" ? "ASC" : "DESC";

        if (match === "partial" && search) {
            const query = `
                SELECT
                    a.article_id,
                    a.title,
                    a.content,
                    a.image_path,
                    a.author_id,
                    u.username,
                    a.created_at
                FROM articles a
                JOIN users u
                    ON a.author_id = u.user_id
                WHERE LOWER(a.title) LIKE LOWER(?)
                   OR LOWER(a.content) LIKE LOWER(?)
                ORDER BY ${sortColumn} ${sortOrder}
            `;

            const articles = await db.all(
                query,
                [`%${search}%`, `%${search}%`]
            );

            return res.status(200).json({
                articles
            });
        }

        if (match === "exact" && search) {
            const query = `
                SELECT
                    a.article_id,
                    a.title,
                    a.content,
                    a.image_path,
                    a.author_id,
                    u.username,
                    a.created_at
                FROM articles a
                JOIN users u
                    ON a.author_id = u.user_id
                ORDER BY ${sortColumn} ${sortOrder}
            `;

            let articles = await db.all(query);

            const regex = new RegExp(
                `(^|[^a-zA-Z])${search}([^a-zA-Z]|$)`,
                "i"
            );

            articles = articles.filter(article =>
                regex.test(article.title) ||
                regex.test(article.content)
            );

            return res.status(200).json({
                articles
            });
        }

        const query = `
            SELECT
                a.article_id,
                a.title,
                a.content,
                a.image_path,
                a.author_id,
                u.username,
                a.created_at
            FROM articles a
            JOIN users u
                ON a.author_id = u.user_id
            ORDER BY ${sortColumn} ${sortOrder}
        `;

        const articles = await db.all(query);

        return res.status(200).json({
            articles
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;