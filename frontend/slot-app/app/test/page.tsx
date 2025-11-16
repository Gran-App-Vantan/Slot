'use client';
// import { createUser } from "@/api/getUser";
import { useEffect, useState } from "react";

// export default function TestPage() {
//     const [data, setData] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await createUser();
//                 if (res) {
//                     setData(res.data.token || null);
//                 } else {
//                     setError("Error");
//                 }
//             } catch (err) {
//                 setError("ユーザー取得に失敗しました");
//             }
//         };
        
//         fetchData();
//     }, []);
//     return (
//         <div>
//             {data && <div>Token: {data}</div>}
//             {error && <div>Error: {error}</div>}
//         </div>
//     )
// }


import { confirmationToken } from "@/api/confirmationToken";
export default function TestPage() {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
useEffect(() => {
    const fetchData = async () => {
        const res = await confirmationToken(crypto.randomUUID());
        if (res) {
            setData(data || null);
        } else {
            setError("Error");
        }
    };
    fetchData();
}, []);
return (
    <div>
        {data && <div>Token: {data}</div>}
        {error && <div>Error: {error}</div>}
    </div>
)
}