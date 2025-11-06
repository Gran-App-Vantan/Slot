'use client';
import StartStop from "../../components/StartStop";
import { useState } from "react";
import GetRole from "../../components/role/get-role";

export default function Role() {
    const [running, setRunning] = useState(false);
    const handleToggle = () => {
        setRunning(prev => !prev);
    };
    // 3つのロールを繰り返し
    const Items = [GetRole(), GetRole(), GetRole(), GetRole(), GetRole(), GetRole()];
    return (
        <>
            <div className="wheel-line overflow-hidden relative">
                {/* 0.5秒ごとのアニメーションでスピン */}
                <div
                    className="py-2"
                    style={{
                        animation: 'spin 0.5s linear infinite',
                        animationPlayState: running ? 'running' : 'paused'
                    }}
                >
                    {Items.map((item, index) => {
                        return (
                            // 200pxごとにロールを表示
                            <div className="slot-item absolute left-4" style={{top: `${-70 + index * 200}px`}}>
                                {item}
                            </div>
                        )
                    })}
                </div>
            </div>
            <StartStop onStop={handleToggle} />
        </>
    );
}