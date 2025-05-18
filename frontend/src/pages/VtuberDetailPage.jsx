import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";

export default function VtuberDetailPage() {
    const { id } = useParams();
    const [vtuber, setVtuber] = useState(null);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/vtubers.php?id=${id}`)
            .then(res => setVtuber(res.data))
            .catch(err => console.error("ライバー詳細取得失敗:", err));
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/articles.php?id=${id}`)
            .then(res => setArticles(res.data.articles || []))
            .catch(err => console.error("記事取得失敗:", err));
    }, [id]);

    if (!vtuber) return <SiteFrame><p>読み込み中...</p></SiteFrame>;

    return (
        <SiteFrame>
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <div className="flex flex-col items-center">
                    <img
                        src={vtuber.thumbnail_url ? `/images/${vtuber.thumbnail_url}` : "/images/default.png"}
                        alt={vtuber.name}
                        className="w-32 h-32 rounded-full mb-4 object-cover"
                    />
                    <h2 className="text-2xl font-bold mb-2">{vtuber.name}</h2>
                    <p className="text-gray-600">所属: {vtuber.group || "未所属"}</p>
                    <p className="text-gray-500 text-sm mb-4">デビュー日: {vtuber.debut_date}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">紹介文</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{vtuber.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">リンク</h3>
                    <ul className="text-blue-600 list-disc pl-5">
                        <li><a href={vtuber.youtube_url} target="_blank" rel="noreferrer">YouTube</a></li>
                        {vtuber.twitter_url && (
                            <li><a href={vtuber.twitter_url} target="_blank" rel="noreferrer">Twitter</a></li>
                        )}
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">関連話題</h3>
                    {articles.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {articles.map(article => (
                                <li key={article.id} className="mb-2">
                                    <a href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
                                        {article.title}
                                    </a>
                                    <p className="text-sm text-gray-500">{article.date}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {article.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-gray-200 rounded px-2 py-1">{tag}</span>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">関連する話題はありません。</p>
                    )}
                </div>
            </div>
        </SiteFrame>
    );
}
