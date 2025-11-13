<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function me(Request $request){
        $authUser = $request->user();
        $snsUser = null;

        // SNS連携済みの場合のみSNS APIを呼び出す
        if ($authUser->sns_id) {
            try {
                $response = Http::get(config('services.dealer.api_url') . "/api/account/show/{$authUser->sns_id}");
                if ($response->successful() && isset($response['data']['user'])) {
                    $snsUser = $response['data']['user'];
                }
            } catch (\Exception $e) {
                // SNS API呼び出しエラーは無視してゲスト情報を返す
                \Log::error('SNS API error: ' . $e->getMessage());
            }
        }

        return response()->json([
            'user_id' => $authUser->id,
            'sns_id' => $authUser->sns_id,
            'point' => $authUser->point,
            'name' => $snsUser ? $snsUser['name'] : "ゲスト{$authUser->id}",
            'user_icon' => $snsUser ? $snsUser['user_icon'] : null,
            'is_parent' => $authUser->id === 1,
        ]);
    }

    public function point_update(Request $request){
        $authUser = request()->user();
        $winAmount = $request->input('win_amount');

        if($authUser->sns_id){
            $authUser->point += $winAmount;
            $url = config('services.dealer.api_url') . "/api/account/wallet/update/{$authUser->sns_id}?" . http_build_query([
                'point' => $authUser->point,
                'service_name' => 'スロット',
                'description' => 'ポイント更新',
                'type' => 'get'
            ]);
            Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.dealer.token')
            ])->patch($url);
        }

        $authUser->update([
            'sns_id' =>null;
        ]);
        return response()->noContent();
    }
}
