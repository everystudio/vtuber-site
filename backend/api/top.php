<?php
$host = "127.0.0.1";
$dbname = "vtuber_db";
$user = "root";
$pass = "";

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    // データベース接続
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    error_log("✅ DB接続成功");

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 🔥 top.php: プログラムが通過しました
    error_log("🔥 top.php: プログラムが通過しました");

    // SQL クエリ
    $stmt = $pdo->prepare("SELECT id, vtuber_id, related_vtuber_id, title, content, date, tags, likes, thumbnail_url FROM articles");
    $stmt->execute();
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $articlesの中身をログに出力
    error_log(print_r($articles, true));

    // サンプルデータ
    $response = [
    "articles" => [
        [
            "id" => 1,
            "title" => "記事タイトル",
            "date" => "2025/05/09",
            "tags" => ["タグ1", "タグ2"]
        ]
    ],
    "ranking" => [
        [
            "name" => "Vtuber名",
            "growth" => "+1234人"
        ]
    ],
    "hot_vtubers" => [
        [
            "name" => "カモ田ぴよ",
            "thumbnail_url" => "kamota.jpg"
            ]
        ],
    ];

    // JSON データを出力
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    error_log($e->getMessage()); // エラーログに記録
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}