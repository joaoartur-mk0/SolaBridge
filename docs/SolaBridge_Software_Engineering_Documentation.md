# SolaBridge: Documentação de Engenharia de Software (ERD)

## 1. Visão Arquitetural e Contexto
O SolaBridge é uma solução contábil projetada para superar o "apagão fiscal" e a instabilidade de softwares legados causados pela Reforma Tributária de 2026. A arquitetura deve ser robusta, escalável e de alta disponibilidade para atender MEIs, profissionais autônomos, pequenas empresas e contadores.

### 1.1. Arquitetura Proposta (Core e Microsserviços)
* **Frontend (Apresentação):** Aplicação Web Responsiva (SPA) desenvolvida em React para controle financeiro, garantindo uma experiência de usuário fluida em dispositivos móveis e desktops.
* **Backend Core (Motor Contábil):** Desenvolvido em PHP com o framework Laravel. Responsável por toda a regra de negócio contábil (partidas dobradas, DRE, balanço) e gestão de usuários.
* **Microserviço Externo (API NFSe):** Uma API de alta performance desenvolvida em Go (Golang) e documentada com Swagger, isolada para lidar especificamente com a mensageria e emissão de notas fiscais.
* **Banco de Dados (Persistência):** PostgreSQL, garantindo conformidade com as propriedades ACID para as transações financeiras do Laravel.
* **Integração Externa (IA & Mensageria):** Webhooks seguros para comunicação com agentes de Inteligência Artificial via WhatsApp, permitindo lançamentos e consultas via chat.

## 2. Requisitos Funcionais (Motor Contábil)
A equipe de backend deve implementar rigorosamente a seguinte lógica de negócios no core:

* **Gestão de Usuários:** Cadastro de empresas e usuários.
* **Plano de Contas:**
    * Deve ser carregado com um estado pré-definido de no mínimo 15 contas.
    * A estrutura de dados deve conter: Código, Nome da Conta, Tipo (Ativo, Passivo, PL, Receita, Despesa) e Natureza (D/C).
* **Lançamentos Contábeis (Partidas Dobradas):**
    * Todo lançamento exige o registro de pelo menos duas partidas (uma conta débito e uma conta crédito), além de valor, data e histórico.
    * **Validação Crítica:** O sistema deve validar e bloquear qualquer operação no banco de dados, exibindo mensagem de erro, se o total de débitos não for igual ao total de créditos.
    * A equação fundamental **Ativo = Passivo + PL** deve ser mantida permanentemente.
* **Relatórios e Analytics:**
    * **Balanço Patrimonial:** Geração de relatório segmentando Ativos e Passivos em Circulante e Não Circulante, junto ao Patrimônio Líquido.
    * **DRE (Demonstração de Resultado):** Cálculo do Resultado Líquido baseado na fórmula: Total das Receitas - Total das Despesas, permitindo filtro por período.
    * **Razão Contábil (Extrato por Conta):** Visão histórica por conta, exibindo data, histórico, débitos, créditos e saldo acumulado.
* **Indicadores de Dashboard:**
    * **Liquidez Corrente:** Cálculo e exibição automática da divisão: Ativo Circulante / Passivo Circulante.
    * **Caixa e Resultados:** Exibição em tempo real dos saldos consolidados de "Caixa" e "Bancos", além do último resultado apurado formatado condicionalmente (verde para lucro, vermelho para prejuízo).

## 3. Estrutura do Banco de Dados (Esquema Relacional)
O DBA deve modelar as seguintes entidades mínimas no PostgreSQL para garantir a integridade referencial exigida:

| Entidade | Propósito |
| :--- | :--- |
| **EMPRESAS** | Armazena os dados das empresas cadastradas no sistema. |
| **PLANO_CONTAS** | Armazena a estrutura hierárquica contábil (Código, Nome, Tipo, Natureza). |
| **LANCAMENTOS** | Armazena o cabeçalho da transação financeira (Data, Histórico). |
| **PARTIDAS** | Armazena as linhas individuais do livro diário (Conta Débito, Conta Crédito, Valor) vinculadas a um Lançamento específico. |

## 4. Fluxo de Demonstração Final (QA)
A equipe de Quality Assurance (QA) deve validar o software seguindo exatamente este fluxo obrigatório:

1.  **Autenticação:** Fazer login e confirmar o carregamento do Dashboard.
2.  **Ciclo de Receita:** Registrar venda de R$ 10.000 (Débito: Caixa / Crédito: Receita).
3.  **Ciclo de Compras:** Registrar compra de R$ 4.000 (Débito: Estoque / Crédito: Caixa).
4.  **Ciclo de Despesas:** Registrar despesa de R$ 1.000 (Débito: Despesa / Crédito: Caixa).
5.  **Tratamento de Exceções:** Tentar lançar um débito sem crédito e verificar a exibição da mensagem de erro de balanceamento.
6.  **Validação de Relatórios:**
    * Gerar Balanço Patrimonial para provar a igualdade da equação contábil.
    * Gerar DRE para confirmar o lucro líquido exato de R$ 5.000.
    * Calcular Liquidez Corrente e validar o valor correto.
    * Extrair o extrato da conta Caixa para verificar as movimentações.

## 5. Diretrizes de Infraestrutura e DevOps
* **Ambiente de Hospedagem:** Estruture o ambiente em servidores Linux (ex: Ubuntu Server), conteinerizando a aplicação com Docker e orquestrando os serviços (React, Laravel, Go API e PostgreSQL) via Docker Compose. Isso garante a paridade entre o ambiente de desenvolvimento local e a produção.
* **Segurança e Boas Práticas:** Utilize um proxy reverso (ex: Nginx) para roteamento. Proteja todas as chaves de API e credenciais de banco de dados utilizando variáveis de ambiente. O controle de versão deve ser rigoroso, garantindo que nenhum arquivo `.env` ou dado sensível seja exposto no repositório do projeto.

## 6. Tech Stack
* **Frontend:** React
* **Backend Core:** PHP + Laravel
* **Microserviço NFSe:** Go (Golang) + Swagger
* **Database:** PostgreSQL
* **Infraestrutura:** Docker, Docker Compose e Linux

## 7. Arquitetura e Isolamento do Banco de Dados

O sistema será um ERP Web focado em múltiplos usuários, adotando uma arquitetura *Multi-tenant* (Múltiplos Inquilinos). O banco de dados será projetado de forma centralizada, garantindo que cada conta ou empresa acesse seus próprios dados de forma ágil e segura.

Para o isolamento lógico das informações dentro de um banco de dados compartilhado, utilizaremos a estratégia de *Tenant ID* (Identificador de Inquilino). Existirá uma tabela central que registrará as empresas (entidades usuárias) do sistema. Todas as tabelas dependentes (como clientes, fornecedores, lançamentos e eventos) possuirão uma chave estrangeira vinculada à sua respectiva empresa. Essa modelagem garante o particionamento lógico da informação, facilita o controle de acesso em nível de aplicação e impede o vazamento de dados entre as diferentes contas operando no ERP.
