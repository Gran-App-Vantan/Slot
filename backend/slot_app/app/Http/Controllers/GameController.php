<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GameController extends Controller
{
    //
        public function createUrl(Request $request)
    {
        $authUser = request()->user();
        $url = config('services.dealer.api_url') . "/api/game/create-url?" . http_build_query([
            'device_number' => $authUser->id,
            'game_type' => "IndianPoker",
        ]);
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.dealer.token')
        ])->post($url)['data'];
        return response()->json([
            'success' => true,
            'message' => 'トークンの生成に成功しました',
            'data' => [
                'token' => $response['token'],
                'game_type' => $response['game_type'],
            ]
        ]);
    }
}
