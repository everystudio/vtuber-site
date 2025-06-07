import React from "react";

export default function AdminLiverForm({
    name, setName,
    groupId, setGroupId,
    description, setDescription,
    thumbnailUrl, setThumbnailUrl,
    debutDate, setDebutDate,
    groups,
    uploading,
    handleImageUpload,
    platforms, togglePlatform,
    platformOptions,
    onSubmit,
    buttonLabel = "保存",
    onCancel,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
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

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {buttonLabel}
                </button>

                <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    キャンセル
                </button>
            </div>
        </form>
    );
}
