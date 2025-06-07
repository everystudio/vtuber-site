-- groupsテーブル作成
CREATE TABLE IF NOT EXISTS groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 初期データ挿入
INSERT IGNORE INTO groups (id, name) VALUES
(1, '個人'),
(2, 'ホロライブ'),
(3, 'にじさんじ');

-- プラットフォームテーブル追加
CREATE TABLE IF NOT EXISTS platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT FALSE
);

-- プラットフォームの初期データ挿入
INSERT IGNORE INTO platforms (id, name , slug) VALUES
(1, 'YouTube', 'youtube'),
(2, 'Twitch', 'twitch'),
(3, 'Bilibili', 'bilibili'),
(4, 'Niconico', 'niconico'),
(5, 'Twitter', 'twitter'),
(6, 'Instagram', 'instagram'),
(7, 'Facebook', 'facebook'),
(8, 'TikTok', 'tiktok'),
(9, 'Mirrativ', 'mirrativ'),
(10, '17Live', '17live'),
(11, 'IRIAM', 'iriam'),
(12, 'OPENREC', 'openrec');


CREATE TABLE IF NOT EXISTS livers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    group_id INT DEFAULT NULL,
    debut_date DATE DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO livers (name,  description, thumbnail_url)
VALUES
('カモ田ぴよ', '毎日12時から底辺雑談', 'kamotapiyo_thumb.png'),
('底辺めがね', 'マイクがノイズだらけ！でも熱意は本物！', 'teihen_megane_thumb.png');

CREATE TABLE liver_platform (
    liver_id INT NOT NULL,
    platform_id INT NOT NULL,
    PRIMARY KEY (liver_id, platform_id),
    FOREIGN KEY (liver_id) REFERENCES livers(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS liver_tags (
    liver_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (liver_id, tag_id),
    FOREIGN KEY (liver_id) REFERENCES livers(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);


