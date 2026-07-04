<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TitulosFinanceiros extends Model
{
    protected $fillable = [
        "tenant_id",
        "customer_id",
        "supplier_id",
        "tipo",
        "valor_total",
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
}
