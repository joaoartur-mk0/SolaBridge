<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class Partida extends Model
{
    protected $table = "partition";
    public $timestamps = false;
    protected $fillable = [
        "tenant_id",
        "lancamento_id",
        "conta_id",
        "produto_id",
        "servico_id",
        "valor",
        "natureza",
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, "tenant_id");
    }

    public function conta()
    {
        return $this->belongsTo(Conta::class, "conta_id");
    }

    public function lancamento()
    {
        return $this->belongsTo(Lancamento::class, "lancamento_id");
    }
}
