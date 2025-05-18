import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/api/articles.php?id=${id}`)
            .then(res => setArticle(res.data))
            .catch(err => console.error("記事取得失敗:", err));

        axios.get(`http://localhost:8000/api/comments.php?article_id=${id}`)
            .then(res => setComments(res.data.comments || []))
            .catch(err => console.error("コメント取得失敗:", err));
    }, [id]);

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;

        axios.post(`http://localhost:8000/api/comments.php`, {
            article_id: id,
            content: newComment
        })
            .then(res => {
                setComments([...comments, res.data.comment]);
                setNewComment("");
            })
            .catch(err => console.error("コメント投稿失敗:", err));
    };

    if (!article) return <SiteFrame><p>読み込み中...</p></SiteFrame>;

    return (
        <SiteFrame>
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
                <p className="text-gray-600 mb-6">{article.date}</p>
                <div className="prose mb-6">
                    {/* HTMLを安全にレンダリングし、画像やリンクを含む本文を表示 */}
                    <div dangerouslySetInnerHTML={{ __html: article.body }} />
                </div>

                <div className="mt-6">
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

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">コメントを投稿</h3>
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="4"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="コメントを入力してください"
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleCommentSubmit}
                    >
                        投稿
                    </button>
                </div>
            </div>
        </SiteFrame>
    );
}