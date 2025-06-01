import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SiteFrame from "../components/SiteFrame";

const LiverList = () => { // VtuberListをLiverListに変更
    const [livers, setLivers] = useState([]); // vtubersをliversに変更

    useEffect(() => {
        console.log("APIを呼び出します");
        axios.get("http://localhost:8000/api/livers.php")
            .then((res) => {
                console.log("APIからのレスポンス:", res.data);
                setLivers(res.data); // vtubersをliversに変更
            })
            .catch((err) => {
                console.error("API呼び出しに失敗しました:", err);
                console.error(err);
            });
    }, []);

    return (
        <SiteFrame>

            <h2 className="text-2xl font-bold mb-6">Liver一覧</h2> {/* Vtuber一覧をLiver一覧に変更 */}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {livers.map((l, index) => (
                    <Link to={`/liver/${l.id}`} key={index} className="bg-white rounded shadow p-4 hover:bg-gray-50"> {/* vtuberをliverに変更 */}
                        <img
                            src={l.thumbnail_url ? `/images/${l.thumbnail_url}` : "/images/default.png"}
                            alt={l.name}
                            className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-lg font-semibold text-center">{l.name}</h3>
                        <p className="text-sm text-gray-500 text-center">{l.group}</p>
                        <p className="text-xs text-gray-400 text-center">デビュー: {l.debut_date}</p>
                    </Link>
                ))}
            </div>
        </SiteFrame>
    );
};

export default LiverList;
