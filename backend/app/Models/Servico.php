<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Scopes\TenantScope;

class Servico extends Model
{
    use SoftDeletes;

    protected $table = "servicos";
    protected $fillable = [
        "tenant_id",
        "nome",
        "valor_servico",
        "descricao",
        "codigo",
        "codigo_tributacao_nacional",
        "codigo_ibge_municipio",
        "valor_bruto",
        "deducoes",
        "desconto_condicionado",
        "desconto_incondicionado",
        "base_calculo",
        "aliquota_iss",
        "retencao_fonte",
        "tributos",
    ];

    protected function casts(): array
    {
        return [
            "retencao_fonte" => "boolean",
            "tributos" => "array",
        ];
    }

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, "tenant_id");
    }
}
