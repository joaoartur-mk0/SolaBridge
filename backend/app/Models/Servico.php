<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class Servico extends Model
{
    protected $table = "servicos";
    protected $fillable = [
        "tenant_id",
        "nome",
        "valor_servico",
        "descricao",
        "codigo",
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, "tenant_id");
    }
}
