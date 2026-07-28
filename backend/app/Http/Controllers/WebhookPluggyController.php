<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebhookPluggyController extends Controller
{
    public function vincular(Request $request)
    {
        $validated = $request->validate([
            "pluggy_item_id" => "required|string|max:255",
        ]);

        try {
            $conta = ContaBancaria::create([
                "user_id" => auth()->id(),
                "pluggy_item_id" => $validated["pluggy_item_id"],
                "status_sicronizacao" => "pendente",
            ]);

            return response()->json(
                [
                    "message" =>
                        "Conexão bancária salva com sucesso. Sincronização iniciada.",
                    "conta" => $conta,
                ],
                201,
            );
        } catch (\Exception $e) {
            Log::error("Erro ao salvar conexão da Pluggy", [
                "erro" => $e->getMessage(),
            ]);
            return response()->json(
                ["error" => "Falha interna ao vincular banco."],
                500,
            );
        }
    }
}
