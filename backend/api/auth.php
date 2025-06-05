<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../includes/env.php';
loadEnv();

// Originチェック
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = explode(',', getenv("ALLOWED_ORIGINS"));

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json");
}

// OPTIONS（プリフライト）処理を即終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';
$client = new Google_Client(['client_id' => getenv("GOOGLE_CLIENT_ID")]);

try {
    $payload = $client->verifyIdToken($token);
    $email = $payload['email'] ?? '';

    // 管理者メールをカンマ区切りで配列に
    $adminEmails = explode(',', getenv("ADMIN_EMAILS"));

    if (in_array($email, $adminEmails)) {
        session_start();
        $_SESSION['is_admin'] = true;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
