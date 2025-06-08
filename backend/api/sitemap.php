<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/env.php';
loadEnv();

header("Content-Type: application/xml; charset=utf-8");

$host = getenv("SITE_DOMAIN"); // 本番ドメインに置き換え
$pdo = getPDO();

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

// トップページのサイトを追加
echo "<url>";
echo "<loc>$host/</loc>";
echo "<changefreq>daily</changefreq>";
echo "</url>\n";

// プラットフォームごとのトップページのリンクも作成する
$stmt = $pdo->query("SELECT slug FROM platforms where is_active = 1");
foreach ($stmt as $row) {
    $slug = htmlspecialchars($row['slug']);
    echo "<url>";
    echo "<loc>$host/$slug</loc>";
    echo "<changefreq>weekly</changefreq>";
    echo "</url>\n";
}

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
