<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estoque extends Model
{
    protected $table = "movimentacoes_estoque";
    protected $fillable = [
        "tenant_id",
        "produto_id",
        "lancamento_id",
        "tipo_movimento",
        "quantidade",
        "custo_unitario",
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
    public function lancamento()
    {
        return $this->belongsTo(Lancamento::class);
    }
}
