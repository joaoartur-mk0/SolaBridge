<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LancamentoController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\VendaController;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::prefix("v1")->group(function () {
    # Cadastros
    Route::post("/tenants", [TenantController::class, "store"]);
    Route::post("/users", [UserController::class, "store"]);
    Route::post("/customers", [CustomerController::class, "store"]);
    Route::post("/suppliers", [SupplierController::class, "store"]); // Assumindo que clonaste o Customer para Supplier

    # Processamentos
    Route::post("/compras", [CompraController::class, "store"]);
    Route::post("/vendas", [VendaController::class, "store"]);
    Route::post("/lancamentos", [LancamentoController::class, "store"]);

    # Relatórios
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
});
