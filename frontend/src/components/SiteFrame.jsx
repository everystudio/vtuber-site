// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-pink-600">Vまとめ</h1>
                <nav className="space-x-4 text-gray-700">
                    <a href="/" className="hover:underline">ホーム</a>
                    <Link to="/vtubers" className="hover:underline">Vtuber一覧</Link>
                    <a href="/ranking" className="hover:underline">ランキング</a>
                    <a href="/tags" className="hover:underline">タグ一覧</a>
                </nav>
            </header>

            <main className="max-w-6xl mx-auto p-4">
                {children}
            </main>

            <footer className="bg-gray-100 text-sm text-gray-600 text-center py-4 mt-10">
                &copy; 2025 Vまとめ All rights reserved.
            </footer>
        </div>
    );
}
