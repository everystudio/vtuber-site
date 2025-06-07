CREATE TABLE link_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255) DEFAULT NULL
);

CREATE TABLE liver_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    liver_id INT NOT NULL,
    link_type_id INT NOT NULL,
    url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (liver_id) REFERENCES livers(id) ON DELETE CASCADE,
    FOREIGN KEY (link_type_id) REFERENCES link_types(id) ON DELETE CASCADE
);

INSERT INTO link_types (id ,name, icon_url)
VALUES 
    (1,'YouTube', '/images/logos/01-youtube.png'),
    (5,'X（旧Twitter）', '/images/logos/05-twitter.png'),
    (9,'Mirrativ', '/images/logos/09-mirrativ.png');
