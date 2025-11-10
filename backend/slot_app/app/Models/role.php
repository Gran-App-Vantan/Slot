<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Model;

class role extends Model
{
    use HasFactory;

    protected $fillable = [
        'slot_id',
        'slot_role'
    ];

    function slot(){
        return $this->belongsTo(Slot::class);
    }
}
