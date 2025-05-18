<?php

// 共通ヘッダー
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ダミーのコメントデータ
$dummyComments = [
    [
        "id" => 1,
        "article_id" => $_GET['article_id'] ?? 0,
        "content" => "これはダミーのコメントです。",
        "date" => "2025-05-18"
    ],
    [
        "id" => 2,
        "article_id" => $_GET['article_id'] ?? 0,
        "content" => "もう一つのダミーコメントです。",
        "date" => "2025-05-18"
    ]
];

// コメントデータをJSON形式で返す
echo json_encode(["comments" => $dummyComments]);
