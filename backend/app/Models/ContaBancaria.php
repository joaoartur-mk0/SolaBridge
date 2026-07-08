<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContaBancaria extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "pluggy_item_id",
        "nome_instituicao",
        "mascara_conta",
        "status_sincronizacao",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
