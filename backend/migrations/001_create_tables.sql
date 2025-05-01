CREATE TABLE IF NOT EXISTS vtubers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    youtube_url VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS vtuber_tags (
    vtuber_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (vtuber_id, tag_id),
    FOREIGN KEY (vtuber_id) REFERENCES vtubers(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

