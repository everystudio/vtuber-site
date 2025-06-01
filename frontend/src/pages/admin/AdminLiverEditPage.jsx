import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SiteFrame from "../../components/SiteFrame";

export default function AdminLiverEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [debutDate, setDebutDate] = useState("");
    const [uploading, setUploading] = useState(false);
    const [platforms, setPlatforms] = useState([]);
    const [platformOptions, setPlatformOptions] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // グループ・プラットフォーム一覧
        const fetchOptions = async () => {
            try {
                const [groupRes, platformRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/groups.php"),
                    axios.get("http://localhost:8000/api/platforms.php"),
                ]);
                setGroups(groupRes.data);
                setPlatformOptions(platformRes.data);
            } catch (err) {
                console.error("選択肢の取得失敗:", err);
            }
        };

        // ライバーの詳細取得
        const fetchLiver = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/livers.php?id=${id}`);
                const data = res.data;
                setName(data.name);
                setGroupId(data.group_id ?? "");
                setDescription(data.description ?? "");
                setYoutubeUrl(data.youtube_url ?? "");
                setThumbnailUrl(data.thumbnail_url ?? "");
                setDebutDate(data.debut_date ?? "");
                setPlatforms(data.platform_ids ?? []); // ← 中間テーブルと結合して配列で取得するようにする
            } catch (err) {
                console.error("ライバー取得失敗:", err);
                alert("ライバー情報の取得に失敗しました");
                navigate("/admin/livers");
            }
        };

        fetchOptions();
        fetchLiver();
    }, [id]);

    const togglePlatform = (platformId) => {
        setPlatforms((prev) =>
            prev.includes(platformId)
                ? prev.filter((p) => p !== platformId)
                : [...prev, platformId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            id,
            name,
            group_id: groupId,
            description,
            youtube_url: youtubeUrl,
            thumbnail_url: thumbnailUrl,
            debut_date: debutDate,
            platform_ids: platforms,
        };

        axios.put(`http://localhost:8000/api/livers.php`, payload)
            .then(() => {
                alert("更新しました");
                navigate("/admin/livers");
            })
            .catch((err) => {
                console.error("更新失敗:", err);
                alert("更新に失敗しました");
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
                <h1 className="text-2xl font-bold mb-4">🎤 ライバー編集</h1>
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
                        <label className="block font-semibold mb-1">プラットフォーム</label>
                        {platformOptions.map((platform) => (
                            <label key={platform.id} className="block">
                                <input
                                    type="checkbox"
                                    value={platform.id}
                                    checked={platforms.includes(platform.id)}
                                    onChange={() => togglePlatform(platform.id)}
                                />
                                <span className="ml-2">{platform.name}</span>
                            </label>
                        ))}
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
