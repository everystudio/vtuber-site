<?php
$host = 'localhost';
$db = 'liver_db'; // 実際のデータベース名に変更
$user = 'root'; // 実際のユーザー名に変更
$pass = ''; // 実際のパスワードに変更
$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);

$migrationsDir = __DIR__ . '/migrations';
$migrationFiles = glob($migrationsDir . '/*.sql');

foreach ($migrationFiles as $file) {
    echo "Running migration: $file\n";
    $sql = file_get_contents($file);
    $pdo->exec($sql);
}
