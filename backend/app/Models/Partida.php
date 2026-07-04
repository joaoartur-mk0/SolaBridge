<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partida extends Model
{
    protected $table = "partition";
    public $timestamps = false;
    protected $fillable = [
        "lancamento_id",
        "conta_id",
        "produto_id",
        "servico_id",
        "valor",
        "natureza",
    ];

    public function conta()
    {
        return $this->belongsTo(Conta::class, "conta_id");
    }

    public function lancamento()
    {
        return $this->belongsTo(Lancamento::class, "lancamento_id");
    }
}
