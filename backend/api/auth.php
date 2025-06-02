<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';

$client = new Google_Client(['client_id' => $_ENV['GOOGLE_CLIENT_ID']]);

try {
    $payload = $client->verifyIdToken($token);
    $email = $payload['email'] ?? '';

    // 管理者メールをカンマ区切りで配列に
    $adminEmails = explode(',', $_ENV['ADMIN_EMAILS']);

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
