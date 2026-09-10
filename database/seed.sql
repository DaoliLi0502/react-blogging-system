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