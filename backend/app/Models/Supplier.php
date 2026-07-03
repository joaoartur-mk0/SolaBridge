<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class Supplier extends Model
{
    protected $table = "suppliers";
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
        return $this->belongsTo(Tenant::class, "tenants_id");
    }
    public function titulos()
    {
        return $this->hasMany(TitulosFinanceiros::class);
    }
    public function lancamento()
    {
        return $this->hasMany(Lancamento::class);
    }
}
