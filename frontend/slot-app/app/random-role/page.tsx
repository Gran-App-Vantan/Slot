'use client';

import { useEffect, useState, useRef } from "react";
import Reel from "@/components/reel";
import StartStop from "@/components/StartStop";
import Gambling from "@/components/gambling";
import { checkWin } from "@/components/winChecker";

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
    // BET額を管理
    const [bet, setBet] = useState(0);
    // この回のスピンで既にポイントを付与したかどうかを追跡
    const hasCheckedWinRef = useRef(false);

    const BetChange = () => {
        setBet(prevBet => prevBet + 100);
    }

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

    // BET額に応じた各ロールの配当を計算
    // BET額 - (ロール値 * 倍率)
    // 倍率 = BET額 / 100
    const calculatePayout = (roleKey: string) => {
        const roleValue = rolePayouts[roleKey] || 0;
        const currentBet = bet + 100; // clickBetと同じ値
        const multiplier = currentBet / 100; // BET倍率（100=1倍、200=2倍、300=3倍）
        return currentBet - (roleValue * multiplier);
    };

    // 横ラインの配当倍率
    const HORIZONTAL_MULTIPLIER = 1.0;
    // 斜めラインの配当倍率
    const DIAGONAL_MULTIPLIER = 1.5;

    const userWin = () => {
        checkWin({
            symbolGrid,
            rolePayouts,
            bet,
            HORIZONTAL_MULTIPLIER,
            DIAGONAL_MULTIPLIER,
            onWin: (winPoints) => {
                setPoints(prev => prev + winPoints);
            }
        });
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
            <Gambling bet={bet} onBetChange={BetChange}/>
        </>
    );
}