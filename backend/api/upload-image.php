<?php
// CORS対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0); // OPTIONS リクエストはここで終了
}

// 本処理
header("Access-Control-Allow-Origin: http://localhost:3000");

// 保存ディレクトリ
$uploadDir = '../uploads/';
$filename = date("Y-m-d") . "_" . uniqid() . '_' . basename($_FILES['image']['name']);
$targetFile = $uploadDir . $filename;

if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    // ★ フルURLを返すように修正
    $url = 'http://localhost:8000/uploads/' . $filename;
    echo json_encode(['url' => $url]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Upload failed']);
}
?>
