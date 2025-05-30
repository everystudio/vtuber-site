import React, { useEffect, useState } from "react";
import axios from "axios";
import SiteFrame from "../components/SiteFrame"; // サイト全体のレイアウトを定義したコンポーネント
import { Link } from "react-router-dom"; // リンクを追加

export default function TopPage() {
    const [articles, setArticles] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [hotVtubers, setHotVtubers] = useState([]);
    const [error, setError] = useState(null); // エラー状態を追加

    useEffect(() => {
        axios.get("http://localhost:8000/api/top.php")
            .then((res) => {
                const { articles, ranking, hot_vtubers } = res.data;
                console.log("APIから取得したデータ:", res.data); // デバッグ用ログ
                setArticles(articles);
                setRanking(ranking);
                setHotVtubers(hot_vtubers);
            })
            .catch((err) => {
                console.error("トップページデータの取得に失敗しました:", err);
                setError("データの取得に失敗しました。後でもう一度お試しください。"); // エラーメッセージを設定
            });
    }, []);

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
                {/* 記事一覧ページへのリンク */}
                <div className="mt-4 text-right">
                    <Link to="/articles/1" className="text-blue-600 hover:underline text-sm">
                        もっと見る →
                    </Link>
                </div>
            </section>

            {/* 人気ランキング */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">🔥 人気Vtuberランキング（今週）</h2>
                <ol className="space-y-2">
                    {ranking.map((vtuber, idx) => (
                        <li key={idx} className="flex justify-between border-b py-1">
                            <span>{idx + 1}. {vtuber.name}</span>
                            <span className="text-sm text-gray-500">{vtuber.growth}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {/* 話題のVtuber */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">👀 話題のVtuber</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {hotVtubers.map((vtuber, idx) => (
                        <div key={idx} className="text-center">
                            <img
                                src={vtuber.thumbnail_url ? `/images/${vtuber.thumbnail_url}` : "/images/default.png"}
                                alt={vtuber.name}
                                className="rounded-full w-24 h-24 mx-auto mb-2"
                            />
                            <p className="text-sm font-medium">{vtuber.name}</p>
                        </div>
                    ))}
                </div>
            </section>
        </SiteFrame>
    );
}
