const fs = require("fs/promises");
const express = require("express");
const multer = require("multer");
const dbPromise = require("../db");
const {
    authMiddleware,
    optionalAuthMiddleware
} = require("../middleware/authMiddleware");
const {
    createArticleSchema,
    updateArticleSchema
} = require("../validation/articleValidation");
const createCommentSchema = require("../validation/commentValidation");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

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

router.get("/articles/me", authMiddleware, async (req, res) => {
    try {
        const db = await dbPromise;

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
            WHERE a.author_id = ?
            ORDER BY a.created_at DESC
        `;

        const articles = await db.all(query, [req.user.user_id]);

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

router.post("/articles", authMiddleware, upload.single("image"), async (req, res) => {

    try {

        const validatedData = await createArticleSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true
        });

        const { title, content } = validatedData;

        const db = await dbPromise;

        const imagePath = req.file
            ? req.file.path
            : null;

        const result = await db.run(
            `INSERT INTO articles (
                title,
                content,
                image_path,
                author_id
            )
            VALUES (?, ?, ?, ?)`,
            title,
            content,
            imagePath,
            req.user.user_id
        );

        const articleId = result.lastID;

        const subscribers = await db.all(
            `SELECT subscriber_id
             FROM user_subscriptions
             WHERE subscribed_user_id = ?`,
            req.user.user_id
        );

        for (const subscriber of subscribers) {

            await db.run(
                `INSERT INTO subscription_notifications (
                    user_id,
                    article_id
                )
                VALUES (?, ?)`,
                subscriber.subscriber_id,
                articleId
            );
        }

        return res.status(201).json({
            message: "Article created successfully",
            article: {
                article_id: articleId,
                title,
                content,
                image_path: imagePath,
                author_id: req.user.user_id
            }
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

router.put("/articles/:aid", authMiddleware, upload.single("image"), async (req, res) => {

    try {

        const validatedData = await updateArticleSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true
        });

        const { title, content, remove_image } = validatedData;

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        if (article.author_id !== req.user.user_id) {

            return res.status(403).json({
                message: "Forbidden"
            });
        }

        let imagePath = article.image_path;

        if (req.file) {

            if (article.image_path) {

                try {
                    await fs.unlink(article.image_path);
                } catch (error) {

                    if (error.code !== "ENOENT") {
                        throw error;
                    }
                }
            }

            imagePath = req.file.path;

        } else if (remove_image) {

            if (article.image_path) {

                try {
                    await fs.unlink(article.image_path);
                } catch (error) {

                    if (error.code !== "ENOENT") {
                        throw error;
                    }
                }
            }

            imagePath = null;
        }

        await db.run(
            `UPDATE articles
             SET title = ?,
                 content = ?,
                 image_path = ?
             WHERE article_id = ?`,
            title,
            content,
            imagePath,
            req.params.aid
        );

        return res.status(200).json({
            message: "Article updated successfully",
            article: {
                article_id: article.article_id,
                title,
                content,
                image_path: imagePath,
                author_id: article.author_id,
                created_at: article.created_at
            }
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

router.delete("/articles/:aid", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        if (article.author_id !== req.user.user_id) {

            return res.status(403).json({
                message: "Forbidden"
            });
        }

        if (article.image_path) {

            try {
                await fs.unlink(article.image_path);
            } catch (error) {

                if (error.code !== "ENOENT") {
                    throw error;
                }
            }
        }

        await db.run(
            `DELETE FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        return res.status(204).send();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/articles/:aid/likes", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT article_id
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        const existingLike = await db.get(
            `SELECT *
             FROM article_likes
             WHERE user_id = ?
               AND article_id = ?`,
            req.user.user_id,
            req.params.aid
        );

        if (existingLike) {

            return res.status(409).json({
                message: "Article already liked"
            });
        }

        await db.run(
            `INSERT INTO article_likes (
                user_id,
                article_id
            )
            VALUES (?, ?)`,
            req.user.user_id,
            req.params.aid
        );

        return res.status(201).json({
            message: "Article liked successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/articles/:aid/likes", optionalAuthMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        const result = await db.get(
            `SELECT COUNT(*) AS count
             FROM article_likes
             WHERE article_id = ?`,
            req.params.aid
        );

        let likedByMe = false;

        if (req.user) {

            const like = await db.get(
                `SELECT *
                 FROM article_likes
                 WHERE user_id = ?
                   AND article_id = ?`,
                req.user.user_id,
                req.params.aid
            );

            if (like) {
                likedByMe = true;
            }
        }

        return res.status(200).json({
            count: result.count,
            liked_by_me: likedByMe
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/articles/:aid/likes", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        const like = await db.get(
            `SELECT *
             FROM article_likes
             WHERE user_id = ?
               AND article_id = ?`,
            req.user.user_id,
            req.params.aid
        );

        if (!like) {

            return res.status(404).json({
                message: "Like not found"
            });
        }

        await db.run(
            `DELETE FROM article_likes
             WHERE user_id = ?
               AND article_id = ?`,
            req.user.user_id,
            req.params.aid
        );

        return res.status(204).send();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/articles/:aid/tags", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        if (article.author_id !== req.user.user_id) {

            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const { tag_ids } = req.body;

        if (!Array.isArray(tag_ids) || tag_ids.length === 0) {

            return res.status(400).json({
                message: "tag_ids must be a non-empty array"
            });
        }

        for (const tagId of tag_ids) {

            const tag = await db.get(
                `SELECT *
                 FROM tags
                 WHERE tag_id = ?`,
                tagId
            );

            if (!tag) {

                return res.status(404).json({
                    message: `Tag ${tagId} not found`
                });
            }

            const existingTag = await db.get(
                `SELECT *
                 FROM article_tags
                 WHERE article_id = ?
                   AND tag_id = ?`,
                req.params.aid,
                tagId
            );

            if (!existingTag) {

                await db.run(
                    `INSERT INTO article_tags (
                        article_id,
                        tag_id
                    )
                    VALUES (?, ?)`,
                    req.params.aid,
                    tagId
                );
            }
        }

        return res.status(201).json({
            message: "Tags added successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/articles/:aid/tags/:tid", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        if (article.author_id !== req.user.user_id) {

            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const articleTag = await db.get(
            `SELECT *
             FROM article_tags
             WHERE article_id = ?
               AND tag_id = ?`,
            req.params.aid,
            req.params.tid
        );

        if (!articleTag) {

            return res.status(404).json({
                message: "Tag not found on this article"
            });
        }

        await db.run(
            `DELETE FROM article_tags
             WHERE article_id = ?
               AND tag_id = ?`,
            req.params.aid,
            req.params.tid
        );

        return res.status(204).send();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/articles/:aid/comments", authMiddleware, async (req, res) => {

    try {

        const validatedData = await createCommentSchema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true
        });

        const { content } = validatedData;

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        const result = await db.run(
            `INSERT INTO comments (
                article_id,
                user_id,
                content
            )
            VALUES (?, ?, ?)`,
            req.params.aid,
            req.user.user_id,
            content
        );

        const commentId = result.lastID;

        const mentions = content.match(/@[a-zA-Z0-9_]+/g) || [];

        const usernames = [];

        for (const mention of mentions) {

            const username = mention.substring(1);

            if (!usernames.includes(username)) {
                usernames.push(username);
            }
        }

        for (const username of usernames) {

            const user = await db.get(
                `SELECT user_id
                 FROM users
                 WHERE username = ?`,
                username
            );

            if (user) {

                await db.run(
                    `INSERT INTO comment_notifications (
                        user_id,
                        comment_id
                    )
                    VALUES (?, ?)`,
                    user.user_id,
                    commentId
                );
            }
        }

        return res.status(201).json({
            message: "Comment created successfully",
            comment: {
                comment_id: commentId,
                article_id: req.params.aid,
                user_id: req.user.user_id,
                content
            }
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

router.get("/articles/:aid/comments", async (req, res) => {

    try {

        const db = await dbPromise;

        const article = await db.get(
            `SELECT *
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });
        }

        const comments = await db.all(
            `SELECT
                c.comment_id,
                c.article_id,
                c.user_id,
                u.username,
                a.avatar_id,
                a.image_path AS avatar_path,
                c.content,
                c.created_at
             FROM comments c
             JOIN users u
                 ON c.user_id = u.user_id
             LEFT JOIN avatars a
                 ON u.avatar_id = a.avatar_id
             WHERE c.article_id = ?
             ORDER BY c.created_at ASC`,
            req.params.aid
        );

        return res.status(200).json({
            comments
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.delete("/articles/:aid/comments/:cid", authMiddleware, async (req, res) => {

    try {

        const db = await dbPromise;

        const comment = await db.get(
            `SELECT *
             FROM comments
             WHERE comment_id = ?
               AND article_id = ?`,
            req.params.cid,
            req.params.aid
        );

        if (!comment) {

            return res.status(404).json({
                message: "Comment not found"
            });
        }

        const article = await db.get(
            `SELECT author_id
             FROM articles
             WHERE article_id = ?`,
            req.params.aid
        );

        if (comment.user_id !== req.user.user_id &&
            article.author_id !== req.user.user_id) {

            return res.status(403).json({
                message: "Forbidden"
            });
        }

        await db.run(
            `DELETE FROM comments
             WHERE comment_id = ?`,
            req.params.cid
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