import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";

const ARTICLES_PER_PAGE = 30;

export default function ArticleListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/articles.php?page=${currentPage}&limit=${ARTICLES_PER_PAGE}`)
            .then((res) => {
                setArticles(res.data.articles || []);
                setTotalPages(Math.ceil(res.data.total / ARTICLES_PER_PAGE));
            })
            .catch((err) => {
                console.error("記事一覧の取得に失敗:", err);
                setError("記事の取得に失敗しました。後でもう一度お試しください。");
            });
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    return (
        <SiteFrame>
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">📰 記事一覧（ページ {currentPage}）</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {articles.map((article) => (
                        <Link
                            to={`/article/${article.id}`}
                            key={article.id}
                            className="bg-white shadow rounded p-4 hover:bg-gray-50"
                        >
                            <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                            <p className="text-sm text-gray-600">
                                {article.date} ・ タグ: {(article.tags || []).join(", ")}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* ページネーション */}
                <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded ${pageNum === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>
            </section>
        </SiteFrame>
    );
}
