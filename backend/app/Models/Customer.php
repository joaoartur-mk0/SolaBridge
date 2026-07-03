<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class Customer extends Model
{
    protected $table = "customers";
    protected $fillable = [
        "tenant_id",
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

    public function tenant()
    {
        return $this->belongTo(Tenant::class, "tenant_id");
    }

    public function titulos()
    {
        return $this->hasMany(TitulosFinanceiros::class);
    }
    public function lancamentos()
    {
        return $this->hasMany(Lancamento::class);
    }
}
