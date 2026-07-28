<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PluggyOpenFinanceController extends Controller
{
    public function getConnectToken(Request $request)
    {
        $clientId = env("PLUGGY_CLIENT_ID");
        $clientSecret = env("PLUGGY_CLIENT_SECRET");

        $authResponse = Http::post("https://api.pluggy.ai/auth", [
            "clientId" => $clientId,
            "clientSecret" => $clientSecret,
        ])
            ->throw()
            ->json();

        $apiKey = $authResponse["apiKey"];

        $connectTokenResponse = Http::withHeaders([
            "X-API-KEY" => $apiKey,
        ])
            ->post("https://api.pluggy.ai/connect_token", [
                "options" => [
                    clientUserId => (string) auth()->id(),
                ],
            ])
            ->throw()
            ->json();

        return response()->json([
            "accessToken" => $connectTokenResponse["accessToken"],
        ]);
    }
}
