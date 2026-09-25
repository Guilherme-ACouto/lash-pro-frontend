# Brava Pro — Frontend

Interface web do sistema de gestão para negócios da área da beleza. SPA em Angular com estado global via NgRx, layout responsivo (sidebar desktop / bottom nav mobile).

## Stack

- **Angular 18** (standalone components, sem NgModules)
- **NgRx** (store, effects, entity) — estado global obrigatório, sem state em serviços
- **Angular Material**
- **ng-apexcharts** (gráficos do dashboard)

## Features

Cada feature é lazy-loaded, feature-first (`features/nome/{components,services,store}`):

| Feature | Rota | Descrição |
|---|---|---|
| Clientes | `/clients` | CRUD, desativar/reativar, filtro por status |
| Serviços | `/services` | CRUD, desativar/reativar |
| Agendamentos | `/appointments` | Agenda estilo Google Calendar (Dia/Semana/Mês) |
| Financeiro | `/financial` | Lançamentos, filtros por período/categoria, toggle pago |
| Estoque | `/inventory` | Itens, alertas de estoque mínimo, movimentações (compra/saída) |
| Dashboard | `/dashboard` | KPIs, gráficos de agendamentos e fluxo de caixa |
| Fichas | `/fichas` (autenticado), `/ficha/:token` (público, sem login) | Anamnese + mapeamento de cílios com canvas/foto; link público pro cliente preencher sozinho |

Todas as features de negócio já têm backend + UI + NgRx completos (ver `brava-docs/.specs/codebase/ARCHITECTURE.md`). O fluxo de registro/ativação de conta e o painel admin de tenants (multi-tenancy) ainda não têm UI — só backend.

## Rodando localmente (via Docker — recomendado)

Requer [Docker](https://www.docker.com/products/docker-desktop) instalado. Ver instruções completas no README do [`brava-backend`](https://github.com/Guilherme-ACouto/brava-pro-backend) (o `docker-compose.yml` que sobe os dois projetos junto com o Postgres vive lá).

```bash
docker compose up --build   # rodar a partir da pasta brava-backend/
```

Frontend fica disponível em `http://localhost:4200`.

## Rodando localmente (sem Docker)

Pré-requisitos: Node 20, backend rodando em `localhost:8080`.

```bash
nvm use 20
```

### Instalação de dependências

```bash
npm install
```

### Verificação de código (linter)

Não há linter configurado no projeto no momento (ex.: ESLint).

### Execução dos testes

```bash
npm test
# roda os testes unitários via Karma/Jasmine
```

### Build (produção)

```bash
npm run build
# gera os arquivos estáticos em dist/brava-frontend/browser
```

### Execução (modo dev)

```bash
npm start
# serve em localhost:4200 com proxy para :8080 (ver proxy.conf.json)
```

## Repositórios relacionados

- Backend: https://github.com/Guilherme-ACouto/brava-pro-backend
- Documentação/specs: https://github.com/Guilherme-ACouto/brava-pro-docs
