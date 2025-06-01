import React from "react";
import { Link } from "react-router-dom";

export default function AdminFrame({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-gray-800 text-white px-6 py-4">
                <h1 className="text-xl font-bold">管理者ダッシュボード</h1>
                <nav className="mt-2 space-x-4">
                    {/* 管理者用ナビゲーションリンク */}
                    <Link to="/admin" className="hover:underline">🏠 管理トップ</Link>
                    <Link to="/admin/articles" className="hover:underline">📰 記事管理</Link>
                    <Link to="/admin/livers" className="hover:underline">🎤 ライバー管理</Link>
                    <Link to="/admin/livers/new" className="hover:underline">➕ 新規ライバー登録</Link>
                    <Link to="/" className="hover:underline text-blue-300">🌐 通常サイトへ戻る</Link>
                </nav>
            </header>

            <main className="p-6">{children}</main>
        </div>
    );
}
