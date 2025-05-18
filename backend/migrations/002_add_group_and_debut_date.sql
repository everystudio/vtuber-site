-- カラム追加
ALTER TABLE vtubers
ADD COLUMN IF NOT EXISTS group_id INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS debut_date DATE DEFAULT NULL,
Add COLUMN IF NOT EXISTS platform_id INT DEFAULT NULL;

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

-- 外部キー追加
ALTER TABLE vtubers
ADD CONSTRAINT IF NOT EXISTS fk_group
FOREIGN KEY (group_id) REFERENCES groups(id)
ON DELETE SET NULL;
