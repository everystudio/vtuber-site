<?php

require_once __DIR__ . '/../includes/env.php';
loadEnv();

// CORS対応
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0); // OPTIONS リクエストはここで終了
}

// Originチェック
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = explode(',', getenv("ALLOWED_ORIGINS"));
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// 保存ディレクトリ
$uploadDir = '../uploads/';
$filename = date("Y-m-d") . "_" . uniqid() . '_' . basename($_FILES['image']['name']);
$targetFile = $uploadDir . $filename;

if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    // アクセスURLを動的に生成
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST']; // 例: anoliver.com もしくは localhost:8000
    $url = $protocol . $host . '/uploads/' . $filename;

    echo json_encode(['url' => $url]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Upload failed']);
}
?>
