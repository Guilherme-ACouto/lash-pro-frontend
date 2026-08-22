# Lash Manager — Frontend

Interface web do sistema de gestão para salões de lash design. SPA em Angular com estado global via NgRx, layout responsivo (sidebar desktop / bottom nav mobile).

## Stack

- **Angular 18** (standalone components, sem NgModules)
- **NgRx** (store, effects, entity) — estado global obrigatório, sem state em serviços
- **Angular Material**
- **ng-apexcharts** (gráficos do dashboard)

## Rodando localmente (via Docker — recomendado)

Requer [Docker](https://www.docker.com/products/docker-desktop) instalado. Ver instruções completas no README do [`lash-backend`](https://github.com/Guilherme-ACouto/lash-pro-backend) (o `docker-compose.yml` que sobe os dois projetos junto com o Postgres vive lá).

```bash
docker compose up --build   # rodar a partir da pasta lash-backend/
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
# gera os arquivos estáticos em dist/lash-frontend/browser
```

### Execução (modo dev)

```bash
npm start
# serve em localhost:4200 com proxy para :8080 (ver proxy.conf.json)
```

## Repositórios relacionados

- Backend: https://github.com/Guilherme-ACouto/lash-pro-backend
- Documentação/specs: https://github.com/Guilherme-ACouto/lash-pro-docs
