<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthEnterRequest;
use App\Http\Requests\LatchRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'ユーザーが存在しません。',
            ]);
        }

        Auth::login($user);
        return response()->json([
            'success' => true,
            'message' => 'ログインしました。',
            'authToken' => $user->createToken('authToken')->plainTextToken,
        ]);
    }


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

    public function latch_return(Request $request){
        $authUser = request()->user();
        return response()->json([
            'latch' => $authUser->latch,
            'success' => true,
        ]);
    }

    public function latch_update(LatchRequest $request){
        $authUser = request()->user();
        $latch = $authUser->latch;
        $latch += $request->input('latch');

        \Log::info('Latchが更新されました', [
            'user_id' => $authUser->id,
            'new_latch' => $latch,
        ]);

        $authUser->update([
            'latch' => $latch,
        ]);
        return response()->json([
            'latch' => $authUser->latch,
            'success' => true,
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
            'sns_id' =>null,
        ]);
        return response()->noContent();
    }

    public function exit(){
        $authUser = request()->user();

        $authUser->update([
            'is_playing' => false,
        ]);

        return response()->noContent();
    }

    public function enter(AuthEnterRequest $request)
    {
        \Log::info('enter メソッド呼び出し', [
            'user_id' => $request->user_id,
            'sns_id' => $request->sns_id,
            'point' => $request->point,
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            \Log::error('ユーザーが見つかりません', ['user_id' => $request->user_id]);
            return response()->json([
                'success' => false,
                'message' => 'ユーザーが見つかりません'
            ], 404);
        }

        // ゲストの場合はsns_idとpointは送られてこない
        $user->sns_id = $request->sns_id ?? null;
        $user->is_playing = true;
        if ($request->point) {
            $user->point = $request->point;
        }
        $user->save();

        \Log::info('ユーザー情報更新完了', [
            'user_id' => $user->id,
            'sns_id' => $user->sns_id,
            'point' => $user->point,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'アカウント接続が完了しました',
            'data' => [
                'user_id' => $user->id,
                'sns_id' => $user->sns_id,
                'point' => $user->point
            ]
        ]);
    }
}
