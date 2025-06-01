import React from "react";
import { Link } from "react-router-dom";
import AdminFrame from "../../components/AdminFrame"; // 管理画面でも共通で使う場合

export default function AdminDashboard() {
    return (
        <AdminFrame>
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">🔧 管理ダッシュボード</h1>

                <ul className="space-y-4">
                    <li>
                        <Link
                            to="/admin/articles"
                            className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            📰 記事の管理
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/livers"
                            className="block p-4 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            🎤 ライバーの管理
                        </Link>
                    </li>
                </ul>
            </div>
        </AdminFrame>
    );
}
