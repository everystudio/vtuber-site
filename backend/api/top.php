<?php
// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// サンプルデータ
$response = [
    "articles" => [
        [
            "id" => 1,
            "title" => "記事タイトル",
            "date" => "2025/05/09",
            "tags" => ["タグ1", "タグ2"]
        ]
    ],
    "ranking" => [
        [
            "name" => "Vtuber名",
            "growth" => "+1234人"
        ]
    ],
    "hot_vtubers" => [
        [
            "name" => "カモ田ぴよ",
            "thumbnail_url" => "kamota.jpg"
        ]
    ]
];

// JSON データを出力
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);