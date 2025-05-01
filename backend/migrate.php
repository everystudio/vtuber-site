<?php
$host = 'localhost';
$db = 'your_db';
$user = 'your_user';
$pass = 'your_pass';
$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);

$migrationsDir = __DIR__ . '/migrations';
$migrationFiles = glob($migrationsDir . '/*.sql');

foreach ($migrationFiles as $file) {
    echo "Running migration: $file\n";
    $sql = file_get_contents($file);
    $pdo->exec($sql);
}
