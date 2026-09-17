# Módulo de Estoque — Plano de Implementação

> Documento de handoff. **Parte 1** é a spec do backend (João). **Parte 2** é o plano das telas do frontend (Sérgio).
> Base: com o back atual, entrada e saída de produtos **já funcionam** via `CompraService`/`VendaService` (movimentação + contabilização em partidas dobradas). O que falta é a camada de **cadastro e consulta** de estoque.

## Convenções da API (já existentes, seguir sempre)

- Envelope de resposta (`App\Traits\ApiResponse`):
  ```json
  { "success": true, "message": "...", "data": <payload> }
  ```
  O front (`apiClient.ts`) já desembrulha e devolve só `data`.
- Listagens usam o paginator do Laravel: `data`, `current_page`, `last_page`, `per_page`, `total`.
- Todas as rotas privadas ficam sob `Route::prefix("v1")->middleware("auth:sanctum")` em `routes/api.php`.
- `tenant_id` vem sempre de `auth()->user()->tenant_id` (nunca do request). Os models já têm `TenantScope` global.
- Autenticação: Bearer token (Sanctum). Sem CSRF.

---

# PARTE 1 — Backend (João)

## B1. Completar o CRUD de Produtos  ⭐ prioridade máxima

Hoje `ProdutoController` só tem `store`. Sem listar/editar/excluir produto, nenhuma tela de estoque funciona.

**Molde pronto no próprio projeto:** `ServicoController` + `ServicoService` já são um CRUD completo com `SoftDeletes`, paginação e `search`. Replicar o mesmo padrão para Produto.

### Tarefas
1. Adicionar `use SoftDeletes;` ao model `Produto` (e migration `->softDeletes()` em `produtos`, ou nova migration).
2. `ProdutoService`: adicionar `listarProdutos(?string $search)`, `buscarProduto(int $id)`, `atualizarProduto(int $id, array $dados)`, `apagarProduto(int $id)`.
3. `ProdutoController`: adicionar `index`, `show`, `update`, `destroy`.
4. Criar `UpdateProdutoRequest` (todos os campos `sometimes`, mesmas regras do `StoreProdutoRequest`).
5. Registrar rotas.

### Endpoints
| Método | Rota | Descrição | Retorno |
|---|---|---|---|
| GET | `/v1/produtos?search=` | Lista paginada de produtos do tenant | Paginator de Produto |
| GET | `/v1/produtos/{id}` | Detalha um produto | Produto |
| POST | `/v1/produtos` | ✅ já existe | `{ produto }` |
| PATCH | `/v1/produtos/{id}` | Atualiza produto | Produto |
| DELETE | `/v1/produtos/{id}` | Soft delete | 200 |

### Contrato do Produto (retorno)
```json
{
  "id": 1,
  "descricao": "Camiseta Branca P",
  "codigo_sku": "CAM-BR-P",
  "unidade": "UN",
  "preco_venda": "49.90",
  "custo_medio": "20.00",
  "ncm": "61091000", "cfop": "5102", "cest": null
}
```
Validação já definida em `StoreProdutoRequest`: `descricao` (req), `preco_venda` (req, ≥0), `custo_medio` (req, ≥0), `unidade` (req, in KG,UN,LT,ML,G,CX), `codigo_sku`/`cfop`/`ncm`/`cest` (nullable).

### Critérios de aceite
- [ ] `GET /produtos` retorna só produtos do tenant logado, paginado, com `?search` filtrando por `descricao`/`codigo_sku`.
- [ ] `PATCH`/`DELETE` respeitam o tenant (404 para produto de outro tenant).
- [ ] Produto excluído (soft delete) não aparece na listagem.

---

## B2. EstoqueService + consulta de saldo e kardex  ⭐ prioridade máxima

As movimentações (`movimentacoes_estoque`) são **gravadas** por compra/venda mas **nunca lidas em agregado**. Não existe "quanto tem em estoque". Este é o coração do módulo de consulta.

### Regra de saldo
Saldo atual de um produto = Σ quantidade de `ENTRADA` + `SALDO_INICIAL` (± `AJUSTE`) − Σ quantidade de `SAIDA`.

> Definir a convenção do `AJUSTE`: sugiro tratar `AJUSTE` como **entrada** (quantidade positiva soma) e criar um `AJUSTE` negativo como `SAIDA` com observação. Alinhar com Sérgio antes.

### Tarefas
1. Criar `App\Services\EstoqueService`:
   - `saldoPorProduto(int $tenant_id)` → lista de produtos com quantidade atual, custo médio e valor total em estoque.
   - `saldoDeProduto(int $produto_id)` → saldo de um produto + histórico (kardex) de movimentações ordenado por data.
2. Criar `App\Http\Controllers\EstoqueController` (`index`, `show`).
3. Registrar rotas.

### Endpoints
| Método | Rota | Descrição |
|---|---|---|
| GET | `/v1/estoque` | Saldo de todos os produtos (posição de estoque) |
| GET | `/v1/estoque/{produtoId}` | Saldo + kardex (histórico de movimentações) de um produto |

### Contrato — `GET /estoque` (posição)
```json
[
  {
    "produto_id": 1,
    "descricao": "Camiseta Branca P",
    "unidade": "UN",
    "quantidade_atual": "35.000",
    "custo_medio": "20.00",
    "valor_em_estoque": "700.00"
  }
]
```

### Contrato — `GET /estoque/{produtoId}` (kardex)
```json
{
  "produto": { "id": 1, "descricao": "...", "unidade": "UN", "custo_medio": "20.00" },
  "quantidade_atual": "35.000",
  "valor_em_estoque": "700.00",
  "movimentacoes": [
    {
      "id": 10, "tipo_movimento": "ENTRADA",
      "quantidade": "50.000", "custo_unitario": "20.00",
      "observacao": "Compra de fornecedor",
      "lancamento_id": 42, "created_at": "2026-07-20T10:00:00Z"
    }
  ]
}
```

### Critérios de aceite
- [ ] Saldo bate com a soma real das movimentações (entrada − saída) por tenant.
- [ ] `valor_em_estoque` = `quantidade_atual * custo_medio`.
- [ ] Kardex ordenado cronologicamente e escopado ao tenant.
- [ ] Produto sem movimentação retorna saldo 0 (não some da lista).

---

## B3. Corrigir custo médio ponderado  🐛 correção contábil

Em `CompraService::processarCompra`, hoje:
```php
$produto->update(["custo_medio" => $dados["custo_unitario"]]); // sobrescreve!
```
Isso **descarta** o custo médio anterior — o campo se chama `custo_medio` mas guarda o "último custo". Para um sistema contábil, o CMV da venda sai errado.

### Correção (média ponderada móvel)
Antes de criar a movimentação de entrada, calcular:
```
saldoQtd    = quantidade atual em estoque (via EstoqueService)
saldoValor  = saldoQtd * custo_medio_atual
novoValor   = saldoValor + (quantidade_comprada * custo_unitario_compra)
novaQtd     = saldoQtd + quantidade_comprada
novo_custo_medio = novaQtd > 0 ? (novoValor / novaQtd) : custo_unitario_compra
```
Persistir `novo_custo_medio` no produto. Idealmente extrair para `EstoqueService::recalcularCustoMedio(...)` e reusar.

### Critérios de aceite
- [ ] Duas compras do mesmo produto a custos diferentes resultam em custo médio ponderado correto.
- [ ] Venda subsequente usa o custo médio recalculado no CMV.
- [ ] Teste em `backend/tests` cobrindo o cálculo.

---

## B4. (Fase 2, opcional) Ajuste manual e saldo inicial

O enum já prevê `AJUSTE` e `SALDO_INICIAL`, mas nenhum fluxo os cria. Permite entrada/saída de estoque **sem** compra/venda financeira (inventário, perda, saldo de abertura).

- `POST /v1/estoque/ajuste` → cria `MovimentacaoEstoque` do tipo `AJUSTE`/`SALDO_INICIAL` (sem título financeiro; lançamento contábil de ajuste é decisão à parte).
- Request: `produto_id`, `tipo_movimento` (AJUSTE|SALDO_INICIAL), `quantidade`, `custo_unitario`, `observacao`.

Deixar para depois das telas básicas.

---

## Resumo das entregas do João
1. **B1** — CRUD de Produtos (index/show/update/destroy + rotas + UpdateProdutoRequest + SoftDeletes). *Molde: ServicoController.*
2. **B2** — EstoqueService + EstoqueController (`GET /estoque`, `GET /estoque/{id}`).
3. **B3** — custo médio ponderado no CompraService (+ teste).
4. **B4** — (opcional) ajuste/saldo inicial.

Endpoints de compra/venda (`POST /compras`, `POST /vendas`) **já existem e funcionam** — não precisam de mudança para o MVP.

---

# PARTE 2 — Frontend (Sérgio): plano das telas

Padrão a seguir (já consolidado no projeto): `services/<x>Service.ts` (mapeia snake_case do back → camelCase do front) → `types/<x>.ts` → `pages/<X>/<X>Page.tsx` → rota em `App.tsx` → item em `navigation.ts`. Molde ideal: **Serviços** (`servicesService.ts` + `ServicesPage.tsx`), que é CRUD completo contra o back.

### Novo grupo de navegação sugerido
```
Estoque
  ├─ Produtos          /produtos
  ├─ Posição de Estoque /estoque
  ├─ Registrar Compra  /compras/nova
  └─ Registrar Venda   /vendas/nova
```

### Ordem de execução (destrava incremental)

**Tela 1 — Produtos (CRUD)** — *depende de B1*
- `services/produtosService.ts`: `listProdutos`, `getProduto`, `createProduto`, `updateProduto`, `deleteProduto` (espelhar `servicesService.ts`).
- `types/produto.ts`: `Produto` (id, descricao, sku, unidade, precoVenda, custoMedio, ncm/cfop/cest).
- `pages/Produtos/ProdutosPage.tsx`: tabela + formulário (molde `ServicesPage`), `<Select>` de unidade (KG/UN/LT/ML/G/CX).
- Rota `/produtos` + item de menu.
- ✅ Já dá pra construir o service/tipos/tela agora; só a integração real espera B1 (enquanto isso, mock opcional).

**Tela 2 — Registrar Compra (entrada)** — *back já pronto (`POST /compras`)*
- `services/comprasService.ts`: `createCompra` → `POST /compras` com `{ supplier_id, produto_id, quantidade, custo_unitario, forma_pagamento (A_VISTA|PRAZO), data_compra }`.
- Precisa dos selects de **Fornecedor** (`GET /suppliers` já existe) e **Produto** (`GET /produtos` após B1).
- `pages/Compras/CompraFormPage.tsx`: formulário simples de 1 produto por compra (o back processa 1 item por chamada).
- Esta tela **pode ser feita já** — o endpoint existe; só o select de produto depende de B1.

**Tela 3 — Registrar Venda (saída)** — *back já pronto (`POST /vendas`)*
- `services/vendasService.ts`: `createVenda` → `POST /vendas` com `{ produto_id, customer_id, quantidade, valor_total, forma_pagamento, data_venda }`.
- Selects de **Cliente** (`GET /customers` já existe) e **Produto** (B1).
- `pages/Vendas/VendaFormPage.tsx`.
- Também dá pra fazer já.

**Tela 4 — Posição de Estoque + Kardex** — *depende de B2*
- `services/estoqueService.ts`: `getPosicaoEstoque` (`GET /estoque`), `getKardex(produtoId)` (`GET /estoque/{id}`).
- `pages/Estoque/EstoquePage.tsx`: tabela de saldo (produto, qtd atual, custo médio, valor em estoque). Clicar num produto abre o kardex (histórico).
- É a tela que "fecha" o módulo — construir por último.

### O que já dá para começar HOJE, sem esperar o João
- Estrutura de `produtosService` + `types/produto` + `ProdutosPage` (com dados mock, trocando para real quando B1 chegar).
- `comprasService`/`vendasService` + telas de registro — os endpoints `POST /compras` e `POST /vendas` **já respondem**; usam `/suppliers` e `/customers` que também já existem. O único bloqueio é o select de produtos (B1).

### Sugestão de sincronização
1. João entrega **B1** → destrava Produtos + os selects de Compra/Venda de ponta a ponta.
2. Em paralelo, Sérgio adianta as telas de Compra/Venda (back já pronto) e a de Produtos com mock.
3. João entrega **B2** → Sérgio faz a tela de Posição/Kardex.
4. **B3** (custo médio) roda em paralelo, sem bloquear front.
