<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class TituloFinanceiro extends Model
{
    protected $table = "titulos_financeiros";
    protected $fillable = [
        "tenant_id",
        "customer_id",
        "supplier_id",
        "tipo",
        "descricao",
        "valor_total",
        "valor_pago",
        "juros",
        "data_vencimento",
        "status",
    ];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
    public function lancamentos()
    {
        return $this->hasMany(Lancamento::class, "titulo_id");
    }
}
