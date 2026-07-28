# SoiGia

SoiGia is split into two TypeScript apps:

- `app/front-end`: Vite + React client.
- `app/back-end`: Express API with Prisma and PostgreSQL.

## Requirements

- Node.js and npm
- Docker with Docker Compose

## First-Time Setup

Install dependencies for each app:

```bash
cd app/front-end
npm install
```

```bash
cd app/back-end
npm install
```

Create the backend environment file:

```bash
cd app/back-end
cp .env.example .env
```

The default local database values are:

```env
DB_HOST="localhost"
DB_PORT="5433"
DB_USERNAME="postgres"
DB_PASSWORD="password"
DB_NAME="soigia"
```

## Run PostgreSQL

Run this command from the repository root:

```bash
docker compose --env-file app/back-end/.env up -d postgres
```

The Compose file reads `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT` from `app/back-end/.env`. The container still uses PostgreSQL's internal port `5432`, while the host uses `DB_PORT` from the env file. The default host port is `5433` to avoid conflicts with an existing local PostgreSQL service on `5432`.

Check the database container:

```bash
docker compose --env-file app/back-end/.env ps
```

Stop the database:

```bash
docker compose --env-file app/back-end/.env stop postgres
```

## Database Schema

Run Prisma commands from `app/back-end`:

```bash
cd app/back-end
npx prisma generate
npx prisma db push
```

`npx prisma generate` creates the Prisma client. `npx prisma db push` applies the current Prisma schema to the local Docker PostgreSQL database.

## Run The Apps

Start the backend:

```bash
cd app/back-end
npm run dev
```

By default, the API runs on:

```txt
http://localhost:8080
```

Start the frontend in another terminal:

```bash
cd app/front-end
npm run dev
```

By default, Vite runs on:

```txt
http://localhost:5173
```

## Build And Test

Frontend checks:

```bash
cd app/front-end
npm run lint
npm run build
```

Backend checks:

```bash
cd app/back-end
npm test -- --runInBand
npm run build
```

## Docker Volume Notes

PostgreSQL stores its data inside the container at:

```txt
/var/lib/postgresql/data
```

The Compose file maps that folder to a named Docker volume:

```yml
soigia-postgres-data:/var/lib/postgresql/data
```

This means the database data is stored outside the container lifecycle. You can stop, start, or recreate the Postgres container without losing data:

```bash
docker compose --env-file app/back-end/.env stop postgres
docker compose --env-file app/back-end/.env up -d postgres
docker compose --env-file app/back-end/.env down
```

Data is removed only when the named volume is deleted, for example:

```bash
docker compose --env-file app/back-end/.env down -v
```
