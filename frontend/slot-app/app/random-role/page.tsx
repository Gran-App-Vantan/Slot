'use client';

import { useState } from "react";
import Reel from "@/components/reel";
import StartStop from "@/components/StartStop";

export default function RandomRolePage() {
    // ボタン押下回数をカウント
    const [clickCount, setClickCount] = useState(0);
    // 各リールの実行状態を管理（true: 回転中、false: 停止中）
    const [reelStates, setReelStates] = useState<[boolean, boolean, boolean]>([false, false, false]);

    const handleToggle = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // すべてのリールが停止している場合は、すべて開始
        if (reelStates.every(state => !state)) {
            setReelStates([true, true, true]);
            return;
        }

        // 奇数回目（1, 3, 5回目）で左から順にリールを停止
        if (newCount === 2) {
            // 左のリール（index 0）を停止
            setReelStates([false, true, true]);
        } else if (newCount === 3) {
            // 真ん中のリール（index 1）を停止
            setReelStates([false, false, true]);
        } else if (newCount === 4) {
            // 右のリール（index 2）を停止
            setReelStates([false, false, false]);
            // すべて停止したらカウントをリセット
            setClickCount(0);
        }
    };

    return (
        <>
            <div className="flex gap-4">
                <Reel running={reelStates[0]} />
                <Reel running={reelStates[1]} />
                <Reel running={reelStates[2]} />
            </div>
            <StartStop onStop={handleToggle} clickCount={clickCount} />
        </>
    );
}