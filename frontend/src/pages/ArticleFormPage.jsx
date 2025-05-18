import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../components/SiteFrame";
import RichTextEditor from "../components/RichTextEditor";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function ArticleFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: body,
        onUpdate({ editor }) {
            setBody(editor.getHTML());
        },
    });

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/api/articles.php?id=${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setBody(res.data.body);
                    // bodyのデータをエディタに反映（editorがreadyになってから）
                    if (editor) {
                        editor.commands.setContent(res.data.body);
                    }
                })
                .catch(err => console.error("記事取得失敗:", err));
        }
    }, [id, editor]);

    const handleSubmit = () => {
        const payload = { title, body, vtuber_id: 1 }; // 仮のVtuber ID

        if (id) {
            axios.put(`http://localhost:8000/api/articles.php?id=${id}`, payload)
                .then(() => navigate(`/articles/${id}`))
                .catch(err => {
                    console.error("記事更新失敗:", err);
                    alert("記事の更新に失敗しました。もう一度お試しください。");
                });
        } else {
            axios.post("http://localhost:8000/api/articles.php", payload)
                .then(res => navigate(`/articles/${res.data.id}`))
                .catch(err => {
                    console.error("記事投稿失敗:", err);
                    alert("記事の投稿に失敗しました。もう一度お試しください。");
                });
        }
    };

    return (
        <SiteFrame>
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-4">{id ? "記事を編集" : "新しい記事を投稿"}</h1>
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
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                    disabled={!editor} // エディタ初期化前は非活性
                >
                    {id ? "更新" : "投稿"}
                </button>
            </div>
        </SiteFrame>
    );
}
