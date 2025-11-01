'use client';
import GetRole from "../../components/role/get-role";

export default function Role() {
    const role = GetRole();
    return (
        <div className="text-2xl font-bold">
            {role}
        </div>
    );
}