import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";

export default function LiverDetailPage() {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { id } = useParams();
    const [liver, setLiver] = useState(null);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/api/livers.php?id=${id}`)
            .then(res => setLiver(res.data))
            .catch(err => console.error("ライバー詳細取得失敗:", err));
    }, [id]);

    useEffect(() => {
        axios.get(`${baseUrl}/api/articles.php?liver_id=${id}`)
            .then(res => setArticles(res.data.articles || []))
            .catch(err => console.error("記事取得失敗:", err));
    }, [id]);

    if (!liver) return <SiteFrame><p>読み込み中...</p></SiteFrame>;

    return (
        <SiteFrame>
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <div className="flex flex-col items-center">
                    <img
                        src={liver.thumbnail_url ? `${liver.thumbnail_url}` : "/images/default.png"}
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
                    {liver.links && liver.links.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {liver.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                    {link.icon_url && (
                                        <img src={link.icon_url} alt={link.name} className="w-5 h-5" />
                                    )}
                                    <span>{link.name}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">リンクは登録されていません。</p>
                    )}
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">関連話題</h3>
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {articles.map(article => (
                                <a href={`/article/${article.id}`} className="block">
                                    <div key={article.id} className="bg-white rounded shadow p-4">
                                        <img
                                            src={article.thumbnail_url ? `${article.thumbnail_url}` : "/images/default.png"}
                                            alt={article.title}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                        <p className="text-blue-600 hover:underline font-semibold block mb-1">
                                            {article.title}
                                        </p>
                                        <p className="text-sm text-gray-500 mb-2">{article.updated_at}</p>
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
