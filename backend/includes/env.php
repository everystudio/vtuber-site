<?php
function loadEnv($envPath = __DIR__ . '/.env') {
    error_log("🔥 環境変数の読み込みを開始します: $envPath");
    if (!file_exists($envPath)){
        error_log("環境変数ファイルが見つかりません: $envPath");
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;

        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if (!getenv($name)) {
            putenv("$name=$value");
        }
    }
}
