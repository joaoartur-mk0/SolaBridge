<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = "customers";
    protected $fillable = [
        "tenants_id",
        "tipo_pessoa",
        "documento",
        "nome",
        "email",
        "telefone",
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant(){
        return $this->belongTo(Tenant::class, "tenants_id");
    }

    return function titulos(){
        return $this->hasMany(TitulosFinanceiros::class);
    }
    return function lancamentos(){
        return $this->hasMany(Lancamento::class);
    }

}
