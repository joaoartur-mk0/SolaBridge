<?php

namespace App\Http\Controllers;

use App\Services\ProdutoService;
use App\Http\Requests\StoreProdutoRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    use ApiResponse;

    protected $produtoService;

    public function __construct(ProdutoService $produtoService)
    {
        $this->produtoService = $produtoService;
    }

    public function store(StoreProdutoRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $produto = $this->produtoService->registrarProduto(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Produto registrado com sucesso!",
            $produto,
            201,
        );
    }
}
