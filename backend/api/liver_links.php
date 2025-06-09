<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/../includes/db.php';
$pdo = getPDO();

// OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET: リンク一覧取得
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $liver_id = $_GET['liver_id'] ?? null;

    if (!$liver_id) {
        echo json_encode(['error' => 'liver_idが必要です']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT ll.id, ll.url, ll.link_type_id, ll.display_order,
               lt.name AS link_type_name, lt.icon_url
        FROM liver_links ll
        JOIN link_types lt ON ll.link_type_id = lt.id
        WHERE ll.liver_id = ?
        ORDER BY ll.display_order ASC
    ");
    $stmt->execute([$liver_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// POST: リンク新規登録（複数もOK）
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $links = $data['links'] ?? [];
    $liver_id = $data['liver_id'] ?? null;

    if (!$liver_id || !is_array($links)) {
        echo json_encode(['error' => '不正なデータ']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO liver_links (liver_id, url, link_type_id, display_order) VALUES (?, ?, ?, ?)");
    foreach ($links as $i => $link) {
        $stmt->execute([
            $liver_id,
            $link['url'] ?? '',
            $link['link_type_id'] ?? 0,
            $i
        ]);
    }

    echo json_encode(['success' => true]);
    exit;
}

// PUT: リンクを一括上書き（liver_id必須）
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $liver_id = $data['liver_id'] ?? null;
    $links = $data['links'] ?? [];

    if (!$liver_id || !is_array($links)) {
        echo json_encode(['error' => '不正なデータ']);
        exit;
    }

    // 一度削除して再登録
    $pdo->prepare("DELETE FROM liver_links WHERE liver_id = ?")->execute([$liver_id]);

    $stmt = $pdo->prepare("INSERT INTO liver_links (liver_id, url, link_type_id, display_order) VALUES (?, ?, ?, ?)");
    foreach ($links as $i => $link) {
        $stmt->execute([
            $liver_id,
            $link['url'] ?? '',
            $link['link_type_id'] ?? 0,
            $i
        ]);
    }

    echo json_encode(['success' => true]);
    exit;
}

// DELETE: 単体削除（?id=3）
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $params);
    $id = $params['id'] ?? null;

    if (!$id) {
        echo json_encode(['error' => 'IDが指定されていません']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM liver_links WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
