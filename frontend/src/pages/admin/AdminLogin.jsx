import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ setIsAuthenticated }) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const handleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;

        try {
            const res = await axios.post(`${baseUrl}/api/auth.php`, { token });

            if (res.data.success) {
                localStorage.setItem("isAdminAuthenticated", "true");
                setIsAuthenticated(true); // ← ログイン成功フラグ
                navigate("/admin"); // 管理ダッシュボードへリダイレクト
            } else {
                alert("アクセス拒否されました");
            }
        } catch (err) {
            console.error("認証エラー", err);
        }
    };

    return (
        <div>
            <h2>管理者ログイン</h2>
            <GoogleLogin onSuccess={handleSuccess} onError={() => alert("失敗しました")} />
        </div>
    );
}
