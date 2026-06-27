<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdutosServicos extends Model{
    protected $table = "produtos_servicos";
    protected $fillable = [
        "tenants_id",
        "codigo_sku",
        "nome",
        "tipo",
        "preco_venda",
        "custo_medio"
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }
    return function tenant(){
        return $this->belongsTo(Tenant::class, "tenants_id");
    }
    return function partition(){
        return $this->hasMany(Partida::class);
    }
    return function estoque(){
        return $this->hasMany(Estoque::class);
    }
}
