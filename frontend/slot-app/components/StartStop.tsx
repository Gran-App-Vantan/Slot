"use client";
import { useState } from "react";
import GetRole from "./role/get-role";

interface StartStop {
    onStop?: () => void;
}


export default function StartStop( { onStop }: StartStop ) {
    // スタートボタンを押したらtrue, ストップボタンを押したらfalse
    const [isRunning, setIsRunning] = useState(false);

    const handleClick = () => {
        setIsRunning(!isRunning);
        onStop?.();
        if (isRunning) {
            GetRole();
        }
    };

    return <button className="border-gold-inner-green w-60 h-16" onClick={handleClick}>
        <span className={"size-27 " + `${isRunning ? "text-red" : "text-gold"}`}>
            {isRunning ? "Stop" : "Start"}            
        </span>
    </button>
}