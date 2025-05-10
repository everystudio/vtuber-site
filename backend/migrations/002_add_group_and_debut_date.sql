-- カラム追加
ALTER TABLE vtubers
ADD COLUMN group_id INT DEFAULT NULL,
ADD COLUMN debut_date DATE DEFAULT NULL;

-- groupsテーブル作成
CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 初期データ挿入
INSERT INTO groups (id, name) VALUES
(1, '個人'),
(2, 'ホロライブ'),
(3, 'にじさんじ');

-- 外部キー追加（必要なら）
ALTER TABLE vtubers
ADD CONSTRAINT fk_group
FOREIGN KEY (group_id) REFERENCES groups(id)
ON DELETE SET NULL;
