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