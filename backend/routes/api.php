<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LancamentoController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\AuthController;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::prefix("v1")->group(function () {
    # Public
    ## Autenticação
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/tenants", [TenantController::class, "store"]);

    # Private
    Route::middleware("auth:sanctum")->group(function () {
        ## Cadastros
        Route::get("/customers", [CustomerController::class, "index"]);
        Route::post("/customers", [CustomerController::class, "store"]);
        Route::patch("/customers/{id}/status", [
            CustomerController::class,
            "updateStatus",
        ]);

        Route::get("/suppliers", [SupplierController::class, "index"]);
        Route::post("/suppliers", [SupplierController::class, "store"]);
        Route::patch("/suppliers/{id}/status", [
            SupplierController::class,
            "updateStatus",
        ]);

        Route::post("/produtos", [ProdutoController::class, "store"]);

        Route::get("/servicos", [ServicoController::class, "index"]);
        Route::post("/servicos", [ServicoController::class, "store"]);
        Route::patch("/servicos/{id}", [ServicoController::class, "update"]);
        Route::delete("/servicos/{id}", [ServicoController::class, "destroy"]);

        Route::post("/users", [UserController::class, "store"]);

        ## Processamentos
        Route::get("/compras", [CompraController::class, "index"]);
        Route::get("/compras/{id}", [CompraController::class, "show"]);
        Route::post("/compras", [CompraController::class, "store"]);
        Route::post("/compras/{id}/cancelar", [
            CompraController::class,
            "cancel",
        ]);
        Route::delete("/compras/{id}", [CompraController::class, "destroy"]);

        Route::get("/vendas", [VendaController::class, "index"]);
        Route::get("/vendas/{id}", [VendaController::class, "show"]);
        Route::post("/vendas", [VendaController::class, "store"]);
        Route::post("/vendas/{id}/cancelar", [
            VendaController::class,
            "cancel",
        ]);
        Route::delete("/vendas/{id}", [VendaController::class, "destroy"]);

        Route::get("/lancamentos", [LancamentoController::class, "index"]);
        Route::post("/lancamentos", [LancamentoController::class, "store"]);

        ## Relatórios
        Route::get("/relatorios/dre", [RelatorioController::class, "dre"]);
        Route::get("/relatorios/balanco", [
            RelatorioController::class,
            "balanco",
        ]);
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
});
