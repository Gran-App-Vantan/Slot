<?php

namespace App\Services;

class SpinCalculator
{
    // 各役の配当倍率
    // 倍率の設定は決まり次第変更、役に関しても同様
    // '役名' => [揃った数 => 倍率]
    private const PAYTABLE = [
        '' => [3 => 10], 
        ''   => [3 => 5],
        ''=> [2 => 2, 3 => 8],
        ''  => [3 => 20],
        ''     => [3 => 2],
        ''     => [3 => 1],
    ];

    // 3x3のリール
    private const PAYLINES = [
        // ライン1: 中央一直線
        [[0, 1], [1, 1], [2, 1]], 
        // ライン2: 上一直線
        [[0, 0], [1, 0], [2, 0]], 
        // ライン3: 下一直線
        [[0, 2], [1, 2], [2, 2]], 
        // ライン4: V字 (上の角からスタート)
        [[0, 0], [1, 1], [2, 2]], 
        // ライン5: 逆V字 (下の角からスタート)
        [[0, 2], [1, 1], [2, 0]],
    ];

    // WILDシンボル（他のシンボルの代わりになる）
    private const WILD_SYMBOL = 'WILD';

    /**
     * リール結果に基づいてペイアウトを計算する
     *
     * @param array $reelResult リール結果 (例: [[R1S1, R1S2, R1S3], [R2S1, R2S2, R2S3], ...])
     * @param float $betAmount ベット金額
     * @return array [win_amount, winning_lines]
     */
    public function calculatePayout(array $reelResult, float $betAmount): array
    {
        $totalWin = 0.0;
        $winningLines = [];
        $numReels = count($reelResult);

        // 各ペイラインをチェック
        foreach (self::PAYLINES as $lineIndex => $lineCoordinates) {
            $lineSymbols = [];
            
            // ペイライン上のシンボルを抽出
            foreach ($lineCoordinates as $reelIndex => [$rowIndex, $colIndex]) {
                // リール数がPAYLINESの設定に満たない場合はスキップ（3リール設定なので、3以上は実行されない）
                if ($reelIndex >= $numReels) {
                    break;
                }
                
                // $reelResult[リールインデックス][行インデックス] のシンボルを取得
                // NOTE: リール結果の配列構造が [リールインデックス][行インデックス] であることを前提とする
                $lineSymbols[] = $reelResult[$reelIndex][$rowIndex];
            }

            // 勝利判定
            $result = $this->checkLineForWin($lineSymbols);

            if ($result['count'] >= 2) { // 最低2個以上揃った場合（CHERRYなど最低配当のシンボルを想定）
                $symbol = $result['symbol'];
                $matchCount = $result['count'];
                
                // 配当表から倍率を取得
                if (isset(self::PAYTABLE[$symbol][$matchCount])) {
                    $multiplier = self::PAYTABLE[$symbol][$matchCount];
                    $lineWin = $betAmount * $multiplier;
                    $totalWin += $lineWin;

                    $winningLines[] = [
                        'line_index' => $lineIndex + 1,
                        'symbol' => $symbol,
                        'matched_count' => $matchCount,
                        'multiplier' => $multiplier,
                        'win_amount' => $lineWin,
                    ];
                }
            }
        }

        return [
            'win_amount' => round($totalWin, 2), // 小数点以下2桁に丸める
            'winning_lines' => $winningLines,
        ];
    }

    /**
     * ペイライン上のシンボル配列をチェックし、勝利シンボルと揃った数を返す
     *
     * @param array $symbols ペイライン上のシンボル配列
     * @return array ['symbol' => string, 'count' => int]
     */
    private function checkLineForWin(array $symbols): array
    {
        if (empty($symbols)) {
            return ['symbol' => null, 'count' => 0];
        }

        $matchCount = 0;
        $winningSymbol = null;
        $nonWilds = [];
        
        // 最初の非WILDシンボルを探す (これがプライマリな勝利シンボルとなる)
        foreach ($symbols as $symbol) {
            if ($symbol !== self::WILD_SYMBOL) {
                $nonWilds[] = $symbol;
            }
        }
        
        // 勝利シンボルを決定 (配列の最初のシンボル、またはWILDしかない場合はWILD)
        $primarySymbol = $nonWilds[0] ?? self::WILD_SYMBOL;
        
        // 左から順に一致するシンボルを数える
        foreach ($symbols as $symbol) {
            // WILDはどのシンボルとしてもカウントする
            if ($symbol === $primarySymbol || $symbol === self::WILD_SYMBOL) {
                $matchCount++;
            } else {
                // 一致が途切れた時点でカウント終了
                break;
            }
        }

        // 勝利判定の基準となるのは、WILDが置換した後のシンボル
        return [
            'symbol' => $primarySymbol,
            'count' => $matchCount,
        ];
    }
}
