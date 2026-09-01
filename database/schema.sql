PRAGMA foreign_keys = ON;

CREATE TABLE avatars (
    avatar_id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT NOT NULL
);

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    real_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    description TEXT,
    avatar_id INTEGER,
    is_admin INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (avatar_id)
        REFERENCES avatars(avatar_id)
        ON DELETE SET NULL,

    CHECK (is_admin IN (0, 1))
);

CREATE TABLE articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_path TEXT,
    author_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE article_likes (
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, article_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE
);

CREATE TABLE article_tags (
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (article_id, tag_id),

    FOREIGN KEY (article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
        REFERENCES tags(tag_id)
        ON DELETE CASCADE
);

CREATE TABLE user_subscriptions (
    subscriber_id INTEGER NOT NULL,
    subscribed_user_id INTEGER NOT NULL,

    PRIMARY KEY (subscriber_id, subscribed_user_id),

    FOREIGN KEY (subscriber_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subscribed_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CHECK (subscriber_id != subscribed_user_id)
);

CREATE TABLE comment_notifications (
    comment_notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (comment_id)
        REFERENCES comments(comment_id)
        ON DELETE CASCADE,

    CHECK (is_read IN (0, 1))
);

CREATE TABLE subscription_notifications (
    subscription_notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (article_id)
        REFERENCES articles(article_id)
        ON DELETE CASCADE,

    CHECK (is_read IN (0, 1))
);