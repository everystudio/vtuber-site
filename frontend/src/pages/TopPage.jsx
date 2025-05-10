import React from "react";
import SiteFrame from "../components/SiteFrame"; // サイト全体のレイアウトを定義したコンポーネント

export default function TopPage() {
    return (
        <SiteFrame>
            {/* 注目まとめ記事 */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">📰 注目のまとめ記事</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((id) => (
                        <article key={id} className="bg-white shadow rounded p-4 hover:bg-gray-50">
                            <h3 className="font-semibold text-lg mb-2">記事タイトル {id}</h3>
                            <p className="text-sm text-gray-600">2025/05/09 ・ タグ: 例タグ</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* 人気ランキング */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">🔥 人気Vtuberランキング（今週）</h2>
                <ol className="space-y-2">
                    {[
                        { name: "星街すいせい", growth: "+12,345人" },
                        { name: "壱百満天原サロメ", growth: "+10,002人" },
                        { name: "宝鐘マリン", growth: "+9,876人" },
                    ].map((vtuber, idx) => (
                        <li key={idx} className="flex justify-between border-b py-1">
                            <span>{idx + 1}. {vtuber.name}</span>
                            <span className="text-sm text-gray-500">{vtuber.growth}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {/* 話題のVtuber */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">👀 話題のVtuber</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {["Vtuber1", "Vtuber2", "Vtuber3", "Vtuber4"].map((name, idx) => (
                        <div key={idx} className="text-center">
                            <img
                                src={`/images/vtuber${idx + 1}.jpg`}
                                alt={name}
                                className="rounded-full w-24 h-24 mx-auto mb-2"
                            />
                            <p className="text-sm font-medium">{name}</p>
                        </div>
                    ))}
                </div>
            </section>
        </SiteFrame>
    );
}
