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

require_once __DIR__ . '/../includes/db.php';
$pdo = getPDO();

error_log("👀 METHOD: " . $_SERVER['REQUEST_METHOD']);


// ✅ GET処理を最初に
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $_GET['id'];
    try {
        $stmt = $pdo->prepare("SELECT * FROM livers WHERE id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            // プラットフォームIDを取得して追加
            $stmt2 = $pdo->prepare("SELECT platform_id FROM liver_platform WHERE liver_id = ?");
            $stmt2->execute([$id]);
            $platform_ids = $stmt2->fetchAll(PDO::FETCH_COLUMN);
            $data['platform_ids'] = $platform_ids;

            // liver_linksテーブルとlink_typesをJOINしてリンクを取得
            $stmt3 = $pdo->prepare("
                SELECT 
                    liver_links.url,
                    liver_links.link_type_id,
                    liver_links.display_order,
                    link_types.name,
                    link_types.icon_url
                FROM liver_links
                JOIN link_types ON liver_links.link_type_id = link_types.id
                WHERE liver_links.liver_id = ?
                ORDER BY liver_links.display_order ASC
            ");
            $stmt3->execute([$id]);
            $links = $stmt3->fetchAll(PDO::FETCH_ASSOC);
            $data['links'] = $links;

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

        $platform = $_GET['platform'] ?? null;
        if ($platform) {
            // Platform名をIDに変換
            $stmtPlatformId = $pdo->prepare("SELECT id FROM platforms WHERE slug = :slug");
            $stmtPlatformId->bindParam(':slug', $platform, PDO::PARAM_STR);
            $stmtPlatformId->execute();
            $platformRow = $stmtPlatformId->fetch(PDO::FETCH_ASSOC);
            if (!$platformRow) {
                echo json_encode(["error" => "Platform not found"], JSON_UNESCAPED_UNICODE);
                exit();
            }
            $platformId = $platformRow['id'];
            error_log("🔥 GET処理: platformId = " . $platformId);
            // platform_id 絞り込みでLiverを取得
            $stmt = $pdo->prepare("
                SELECT l.*
                FROM livers l
                JOIN liver_platform lp ON l.id = lp.liver_id
                WHERE lp.platform_id = :platform_id
                ORDER BY l.created_at DESC
            ");
            $stmt->bindParam(':platform_id', $platformId);
            $stmt->execute(); // ← これが必要！
        }
        else{
            $stmt = $pdo->query("SELECT * FROM livers ORDER BY created_at DESC");
        }

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        error_log("🔥 GET処理: 取得したライバー数 = " . count($data));

        // 各ライバーのplatformsを取得
        foreach ($data as &$liver) {
            $stmt2 = $pdo->prepare("
                SELECT p.name
                FROM liver_platform lp
                JOIN platforms p ON lp.platform_id = p.id
                WHERE lp.liver_id = ?
            ");
            $stmt2->execute([$liver['id']]);
            $platforms = $stmt2->fetchAll(PDO::FETCH_COLUMN);
            $liver['platforms'] = $platforms;
        }

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

    $debutDate = !empty($data['debut_date']) ? $data['debut_date'] : null;

    $stmt = $pdo->prepare("INSERT INTO livers (name, group_id, description, thumbnail_url, debut_date)
        VALUES (:name, :group_id, :description, :thumbnail_url, :debut_date)");

    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':group_id', $data['group_id']);
    $stmt->bindParam(':description', $data['description']);
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

    // Linksの登録
    if (!empty($data['links']) && is_array($data['links'])) {
        $stmt = $pdo->prepare("INSERT INTO liver_links (liver_id, url, link_type_id, display_order) VALUES (?, ?, ?, ?)");
        foreach ($data['links'] as $i => $link) {
            $stmt->execute([
                $liverId,
                $link['url'] ?? '',
                $link['link_type_id'] ?? 0,
                $i
            ]);
        }
    }


    echo json_encode(['success' => true]);
    exit();
}

// ✅ PUT処理（ライバーの編集）
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    error_log("🔥 PUT処理に入りました");

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'IDが指定されていません']);
        exit();
    }

    $debutDate = !empty($data['debut_date']) ? $data['debut_date'] : null;
    $groupId = !empty($data['group_id']) ? $data['group_id'] : null;

    // 更新
    $stmt = $pdo->prepare("UPDATE livers SET
        name = :name,
        group_id = :group_id,
        description = :description,
        thumbnail_url = :thumbnail_url,
        debut_date = :debut_date
        WHERE id = :id
    ");

    $success = $stmt->execute([
        ':name' => $data['name'],
        ':group_id' => $groupId,
        ':description' => $data['description'],
        ':thumbnail_url' => $data['thumbnail_url'],
        ':debut_date' => $debutDate,
        ':id' => $id,
    ]);

    if (!$success) {
        error_log("❌ UPDATE失敗: " . print_r($stmt->errorInfo(), true));
        http_response_code(500);
        echo json_encode(['error' => '更新に失敗しました']);
        exit();
    }

    // 中間テーブル更新
    $pdo->prepare("DELETE FROM liver_platform WHERE liver_id = ?")->execute([$id]);

    if (!empty($data['platform_ids']) && is_array($data['platform_ids'])) {
        $stmt = $pdo->prepare("INSERT INTO liver_platform (liver_id, platform_id) VALUES (:liver_id, :platform_id)");
        foreach ($data['platform_ids'] as $platformId) {
            $result = $stmt->execute([
                ':liver_id' => $id,
                ':platform_id' => $platformId
            ]);

            if (!$result) {
                error_log("❌ liver_platformへの再INSERT失敗: liver_id={$id}, platform_id={$platformId}");
                error_log("詳細: " . print_r($stmt->errorInfo(), true));
            }
        }
    }

    // 既存リンクを一度削除して再登録
    $pdo->prepare("DELETE FROM liver_links WHERE liver_id = ?")->execute([$id]);

    if (!empty($data['links']) && is_array($data['links'])) {
        $stmt = $pdo->prepare("INSERT INTO liver_links (liver_id, url, link_type_id, display_order) VALUES (?, ?, ?, ?)");
        foreach ($data['links'] as $i => $link) {
            $stmt->execute([
                $id,
                $link['url'] ?? '',
                $link['link_type_id'] ?? 0,
                $i
            ]);
        }
    }    

    echo json_encode(['success' => true]);
    exit();
}

// ✅ その他のリクエスト（PUTなど）は拒否
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
