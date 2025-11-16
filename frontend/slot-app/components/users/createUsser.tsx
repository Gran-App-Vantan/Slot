'use client';
import { createUser } from "@/api/getUser";
import { useEffect, useState } from "react";

export default function CreateUser() {
    const [data, setData] = useState <string | null>(null);
    const [error, setError] = useState <string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await createUser();
                if (res === null) {
                    setError("Error");
                } else if (res.success) {
                    setData(res.data.token);
                } else {
                    setError("Error");
                }
            } catch (err) {
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