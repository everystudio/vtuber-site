import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminFrame from "../../components/AdminFrame";
import AdminLiverForm from "../../components/AdminLiverForm";

export default function AdminLiverFormPage() {
    const { id } = useParams(); // ← idがあれば編集、なければ新規
    const isEdit = !!id;

    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // 共通State
    const [name, setName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [debutDate, setDebutDate] = useState("");
    const [groups, setGroups] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [platforms, setPlatforms] = useState([]); // 選択された platform_id の配列
    const [platformOptions, setPlatformOptions] = useState([]);
    const [linkTypeOptions, setLinkTypeOptions] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [groupRes, platformRes, linkTypeRes] = await Promise.all([
                    axios.get(`${baseUrl}/api/groups.php`),
                    axios.get(`${baseUrl}/api/platforms.php`),
                    axios.get(`${baseUrl}/api/link_types.php`)
                ]);
                setGroups(groupRes.data);
                setPlatformOptions(platformRes.data);
                setLinkTypeOptions(linkTypeRes.data);
            } catch (err) {
                console.error("初期データ取得失敗:", err);
            }
        };

        fetchInitialData();
    }, []);

    // 編集時、ライバーの情報を取得
    useEffect(() => {
        if (!isEdit || linkTypeOptions.length === 0) return;

        axios.get(`${baseUrl}/api/livers.php?id=${id}`)
            .then((res) => {
                const data = res.data;

                setName(data.name);
                setGroupId(data.group_id ?? "");
                setDescription(data.description ?? "");
                setThumbnailUrl(data.thumbnail_url ?? "");
                setDebutDate(data.debut_date ?? "");
                setPlatforms(data.platform_ids ?? []);

                // 🔽 文字列化してからセット
                const fixedLinks = (data.links ?? []).map(link => ({
                    ...link,
                    link_type_id: link.link_type_id != null ? String(link.link_type_id) : ""
                }));
                setLinks(fixedLinks);
            })
            .catch((err) => {
                console.error("ライバー取得失敗:", err);
                alert("ライバー情報の取得に失敗しました");
                navigate("/admin/livers");
            });
    }, [id, isEdit, linkTypeOptions]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id,
            name,
            group_id: groupId,
            description,
            thumbnail_url: thumbnailUrl,
            debut_date: debutDate,
            platform_ids: platforms,
            links,
        };

        try {
            if (isEdit) {
                await axios.put(`${baseUrl}/api/livers.php`, payload);
                alert("更新しました");
            } else {
                await axios.post(`${baseUrl}/api/livers.php`, payload);
                alert("登録しました");
            }
            navigate("/admin/livers");
        } catch (err) {
            console.error("保存失敗:", err);
            alert("保存に失敗しました");
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

    const addLink = () => {
        setLinks([...links, { url: "", link_type_id: "" }]);
    };

    const updateLink = (index, field, value) => {
        const updated = [...links];
        updated[index][field] = value;
        setLinks(updated);
    };

    const removeLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    return (
        <AdminFrame>
            <div className="max-w-xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">
                    🎤 {isEdit ? "ライバー編集" : "ライバー新規登録"}
                </h1>

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
                        <div className="flex flex-wrap gap-4">
                            {platformOptions.map((platform) => (
                                <label key={platform.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={platform.id}
                                        checked={platforms.includes(platform.id)}
                                        onChange={() => togglePlatform(platform.id)}
                                    />
                                    <span>{platform.name}</span>
                                </label>
                            ))}
                        </div>

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
                    <div>
                        <label className="block font-semibold mb-1">関連リンク</label>
                        {links.map((link, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="URL"
                                    className="flex-1 border px-2 py-1 rounded"
                                    value={link.url}
                                    onChange={(e) => updateLink(i, "url", e.target.value)}
                                />
                                <select
                                    value={String(link.link_type_id ?? "")}
                                    onChange={(e) => updateLink(i, "link_type_id", e.target.value)}
                                >
                                    <option value="">選択</option>
                                    {linkTypeOptions.map((type) => (
                                        <option key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => removeLink(i)} className="text-red-600 hover:underline">削除</button>
                            </div>
                        ))}
                        <button type="button" onClick={addLink} className="text-blue-600 hover:underline">＋リンクを追加</button>
                    </div>


                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isEdit ? "更新する" : "登録する"}
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

            </div >
        </AdminFrame >
    );
}
