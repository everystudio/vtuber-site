import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../../components/SiteFrame";

export default function AdminLiverFormPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [debutDate, setDebutDate] = useState("");
    const [groups, setGroups] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // グループ一覧を取得
        axios.get("http://localhost:8000/api/groups.php")
            .then((res) => {
                setGroups(res.data);
            })
            .catch((err) => {
                console.error("グループ一覧取得失敗:", err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name,
            group_id: groupId,
            description,
            youtube_url: youtubeUrl,
            thumbnail_url: thumbnailUrl,
            debut_date: debutDate,
        };

        axios.post("http://localhost:8000/api/livers.php", payload)
            .then((res) => {
                console.log("登録成功:", res.data);
                navigate("/admin/livers");
            })
            .catch((err) => {
                console.error("登録失敗:", err);
                alert("登録に失敗しました");
            });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);

        try {
            const res = await axios.post("http://localhost:8000/api/upload-image.php", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const imageUrl = res.data.url;
            setThumbnailUrl(imageUrl);
        } catch (err) {
            console.error("画像アップロード失敗:", err);
            alert("画像のアップロードに失敗しました");
        } finally {
            setUploading(false);
        }
    };

    return (
        <SiteFrame>
            <div className="max-w-xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">🎤 ライバー新規登録</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">名前</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">グループID</label>
                        <select
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">-- グループを選択 --</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">説明</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">YouTube URL</label>
                        <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">サムネイル画像</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                        {uploading && <p className="text-sm text-gray-500">アップロード中...</p>}
                        {thumbnailUrl && (
                            <div className="mb-2">
                                <img src={thumbnailUrl} alt="サムネイル" className="w-32 h-auto border rounded" />
                                <p className="text-sm text-gray-600 break-all">{thumbnailUrl}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">デビュー日</label>
                        <input type="date" value={debutDate} onChange={(e) => setDebutDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        登録する
                    </button>
                </form>
            </div>
        </SiteFrame>
    );
}
