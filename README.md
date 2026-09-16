# testcontainer-node-lab

Laboratório didático: **NestJS + Prisma + PostgreSQL + Vitest + Testcontainers** em arquitetura hexagonal (Ports & Adapters).

> **Mensagem central:** o objetivo não é testar classes isoladas nem com mocks. O objetivo é verificar que a aplicação **inteira** funciona quando conectada a uma infraestrutura **real**.

## Pré-requisitos

- Node.js (>= 22)
- npm
- Docker (obrigatório para os testes — o PostgreSQL dos testes é criado via Testcontainers)

## Instalação

```bash
npm install
```

## Desenvolvimento

Banco de desenvolvimento via docker-compose (Postgres persistente em `localhost:5433`):

```bash
docker compose up -d
npx prisma migrate dev   # aplicar/gerar migrations no banco de dev (localhost:5433)
npm run start:dev        # nest start --watch
```

## Rodando via Docker (opcional)

A imagem criada pela `Dockerfile` é multi-stage (`node:24-alpine`) e executa `node dist/main.js` na entrada. Ela espera `DATABASE_URL` apontando para um PostgreSQL acessível com as migrations já aplicadas:

```bash
docker build -t testcontainer-node-lab .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@<host-do-postgres>:5432/postgres?schema=public" \
  testcontainer-node-lab
```

## Testes

```bash
npm run test:e2e
```

O que acontece sob o capô (Vitest):

1. Testcontainers cria um **PostgreSQL temporário e descartável**;
2. a connection string é obtida do container e define `DATABASE_URL`;
3. `prisma migrate deploy` aplica as migrations no banco temporário;
4. a aplicação NestJS sobe (via `@nestjs/testing`);
5. os testes fazem requisições **HTTP reais** com supertest;
6. Prisma persiste os dados no PostgreSQL real do container;
7. ao final, app e container são encerrados (mesmo com falhas).

## PostgreSQL de desenvolvimento × PostgreSQL de teste

| | Desenvolvimento | Testes |
|---|---|---|
| Responsável | `docker compose up` | Testcontainers (Vitest) |
| Duração | Persistente (volume `postgres-data`) | Temporário, destruído no teardown |
| Conexão | `localhost:5433` (`.env`) | Dinâmica, obtida do container |

Os testes **nunca** dependem de um Postgres local fixo.

## Fluxo da requisição

```text
HTTP → NestJS (Controller) → Use Case → TaskRepository (porta) → Prisma Adapter → Prisma Client → PostgreSQL
```

Nos testes, o PostgreSQL é o container do Testcontainers; em desenvolvimento, o do docker-compose.

## Estrutura

```text
src/
├── domain/task/            # Task + porta TaskRepository (TS puro)
├── application/task/       # use cases — dependem só da porta
├── adapters/inbound/http/  # TasksController
├── adapters/outbound/prisma/  # PrismaTaskRepository (único adaptador de persistência)
├── infrastructure/prisma/  # PrismaModule + PrismaService
└── main.ts
test/
├── e2e/tasks.e2e-spec.ts
└── setup/test-environment.ts
```
