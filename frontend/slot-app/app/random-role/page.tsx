'use client';

import { useEffect, useState, useRef } from "react";
import Reel from "@/components/reel";
import StartStop from "@/components/StartStop";

export default function RandomRolePage() {
    // ボタン押下回数をカウント
    const [clickCount, setClickCount] = useState(0);
    // 各リールの実行状態を管理（true: 回転中、false: 停止中）
    const [reelStates, setReelStates] = useState<[boolean, boolean, boolean]>([false, false, false]);
    // 3x3グリッドのシンボルを管理 [リール0の[上,中央,下], リール1の[上,中央,下], リール2の[上,中央,下]]
    const [symbolGrid, setSymbolGrid] = useState<[[string | null, string | null, string | null], [string | null, string | null, string | null], [string | null, string | null, string | null]]>([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);
    // ポイントを管理
    const [points, setPoints] = useState(0);
    // この回のスピンで既にポイントを付与したかどうかを追跡
    const hasCheckedWinRef = useRef(false);

    useEffect(() => {
        // 3つすべてのリールが停止していて、すべてのシンボルが設定されている場合のみチェック
        const allStopped = reelStates.every(state => !state);
        const allSymbolsSet = symbolGrid.every(reel => reel.every(symbol => symbol !== null));
        
        if (allStopped && allSymbolsSet) {
            // まだチェックしていない場合のみ実行
            if (!hasCheckedWinRef.current) {
                hasCheckedWinRef.current = true; // チェック済みフラグを設定
                userWin();
            }
        }
    }, [reelStates, symbolGrid]);

    // 各roleの配当を定義
    const rolePayouts: Record<string, number> = {
        aRole: 20,   // 淳平No.1
        bRole: 50,  // 淳平No.2
        cRole: 90,  // 淳平No.3
        dRole: 200,  // 淳平No.4
        eRole: 300,  // 淳平No.5
        fRole: 500,  // 淳平No.6
        gRole: 1000,  // 淳平No.7
    };

    // 横ラインの配当倍率
    const HORIZONTAL_MULTIPLIER = 1.0;
    // 斜めラインの配当倍率
    const DIAGONAL_MULTIPLIER = 1.5;

    const userWin = () => {
        const [reel0, reel1, reel2] = symbolGrid;
        const [top0, center0, bottom0] = reel0;
        const [top1, center1, bottom1] = reel1;
        const [top2, center2, bottom2] = reel2;

        if (!top0 || !center0 || !bottom0 || !top1 || !center1 || !bottom1 || !top2 || !center2 || !bottom2) {
            return;
        }

        let winPoints = 0;

        // 横ラインのチェック（上、中央、下）
        // 上段
        if (top0 === top1 && top1 === top2) {
            const basePayout = rolePayouts[top0] || 0;
            const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER);
            winPoints += payout;
            console.log(`上段が揃いました！ (${top0}): ${payout}ポイント`);
        }
        // 中央段
        if (center0 === center1 && center1 === center2) {
            const basePayout = rolePayouts[center0] || 0;
            const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER);
            winPoints += payout;
            console.log(`中央段が揃いました！ (${center0}): ${payout}ポイント`);
        }
        // 下段
        if (bottom0 === bottom1 && bottom1 === bottom2) {
            const basePayout = rolePayouts[bottom0] || 0;
            const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER);
            winPoints += payout;
            console.log(`下段が揃いました！ (${bottom0}): ${payout}ポイント`);
        }

        // 斜めラインのチェック
        // 左上→右下（上段左、中央段中央、下段右）
        if (top0 === center1 && center1 === bottom2) {
            const basePayout = rolePayouts[top0] || 0;
            const payout = Math.floor(basePayout * DIAGONAL_MULTIPLIER);
            winPoints += payout;
            console.log(`左上→右下の斜めが揃いました！ (${top0}): ${payout}ポイント`);
        }
        // 右上→左下（上段右、中央段中央、下段左）
        if (top2 === center1 && center1 === bottom0) {
            const basePayout = rolePayouts[top2] || 0;
            const payout = Math.floor(basePayout * DIAGONAL_MULTIPLIER);
            winPoints += payout;
            console.log(`右上→左下の斜めが揃いました！ (${top2}): ${payout}ポイント`);
        }

        if (winPoints > 0) {
            setPoints(prev => prev + winPoints);
            console.log(`合計 ${winPoints}ポイント獲得！`);
            alert(`${winPoints}ポイント獲得！`);
        }
    }

    // デバッグ用: 強制的に同じroleを設定する関数
    const testSetSameRole = (roleKey: string = 'aRole') => {
        setSymbolGrid([
            [roleKey, roleKey, roleKey],
            [roleKey, roleKey, roleKey],
            [roleKey, roleKey, roleKey]
        ]);
        setReelStates([false, false, false]);
        hasCheckedWinRef.current = false; // リセット
        console.log(`デバッグ: すべてのリールを ${roleKey} に設定しました`);
    }

    const handleToggle = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // すべてのリールが停止している場合は、すべて開始
        if (reelStates.every(state => !state)) {
            setReelStates([true, true, true]);
            // リール開始時にシンボルをリセット
            setSymbolGrid([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]);
            // チェック済みフラグをリセット（新しいスピンの開始）
            hasCheckedWinRef.current = false;
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
                <Reel 
                    running={reelStates[0]} 
                    reelIndex={0}
                    symbolChange={(keys) => {
                        setSymbolGrid(prev => [[keys[0], keys[1], keys[2]], prev[1], prev[2]]);
                    }} 
                />
                <Reel 
                    running={reelStates[1]} 
                    reelIndex={1}
                    symbolChange={(keys) => {
                        setSymbolGrid(prev => [prev[0], [keys[0], keys[1], keys[2]], prev[2]]);
                    }} 
                />
                <Reel 
                    running={reelStates[2]} 
                    reelIndex={2}
                    symbolChange={(keys) => {
                        setSymbolGrid(prev => [prev[0], prev[1], [keys[0], keys[1], keys[2]]]);
                    }} 
                />
            </div>
            <StartStop onStop={handleToggle} clickCount={clickCount} />
            <div className="mt-4">
                <p className="text-xl font-bold">ポイント: {points}</p>
            </div>
        </>
    );
}