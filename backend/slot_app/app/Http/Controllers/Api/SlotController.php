<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpinCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SlotController extends Controller
{
    /**
     * リール結果とベット額を受け取り、ペイアウトを計算して返す
     * POST /api/slot/spin
     *
     * @param Request $request
     * @param SpinCalculator $calculator 依存性注入（DI）で計算クラスを受け取る
     */
    public function spin(Request $request, SpinCalculator $calculator)
    {
        $validator = Validator::make($request->all(), [
            'bet_amount' => 'required|numeric|min:1',
            'reel_result' => 'required|array|size:3',
            'reel_result.*' => 'required|array|size:3',
            'reel_result.*.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $betAmount = $request->input('bet_amount');
        $reelResult = $request->input('reel_result');

        try {
            $payout = $calculator->calculatePayout($reelResult, $betAmount);
            return response()->json([
                'status' => 'success',
                'reel_result' => $reelResult,
                'bet_amount' => $betAmount,
                'win_amount' => $payout['win_amount'],
                'winning_lines' => $payout['winning_lines'], // 揃った時に演出出すならこれで判定してちょ
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Calculation failed: ' . $e->getMessage()], 500);
        }
    }
}
