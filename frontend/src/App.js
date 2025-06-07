import React, { useState } from "react";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ユーザー用のページ
import TopPage from './pages/TopPage';

import LiverListPage from "./pages/LiverListPage"; // VtuberListPageをLiverListPageに変更
import LiverDetailPage from "./pages/LiverDetailPage"; // VtuberDetailPageをLiverDetailPageに変更
import ArticleListPage from "./pages/ArticleListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

// 管理者用のページ
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLiverListPage from "./pages/admin/AdminLiverListPage";
import AdminLiverFormPage from "./pages/admin/AdminLiverFormPage";
import AdminArticleListPage from "./pages/admin/AdminArticleListPage";
import AdminArticleFormPage from "./pages/admin/AdminArticleFormPage";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAdminAuthenticated") === "true";
  });

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={clientId}>
        <Routes>
          {/* ユーザーアクセス */}
          <Route path="/:platform?" element={<TopPage />} />

          <Route path="/livers" element={<LiverListPage />} /> {/* VtuberListPageをLiverListPageに変更 */}
          <Route path="/liver/:id" element={<LiverDetailPage />} /> {/* VtuberDetailPageをLiverDetailPageに変更 */}
          <Route path="/articles/:page" element={<ArticleListPage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />

          {/* 管理者ログイン */}
          <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />

          {/* 管理者ページ：認証必須 */}
          <Route path="/admin" element={isAuthenticated ? <AdminDashboard setIsAuthenticated={setIsAuthenticated} /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin/livers" element={isAuthenticated ? <AdminLiverListPage /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin/livers/new" element={isAuthenticated ? <AdminLiverFormPage /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin/livers/edit/:id" element={isAuthenticated ? <AdminLiverFormPage /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin/articles" element={isAuthenticated ? <AdminArticleListPage /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin/article/new" element={isAuthenticated ? <AdminArticleFormPage /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin/article/edit/:id" element={isAuthenticated ? <AdminArticleFormPage /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} />

          {/* <Route path="/admin/articles" element={<AdminArticleListPage />} /> */}
          {/* <Route path="/admin/livers" element={<AdminLiverListPage />} /> */}

        </Routes>
      </GoogleOAuthProvider>

      {/* 必要なら個別のコンポーネントも表示 */}
      {/* <VtuberList /> ← TopPage内に移す or 条件付きで表示でもOK */}
      {/*<h1 className="text-2xl font-bold mb-4">底辺Vtuberまとめサイト</h1> */}
      {/*<VtuberList />*/}

    </div>



  );
}

export default App;
