'use client';

import { useState, useEffect } from "react";
import { checkWin } from "./winChecker";

interface TimelineItem {
    type: string;
    role: string;
    payout: number;
}

interface TimeLineProps {
    results: TimelineItem[];
}

function TimeLine({ results }: TimeLineProps) {
    const getRoleImage = (role: string) => {
        const roleImages: Record<string, string> = {
            aRole: "/slot-item/1762352725612.png",
            bRole: "/slot-item/IMG_4021.jpg",
            cRole: "/slot-item/IMG_5546.jpg",
            dRole: "/slot-item/IMG_5964.jpg",
            eRole: "/slot-item/IMG_7581.jpg",
            fRole: "/slot-item/IMG_7721.jpg",
            gRole: "/slot-item/IMG_7773.jpg",
        };
        return roleImages[role] || "/file.svg";
    };

    const getRoleName = (role: string) => {
        const roleNames: Record<string, string> = {
            aRole: "淳平No.1",
            bRole: "淳平No.2",
            cRole: "淳平No.3",
            dRole: "淳平No.4",
            eRole: "淳平No.5",
            fRole: "淳平No.6",
            gRole: "淳平No.7",
        };
        return roleNames[role] || role;
    };

    return (
        <div className="border-gold-inner-img w-67 h-54 overflow-y-auto">
            {results.length === 0 ? (
                <div className="px-2 py-1 flex justify-center items-center gap-4">
                    <p className="text-gold p22">結果がありません</p>
                </div>
            ) : (
                results.map((item, index) => (
                    <div key={index} className="px-2 py-1 flex justify-start items-center gap-4">
                        {item.role !== 'none' && (
                            <img src={getRoleImage(item.role)} alt="シンボル" className="w-5 h-5"/>
                        )}
                        {item.role !== 'none' ? (
                            <h3 className="p22 text-gold flex items-center gap-2 w-24">{getRoleName(item.role)}</h3>
                        ) : (
                            <div className="w-24"></div>
                        )}
                        {item.payout > 0 ? (
                            <p className="text-green-500 p22 font-bold">+{item.payout.toLocaleString()}</p>
                        ) : (
                            <p className="text-red-500 p22 font-bold">ハズレ</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default TimeLine;