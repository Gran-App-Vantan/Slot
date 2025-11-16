import Cookies from 'js-cookie';

export type GetUserResponse = 
| {
    success: true;
    user_id: number;
    sns_id: number | null;
    point: number;
    name: string;
    user_icon: string | null;
    is_parent: boolean;
} | {
    success: false;
    message: string;
}

export async function getUser(): Promise<GetUserResponse> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8080';
    const apiUrl = `${apiBaseUrl}/api/me`;
    const token = Cookies.get('authToken');

    console.log(apiUrl);
    
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            console.error("ユーザー取得に失敗しました");
            return {
                success: false,
                message: "ユーザー取得に失敗しました",
            }
        }

        const data = await response.json();

        return {
            success: true,
            user_id: data.user_id,
            sns_id: data.sns_id,
            point: data.point,
            name: data.name,
            user_icon: data.user_icon,
            is_parent: data.is_parent,
        }

    } catch (err) {
        throw new Error("ユーザー取得に失敗しました");
    }
}
