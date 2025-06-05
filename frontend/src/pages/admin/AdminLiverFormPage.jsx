import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminFrame from "../../components/AdminFrame";

export default function AdminLiverFormPage() {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [debutDate, setDebutDate] = useState("");
    const [groups, setGroups] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [platforms, setPlatforms] = useState([]); // 選択された platform_id の配列
    const [platformOptions, setPlatformOptions] = useState([]);

    useEffect(() => {
        // 並列でAPIを呼び出す
        const fetchGroups = axios.get(`${baseUrl}/api/groups.php`);
        const fetchPlatforms = axios.get(`${baseUrl}/api/platforms.php`);

        Promise.all([fetchGroups, fetchPlatforms])
            .then(([groupsRes, platformsRes]) => {
                setGroups(groupsRes.data);
                setPlatformOptions(platformsRes.data);
            })
            .catch((err) => {
                console.error("初期データ取得に失敗:", err);
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
            platform_ids: platforms,
        };

        axios.post(`${baseUrl}/api/livers.php`, payload)
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
            const res = await axios.post(`${baseUrl}/api/upload-image.php`, formData, {
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

    const togglePlatform = (id) => {
        setPlatforms((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );
    };

    return (
        <AdminFrame>
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


                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            登録する
                        </button>

                        <button
                            type="button"
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => navigate("/admin/livers")}
                        >
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </AdminFrame>
    );
}
