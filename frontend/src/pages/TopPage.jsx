import React, { useEffect, useState } from "react";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";
import { Link, useParams } from "react-router-dom";

export default function PlatformTopPage() {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { platform } = useParams(); // URLからプラットフォーム名を取得
    const storedPlatform = localStorage.getItem("selectedPlatform");
    const effectivePlatform = platform || storedPlatform;

    const [articles, setArticles] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [hotLivers, setHotLivers] = useState([]);
    const [error, setError] = useState(null);

    const url = effectivePlatform
        ? `${baseUrl}/api/top.php?platform=${effectivePlatform}`
        : `${baseUrl}/api/top.php`;

    useEffect(() => {
        if (platform) {
            localStorage.setItem("selectedPlatform", platform);
        }
        axios.get(url)
            .then((res) => {
                const { articles, ranking, hot_livers } = res.data;
                console.log("APIから取得したデータ:", res.data);
                setArticles(articles);
                setRanking(ranking);
                setHotLivers(hot_livers);
            })
            .catch((err) => {
                console.error("プラットフォーム別トップページ取得失敗:", err);
                setError("データの取得に失敗しました。後でもう一度お試しください。");
            });
    }, [platform]);

    return (
        <SiteFrame>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            {/* 注目まとめ記事 */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">📰 注目のまとめ記事</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.slice(0, 6).map((article) => (
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
                <div className="mt-4 text-right">
                    <Link to={`/articles/1?platform=${platform}`} className="text-blue-600 hover:underline text-sm">
                        もっと見る →
                    </Link>
                </div>
            </section>

            {/* 話題のLiver */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">👀 話題のLiver</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {hotLivers.map((liver, idx) => (
                        <Link
                            to={`/liver/${liver.id}`}
                            key={idx}
                            className="bg-white shadow rounded p-4 hover:bg-gray-50">
                            <div className="text-center">
                                <img
                                    src={liver.thumbnail_url || "/images/default.png"}
                                    alt={liver.name}
                                    className="rounded-full w-24 h-24 mx-auto mb-2"
                                />
                                <p className="text-sm font-medium">{liver.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </SiteFrame>
    );
}
