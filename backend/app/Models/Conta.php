<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conta extends Model
{
    protected $fillable = ["tenants_id", "codigo", "nome", "tipo", "natureza"];
    public $timestamps = false;
    protected $fillable = ["codigo", "nome", "tipo", "natureza"];

    protected static function booted()
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function partidas()
    {
        return $this->hasMany(Partida::class);
    }
}
