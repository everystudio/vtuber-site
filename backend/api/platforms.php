<?php
$host = "127.0.0.1";
$dbname = "liver_db"; // データベース名を変更
$user = "root";
$pass = "";

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("🔥 GET処理に入りました");
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        error_log("✅ DB接続成功");

        $stmt = $pdo->query("SELECT * FROM platforms ORDER BY id ASC");
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
