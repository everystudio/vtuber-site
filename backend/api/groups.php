<?php

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../includes/db.php';
$pdo = getPDO();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("🔥 GET処理に入りました");
    try {
        $stmt = $pdo->query("SELECT * FROM groups ORDER BY id ASC");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        error_log(print_r($data, true));
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        error_log("❌ DBエラー: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}
