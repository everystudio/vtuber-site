<?php
$host = "127.0.0.1";
$dbname = "vtuber_db";
$user = "root";
$pass = "";

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(['error' => '無効なIDです']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    error_log("✅ DB接続成功");

    $stmt = $pdo->prepare('SELECT * FROM articles WHERE vtuber_id = :id');
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $articlesの中のtagsを配列に変換
    foreach ($articles as &$article) {
        if (isset($article['tags']) && is_string($article['tags'])) {
            $article['tags'] = json_decode($article['tags'], true);
        }
    }
    unset($article); // 参照を解除    
    
    error_log("ログを出力します");
    error_log(print_r($articles, true));

    echo json_encode(['articles' => $articles]);
} catch (Exception $e) {
    echo json_encode(['error' => '記事の取得中にエラーが発生しました']);
}