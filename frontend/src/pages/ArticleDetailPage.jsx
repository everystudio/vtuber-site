import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ← useNavigateを追加
import axios from "axios";
import SiteFrame from "../components/SiteFrame";

export default function ArticleDetailPage() {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate(); // ← ナビゲーション用フック
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        axios.get(`${baseUrl}/api/articles.php?id=${id}`)
            .then(res => {
                setArticle(res.data.article);
                console.log("記事データ:", res.data); // デバッグ用ログ
            })
            .catch(err => console.error("記事取得失敗:", err));

        axios.get(`${baseUrl}/api/comments.php?article_id=${id}`)
            .then(res => setComments(res.data.comments || []))
            .catch(err => console.error("コメント取得失敗:", err));
    }, [id]);

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;

        axios.post(`${baseUrl}/api/comments.php`, {
            article_id: id,
            content: newComment
        })
            .then(res => {
                setComments([...comments, res.data.comment]);
                setNewComment("");
            })
            .catch(err => console.error("コメント投稿失敗:", err));
    };

    const handleArticleEdit = () => {
        navigate(`/article/edit/${id}`); // ← 編集ページにリダイレクト
    };

    if (!article) return <SiteFrame><p>読み込み中...</p></SiteFrame>;

    return (
        <SiteFrame>
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 bg-white rounded shadow">
                {/* タグ + コメント */}
                <div className="flex justify-between items-center">
                    <div className="space-x-2">
                        {article.tags.map(tag => (
                            <span key={tag} className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    {article.commentCount > 0 && (
                        <div className="text-pink-500 text-sm">
                            💬 {article.commentCount}
                        </div>
                    )}
                </div>
                {/* タイトル */}
                <h1 className="text-2xl font-bold text-red-700 leading-snug">
                    {article.title}
                </h1>

                {/* 更新日 */}
                <div className="text-sm text-gray-500">更新日：{article.updated_at}</div>

                {/* ライバー簡易表示 */}
                {article.liver_id && (
                    <div className="flex items-center gap-4 mb-4">
                        {article.thumbnail_url && (
                            <img
                                src={article.thumbnail_url}
                                alt={article.liver_name}
                                className="w-12 h-12 rounded-full object-cover border"
                            />
                        )}
                        <div>
                            <p className="text-sm text-gray-600">この記事のライバー</p>
                            <button
                                onClick={() => navigate(`/liver/${article.liver_id}`)}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                {article.liver_name}
                            </button>
                        </div>
                    </div>
                )}

                {/* サムネイル画像 */}
                <img src={article.thumbnail_url} alt="記事サムネイル" className="w-full rounded shadow" />

                {/* 本文 */}
                <div className="prose max-w-none text-base leading-relaxed text-gray-800">
                    {/* HTMLを安全にレンダリングし、画像やリンクを含む本文を表示 */}
                    <div dangerouslySetInnerHTML={{ __html: article.body }} />
                </div>

                {/* コメント一覧 */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">みんなの反応</h3>
                    {comments.length > 0 ? (
                        <ul className="space-y-4">
                            {comments.map(comment => (
                                <li key={comment.id} className="bg-gray-100 p-4 rounded shadow">
                                    <p className="text-gray-700">{comment.content}</p>
                                    <p className="text-sm text-gray-500 text-right">{comment.date}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">まだコメントはありません。</p>
                    )}
                </div>

                {/* コメント投稿欄 */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">コメントを投稿</h3>
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="4"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="コメントを入力してください"
                    />
                    <div className="flex gap-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleCommentSubmit}
                        >
                            コメント投稿
                        </button>
                    </div>
                </div>
            </div>

        </SiteFrame>
    );
}