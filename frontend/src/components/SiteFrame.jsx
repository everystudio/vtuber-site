// src/components/Layout.jsx
import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

export default function Layout({ children }) {
    const { platform } = useParams();
    const storedPlatform = localStorage.getItem("selectedPlatform");
    const activePlatform = platform || storedPlatform;
    const [menuOpen, setMenuOpen] = useState(false);

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

                {/* ハンバーガー（モバイルのみ） */}
                <button
                    className="sm:hidden text-gray-700"
                    onClick={() => setMenuOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* PC用メニュー（常時表示） */}
                <nav className="hidden sm:flex gap-4 text-gray-700 text-sm items-center">
                    <a href="/" className="hover:underline">ホーム</a>
                    <Link to="/livers" className="hover:underline">Liver一覧</Link>
                    <a href="/articles/1" className="hover:underline">記事一覧</a>
                    <a href="/tags" className="hover:underline">タグ一覧</a>
                    {activePlatform && (
                        <a
                            onClick={() => {
                                localStorage.removeItem("selectedPlatform");
                                window.location.href = "/";
                            }}
                            className="cursor-pointer font-semibold text-blue-600 hover:underline hover:text-blue-700 transition"
                        >
                            全体に戻る
                        </a>
                    )}
                </nav>
                {/* オーバーレイ（クリックで閉じる） */}
                {menuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                )}

                {/* スライドメニュー（モバイルのみ） */}
                <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                    } sm:hidden p-5 space-y-4`}
                >
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-500 hover:text-gray-800 text-right block ml-auto"
                    >
                        × 閉じる
                    </button>
                    <a href="/" className="block text-gray-800 font-semibold hover:underline">ホーム</a>
                    <Link to="/livers" className="block text-gray-800 font-semibold hover:underline">Liver一覧</Link>
                    <a href="/articles/1" className="block text-gray-800 font-semibold hover:underline">記事一覧</a>
                    <a href="/tags" className="block text-gray-800 font-semibold hover:underline">タグ一覧</a>
                    {activePlatform && (
                        <a
                            onClick={() => {
                                localStorage.removeItem("selectedPlatform");
                                window.location.href = "/";
                            }}
                            className="block text-blue-600 font-semibold hover:underline"
                        >
                            全体に戻る
                        </a>
                    )}
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4">
                {/* ✅ トップページで かつ Platform選択前のみ表示 */}
                {isTopPage && !activePlatform && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-3">プラットフォーム別まとめを見る</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <Link
                                to="/mirrativ"
                                className="flex items-center gap-3 p-4 rounded-lg shadow bg-green-50 hover:bg-green-100 transition"
                            >
                                <img src="/images/logos/09-mirrativ.png" alt="mirrativ" className="w-8 h-8" />
                                <span className="font-semibold text-green-800">Mirrativまとめを見る</span>
                            </Link>
                            <Link
                                to="/youtube"
                                className="flex items-center gap-3 p-4 rounded-lg shadow bg-red-50 hover:bg-red-100 transition"
                            >
                                <img src="/images/logos/01-youtube.png" alt="youtube" className="w-8 h-8" />
                                <span className="font-semibold text-red-700">YouTubeまとめを見る</span>
                            </Link>
                            <Link
                                to="/twitter"
                                className="flex items-center gap-3 p-4 rounded-lg shadow bg-blue-50 hover:bg-blue-100 transition"
                            >
                                <img src="/images/logos/05-twitter.png" alt="twitter" className="w-8 h-8" />
                                <span className="font-semibold text-blue-700">Twitterまとめを見る</span>
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