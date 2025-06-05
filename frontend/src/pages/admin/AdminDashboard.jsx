import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";
import AdminFrame from "../../components/AdminFrame"; // 管理画面でも共通で使う場合

export default function AdminDashboard({ setIsAuthenticated }) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            console.log('ログアウト処理実行中');
            await axios.post(`${baseUrl}/api/logout.php`, {}, {
                withCredentials: true
            });
            localStorage.removeItem("isAdminAuthenticated");
            setIsAuthenticated(false);

            console.log('状態変更 → ナビゲート');
            alert('ログアウトしました');
            navigate('/admin/login');

        } catch (error) {
            console.error('ログアウト失敗:', error);
        }
    };

    return (
        <AdminFrame>
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        🛠 管理ダッシュボード
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded shadow"
                    >
                        🔓 <span>ログアウト</span>
                    </button>
                </div>

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
