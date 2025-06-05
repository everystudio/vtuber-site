import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminFrame from "../../components/AdminFrame";

export default function AdminArticleListPage() {
    const [articles, setArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const limit = 10; // ← 1ページに表示する件数

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // React state初期化時に使用
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        axios
            .get(`${baseUrl}/api/articles.php?page=${page}&limit=${limit}`)
            .then((res) => {
                setArticles(res.data.articles);
                setTotal(res.data.total);
                setPages(res.data.pages);
            })
            .catch((err) => {
                console.error("記事取得失敗:", err);
            });
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        navigate(`/admin/articles?page=${newPage}`); // ← URLにも反映
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <AdminFrame>
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">📰 記事管理ページ</h1>

                <table className="w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">タイトル</th>
                            <th className="border px-4 py-2">ライバー</th>
                            <th className="border px-4 py-2">作成日</th>
                            <th className="border px-4 py-2">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{article.id}</td>
                                <td className="border px-4 py-2">{article.title}</td>
                                <td className="border px-4 py-2">{article.liver_name || "-"}</td>
                                <td className="border px-4 py-2">{article.created_at}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <Link
                                        to={`/admin/article/edit/${article.id}?page=${page}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        編集
                                    </Link>
                                    {/* 削除ボタン追加予定があればここに追加 */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ページネーション */}
                <div className="flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </AdminFrame>
    );
}
