'use client';

interface WinCheckerProps {
    symbolGrid: [[string | null, string | null, string | null], [string | null, string | null, string | null], [string | null, string | null, string | null]];
    rolePayouts: Record<string, number>;
    bet: number;
    HORIZONTAL_MULTIPLIER: number;
    DIAGONAL_MULTIPLIER: number;
    onWin: (winPoints: number) => void;
}

export function checkWin({
    symbolGrid,
    rolePayouts,
    bet,
    HORIZONTAL_MULTIPLIER,
    DIAGONAL_MULTIPLIER,
    onWin
}: WinCheckerProps) {
    const [reel0, reel1, reel2] = symbolGrid;
    const [top0, center0, bottom0] = reel0;
    const [top1, center1, bottom1] = reel1;
    const [top2, center2, bottom2] = reel2;

    if (!top0 || !center0 || !bottom0 || !top1 || !center1 || !bottom1 || !top2 || !center2 || !bottom2) {
        return;
    }

    let winPoints = 0;
    const currentBet = bet + 100; // 現在のBET額
    const betMultiplier = currentBet / 100; // BET倍率（100=1倍、200=2倍、300=3倍）

    // 横ラインのチェック（上、中央、下）
    // 上段
    if (top0 === top1 && top1 === top2) {
        const basePayout = rolePayouts[top0] || 0;
        const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        console.log(`上段が揃いました！ (${top0}): ${payout}ポイント`);
    }
    // 中央段
    if (center0 === center1 && center1 === center2) {
        const basePayout = rolePayouts[center0] || 0;
        const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        console.log(`中央段が揃いました！ (${center0}): ${payout}ポイント`);
    }
    // 下段
    if (bottom0 === bottom1 && bottom1 === bottom2) {
        const basePayout = rolePayouts[bottom0] || 0;
        const payout = Math.floor(basePayout * HORIZONTAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        console.log(`下段が揃いました！ (${bottom0}): ${payout}ポイント`);
    }

    // 斜めラインのチェック
    // 左上→右下（上段左、中央段中央、下段右）
    if (top0 === center1 && center1 === bottom2) {
        const basePayout = rolePayouts[top0] || 0;
        const payout = Math.floor(basePayout * DIAGONAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        console.log(`左上→右下の斜めが揃いました！ (${top0}): ${payout}ポイント`);
    }
    // 右上→左下（上段右、中央段中央、下段左）
    if (top2 === center1 && center1 === bottom0) {
        const basePayout = rolePayouts[top2] || 0;
        const payout = Math.floor(basePayout * DIAGONAL_MULTIPLIER * betMultiplier);
        winPoints += payout;
        console.log(`右上→左下の斜めが揃いました！ (${top2}): ${payout}ポイント`);
    }
    else {
        console.log('ハズレ');
    }

    if (winPoints > 0) {
        onWin(winPoints);
        console.log(`合計 ${winPoints}ポイント獲得！`);
        alert(`${winPoints}ポイント獲得！`);
    }
}
