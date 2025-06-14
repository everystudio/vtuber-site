import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AdminFrame from "../../components/AdminFrame";
import RichTextEditor from "../../components/RichTextEditor";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function ArticleFormPage() {
    const { id, liver_id, liver_name } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [liverName, setLiverName] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // クエリパラメータを取得
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page") || 1;


    const editor = useEditor({
        extensions: [StarterKit],
        content: body,
        onUpdate({ editor }) {
            setBody(editor.getHTML());
        },
    });

    useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/api/articles.php?id=${id}`)
                .then(res => {
                    setTitle(res.data.article.title);
                    setBody(res.data.article.body);
                    setLiverName(res.data.article.liver_name || "（不明）"); // ← ここ
                    setThumbnailUrl(res.data.article.thumbnail_url || "");
                })
                .catch(err => console.error("記事取得失敗:", err));
        }
    }, [id, editor]);

    useEffect(() => {
        if (!id && liver_id) {
            axios.get(`${baseUrl}/api/livers.php?id=${liver_id}`)
                .then(res => {
                    setLiverName(res.data.name);
                })
                .catch(err => console.error("ライバー情報取得失敗:", err));
        }
    }, [id, liver_id]);

    useEffect(() => {
        if (editor && body) {
            editor.commands.setContent(body);
        }
    }, [editor, body]);

    const handleSubmit = () => {
        const payload = {
            title,
            body,
            liver_id: liver_id,
            thumbnail_url: thumbnailUrl
        };

        if (id) {
            axios.put(`${baseUrl}/api/articles.php?id=${id}`, payload)
                .then(() => navigate(`/article/${id}`))
                .catch(err => {
                    console.error("記事更新失敗:", err);
                    alert("記事の更新に失敗しました。もう一度お試しください。");
                });
        } else {
            axios.post(`${baseUrl}/api/articles.php`, payload)
                .then(res => navigate(`/article/${res.data.id}`))
                .catch(err => {
                    console.error("記事投稿失敗:", err);
                    alert("記事の投稿に失敗しました。もう一度お試しください。");
                });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);

        try {
            const res = await axios.post(`${baseUrl}/api/upload-image.php`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setThumbnailUrl(res.data.url);
        } catch (err) {
            console.error("画像アップロード失敗:", err);
            alert("画像のアップロードに失敗しました");
        } finally {
            setUploading(false);
        }
    };

    return (
        <AdminFrame>
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-4">{id ? "記事を編集" : "新しい記事を投稿"}</h1>
                {liverName && (
                    <div className="mb-4 text-gray-800 font-semibold">
                        対象ライバー: <span className="text-blue-600">{liverName}</span>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">タイトル</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="記事のタイトルを入力してください"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">サムネイル画像</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                    {uploading && <p className="text-sm text-gray-500">アップロード中...</p>}
                    {thumbnailUrl && (
                        <div className="mb-2">
                            <img src={thumbnailUrl} alt="サムネイル" className="w-64 h-auto border rounded shadow" />
                            <p className="text-sm text-gray-600 break-all">{thumbnailUrl}</p>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">本文</label>
                    <RichTextEditor value={body} onChange={setBody} />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">プレビュー</label>
                    <div
                        className="border rounded p-2 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                        disabled={!editor} // エディタ初期化前は非活性
                    >
                        {id ? "更新" : "投稿"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/articles?page=${page}`)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </AdminFrame>
    );
}
