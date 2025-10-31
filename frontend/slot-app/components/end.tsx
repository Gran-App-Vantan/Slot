"use client";
import { useState } from "react";

function End() {
    const [isEnd, setIsEnd] = useState(false);

    return (
        <button className="border-gold-inner-red w-50 h-16 rounded-[22px]">
            <span className="gold size-27-SC bg-clip-text text-transparent font-bold">
                終了
            </span>
        </button>
    )
}

export default End;