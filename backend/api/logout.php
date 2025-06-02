<?php
// CORS対応（credentials許可も必要！）
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// エラーログ出力
error_log("🔥 logout.php: プログラムが通過しました");

// Preflightリクエスト対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

error_log("✅ logout.php 実行開始");

// セッション破棄
session_start();
$_SESSION = [];
session_destroy();

echo json_encode(['success' => true]);
