import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";

export default function LiverDetailPage() {
    const { id } = useParams();
    const [liver, setLiver] = useState(null);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/livers.php?id=${id}`)
            .then(res => setLiver(res.data))
            .catch(err => console.error("ライバー詳細取得失敗:", err));
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/articles.php?liver_id=${id}`)
            .then(res => setArticles(res.data.articles || []))
            .catch(err => console.error("記事取得失敗:", err));
    }, [id]);

    if (!liver) return <SiteFrame><p>読み込み中...</p></SiteFrame>;

    return (
        <SiteFrame>
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <div className="flex flex-col items-center">
                    <img
                        src={liver.thumbnail_url ? `/images/${liver.thumbnail_url}` : "/images/default.png"}
                        alt={liver.name}
                        className="w-32 h-32 rounded-full mb-4 object-cover"
                    />
                    <h2 className="text-2xl font-bold mb-2">{liver.name}</h2>
                    <p className="text-gray-600">所属: {liver.group || "未所属"}</p>
                    <p className="text-gray-500 text-sm mb-4">デビュー日: {liver.debut_date}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">紹介文</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{liver.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">リンク</h3>
                    <ul className="text-blue-600 list-disc pl-5">
                        <li><a href={liver.youtube_url} target="_blank" rel="noreferrer">YouTube</a></li>
                        {liver.twitter_url && (
                            <li><a href={liver.twitter_url} target="_blank" rel="noreferrer">Twitter</a></li>
                        )}
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">関連話題</h3>
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {articles.map(article => (
                                <a href={`/article/${article.id}`} className="block">
                                    <div key={article.id} className="bg-white rounded shadow p-4">
                                        <img
                                            src={article.thumbnail_url ? `/images/${article.thumbnail_url}` : "/images/default.png"}
                                            alt={article.title}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                        <p className="text-blue-600 hover:underline font-semibold block mb-1">
                                            {article.title}
                                        </p>
                                        <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-gray-200 rounded px-2 py-1">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">関連する話題はありません。</p>
                    )}
                </div>
            </div>
        </SiteFrame>
    );
}
