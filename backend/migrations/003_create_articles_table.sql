CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vtuber_id INT NOT NULL,
    related_vtuber_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    tags JSON,
    likes INT DEFAULT 0,
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vtuber_id) REFERENCES vtubers(id) ON DELETE CASCADE
);

