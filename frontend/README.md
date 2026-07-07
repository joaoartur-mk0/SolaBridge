# SolaBridge

Sistema web de gestão contábil simplificada e emissão de NFS-e, desenvolvido como projeto acadêmico para a disciplina de **Introdução à Contabilidade** do curso de Análise e Desenvolvimento de Sistemas.

## Sobre o projeto

O **SolaBridge** tem como objetivo oferecer uma solução simples e acessível para auxiliar MEIs, profissionais autônomos, empresas de serviços e contadores na organização financeira, gestão de clientes, controle de serviços e emissão de Nota Fiscal de Serviço Eletrônica (NFS-e).

Nesta primeira versão, o foco do projeto será a criação de uma interface web funcional utilizando dados simulados, permitindo validar o fluxo principal do sistema antes da integração completa com o backend e com a API pública de emissão de NFS-e.

## Tecnologias utilizadas

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend previsto

* PHP
* Laravel
* PostgreSQL

### Integrações previstas

* API pública do governo para emissão de NFS-e

## Funcionalidades previstas

* Dashboard com indicadores financeiros
* Cadastro e listagem de clientes/tomadores
* Cadastro e listagem de serviços
* Tela de emissão de NFS-e
* Histórico de notas fiscais
* Controle financeiro básico
* Configurações da empresa
* Integração futura com backend Laravel
* Integração futura com API de NFS-e

## Estrutura inicial do projeto

```txt
src/
├── assets/
├── components/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── hooks/
├── layouts/
├── mocks/
├── pages/
├── services/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acessar a pasta do projeto

```bash
cd SolaBridge
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Rodar o projeto em ambiente de desenvolvimento

```bash
npm run dev
```

O projeto ficará disponível, por padrão, em:

```txt
http://localhost:5173
```

## Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção do projeto.

```bash
npm run preview
```

Executa uma prévia local da versão de produção.

## Fluxo de trabalho com Git

A branch principal do projeto será:

```txt
main
```

Durante o desenvolvimento, cada nova funcionalidade deve ser criada em uma branch separada.

Exemplos:

```bash
git checkout -b feat/layout-base
git checkout -b feat/dashboard
git checkout -b feat/customers-page
git checkout -b feat/services-page
git checkout -b feat/invoices-page
```

## Padrão de commits

Sugestão de padrão para commits:

```txt
feat: nova funcionalidade
fix: correção de erro
style: ajuste visual ou formatação
refactor: refatoração de código
docs: alteração na documentação
chore: configuração ou manutenção do projeto
```

Exemplos:

```bash
git commit -m "chore: initial React Vite setup"
git commit -m "feat: add base layout"
git commit -m "feat: add customers page"
git commit -m "style: improve dashboard cards"
```

## Módulos planejados

### Dashboard

Tela inicial com indicadores como:

* Receita do mês
* Despesas do mês
* Saldo atual
* Notas emitidas
* Notas pendentes
* Impostos estimados

### Clientes

Cadastro e listagem de clientes/tomadores de serviço.

### Serviços

Cadastro e listagem dos serviços prestados pela empresa.

### Emissão de NFS-e

Fluxo para selecionar cliente, serviço, valor, descrição e emitir ou simular uma NFS-e.

### Notas fiscais

Histórico de notas emitidas, pendentes, rejeitadas ou canceladas.

### Financeiro

Controle básico de entradas, saídas, categorias e status de pagamento.

### Configurações

Dados da empresa necessários para operação do sistema e emissão fiscal.

## Status do projeto

Em desenvolvimento inicial.

## Objetivo acadêmico

Este projeto foi desenvolvido com fins acadêmicos, buscando aplicar conceitos de desenvolvimento web, organização de software, banco de dados, integração de sistemas e fundamentos de contabilidade.
