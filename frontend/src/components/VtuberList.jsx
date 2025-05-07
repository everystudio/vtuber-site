import React, { useEffect, useState } from "react";
import axios from "axios";

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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Vtuber一覧6</h2>
            <ul>
                {vtubers.map((vtuber) => (
                    <li key={vtuber.id} className="mb-4 border-b pb-2">
                        <p className="text-lg font-semibold">{vtuber.name}</p>
                        <p>{vtuber.description}</p>
                        <a href={vtuber.youtube_url} target="_blank" rel="noopener noreferrer">YouTube</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VtuberList;
