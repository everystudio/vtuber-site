<?php
require_once __DIR__ . '/../includes/db.php';

header("Content-Type: application/xml; charset=utf-8");

$host = "https://yourdomain.com"; // 本番ドメインに置き換え
$pdo = getPDO();

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

// 配信者一覧
$stmt = $pdo->query("SELECT id, updated_at FROM livers");
foreach ($stmt as $row) {
    $id = $row['id'];
    $lastmod = date('Y-m-d', strtotime($row['updated_at'])); // ISO 8601形式に変換
    echo "<url>";
    echo "<loc>$host/liver/$id</loc>";
    echo "<lastmod>$lastmod</lastmod>";
    echo "</url>\n";
}

// 記事一覧
$stmt = $pdo->query("SELECT id, updated_at FROM articles");
foreach ($stmt as $row) {
    $id = $row['id'];
    $lastmod = date('Y-m-d', strtotime($row['updated_at'])); // ISO 8601形式に変換
    echo "<url>";
    echo "<loc>$host/article/$id</loc>";
    echo "<lastmod>$lastmod</lastmod>";
    echo "</url>\n";
}

echo "</urlset>";
