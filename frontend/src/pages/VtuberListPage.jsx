import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // リンクを追加
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

            <h2 className="text-2xl font-bold mb-6">Vtuber一覧</h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vtubers.map((v, index) => (
                    <Link to={`/vtuber/${v.id}`} key={index} className="bg-white rounded shadow p-4 hover:bg-gray-50">
                        <img
                            src={v.thumbnail_url ? `/images/${v.thumbnail_url}` : "/images/default.png"}
                            alt={v.name}
                            className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-lg font-semibold text-center">{v.name}</h3>
                        <p className="text-sm text-gray-500 text-center">{v.group}</p>
                        <p className="text-xs text-gray-400 text-center">デビュー: {v.debut_date}</p>
                    </Link>
                ))}
            </div>
        </SiteFrame>
    );
};

export default VtuberList;
