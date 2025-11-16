import axios from "axios";
import Cookies from "js-cookie";

export type ConfirmationTokenResponse = 
    |{
        token: string;
    }
    | {
        success: boolean;
        message: string;
        data:{
		user_id: number,
		has_point: number,
		token: string,
		device_id: number,
		expires_at: string,
	}
}

export async function confirmationToken(token: string): Promise<ConfirmationTokenResponse> {
    const slotApi = process.env.NEXT_PUBLIC_SLOT_API_URL || 'http://localhost:8080';
    const apiUrl = `${slotApi}/api/game/confirmation-token`;
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {
            success: false,
            message: "認証トークンが存在しません",
        }
    }
    return axios 
        .post(apiUrl, {}, {
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true, 
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            if (err.response) {
                return {
                    success: false,
                    message: "トークン確認に失敗しました",
                }
            }
            return {
                success: false,
                message: "トークン確認に失敗しました",
            }
        });

}