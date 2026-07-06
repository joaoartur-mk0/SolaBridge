<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;

class Conta extends Model
{
    protected $fillable = ["tenant_id", "codigo", "nome", "tipo", "natureza"];
    public $timestamps = false;

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
