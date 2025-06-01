<?php
// 共通ヘッダー
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_log("🔥 livers.php: プログラムが通過しました");

// OPTIONSリクエストはここで終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "127.0.0.1";
$dbname = "liver_db"; // データベース名を変更
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    error_log("✅ DB接続成功");
} catch (PDOException $e) {
    error_log("❌ DB接続失敗: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "DB接続失敗"]);
    exit();
}
error_log("👀 METHOD: " . $_SERVER['REQUEST_METHOD']);


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
    error_log("🔥 POST処理に入りました");
    $data = json_decode(file_get_contents("php://input"), true);

    $youtubeUrl = !empty($data['youtube_url']) ? $data['youtube_url'] : null;
    $debutDate = !empty($data['debut_date']) ? $data['debut_date'] : null;

    $stmt = $pdo->prepare("INSERT INTO livers (name, group_id, description, youtube_url, thumbnail_url, debut_date)
        VALUES (:name, :group_id, :description, :youtube_url, :thumbnail_url, :debut_date)");

    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':group_id', $data['group_id']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':youtube_url', $youtubeUrl);
    $stmt->bindParam(':thumbnail_url', $data['thumbnail_url']);
    $stmt->bindParam(':debut_date', $debutDate);


    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        error_log("❌ SQL実行失敗: " . print_r($stmt->errorInfo(), true));
        http_response_code(500);
        echo json_encode(['error' => '保存に失敗しました']);
    }

    $liverId = $pdo->lastInsertId();

    // ② platforms との中間テーブルへ登録
    if (!empty($data['platform_ids']) && is_array($data['platform_ids'])) {
        $stmt = $pdo->prepare("INSERT INTO liver_platform (liver_id, platform_id) VALUES (:liver_id, :platform_id)");
        foreach ($data['platform_ids'] as $platformId) {
            $result = $stmt->execute([
                ':liver_id' => $liverId,
                ':platform_id' => $platformId
            ]);

            if (!$result) {
                error_log("❌ liver_platformへのINSERT失敗: liver_id={$liverId}, platform_id={$platformId}");
                error_log("詳細: " . print_r($stmt->errorInfo(), true));
            }
        }
    }

    echo json_encode(['success' => true]);
    exit();
}

// ✅ その他のリクエスト（PUTなど）は拒否
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
