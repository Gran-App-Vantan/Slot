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

        if(!$authUser) {
            return response()->json([
                'success' => false,
                'message' => 'ユーザーが存在しません。',
            ]);
        }

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
            'point' => $authUser->point,
        ]);
        return response()->noContent();
    }

    public function exit(){
        $authUser = request()->user();

        $authUser->update([
            'sns_id' =>null,
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

    public function createUrl(Request $request)
    {
        try {
            $authUser = request()->user();
            
            // 認証チェック
            if (!$authUser) {
                \Log::error('createUrl: 認証ユーザーが存在しません');
                return response()->json([
                    'success' => false,
                    'message' => '認証が必要です',
                ], 401);
            }

            // 設定値の確認
            $apiUrl = config('services.dealer.api_url');
            $token = config('services.dealer.token');
            
            \Log::info('createUrl: リクエスト開始', [
                'user_id' => $authUser->id,
                'api_url' => $apiUrl,
                'token_exists' => !empty($token),
            ]);

            if (!$apiUrl || !$token) {
                \Log::error('createUrl: 設定値が不足しています', [
                    'api_url' => $apiUrl,
                    'token_exists' => !empty($token),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'サーバー設定エラー',
                ], 500);
            }

            $url = rtrim($apiUrl, '/') . "/api/game/create-url?" . http_build_query([
                'device_number' => $authUser->id,
                'game_type' => "Slot",
            ]);

            \Log::info('createUrl: 外部API呼び出し', [
                'url' => $url,
                'token_exists' => !empty($token),
                'token_length' => $token ? strlen($token) : 0,
            ]);

            $response = Http::withoutRedirecting()
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($url, [ // リクエストボディを追加
                    'device_number' => $authUser->id,
                    'game_type' => 'Slot',
                ]);

            // レスポンスの確認
            if (!$response->successful()) {
                $errorBody = $response->body();
                $errorJson = $response->json();
                
                \Log::error('createUrl: 外部API呼び出し失敗', [
                    'status' => $response->status(),
                    'body' => $errorBody,
                    'json' => $errorJson,
                    'headers' => $response->headers(),
                    'url' => $url,
                    'request_params' => [
                        'device_number' => $authUser->id,
                        'game_type' => 'Slot',
                    ],
                ]);
                
                // リダイレクトエラーの場合
                if ($response->status() >= 300 && $response->status() < 400) {
                    \Log::error('createUrl: リダイレクトが発生しました', [
                        'location' => $response->header('Location'),
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => '外部APIのURLが正しくありません',
                        'error' => 'リダイレクトが発生しました',
                    ], 500);
                }
                
                // 500エラーの場合、より詳細な情報を返す
                return response()->json([
                    'success' => false,
                    'message' => 'トークン生成に失敗しました',
                    'error' => $errorJson ?? $errorBody,
                    'status' => $response->status(),
                    'external_api_error' => true, // 外部APIのエラーであることを示す
                ], 500);
            }

            $responseData = $response->json();
            
            if (!isset($responseData['data'])) {
                \Log::error('createUrl: レスポンス形式が不正', [
                    'response' => $responseData,
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'レスポンス形式が不正です',
                ], 500);
            }

            \Log::info('createUrl: 成功', [
                'user_id' => $authUser->id,
                'token' => $responseData['data']['token'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'トークンの生成に成功しました',
                'data' => [
                    'token' => $responseData['data']['token'],
                    'game_type' => $responseData['data']['game_type'],
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('createUrl: 例外発生', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'サーバーエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}