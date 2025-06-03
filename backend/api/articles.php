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

// タグを処理するためのヘルパー関数
function processTags(&$article) {
    if (isset($article['tags']) && is_string($article['tags'])) {
        $article['tags'] = json_decode($article['tags'], true);
    } else {
        $article['tags'] = ["未設定"]; // タグがない場合は未設定を設定
    }
}

require_once __DIR__ . '/../includes/db.php';
$pdo = getPDO();

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {

        // ページ単位で取得する場合
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 0;
        $limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 30;
        $offset = ($page - 1) * $limit;

        // 特定のliver_idで絞り込む場合
        $liver_id = isset($_GET['liver_id']) ? intval($_GET['liver_id']) : 0;

        // 単体取得の場合
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id > 0) {
            // 単体取得
            error_log("🔥 単体取得処理に入りました");
            $stmt = $pdo->prepare('SELECT * FROM articles WHERE id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();            $article = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($article) {
                processTags($article);
            }
            //unset($article);

            // 単体の記事をerror_logに出力
            error_log(print_r($article, true));

            echo json_encode(['article' => $article]); 
        } else if ($liver_id > 0) {
            // liver_idで絞り込んだ記事一覧を取得
            $stmt = $pdo->prepare('SELECT * FROM articles WHERE liver_id = :liver_id');
            $stmt->bindParam(':liver_id', $liver_id, PDO::PARAM_INT);
            $stmt->execute();

            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as &$article) {
                processTags($article);
            }
            unset($article);

            echo json_encode(['articles' => $articles]);
        } else if ($page > 0) {
            // 総件数を取得
            $countStmt = $pdo->query("SELECT COUNT(*) FROM articles");
            $total = $countStmt->fetchColumn();

            // 記事＋liver_nameを取得（JOIN付き）
            $stmt = $pdo->prepare("
                SELECT 
                    a.id, a.title, a.created_at AS date, a.tags, l.name AS liver_name 
                FROM articles a
                LEFT JOIN livers l ON a.liver_id = l.id
                ORDER BY a.created_at DESC
                LIMIT :limit OFFSET :offset
            ");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as &$article) {
                processTags($article);
            }
            unset($article);

            echo json_encode([
                'total' => $total,
                'articles' => $articles,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]);
        } else if ($liver_id === 0) {
            // 全件取得
            error_log("🔥 全件取得処理に入りました");
            $stmt = $pdo->query('SELECT * FROM articles ORDER BY created_at DESC');            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as &$article) {
                processTags($article);
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
        $liver_id = $data['liver_id'] ?? null;


        $stmt = $pdo->prepare("INSERT INTO articles (title, body, created_at, liver_id) VALUES (:title, :body, :created_at, :liver_id)");
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':body', $body);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':liver_id', $liver_id, PDO::PARAM_INT);

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
