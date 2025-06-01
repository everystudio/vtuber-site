<?php
$host = "127.0.0.1";
$dbname = "liver_db"; // データベース名を変更
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
    $stmt = $pdo->prepare("SELECT id, liver_id, related_liver_id, title, content, date, tags, likes, thumbnail_url FROM articles");
    $stmt->execute();
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $articlesの中のtagsを配列に変換
    foreach ($articles as &$article) {
        if (isset($article['tags']) && is_string($article['tags'])) {
            $article['tags'] = json_decode($article['tags'], true);
        }
        else {
            $article['tags'] = ["未設定"]; // タグがない場合は空の配列を設定
        }
    }
    unset($article); // 参照を解除

    // $articlesの中身をログに出力
    error_log(print_r($articles, true));

    // 最近登録されたLiverを取得（idも含む）
    $stmtHotLivers = $pdo->query("SELECT id, name, thumbnail_url FROM livers ORDER BY created_at DESC LIMIT 5");
    $hotLivers = $stmtHotLivers->fetchAll(PDO::FETCH_ASSOC);

    // $responseのhot_liversを動的に設定
    $response = [
        "articles" => $articles,
        "ranking" => [
            [
                "name" => "Vtuber名",
                "growth" => "+1234人"
            ]
        ],
        "hot_livers" => $hotLivers,
    ];

    // JSON データを出力
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    error_log($e->getMessage()); // エラーログに記録
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}