import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopPage from './pages/TopPage';
import LiverListPage from "./pages/LiverListPage"; // VtuberListPageをLiverListPageに変更
import LiverDetailPage from "./pages/LiverDetailPage"; // VtuberDetailPageをLiverDetailPageに変更
import ArticleListPage from "./pages/ArticleListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticleFormPage from "./pages/ArticleFormPage";

function App() {
  return (
    <div className="App">
      {/* サイト全体のトップページを表示 */}
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/livers" element={<LiverListPage />} /> {/* VtuberListPageをLiverListPageに変更 */}
        <Route path="/liver/:id" element={<LiverDetailPage />} /> {/* VtuberDetailPageをLiverDetailPageに変更 */}
        <Route path="/articles/:page" element={<ArticleListPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/article/new" element={<ArticleFormPage />} />
        <Route path="/article/edit/:id" element={<ArticleFormPage />} />
      </Routes>

      {/* 必要なら個別のコンポーネントも表示 */}
      {/* <VtuberList /> ← TopPage内に移す or 条件付きで表示でもOK */}
      {/*<h1 className="text-2xl font-bold mb-4">底辺Vtuberまとめサイト</h1> */}
      {/*<VtuberList />*/}

    </div>



  );
}

export default App;
