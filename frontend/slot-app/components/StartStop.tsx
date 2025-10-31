"use client";
import { useState } from "react";

export default function StartStop() {
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div>
            <button className="border-gold-inner-green w-60 h-16" onClick={() => setIsRunning(!isRunning)}>
                <span className={"size-27 " + `${isRunning ? "text-red" : "text-gold"}`}>
                    {isRunning ? "Stop" : "Start"}
                </span>
            </button>
        </div>
    )
}