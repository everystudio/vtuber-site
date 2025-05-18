<?php
// CORS設定
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// OPTIONSリクエストはここで終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB接続共通処理
$host = "127.0.0.1";
$dbname = "vtuber_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    error_log("✅ DB接続成功");

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $vtuber_id = isset($_GET['vtuber_id']) ? intval($_GET['vtuber_id']) : 0;
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id > 0) {
            // 単体取得
            error_log("🔥 単体取得処理に入りました");
            $stmt = $pdo->prepare('SELECT * FROM articles WHERE id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $article = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($article && isset($article['tags']) && is_string($article['tags'])) {
                $article['tags'] = json_decode($article['tags'], true);
            }
            else {
                $article['tags'] = ["未設定"]; // タグがない場合は空の配列を設定
            }
            unset($article);      
            echo json_encode(['article' => $article]);

        } else if ($vtuber_id === 0) {
            // 全件取得
            error_log("🔥 全件取得処理に入りました");
            $stmt = $pdo->query('SELECT * FROM articles ORDER BY created_at DESC');
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as &$article) {
                if (isset($article['tags']) && is_string($article['tags'])) {
                    $article['tags'] = json_decode($article['tags'], true);
                }
                else {
                    $article['tags'] = ["未設定"]; // タグがない場合は空の配列を設定
                }
            }
            unset($article);

            echo json_encode(['articles' => $articles]);            
        } else if ($vtuber_id > 0) {
            // vtuber_idで絞り込んだ記事一覧を取得
            $stmt = $pdo->prepare('SELECT * FROM articles WHERE vtuber_id = :vtuber_id');
            $stmt->bindParam(':vtuber_id', $vtuber_id, PDO::PARAM_INT);
            $stmt->execute();

            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as &$article) {
                if (isset($article['tags']) && is_string($article['tags'])) {
                    $article['tags'] = json_decode($article['tags'], true);
                }
                else {
                    $article['tags'] = ["未設定"]; // タグがない場合は空の配列を設定
                }
            }
            unset($article);

            echo json_encode(['articles' => $articles]);
        } else {
            echo json_encode(['error' => 'パラメータが不足しています']);
        }

    } else if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $title = $data['title'] ?? '';
        $body = $data['body'] ?? '';
        $created_at = date('Y-m-d H:i:s');
        $vtuber_id = $data['vtuber_id'] ?? null;


        $stmt = $pdo->prepare("INSERT INTO articles (title, body, created_at, vtuber_id) VALUES (:title, :body, :created_at, :vtuber_id)");
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':body', $body);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':vtuber_id', $vtuber_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(['id' => $pdo->lastInsertId()]);
        } else {
            echo json_encode(['error' => '保存に失敗しました']);
        }

    } else if ($method === 'PUT') {
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents("php://input"), true);
        $title = $data['title'] ?? '';
        $body = $data['body'] ?? '';

        $stmt = $pdo->prepare("UPDATE articles SET title = :title, body = :body WHERE id = :id");
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':body', $body);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => '更新に失敗しました']);
        }

    } else {
        echo json_encode(['error' => '許可されていないリクエストです']);
    }
} catch (Exception $e) {
    error_log("❌ DBエラー: " . $e->getMessage());
    echo json_encode(['error' => 'サーバーエラー']);
}
