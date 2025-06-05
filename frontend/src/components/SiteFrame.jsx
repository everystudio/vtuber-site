// src/components/Layout.jsx
import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

export default function Layout({ children }) {
    const { platform } = useParams();
    const storedPlatform = localStorage.getItem("selectedPlatform");
    const activePlatform = platform || storedPlatform;

    const isPlatformMode = !!activePlatform;
    const theme = activePlatform ? platformThemes[activePlatform] : null;
    const location = useLocation();
    const isTopPage = location.pathname === "/" || location.pathname === `/${activePlatform}`;
    return (
        <div className="min-h-screen bg-gray-50">
            <header className={`shadow p-4 flex justify-between items-center ${theme?.bg || "bg-white"}`}>
                <div className="flex items-center gap-3">
                    {theme?.logo && (
                        <img src={theme.logo} alt={`${activePlatform}ロゴ`} className="w-8 h-8" />
                    )}
                    <h1 className={`text-2xl font-bold ${theme?.color || "text-pink-600"}`}>
                        {theme?.name || "あの配信者まとめ"}
                    </h1>
                </div>

                <nav className="space-x-4 text-gray-700">
                    <a href="/" className="hover:underline">ホーム</a>
                    <Link to="/livers" className="hover:underline">Liver一覧</Link>
                    <a href="/articles/1" className="hover:underline">記事一覧</a>
                    {/*
                    <a href="/ranking" className="hover:underline">ランキング</a>
                    */}
                    <a href="/tags" className="hover:underline">タグ一覧</a>

                    {/* 全体に戻るボタン：Platform選択中のみ表示 */}
                    {!activePlatform && (
                        <a
                            onClick={() => {
                                localStorage.removeItem("selectedPlatform");
                                window.location.href = "/";
                            }}
                            className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline hover:text-blue-700 transition"
                        >
                            全体に戻る
                        </a>
                    )}
                </nav>
            </header>

            <main className="max-w-6xl mx-auto p-4">
                {/* ✅ トップページで かつ Platform選択前のみ表示 */}
                {isTopPage && !activePlatform && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-3">プラットフォーム別まとめを見る</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/mirrativ"
                                className="inline-block px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold shadow hover:bg-green-200 transition"
                            >
                                Mirrativまとめを見る
                            </Link>
                            <Link
                                to="/youtube"
                                className="inline-block px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition"
                            >
                                YouTubeまとめを見る
                            </Link>
                        </div>
                    </section>
                )}



                {children}
            </main>

            <footer className="bg-gray-100 text-sm text-gray-600 text-center py-4 mt-10">
                &copy; 2025 配信者まとめ All rights reserved.
            </footer>
        </div>
    );
}

// テーマ設定（ファイルの下に置いてもOK）
const platformThemes = {
    mirrativ: {
        name: "あのMirrativまとめ",
        color: "text-green-700",
        bg: "bg-green-100",
        logo: "/images/logos/09-mirrativ.png",
    },
    youtube: {
        name: "あのYouTubeまとめ",
        color: "text-red-600",
        bg: "bg-red-100",
        logo: "/logos/youtube.png",
    },
    bilibili: {
        name: "あのbilibiliまとめ",
        color: "text-blue-700",
        bg: "bg-blue-100",
        logo: "/logos/bilibili.png",
    },
};