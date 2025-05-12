import React, { useEffect, useState } from "react";
import axios from "axios";
import SiteFrame from "../components/SiteFrame"; // サイト全体のレイアウトを定義したコンポーネント

const VtuberList = () => {
    const [vtubers, setVtubers] = useState([]);

    useEffect(() => {
        console.log("APIを呼び出します");
        axios.get("http://localhost:8000/api/vtubers.php")
            .then((res) => {
                console.log("APIからのレスポンス:", res.data);
                setVtubers(res.data)
            })
            .catch((err) => {
                console.error("API呼び出しに失敗しました:", err);
                console.error(err);
            });
    }, []);

    return (
        <SiteFrame>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">Vtuber一覧</h2>
                <ul>
                    {vtubers.map((vtuber) => (
                        <li key={vtuber.id} className="mb-4 p-4 border rounded shadow hover:shadow-md transition">
                            <p className="text-xl font-bold text-indigo-700">{vtuber.name}</p>
                            <p className="text-gray-700">{vtuber.description} {vtuber.debut_date}</p>

                            {/* 🔽 ここに入れる！ */}
                            {console.log("▶ vtuberデータ:", vtuber)}

                            <a href={vtuber.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">YouTube</a>
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="text-2xl font-bold mb-6">Vtuber一覧</h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vtubers.map((v, index) => (
                    <div key={index} className="bg-white rounded shadow p-4 hover:bg-gray-50">
                        <img
                            src={v.thumbnail_url}
                            alt={v.name}
                            className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-lg font-semibold text-center">{v.name}</h3>
                        <p className="text-sm text-gray-500 text-center">{v.group}</p>
                        <p className="text-xs text-gray-400 text-center">デビュー: {v.debut_date}</p>
                    </div>
                ))}
            </div>
        </SiteFrame>
    );
};

export default VtuberList;
