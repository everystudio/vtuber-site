<?php
require_once __DIR__ . '/../includes/db.php';

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// データベース接続
$pdo = getPDO();

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("🔥 top.php: プログラムが通過しました");

    // GETパラメータからplatformを取得（例: mirrative）
    $platform = $_GET['platform'] ?? null;

    if($platform){
        error_log("🔥 top.php: platformが指定されました: " . $platform);
        // Platform名をIDに変換
        $stmtPlatformId = $pdo->prepare("SELECT id FROM platforms WHERE slug = :slug");
        $stmtPlatformId->bindParam(':slug', $platform, PDO::PARAM_STR);
        $stmtPlatformId->execute();
        $platformRow = $stmtPlatformId->fetch(PDO::FETCH_ASSOC);

        if (!$platformRow) {
            echo json_encode([
                "articles" => [],
                "ranking" => [],
                "hot_livers" => [],
                "error" => "指定されたプラットフォームが存在しません。"
            ]);
            exit;
        }

        $platformId = $platformRow['id'];
        // JOINでplatformに属するliverの記事だけ取得
        $stmt = $pdo->prepare("
            SELECT a.id, a.liver_id, a.related_liver_id, a.title, a.content, a.updated_at, a.tags, a.likes, a.thumbnail_url
            FROM articles a
            JOIN liver_platform lp ON a.liver_id = lp.liver_id
            WHERE lp.platform_id = :platform_id
        ");
        $stmt->bindParam(':platform_id', $platformId);

    }
    else {
        error_log("🔥 top.php: platformが指定されていません。全ての記事を取得します。");
        // SQL クエリ
        $stmt = $pdo->prepare("SELECT id, liver_id, related_liver_id, title, content, updated_at, tags, likes, thumbnail_url FROM articles");
    }

    $stmt->execute();
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $articlesの中のtagsを配列に変換
    foreach ($articles as &$article) {
        if (isset($article['tags']) && is_string($article['tags'])) {
            $article['tags'] = json_decode($article['tags'], true);
        }
        else {
            $article['tags'] = ["未設定"]; // タグがない場合は空の配列を設定
        }
    }
    unset($article); // 参照を解除

    // $articlesの中身をログに出力
    error_log(print_r($articles, true));

    if ($platform) {
        $stmtHotLivers = $pdo->prepare("
            SELECT l.id, l.name, l.thumbnail_url
            FROM livers l
            JOIN liver_platform lp ON l.id = lp.liver_id
            WHERE lp.platform_id = :platform_id
            ORDER BY l.created_at DESC
            LIMIT 5
        ");
        $stmtHotLivers->bindParam(':platform_id', $platformId);
        $stmtHotLivers->execute();
    } else {
        $stmtHotLivers = $pdo->query("
            SELECT id, name, thumbnail_url 
            FROM livers 
            ORDER BY created_at DESC 
            LIMIT 5
        ");
    }

    $hotLivers = $stmtHotLivers->fetchAll(PDO::FETCH_ASSOC);

    // $responseのhot_liversを動的に設定
    $response = [
        "articles" => $articles,
        "ranking" => [
            [
                "name" => "Vtuber名",
                "growth" => "+1234人"
            ]
        ],
        "hot_livers" => $hotLivers,
    ];

    // JSON データを出力
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    error_log($e->getMessage()); // エラーログに記録
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}