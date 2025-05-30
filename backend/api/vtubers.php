<?php
$host = "127.0.0.1";
$dbname = "liver_db"; // データベース名を変更
$user = "root";
$pass = "";

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ✅ GET処理を最初に
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $_GET['id'];
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        $stmt = $pdo->prepare("SELECT * FROM livers WHERE id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            echo json_encode($data, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Liver not found"]);
        }
    } catch (PDOException $e) {
        error_log("❌ DBエラー: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("🔥 GET処理に入りました");
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        error_log("✅ DB接続成功");

        $stmt = $pdo->query("SELECT * FROM livers ORDER BY created_at DESC");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // デバッグ用ログ出力（XAMPPなら C:\xampp\php\logs\php_error_log に出力されます）
        error_log(print_r($data, true));
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        error_log("❌ DBエラー: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// ✅ POST処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header("Access-Control-Allow-Methods: POST");

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data["name"] ?? "";
    $youtube = $data["youtube_url"] ?? "";
    $desc = $data["description"] ?? "";

    if (!$name) {
        http_response_code(400);
        echo json_encode(["error" => "名前は必須です"]);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        $stmt = $pdo->prepare("INSERT INTO livers (name, youtube_url, description) VALUES (?, ?, ?)");
        $stmt->execute([$name, $youtube, $desc]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// ✅ その他のリクエスト（PUTなど）は拒否
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
