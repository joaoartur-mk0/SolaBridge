<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LancamentoController;
use App\Http\Controllers\RelatorioController;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

// Rota para gravar transações
Route::post("/lancamentos", [LancamentoController::class, "store"]);

// Rotas de Relatórios Matemáticos
Route::get("/relatorios/dre", [RelatorioController::class, "dre"]);
Route::get("/relatorios/balanco", [RelatorioController::class, "balanco"]);
Route::get("/relatorios/liquidez", [
    RelatorioController::class,
    "liquidezCorrente",
]);
Route::get("/relatorios/caixa-bancos", [
    RelatorioController::class,
    "saldoCaixaBancos",
]);
Route::get("/relatorios/razao/{contaId}", [
    RelatorioController::class,
    "razao",
]);
