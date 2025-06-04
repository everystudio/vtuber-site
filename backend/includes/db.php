<?php
// backend/includes/db.php

require_once __DIR__ . '/env.php';
loadEnv();

function getPDO() {
    static $pdo = null;

    if ($pdo === null) {
        $host = getenv("DB_HOST") ?: "127.0.0.999";
        $dbname = getenv("DB_NAME") ?: "liver_dbaaaaa";
        $user = getenv("DB_USER") ?: "root";
        $pass = getenv("DB_PASS") ?: "";

        try {
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            error_log("DB接続失敗: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "DB接続に失敗しました"]);
            exit();
        }

        error_log("✅ DB接続成功");
    }

    return $pdo;
}
