'use client';

interface WinCheckerProps {
    symbolGrid: [[string | null, string | null, string | null], [string | null, string | null, string | null], [string | null, string | null, string | null]];
    rolePayouts: Record<string, number>;
    bet: number;
    HORIZONTAL_MULTIPLIER: number;
    DIAGONAL_MULTIPLIER: number;
    onWin: (winPoints: number) => void;
    onResult?: (result: { type: string; role: string; payout: number }) => void;
}

export function checkWin({
    symbolGrid,
    rolePayouts,
    bet,
    HORIZONTAL_MULTIPLIER,
    DIAGONAL_MULTIPLIER,
    onWin,
    onResult
}: WinCheckerProps) {
    const [reel0, reel1, reel2] = symbolGrid;
    const [top0, center0, bottom0] = reel0;
    const [top1, center1, bottom1] = reel1;
    const [top2, center2, bottom2] = reel2;

    // デバッグログ
    console.log('checkWin called with:', {
        symbolGrid,
        bet,
        top0, top1, top2,
        center0, center1, center2,
        bottom0, bottom1, bottom2
    });

    if (!top0 || !center0 || !bottom0 || !top1 || !center1 || !bottom1 || !top2 || !center2 || !bottom2) {
        console.log('Some symbols are null, returning early');
        return;
    }

    let winPoints = 0;
    const currentBet = bet + 100;
    const betMultiplier = currentBet / 100;
    let resultType = 'ハズレ';
    let resultRole = '';
    let resultPayout = 0;

    console.log('Calculating with:', { currentBet, betMultiplier });

    // 横ラインのチェック（上、中央、下）
    // 上段
    if (top0 === top1 && top1 === top2) {
        const basePayout = rolePayouts[top0] || 0;
        const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        resultType = '上段';
        resultRole = top0;
        resultPayout = payout;
    }
    // 中央段
    else if (center0 === center1 && center1 === center2) {
        const basePayout = rolePayouts[center0] || 0;
        const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        resultType = '中央段';
        resultRole = center0;
        resultPayout = payout;
    }
    // 下段
    else if (bottom0 === bottom1 && bottom1 === bottom2) {
        const basePayout = rolePayouts[bottom0] || 0;
        const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        resultType = '下段';
        resultRole = bottom0;
        resultPayout = payout;
    }
    // 斜めラインのチェック
    // 左上→右下（上段左、中央段中央、下段右）
    else if (top0 === center1 && center1 === bottom2) {
        const basePayout = rolePayouts[top0] || 0;
        const payout = Math.floor(basePayout * DIAGONAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        resultType = '左上→右下';
        resultRole = top0;
        resultPayout = payout;
    }
    // 右上→左下（上段右、中央段中央、下段左）
    else if (top2 === center1 && center1 === bottom0) {
        const basePayout = rolePayouts[top2] || 0;
        const payout = Math.floor(basePayout * DIAGONAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        resultType = '右上→左下';
        resultRole = top2;
        resultPayout = payout;
    }

    console.log('Final result:', { resultType, resultRole, resultPayout, winPoints });

    // 結果をコールバックで返す（ハズレも含めて全て記録）
    if (onResult) {
        onResult({
            type: resultType,
            role: resultRole || 'none', // ハズレの場合は'none'を設定
            payout: resultPayout
        });
    }

    if (winPoints > 0) {
        onWin(winPoints);;
    }
}
