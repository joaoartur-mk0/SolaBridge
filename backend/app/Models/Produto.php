<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model{
    protected $table = "produtos";
    protected $fillable = [
        "tenant_id",
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
        return $this->belongsTo(Tenant::class, "tenant_id");
    }
    return function partition(){
        return $this->hasMany(Partida::class);
    }
    return function estoque(){
        return $this->hasMany(Estoque::class);
    }
}
