<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Spin extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bet_amount',
        'win_amount',
        'net_payout',
        'reel_result',
        'is_jackpot',
        'played_at',
    ];

    function user(){
        return $this->belongsTo(User::class);
    }

    function reelResults(){
        return $this->hasMany(SpinReelResult::class);
    }
}
