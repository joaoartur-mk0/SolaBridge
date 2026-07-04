<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lancamento extends Model
{
    protected $table = "lancamentos";
    public $timestamps = false;
    protected $fillable = [
        "tenant_id",
        "customer_id",
        "supplier_id",
        "titulo_id",
        "description",
        "date",
    ];

    public function partidas()
    {
        return $this->hasMany(Partida::class, "lancamento_id");
    }
    public function tenant()
    {
        return $this->belongsTo(Tenant::class, "tenant_id");
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class, "customer_id");
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, "supplier_id");
    }
}
