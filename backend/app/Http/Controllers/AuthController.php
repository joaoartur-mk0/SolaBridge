<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Credenciais inválidas. Verifique o seu e-mail e password.",
                ],
                401,
            );
        }
        $token = $user->createToken("app_token")->plainTextToken;

        return response()->json(
            [
                "success" => true,
                "message" => "Login efetuado com sucesso.",
                "token" => $token,
                "user" => [
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role,
                    "tenant_id" => $user->tenant_id,
                ],
            ],
            200,
        );
    }
}
