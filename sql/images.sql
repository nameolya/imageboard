DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment_username VARCHAR NOT NULL,
    comment TEXT,
    image_id INTEGER NOT NULL REFERENCES images(id),
    comment_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);