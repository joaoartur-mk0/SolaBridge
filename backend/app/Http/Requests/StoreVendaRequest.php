<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class VendaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SolaBridge - Painel de Testes API</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            .nav-btn.active { background-color: #4f46e5; color: white; }
        </style>
    </head>
    <body class="bg-gray-100 font-sans text-gray-800 h-screen flex overflow-hidden">

        <!-- MENU LATERAL (SIDEBAR) -->
        <div class="w-64 bg-white shadow-lg flex flex-col">
            <div class="p-6 border-b">
                <h1 class="text-2xl font-bold text-indigo-600">SolaBridge</h1>
                <p class="text-xs text-gray-500">API Tester Environment</p>
                <div id="auth-status" class="mt-3 text-xs font-bold text-red-600 bg-red-100 p-2 rounded text-center">
                    Não Autenticado
                </div>
            </div>
            <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                <button onclick="openTab('login')" id="btn-login" class="nav-btn active w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">🔑 1. Autenticação</button>
                <button onclick="openTab('tenant')" id="btn-tenant" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">🏢 2. Tenant (Empresa)</button>
                <button onclick="openTab('user')" id="btn-user" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">👤 3. Usuários</button>
                <button onclick="openTab('customer')" id="btn-customer" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">🤝 4. Clientes</button>
                <button onclick="openTab('supplier')" id="btn-supplier" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">🏭 5. Fornecedores</button>
                <button onclick="openTab('compra')" id="btn-compra" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">🛒 6. Compras</button>
                <button onclick="openTab('venda')" id="btn-venda" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">💰 7. Vendas</button>
                <button onclick="openTab('lancamento')" id="btn-lancamento" class="nav-btn w-full text-left p-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition">📚 8. Lançamento Contábil</button>
            </nav>
        </div>

        <!-- ÁREA PRINCIPAL -->
        <div class="flex-1 flex flex-col h-full bg-gray-50">

            <!-- Formulários (Rolagem) -->
            <div class="flex-1 overflow-y-auto p-8">
                <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                    <!-- TAB: LOGIN -->
                    <div id="tab-login" class="tab-content active">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Login (Sanctum)</h2>
                        <div class="space-y-4">
                            <div><label class="block text-sm">E-mail</label><input type="email" id="login_email" value="joao@empresa.com" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Senha</label><input type="password" id="login_password" value="password123" class="w-full p-2 border rounded"></div>
                            <button onclick="fazerLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded">Fazer Login & Guardar Token</button>
                        </div>
                    </div>

                    <!-- TAB: TENANT -->
                    <div id="tab-tenant" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registrar Empresa (Pública)</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm">Tipo Pessoa</label><select id="t_tipo" class="w-full p-2 border rounded"><option value="PJ">PJ</option><option value="PF">PF</option></select></div>
                            <div><label class="block text-sm">Documento</label><input type="text" id="t_doc" value="12345678000199" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><label class="block text-sm">Nome da Empresa</label><input type="text" id="t_nome" value="Nova Empresa Teste" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">E-mail Empresa</label><input type="email" id="t_email" value="contato@teste.com" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Telefone</label><input type="text" id="t_tel" value="11999999999" class="w-full p-2 border rounded"></div>
                            <!-- Campos do Admin Necessários para a lógica do Service que fizemos -->
                            <div class="col-span-2 mt-4 pt-4 border-t"><h3 class="font-bold">Dados do Admin</h3></div>
                            <div><label class="block text-sm">Nome Admin</label><input type="text" id="t_admin_nome" value="Admin Teste" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">E-mail Admin</label><input type="email" id="t_admin_email" value="admin2@teste.com" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><label class="block text-sm">Senha Admin</label><input type="password" id="t_admin_pass" value="password123" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><button onclick="enviarRequest('POST', '/tenants', getTenantPayload())" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Salvar Empresa</button></div>
                        </div>
                    </div>

                    <!-- TAB: USER -->
                    <div id="tab-user" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Novo Usuário da Empresa</h2>
                        <div class="space-y-4">
                            <div><label class="block text-sm">Nome</label><input type="text" id="u_nome" value="Maria Contador" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">E-mail</label><input type="email" id="u_email" value="maria@empresa.com" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Senha</label><input type="password" id="u_pass" value="senhaForte1" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Role</label><select id="u_role" class="w-full p-2 border rounded"><option value="admin">Admin</option><option value="contador" selected>Contador</option><option value="operador">Operador</option></select></div>
                            <button onclick="enviarRequest('POST', '/users', getUserPayload())" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Salvar Usuário</button>
                        </div>
                    </div>

                    <!-- TAB: CUSTOMER -->
                    <div id="tab-customer" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Novo Cliente</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm">Tipo Pessoa</label><select id="c_tipo" class="w-full p-2 border rounded"><option value="PJ">PJ</option><option value="PF">PF</option></select></div>
                            <div><label class="block text-sm">Documento</label><input type="text" id="c_doc" value="99888777000166" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><label class="block text-sm">Nome</label><input type="text" id="c_nome" value="Cliente Alpha LTDA" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">E-mail</label><input type="email" id="c_email" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Telefone</label><input type="text" id="c_tel" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><button onclick="enviarRequest('POST', '/customers', getCustomerPayload('c_'))" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Salvar Cliente</button></div>
                        </div>
                    </div>

                    <!-- TAB: SUPPLIER -->
                    <div id="tab-supplier" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Novo Fornecedor</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm">Tipo Pessoa</label><select id="s_tipo" class="w-full p-2 border rounded"><option value="PJ">PJ</option><option value="PF">PF</option></select></div>
                            <div><label class="block text-sm">Documento</label><input type="text" id="s_doc" value="11222333000144" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><label class="block text-sm">Nome</label><input type="text" id="s_nome" value="Distribuidora Omega" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">E-mail</label><input type="email" id="s_email" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Telefone</label><input type="text" id="s_tel" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><button onclick="enviarRequest('POST', '/suppliers', getCustomerPayload('s_'))" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Salvar Fornecedor</button></div>
                        </div>
                    </div>

                    <!-- TAB: COMPRA -->
                    <div id="tab-compra" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registrar Compra</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm">ID Fornecedor</label><input type="number" id="cp_supplier" value="1" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">ID Produto</label><input type="number" id="cp_prod" value="1" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Quantidade</label><input type="number" step="0.01" id="cp_qtd" value="10" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Custo Unitário (R$)</label><input type="number" step="0.01" id="cp_custo" value="50.00" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Forma Pagamento</label><select id="cp_forma" class="w-full p-2 border rounded"><option value="A_VISTA">À Vista</option><option value="PRAZO">A Prazo</option></select></div>
                            <div><label class="block text-sm">Data</label><input type="date" id="cp_data" value="2026-07-01" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><button onclick="enviarRequest('POST', '/compras', getCompraPayload())" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Processar Compra</button></div>
                        </div>
                    </div>

                    <!-- TAB: VENDA -->
                    <div id="tab-venda" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registrar Venda</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm">ID Cliente</label><input type="number" id="v_customer" value="1" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">ID Produto</label><input type="number" id="v_prod" value="1" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Quantidade</label><input type="number" step="0.01" id="v_qtd" value="2" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Valor Total (R$)</label><input type="number" step="0.01" id="v_total" value="200.00" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Forma Pagamento</label><select id="v_forma" class="w-full p-2 border rounded"><option value="A_VISTA">À Vista</option><option value="PRAZO">A Prazo</option></select></div>
                            <div><label class="block text-sm">Data</label><input type="date" id="v_data" value="2026-07-01" class="w-full p-2 border rounded"></div>
                            <div class="col-span-2"><button onclick="enviarRequest('POST', '/vendas', getVendaPayload())" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Processar Venda</button></div>
                        </div>
                    </div>

                    <!-- TAB: LANCAMENTO -->
                    <div id="tab-lancamento" class="tab-content">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Lançamento Contábil Manual</h2>
                        <div class="space-y-4">
                            <div><label class="block text-sm">Descrição</label><input type="text" id="l_desc" value="Ajuste contábil manual" class="w-full p-2 border rounded"></div>
                            <div><label class="block text-sm">Data</label><input type="date" id="l_data" value="2026-07-01" class="w-full p-2 border rounded"></div>

                            <div class="grid grid-cols-3 gap-4 border p-4 bg-gray-50 rounded">
                                <div class="col-span-3 font-bold text-sm">Partida 1 (Débito)</div>
                                <div><label class="text-xs">ID Conta</label><input type="number" id="l_c1" value="1" class="w-full p-1 border rounded"></div>
                                <div><label class="text-xs">Valor</label><input type="number" id="l_v1" value="150.00" class="w-full p-1 border rounded"></div>
                                <div><label class="text-xs">Natureza</label><select id="l_n1" class="w-full p-1 border rounded"><option value="D">D (Débito)</option></select></div>
                            </div>

                            <div class="grid grid-cols-3 gap-4 border p-4 bg-gray-50 rounded">
                                <div class="col-span-3 font-bold text-sm">Partida 2 (Crédito)</div>
                                <div><label class="text-xs">ID Conta</label><input type="number" id="l_c2" value="2" class="w-full p-1 border rounded"></div>
                                <div><label class="text-xs">Valor</label><input type="number" id="l_v2" value="150.00" class="w-full p-1 border rounded"></div>
                                <div><label class="text-xs">Natureza</label><select id="l_n2" class="w-full p-1 border rounded"><option value="C">C (Crédito)</option></select></div>
                            </div>

                            <button onclick="enviarRequest('POST', '/lancamentos', getLancamentoPayload())" class="w-full bg-blue-600 text-white font-bold py-2 rounded">Gravar Lançamento</button>
                        </div>
                    </div>

                </div>
            </div>

            <!-- CONSOLE DE SAÍDA (Fixo em baixo) -->
            <div class="h-64 bg-gray-900 border-t-4 border-indigo-500 flex flex-col">
                <div class="bg-gray-800 text-gray-400 text-xs p-2 flex justify-between">
                    <span>Console da API (Resposta do Servidor)</span>
                    <button onclick="document.getElementById('api-console').innerText = '// Aguardando...'" class="hover:text-white">Limpar</button>
                </div>
                <div class="p-4 flex-1 overflow-y-auto">
                    <pre id="api-console" class="text-green-400 text-sm font-mono whitespace-pre-wrap">// Aguardando requisição...</pre>
                </div>
            </div>
        </div>

        <script>
            const API_URL = 'http://127.0.0.1:8000/api/v1';
            let authToken = null;

            // --- SISTEMA DE ABAS ---
            function openTab(tabId) {
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
                document.getElementById('tab-' + tabId).classList.add('active');
                document.getElementById('btn-' + tabId).classList.add('active');
            }

            // --- LOG DE CONSOLE ---
            function logConsole(data, isError = false) {
                const consoleEl = document.getElementById('api-console');
                consoleEl.innerText = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
                consoleEl.className = `text-sm font-mono whitespace-pre-wrap ${isError ? 'text-red-400' : 'text-green-400'}`;
            }

            // --- LOGIN SANCTUM ---
            async function fazerLogin() {
                logConsole("A autenticar...");
                const payload = {
                    email: document.getElementById('login_email').value,
                    password: document.getElementById('login_password').value
                };

                try {
                    const response = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();
                    if (response.ok && data.token) {
                        authToken = data.token;
                        document.getElementById('auth-status').className = "mt-3 text-xs font-bold text-green-800 bg-green-100 p-2 rounded text-center";
                        document.getElementById('auth-status').innerText = `Autenticado: ${data.user.name}`;
                        logConsole(data);
                    } else {
                        logConsole(data, true);
                    }
                } catch (err) {
                    logConsole(`Erro fatal: ${err.message}`, true);
                }
            }

            // --- MOTOR DE REQUISIÇÕES GENÉRICO ---
            async function enviarRequest(method, endpoint, payload) {
                logConsole(`Enviando ${method} para ${endpoint}...`);

                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };

                // Injeta o Token se existir (Zero Trust em ação!)
                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                try {
                    const response = await fetch(`${API_URL}${endpoint}`, {
                        method: method,
                        headers: headers,
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();
                    logConsole(data, !response.ok);
                } catch (err) {
                    logConsole(`Erro de Rede (Verifique se o Laravel está rodando): ${err.message}`, true);
                }
            }

            // --- MONTADORES DE PAYLOAD (JSON) ---
            function getTenantPayload() {
                return {
                    tipo_pessoa: document.getElementById('t_tipo').value,
                    documento: document.getElementById('t_doc').value,
                    nome: document.getElementById('t_nome').value,
                    email: document.getElementById('t_email').value || undefined,
                    telefone: document.getElementById('t_tel').value || undefined,
                    admin_name: document.getElementById('t_admin_nome').value,
                    admin_email: document.getElementById('t_admin_email').value,
                    admin_password: document.getElementById('t_admin_pass').value
                };
            }

            function getUserPayload() {
                return {
                    name: document.getElementById('u_nome').value,
                    email: document.getElementById('u_email').value,
                    password: document.getElementById('u_pass').value,
                    role: document.getElementById('u_role').value
                };
            }

            function getCustomerPayload(prefix) { // Serve para Customer e Supplier
                return {
                    tipo_pessoa: document.getElementById(prefix + 'tipo').value,
                    documento: document.getElementById(prefix + 'doc').value,
                    nome: document.getElementById(prefix + 'nome').value,
                    email: document.getElementById(prefix + 'email').value || undefined,
                    telefone: document.getElementById(prefix + 'tel').value || undefined
                };
            }

            function getCompraPayload() {
                return {
                    supplier_id: parseInt(document.getElementById('cp_supplier').value),
                    produto_id: parseInt(document.getElementById('cp_prod').value),
                    quantidade: parseFloat(document.getElementById('cp_qtd').value),
                    custo_unitario: parseFloat(document.getElementById('cp_custo').value),
                    forma_pagamento: document.getElementById('cp_forma').value,
                    data_compra: document.getElementById('cp_data').value
                };
            }

            function getVendaPayload() {
                return {
                    customer_id: parseInt(document.getElementById('v_customer').value),
                    produto_id: parseInt(document.getElementById('v_prod').value),
                    quantidade: parseFloat(document.getElementById('v_qtd').value),
                    valor_total: parseFloat(document.getElementById('v_total').value),
                    forma_pagamento: document.getElementById('v_forma').value,
                    data_venda: document.getElementById('v_data').value
                };
            }

            function getLancamentoPayload() {
                return {
                    description: document.getElementById('l_desc').value,
                    date: document.getElementById('l_data').value,
                    partidas: [
                        {
                            conta_id: parseInt(document.getElementById('l_c1').value),
                            valor: parseFloat(document.getElementById('l_v1').value),
                            natureza: document.getElementById('l_n1').value
                        },
                        {
                            conta_id: parseInt(document.getElementById('l_c2').value),
                            valor: parseFloat(document.getElementById('l_v2').value),
                            natureza: document.getElementById('l_n2').value
                        }
                    ]
                };
            }
        </script>
    </body>
    </html>
    }

    public function messages(): array
    {
        return [
            "produto_id.exists" =>
                "O produto selecionado não está cadastrado no sistema!",
            "valor_total.min" => "O valor da venda deve ser maior que zero!",
            "customer_id.exists" =>
                "O cliente selecionado não está cadastrado no sustema!",
            "quantidade.min" =>
                "A quantidade do produto deve ser maior que zero!",
            "forma_pagamento.in" => "Forma de pagamento inválida!",
        ];
    }
}
