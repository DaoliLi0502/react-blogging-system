INSERT INTO users (
    username,
    password_hash,
    real_name,
    date_of_birth,
    description,
    avatar_id,
    is_admin
) VALUES (
    'testuser',
    '$2b$10$lWe5d.IJbfzHCplrrhbLOuXhDbm7XEYwGpOVwzefh2mAuMpBiMs2i',
    'Test User',
    '1995-01-01',
    'Test account',
    NULL,
    0
);

INSERT INTO articles (
    title,
    content,
    author_id
) VALUES (
    'My First Article',
    'This is my first article.',
    2
);

INSERT INTO articles (
    title,
    content,
    author_id
) VALUES (
    'Learning React',
    'I am learning React and building a blogging system.',
    2
);

INSERT INTO articles (
    title,
    content,
    author_id
) VALUES (
    'Hello World',
    'Hello, this is a test article.',
    1
);

INSERT INTO comments (
    article_id,
    user_id,
    content
) VALUES (
    1,
    2,
    'This is a very interesting article.'
);

INSERT INTO comments (
    article_id,
    user_id,
    content
) VALUES (
    1,
    1,
    'Thank you for sharing this article.'
);

INSERT INTO comments (
    article_id,
    user_id,
    content
) VALUES (
    2,
    1,
    'React is very useful for building user interfaces.'
);

INSERT INTO comments (
    article_id,
    user_id,
    content
) VALUES (
    2,
    2,
    'I am also learning React.'
);

INSERT INTO comments (
    article_id,
    user_id,
    content
) VALUES (
    3,
    2,
    'Hello Alice, nice article!'
);

INSERT INTO comment_notifications (
    user_id,
    comment_id,
    is_read
)
VALUES
    (1, 1, 0),
    (1, 2, 1);

INSERT INTO subscription_notifications (
    user_id,
    article_id,
    is_read
)
VALUES
    (1, 2, 0),
    (1, 3, 1);

INSERT INTO tags (name)
VALUES
    ('React'),
    ('JavaScript'),
    ('Node.js'),
    ('SQLite'),
    ('Web Development'),
    ('Programming');

INSERT INTO article_tags (article_id, tag_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 6),
    (2, 3),
    (2, 4),
    (3, 1),
    (3, 5);