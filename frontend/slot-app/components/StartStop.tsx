"use client";
import { useState } from "react";
import GetRole from "./role/get-role";

interface StartStop {
    onStop?: () => void;
    clickCount: number;
}


export default function StartStop( { onStop, clickCount }: StartStop ) {
    // スタートボタンを押したらtrue, ストップボタンを押したらfalse
    const isRunning = clickCount >= 1;

    const handleClick = () => {
        onStop?.();
        if (isRunning) {
            GetRole();
        }
    };

    return <button className="border-gold-inner-green w-60 h-16" onClick={handleClick}>
        <span className={"size-27 " + `${isRunning ? "text-blinking size-big" : "text-gold"}`}>
            {isRunning ? "Stop" : "Start"}            
        </span>
    </button>
}