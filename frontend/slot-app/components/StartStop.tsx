"use client";
import { useState } from "react";
import GetRole from "./role/get-role";

interface StartStop {
    onStop?: () => void;
}


export default function StartStop( { onStop }: StartStop ) {
    const [isRunning, setIsRunning] = useState(false);

    const handleClick = () => {
        if (isRunning) {
            setIsRunning(false);
            onStop?.();
            GetRole();
            console.log(GetRole());
        } else {
            setIsRunning(true);
            console.log("Start");
        }
    };

    return <button className="border-gold-inner-green w-60 h-16" onClick={handleClick}>
        <span className={"size-27 " + `${isRunning ? "text-red" : "text-gold"}`}>
            {isRunning ? "Stop" : "Start"}            
        </span>
        <div>{GetRole()}</div>
    </button>
}