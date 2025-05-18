<?php
// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(['error' => '無効なIDです']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT * FROM articles WHERE vtuber_id = :id');
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['articles' => $articles]);
} catch (Exception $e) {
    echo json_encode(['error' => '記事の取得中にエラーが発生しました']);
}