import Cookies from "js-cookie";
import axios from "axios";

export type createUserResponse = 
     | null
     | {
        success: true;
        message: string;
        data: {
            token: string;
        }
     }

export async function createUser(): Promise<createUserResponse> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8080';
    const apiUrl = `${apiBaseUrl}/api/create-url`;

    // トークンが存在しない場合はエラーを返す
    const token = Cookies.get('authToken');
    if (!token) {
        console.error("認証トークンが存在しません");
        return null;
    }

    return axios
        .post(apiUrl, {}, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true, 
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.error("ユーザー作成に失敗しました:", err);
            if (err.response) {
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data);
            }
            return null;
        });
};