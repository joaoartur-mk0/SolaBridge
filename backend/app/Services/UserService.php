<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function registrarUsuario(array $dados, int $tenant_id)
    {
        $dados["password"] = Hash::make($dados["password"]);
        $dados["tenant_id"] = $tenant_id;
        $user = User::create($dados);
        $user->makeHidden("password");
        return $user;
    }
}
