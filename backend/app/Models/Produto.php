<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class Produto extends Model
{
    protected $table = "produtos";
    protected $fillable = [
        "tenant_id",
        "ncm",
        "cfop",
        "cest",
        "unidade",
        "codigo_sku",
        "descricao",
        "preco_venda",
        "custo_medio",
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }
    public function tenant()
    {
        return $this->belongsTo(Tenant::class, "tenant_id");
    }
    public function partition()
    {
        return $this->hasMany(Partida::class);
    }
    public function estoque()
    {
        return $this->hasMany(MovimentacaoEstoque::class);
    }
}
