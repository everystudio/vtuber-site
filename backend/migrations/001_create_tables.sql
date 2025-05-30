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
    name VARCHAR(100) NOT NULL UNIQUE
);

-- プラットフォームの初期データ挿入
INSERT IGNORE INTO platforms (id, name) VALUES
(1, 'YouTube'),
(2, 'Twitch'),
(3, 'Bilibili'),
(4, 'Niconico'),
(5, 'Twitter'),
(6, 'Instagram'),
(7, 'Facebook'),
(8, 'TikTok'),
(9, 'Mirrative'),
(10, '17Live'),
(11, 'IRIAM');


CREATE TABLE IF NOT EXISTS livers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    youtube_url VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(255),
    platform_id INT DEFAULT NULL,
    group_id INT DEFAULT NULL,
    debut_date DATE DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE SET NULL
);

INSERT INTO vtubers (name, youtube_url, description, thumbnail_url)
VALUES
('カモ田ぴよ', 'https://www.youtube.com/channel/xxx', '毎日12時から底辺雑談', 'kamotapiyo_thumb.png'),
('底辺めがね', 'https://www.youtube.com/channel/yyy', 'マイクがノイズだらけ！でも熱意は本物！', 'teihen_megane_thumb.png');


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


