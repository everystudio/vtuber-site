import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopPage from './pages/TopPage';
import VtuberListPage from "./pages/VtuberListPage";
import VtuberDetailPage from "./pages/VtuberDetailPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticleFormPage from "./pages/ArticleFormPage";

function App() {
  return (
    <div className="App">
      {/* サイト全体のトップページを表示 */}
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/vtubers" element={<VtuberListPage />} />
        <Route path="/vtuber/:id" element={<VtuberDetailPage />} />
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
