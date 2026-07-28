# SolaBridge — Brief para criativos

Reúne o que é preciso saber sobre o produto para criar peças de marketing
(posts, carrosséis, landing) consistentes. Use como contexto ao pedir
criativos. Este produto é filho da **SolaSoftware** — ver
`../SolaSoftware/brand/BRANDING.md` para as regras de propagação da marca-mãe
(selo de rodapé, cantos retos, vermelho lacre reservado, etc.), que também
valem aqui.

## Sobre o produto

**SolaBridge** é um sistema de gestão de NFS-e (nota fiscal de serviço) para
pequenas e médias empresas: emissão de nota, dashboards financeiros e gestão
de clientes. Nasceu como trabalho da matéria de Contabilidade, mas a escolha
do tema não foi arbitrária — a **reforma tributária de 2026** mudou bastante
as regras de NFS-e, e é exatamente a dor que o produto resolve: ajudar
empresas a atravessar essa mudança sem ficar perdidas em sistema municipal
burocrático.

**Para quem é**: pequenas e médias empresas prestadoras de serviço que
precisam emitir NFS-e regularmente e sentem o peso da burocracia fiscal —
sobretudo agora, com as mudanças de 2026.

**Dor que resolve**: sistemas municipais de NFS-e são notoriamente feios,
lentos e confusos; a reforma tributária piorou a confusão no curto prazo.
O SolaBridge organiza emissão, clientes e visão financeira num só lugar,
com interface que não parece papel timbrado de prefeitura.

**Diferencial**: não é "mais um ERP genérico" — é focado especificamente em
NFS-e e no momento de transição regulatória, com dashboards financeiros
pensados pra dar visão real do negócio, não só cumprir obrigação.

## Identidade visual

**Status: paleta abaixo já aplicada no código** (`frontend/src/index.css`,
bloco `@theme`, e componentes `Badge`/`StatCard`/`Button`/etc.). Os nomes
de token no CSS são mais curtos que os desta tabela — mapeamento:
`accent-primary` → `brand` / `brand-light` (texto) / `brand-hover`,
`accent-secondary` → `positive`, `utility-warning` → `warning`,
`utility-error` → `danger`. O lime/emerald/sky/amber padrão do Tailwind
que existia antes (`Badge.tsx`, `StatCard.tsx` e mais ~20 arquivos) foi
totalmente substituído por esses tokens.

Direção: **moderno, mas confiável** — o contraste é justamente com a
estética burocrática/datada dos sistemas fiscais tradicionais. Nada de
parecer "gov.br", mas também nada de parecer fintech descolada demais pra
quem lida com imposto. O conceito central é a **ponte**: o produto existe
pra facilitar a travessia entre a empresa e a obrigação fiscal — isso vira
símbolo gráfico central (uma ponte estilizada, geométrica, minimalista —
não literal/realista).

- **Base**: fundo escuro, herdado do que já está implementado no dashboard
  (`#020617`) — mesma família visual escura de Eliza e Axios Calc.
- **Cores**:
  - `bg-base` `#020617` — fundo padrão (já em produção)
  - `surface-1` `#0B1220` — painéis
  - `surface-2` `#141D2E` — elementos elevados/hover
  - `border-hairline` `#1F2A3D` — bordas finas
  - `text-primary` `#F8FAFC` — texto principal (já em produção)
  - `text-secondary` `#94A3B8` — texto secundário
  - `accent-primary` (**aço da ponte**) `#3E7C99` — cor de marca do produto,
    tom de aço/cabo estrutural, usado em CTAs, links, ícone da ponte
  - `accent-primary-hover` `#52A0C0`
  - `accent-secondary` (positivo/confirmado — nota emitida, pagamento OK)
    `#4C9A7E`
  - `utility-warning` (pendência/prazo) `#C99A3E`
  - `utility-error` `#C4573F`
  - **Não usar** o vermelho lacre da SolaSoftware (`#7D2430`) em nenhum
    lugar do produto — é reservado à marca-mãe (ver regra de propagação).
  - **Regra: nada de cor viva/neon**, principalmente em verde e azul (são
    as que mais tendem a ficar berrantes em fundo escuro). Evitar
    especificamente os tons puros do Tailwind — `emerald-400/500`,
    `green-400/500`, `lime-400`, `cyan-400`, `sky-400`, `blue-400` — em
    qualquer estado (badge, ícone, gráfico, foco de input). Preferir
    sempre a versão dessaturada/apagada (como `accent-primary` e
    `accent-secondary` acima), ou aplicar opacidade sobre um tom mais
    escuro da mesma família em vez do tom puro.
- **Tipografia**: títulos e números de destaque (dashboards, valores) em
  **IBM Plex Sans Condensed** (Bold) — técnica, precisa, ótima pra dados
  tabulares; corpo de texto em **Public Sans** — fonte desenhada pra
  contexto institucional/governamental (USWDS), reforça a sensação de
  confiabilidade sem cair em fonte genérica de SaaS.
- **Símbolo**: ponte estilizada em linhas retas (treliça geométrica
  minimalista), monocromática em `accent-primary`. É o ícone/logo próprio
  do produto — diferente do símbolo cruz+circuito da SolaSoftware, que
  continua aparecendo separadamente no selo de rodapé (ver regra de
  propagação da marca-mãe).
- **Forma**: cantos retos/quase retos (herdado da regra da casa), barra de
  acento lateral em vez de caixa toda tintada, hairline em vez de sombra
  pesada.
- **Tom de voz**: direto e claro, evita jargão contábil quando dá pra
  simplificar. Fala como quem entende de fiscal mas não trata o usuário
  como contador — "menos burocracia, mais clareza", sem soar informal
  demais pra um contexto de obrigação legal.

## Prompts prontos para gerar criativos

Cole a seção **Identidade visual** antes de um destes prompts.

### 1. Carrossel de apresentação (Instagram, 1080×1350, 5 slides)

```
Crie um carrossel de 5 slides para Instagram (1080x1350 cada) apresentando
o SolaBridge, um sistema de gestão de NFS-e (nota fiscal de serviço) para
pequenas e médias empresas.

Identidade visual: fundo escuro (#020617), painéis em #0B1220 com bordas
finas, texto em #F8FAFC, acento primário em azul-aço (#3E7C99, tom de cabo
de ponte estrutural), acento secundário verde-acinzentado (#4C9A7E) para
destaques positivos. Símbolo: uma ponte estilizada em linhas retas
geométricas, minimalista, monocromática. Tipografia condensada e técnica
para títulos/números, mais legível para o corpo. Cantos retos, sem
elementos arredondados. Tom moderno mas confiável — contraste direto com a
estética burocrática de sistemas fiscais municipais tradicionais.

Estrutura:
1. Capa: "A reforma tributária mudou a NFS-e. Sua empresa já se ajustou?"
   — gancho de dor/atualidade.
2. O problema: sistemas municipais confusos, burocracia que trava o dia a
   dia.
3. A solução: SolaBridge — emissão de NFS-e, gestão de clientes e
   dashboard financeiro num só lugar.
4. Diferencial: feito pra atravessar a mudança regulatória sem
   complicação, com visão real do negócio.
5. CTA: chamada para testar / saber mais, nome do produto em destaque.

Gere as 5 imagens.
```

### 2. Post único — anúncio de disponibilidade (1080×1080)

```
Crie uma imagem quadrada (1080x1080) para Instagram anunciando que o
SolaBridge já está disponível para pequenas e médias empresas emitirem
NFS-e.

Identidade visual: fundo escuro (#020617), acento azul-aço (#3E7C99),
símbolo de ponte estilizada em linhas geométricas centralizado, tipografia
condensada para o título, cantos retos, tom moderno e confiável.

Texto sugerido: "Menos burocracia. Mais clareza fiscal." com o nome
SolaBridge em destaque.
```

### 3. Sequência de Stories — dor + solução (1080×1920, 3 stories)

```
Crie 3 imagens de Story para Instagram (1080x1920 cada) sobre o SolaBridge.

Identidade visual: fundo escuro (#020617), acento azul-aço (#3E7C99),
símbolo de ponte em linhas retas, tipografia condensada, cantos retos, tom
direto e confiável.

Story 1: gancho — "Ainda emite NFS-e no sistema da prefeitura?" com espaço
reservado para elemento de swipe-up/link no rodapé.
Story 2: destaque — mockup estilizado de tela mostrando emissão de nota
simplificada.
Story 3: CTA simples com o nome do produto.
```

## Selo de marca-mãe

Todo material inclui o selo padrão "by SolaSoftware" (símbolo cruz+circuito
monocromático + texto discreto) no rodapé — ver `brand/logo-solasoftware.png`
e regras em `../SolaSoftware/brand/BRANDING.md`.
