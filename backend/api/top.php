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

    // $articlesの中のtagsを配列に変換
    foreach ($articles as &$article) {
        if (isset($article['tags']) && is_string($article['tags'])) {
            $article['tags'] = json_decode($article['tags'], true);
        }
    }
    unset($article); // 参照を解除

    // $articlesの中身をログに出力
    error_log(print_r($articles, true));

    // 最近登録されたVTuberを取得（idも含む）
    $stmtHotVtubers = $pdo->query("SELECT id, name, thumbnail_url FROM vtubers ORDER BY created_at DESC LIMIT 5");
    $hotVtubers = $stmtHotVtubers->fetchAll(PDO::FETCH_ASSOC);

    // $responseのhot_vtubersを動的に設定
    $response = [
        "articles" => $articles,
        "ranking" => [
            [
                "name" => "Vtuber名",
                "growth" => "+1234人"
            ]
        ],
        "hot_vtubers" => $hotVtubers,
    ];

    // JSON データを出力
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    error_log($e->getMessage()); // エラーログに記録
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}