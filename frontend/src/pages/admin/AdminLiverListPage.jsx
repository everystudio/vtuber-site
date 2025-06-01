import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminFrame from "../../components/AdminFrame";

export default function AdminLiverListPage() {
    const [livers, setLivers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/livers.php")
            .then((res) => {
                setLivers(res.data);
            })
            .catch((err) => {
                console.error("ライバー一覧の取得に失敗:", err);
                setError("ライバー情報の取得に失敗しました。");
            });
    }, []);

    return (
        <AdminFrame>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">🎤 ライバー一覧（管理）</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4 text-right">
                    <Link
                        to="/admin/livers/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ＋ 新規ライバー追加
                    </Link>
                </div>

                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">名前</th>
                            <th className="border px-4 py-2">Platform</th>
                            <th className="border px-4 py-2">グループ</th>
                            <th className="border px-4 py-2">デビュー日</th>
                            <th className="border px-4 py-2">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {livers.map((liver) => (
                            <tr key={liver.id}>
                                <td className="border px-4 py-2">{liver.id}</td>
                                <td className="border px-4 py-2">{liver.name}</td>
                                <td className="border px-4 py-2">
                                    {liver.platforms && liver.platforms.length > 0
                                        ? liver.platforms.join(", ")
                                        : "―"}
                                </td>
                                <td className="border px-4 py-2">{liver.group_id}</td>
                                <td className="border px-4 py-2">{liver.debut_date}</td>
                                <td className="border px-4 py-2 text-center">
                                    <Link
                                        to={`/admin/livers/${liver.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        編集
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminFrame>
    );
}
