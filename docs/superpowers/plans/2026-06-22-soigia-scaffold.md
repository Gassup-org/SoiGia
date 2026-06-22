# SoiGia Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a package-heavy monorepo for SoiGia with runnable `web`, `api`, and `worker` apps plus shared packages, Docker Compose, and CI.

**Architecture:** The repo is split into `apps/web`, `apps/api`, and `workers/crawler`, with shared configuration and contracts living under `packages/*`. The API owns the PostgreSQL schema through Prisma, the worker communicates through RabbitMQ-shaped contracts, and the root workspace orchestrates common scripts for local development and verification.

**Tech Stack:** `pnpm workspace`, React, Vite, TypeScript, Express, Prisma, PostgreSQL, Redis, RabbitMQ, Python `uv`, `pytest`, Docker Compose, GitHub Actions

---

## File Structure

Create these top-level areas during implementation:

- `apps/web`
  - Vite React app with route skeleton, homepage, and smoke tests
- `apps/api`
  - Express app with layered folders, health endpoint, Prisma schema, and route tests
- `workers/crawler`
  - Python package with startup entrypoint, config model, and worker smoke test
- `packages/config`
  - Shared runtime constants
- `packages/shared-types`
  - Shared TypeScript DTOs for frontend and API
- `packages/utils`
  - Shared utility helpers like currency formatting
- `packages/ui`
  - Shared React UI primitives used by the web app
- `packages/eslint-config`
  - Reusable ESLint flat configs
- `packages/tsconfig`
  - Reusable TypeScript base configs
- `infra/docker`
  - Dockerfiles for `web`, `api`, and `worker`
- `.github/workflows`
  - CI pipeline
- `tests/repo`
  - Repo-level smoke checks for workspace and ops artifacts

### Task 1: Root Workspace Skeleton

**Files:**
- Create: `tests/repo/root-workspace.test.mjs`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Modify: `README.md`

- [ ] **Step 1: Write the failing workspace smoke test**

```js
// tests/repo/root-workspace.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("root workspace files exist with required scripts", () => {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const workspace = fs.readFileSync("pnpm-workspace.yaml", "utf8");
  const envExample = fs.readFileSync(".env.example", "utf8");

  assert.equal(packageJson.name, "soigia");
  assert.ok(packageJson.scripts.dev);
  assert.ok(packageJson.scripts.build);
  assert.ok(packageJson.scripts.lint);
  assert.ok(packageJson.scripts.test);
  assert.ok(packageJson.scripts.typecheck);
  assert.ok(packageJson.scripts.format);

  assert.match(workspace, /apps\/\*/);
  assert.match(workspace, /packages\/\*/);

  assert.match(envExample, /DATABASE_URL=/);
  assert.match(envExample, /REDIS_URL=/);
  assert.match(envExample, /RABBITMQ_URL=/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/repo/root-workspace.test.mjs`
Expected: FAIL because `package.json` and `pnpm-workspace.yaml` do not exist yet.

- [ ] **Step 3: Write the root workspace files**

```json
// package.json
{
  "name": "soigia",
  "private": true,
  "packageManager": "pnpm@10.13.1",
  "scripts": {
    "dev": "concurrently -n web,api,worker -c cyan,green,yellow \"pnpm web:dev\" \"pnpm api:dev\" \"pnpm worker:dev\"",
    "web:dev": "pnpm --filter @soigia/web dev",
    "api:dev": "pnpm --filter @soigia/api dev",
    "worker:dev": "uv run --project workers/crawler python -m src.main",
    "build": "pnpm -r --if-present build",
    "lint": "pnpm -r --if-present lint && pnpm worker:lint",
    "test": "pnpm -r --if-present test && pnpm worker:test",
    "typecheck": "pnpm -r --if-present typecheck",
    "format": "prettier --check .",
    "worker:lint": "uv run --project workers/crawler ruff check .",
    "worker:test": "uv run --project workers/crawler pytest"
  },
  "devDependencies": {
    "concurrently": "^9.1.2",
    "prettier": "^3.6.2",
    "tsup": "^8.5.0",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

```yaml
// pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

```dotenv
// .env.example
NODE_ENV=development
WEB_PORT=5173
API_PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/soigia
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_MANAGEMENT_PORT=15672
WORKER_LOG_LEVEL=INFO
```

```gitignore
// .gitignore
node_modules
dist
coverage
.env
.env.local
.venv
__pycache__
.pytest_cache
.ruff_cache
.DS_Store
pnpm-lock.yaml
workers/crawler/.venv
```

```md
// README.md
# SoiGia

Monorepo scaffold cho nền tảng theo dõi và so sánh giá.

## Structure

- `apps/web`: React + Vite frontend
- `apps/api`: Express + Prisma backend
- `workers/crawler`: Python worker
- `packages/*`: shared config, types, utils, and UI primitives

## Getting Started

1. `pnpm install`
2. `uv sync --project workers/crawler`
3. `docker compose up -d postgres redis rabbitmq`
4. `pnpm dev`
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/repo/root-workspace.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/repo/root-workspace.test.mjs .gitignore .env.example package.json pnpm-workspace.yaml README.md
git commit -m "chore: add root workspace scaffold"
```

### Task 2: Shared Packages and Base Tooling

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/src/index.ts`
- Create: `packages/shared-types/package.json`
- Create: `packages/shared-types/src/index.ts`
- Create: `packages/utils/package.json`
- Create: `packages/utils/src/index.ts`
- Create: `packages/utils/src/index.test.ts`
- Create: `packages/ui/package.json`
- Create: `packages/ui/src/index.tsx`
- Create: `packages/eslint-config/package.json`
- Create: `packages/eslint-config/base.mjs`
- Create: `packages/eslint-config/react.mjs`
- Create: `packages/eslint-config/node.mjs`
- Create: `packages/tsconfig/package.json`
- Create: `packages/tsconfig/base.json`
- Create: `packages/tsconfig/node.json`
- Create: `packages/tsconfig/react.json`

- [ ] **Step 1: Write the failing shared package test**

```ts
// packages/utils/src/index.test.ts
import { describe, expect, it } from "vitest";
import { formatCurrency } from "./index";

describe("formatCurrency", () => {
  it("formats VND values for display", () => {
    expect(formatCurrency(12500)).toBe("12.500 đ");
  });
});
```

```json
// packages/utils/package.json
{
  "name": "@soigia/utils",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --dts --format esm",
    "test": "vitest run",
    "typecheck": "tsc -p ../../packages/tsconfig/node.json --noEmit"
  }
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @soigia/utils test`
Expected: FAIL because `packages/utils/src/index.ts` does not exist yet.

- [ ] **Step 3: Implement the shared packages**

```ts
// packages/utils/src/index.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}
```

```json
// packages/config/package.json
{
  "name": "@soigia/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --dts --format esm",
    "typecheck": "tsc -p ../../packages/tsconfig/node.json --noEmit"
  }
}
```

```ts
// packages/config/src/index.ts
export const appConfig = {
  webName: "SoiGia Web",
  apiName: "SoiGia API",
  workerName: "SoiGia Worker"
} as const;

export const queueNames = {
  priceIngestion: "price.ingestion"
} as const;
```

```json
// packages/shared-types/package.json
{
  "name": "@soigia/shared-types",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --dts --format esm",
    "typecheck": "tsc -p ../../packages/tsconfig/node.json --noEmit"
  }
}
```

```ts
// packages/shared-types/src/index.ts
export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type ProductSummary = {
  id: string;
  name: string;
  categoryId: string;
};

export type HealthResponse = {
  status: "ok";
  service: string;
  timestamp: string;
};
```

```json
// packages/ui/package.json
{
  "name": "@soigia/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "scripts": {
    "build": "tsup src/index.tsx --dts --format esm",
    "typecheck": "tsc -p ../../packages/tsconfig/react.json --noEmit"
  }
}
```

```tsx
// packages/ui/src/index.tsx
import type { PropsWithChildren } from "react";

export function SectionCard({
  title,
  children
}: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

```json
// packages/eslint-config/package.json
{
  "name": "@soigia/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./base": "./base.mjs",
    "./node": "./node.mjs",
    "./react": "./react.mjs"
  }
}
```

```js
// packages/eslint-config/base.mjs
export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];
```

```js
// packages/eslint-config/node.mjs
import base from "./base.mjs";

export default [...base];
```

```js
// packages/eslint-config/react.mjs
import base from "./base.mjs";

export default [...base];
```

```json
// packages/tsconfig/package.json
{
  "name": "@soigia/tsconfig",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./base.json": "./base.json",
    "./node.json": "./node.json",
    "./react.json": "./react.json"
  }
}
```

```json
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

```json
// packages/tsconfig/node.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"]
  }
}
```

```json
// packages/tsconfig/react.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ES2022"]
  }
}
```

- [ ] **Step 4: Run tests and builds to verify they pass**

Run: `pnpm --filter @soigia/utils test && pnpm --filter @soigia/config build && pnpm --filter @soigia/shared-types build && pnpm --filter @soigia/ui build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/config packages/shared-types packages/utils packages/ui packages/eslint-config packages/tsconfig
git commit -m "feat: add shared packages and base tooling"
```

### Task 3: Web App Scaffold

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/app/router.tsx`
- Create: `apps/web/src/pages/home-page.tsx`
- Create: `apps/web/src/styles/index.css`
- Create: `apps/web/src/test/setup.ts`
- Create: `apps/web/src/app/app.test.tsx`

- [ ] **Step 1: Write the failing web smoke test**

```tsx
// apps/web/src/app/app.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("App", () => {
  it("renders the SoiGia landing page", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /soi gia/i })).toBeInTheDocument();
    expect(screen.getByText(/theo doi gia theo danh muc/i)).toBeInTheDocument();
  });
});
```

```json
// apps/web/package.json
{
  "name": "@soigia/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@soigia/shared-types": "workspace:*",
    "@soigia/ui": "workspace:*",
    "@soigia/utils": "workspace:*",
    "@tanstack/react-query": "^5.83.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^9.30.1",
    "jsdom": "^26.1.0",
    "vite": "^7.0.0"
  }
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @soigia/web test`
Expected: FAIL because `src/App.tsx` does not exist yet.

- [ ] **Step 3: Write the minimal web implementation**

```tsx
// apps/web/src/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

export function App() {
  return <RouterProvider router={router} />;
}
```

```tsx
// apps/web/src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/home-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  }
]);
```

```tsx
// apps/web/src/pages/home-page.tsx
import { SectionCard } from "@soigia/ui";

export function HomePage() {
  return (
    <main>
      <header>
        <p>Soi Gia</p>
        <h1>Theo doi gia theo danh muc</h1>
      </header>
      <SectionCard title="Danh muc">
        <p>Thuc pham, xang dau, thoi trang va cac nhom hang can theo doi.</p>
      </SectionCard>
      <SectionCard title="So sanh">
        <p>Chon san pham de xem gia giua nhieu cua hang.</p>
      </SectionCard>
    </main>
  );
}
```

```tsx
// apps/web/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```ts
// apps/web/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
```

```ts
// apps/web/src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

```css
// apps/web/src/styles/index.css
:root {
  font-family: "Be Vietnam Pro", sans-serif;
  color: #1f2937;
  background: linear-gradient(180deg, #fff8ef 0%, #f7fbff 100%);
}

body {
  margin: 0;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px 80px;
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "@soigia/tsconfig/react.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["src", "vite.config.ts"]
}
```

```html
// apps/web/index.html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SoiGia</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Run the test and build to verify they pass**

Run: `pnpm --filter @soigia/web test && pnpm --filter @soigia/web build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: scaffold web app"
```

### Task 4: API Scaffold with Health Route and Prisma

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/tsup.config.ts`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/src/routes/health-route.ts`
- Create: `apps/api/src/controllers/health-controller.ts`
- Create: `apps/api/src/services/health-service.ts`
- Create: `apps/api/src/lib/env.ts`
- Create: `apps/api/src/lib/prisma.ts`
- Create: `apps/api/tests/health.route.test.ts`
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/seed.ts`

- [ ] **Step 1: Write the failing API test**

```ts
// apps/api/tests/health.route.test.ts
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("GET /health", () => {
  it("returns API health details", async () => {
    const app = createApp();
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("SoiGia API");
  });
});
```

```json
// apps/api/package.json
{
  "name": "@soigia/api",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "prisma:generate": "prisma generate",
    "prisma:validate": "prisma validate"
  },
  "dependencies": {
    "@prisma/client": "^6.10.1",
    "@soigia/config": "workspace:*",
    "@soigia/shared-types": "workspace:*",
    "express": "^5.1.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/express": "^5.0.3",
    "@types/node": "^24.0.14",
    "@types/supertest": "^6.0.3",
    "eslint": "^9.30.1",
    "prisma": "^6.10.1",
    "supertest": "^7.1.1",
    "tsx": "^4.20.3"
  }
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @soigia/api test`
Expected: FAIL because `src/app.ts` does not exist yet.

- [ ] **Step 3: Implement the API app and Prisma schema**

```ts
// apps/api/src/services/health-service.ts
import { appConfig } from "@soigia/config";
import type { HealthResponse } from "@soigia/shared-types";

export function getHealth(): HealthResponse {
  return {
    status: "ok",
    service: appConfig.apiName,
    timestamp: new Date().toISOString()
  };
}
```

```ts
// apps/api/src/controllers/health-controller.ts
import type { Request, Response } from "express";
import { getHealth } from "../services/health-service";

export function healthController(_request: Request, response: Response) {
  response.json(getHealth());
}
```

```ts
// apps/api/src/routes/health-route.ts
import { Router } from "express";
import { healthController } from "../controllers/health-controller";

export const healthRoute = Router();

healthRoute.get("/health", healthController);
```

```ts
// apps/api/src/app.ts
import express from "express";
import { healthRoute } from "./routes/health-route";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(healthRoute);

  return app;
}
```

```ts
// apps/api/src/server.ts
import { createApp } from "./app";

const port = Number(process.env.API_PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`SoiGia API listening on ${port}`);
});
```

```ts
// apps/api/src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  API_PORT: z.string().default("3000"),
  DATABASE_URL: z.string().min(1)
});

export const env = envSchema.parse(process.env);
```

```ts
// apps/api/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

```prisma
// apps/api/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          String          @id @default(cuid())
  name        String
  slug        String          @unique
  categoryId  String
  category    Category        @relation(fields: [categoryId], references: [id])
  pricePoints PriceSnapshot[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model PriceSnapshot {
  id          String   @id @default(cuid())
  storeName   String
  price       Decimal  @db.Decimal(12, 2)
  capturedAt  DateTime
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  createdAt   DateTime @default(now())
}
```

```ts
// apps/api/prisma/seed.ts
export async function seed() {
  console.log("Seed placeholder for SoiGia");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

```json
// apps/api/tsconfig.json
{
  "extends": "@soigia/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src", "tests", "prisma/seed.ts", "tsup.config.ts"]
}
```

```ts
// apps/api/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  dts: false,
  clean: true
});
```

- [ ] **Step 4: Run the API test and Prisma validation**

Run: `pnpm --filter @soigia/api test && pnpm --filter @soigia/api prisma:validate`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "feat: scaffold api app and prisma schema"
```

### Task 5: Python Worker Scaffold

**Files:**
- Create: `workers/crawler/pyproject.toml`
- Create: `workers/crawler/src/main.py`
- Create: `workers/crawler/src/config.py`
- Create: `workers/crawler/src/models/events.py`
- Create: `workers/crawler/src/publishers/rabbitmq.py`
- Create: `workers/crawler/src/consumers/price_jobs.py`
- Create: `workers/crawler/src/crawler/bootstrap.py`
- Create: `workers/crawler/tests/test_main.py`

- [ ] **Step 1: Write the failing worker smoke test**

```python
# workers/crawler/tests/test_main.py
from src.main import build_startup_message


def test_build_startup_message_contains_service_name():
    assert build_startup_message() == "SoiGia Worker is ready"
```

```toml
# workers/crawler/pyproject.toml
[project]
name = "soigia-crawler"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "beautifulsoup4>=4.13.4",
  "httpx>=0.28.1",
  "pydantic>=2.11.7"
]

[dependency-groups]
dev = [
  "pytest>=8.4.1",
  "ruff>=0.12.1"
]

[tool.pytest.ini_options]
pythonpath = ["."]
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `uv run --project workers/crawler pytest workers/crawler/tests/test_main.py`
Expected: FAIL because `workers/crawler/src/main.py` does not exist yet.

- [ ] **Step 3: Implement the worker package**

```python
# workers/crawler/src/main.py
from src.crawler.bootstrap import bootstrap_worker


def build_startup_message() -> str:
    return "SoiGia Worker is ready"


def main() -> None:
    print(build_startup_message())
    bootstrap_worker()


if __name__ == "__main__":
    main()
```

```python
# workers/crawler/src/config.py
from pydantic import BaseModel


class WorkerSettings(BaseModel):
    rabbitmq_url: str = "amqp://guest:guest@localhost:5672"
    log_level: str = "INFO"
```

```python
# workers/crawler/src/models/events.py
from pydantic import BaseModel


class PriceIngestionEvent(BaseModel):
    source_name: str
    product_name: str
    store_name: str
    price: float
```

```python
# workers/crawler/src/publishers/rabbitmq.py
from src.models.events import PriceIngestionEvent


def publish_price_event(event: PriceIngestionEvent) -> None:
    print(f"publish stub: {event.model_dump_json()}")
```

```python
# workers/crawler/src/consumers/price_jobs.py
def consume_price_jobs() -> None:
    print("consume stub")
```

```python
# workers/crawler/src/crawler/bootstrap.py
from src.consumers.price_jobs import consume_price_jobs


def bootstrap_worker() -> None:
    consume_price_jobs()
```

- [ ] **Step 4: Run the worker test to verify it passes**

Run: `uv run --project workers/crawler pytest workers/crawler/tests/test_main.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add workers/crawler
git commit -m "feat: scaffold crawler worker"
```

### Task 6: Ops Artifacts, Docker, and CI

**Files:**
- Create: `tests/repo/ops-artifacts.test.mjs`
- Create: `docker-compose.yml`
- Create: `infra/docker/api.Dockerfile`
- Create: `infra/docker/web.Dockerfile`
- Create: `infra/docker/worker.Dockerfile`
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

- [ ] **Step 1: Write the failing ops smoke test**

```js
// tests/repo/ops-artifacts.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("docker compose and CI files include the required services", () => {
  const compose = fs.readFileSync("docker-compose.yml", "utf8");
  const workflow = fs.readFileSync(".github/workflows/ci.yml", "utf8");

  for (const service of ["postgres", "redis", "rabbitmq", "api", "web", "worker"]) {
    assert.match(compose, new RegExp(`${service}:`));
  }

  assert.match(workflow, /pnpm install/);
  assert.match(workflow, /uv sync --project workers\/crawler/);
  assert.match(workflow, /pnpm test/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/repo/ops-artifacts.test.mjs`
Expected: FAIL because `docker-compose.yml` and `.github/workflows/ci.yml` do not exist yet.

- [ ] **Step 3: Implement Docker Compose, Dockerfiles, and CI**

```yaml
// docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: soigia
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  api:
    build:
      context: .
      dockerfile: infra/docker/api.Dockerfile
    env_file:
      - .env.example
    depends_on:
      - postgres
      - redis
      - rabbitmq
    ports:
      - "3000:3000"

  web:
    build:
      context: .
      dockerfile: infra/docker/web.Dockerfile
    depends_on:
      - api
    ports:
      - "5173:5173"

  worker:
    build:
      context: .
      dockerfile: infra/docker/worker.Dockerfile
    env_file:
      - .env.example
    depends_on:
      - rabbitmq
```

```dockerfile
// infra/docker/api.Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install
CMD ["pnpm", "--filter", "@soigia/api", "dev"]
```

```dockerfile
// infra/docker/web.Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install
CMD ["pnpm", "--filter", "@soigia/web", "dev", "--host", "0.0.0.0"]
```

```dockerfile
// infra/docker/worker.Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY workers/crawler ./workers/crawler
RUN pip install uv && uv sync --project workers/crawler
CMD ["uv", "run", "--project", "workers/crawler", "python", "-m", "src.main"]
```

```yaml
// .github/workflows/ci.yml
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.13.1
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: corepack enable
      - run: pnpm install
      - run: uv sync --project workers/crawler
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

```md
// README.md
# SoiGia

## Local Development

1. `pnpm install`
2. `uv sync --project workers/crawler`
3. `docker compose up -d postgres redis rabbitmq`
4. `pnpm dev`

## Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
```

- [ ] **Step 4: Run the smoke test and compose validation**

Run: `node --test tests/repo/ops-artifacts.test.mjs && docker compose config >/tmp/soigia-compose.txt`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/repo/ops-artifacts.test.mjs docker-compose.yml infra/docker .github/workflows/ci.yml README.md
git commit -m "chore: add docker and ci scaffold"
```

### Task 7: Final Integration Verification

**Files:**
- Modify: `README.md` if verification uncovers missing commands or mismatched setup text

- [ ] **Step 1: Add a final verification checklist to README if missing**

```md
## Final Smoke Checklist

1. `pnpm install`
2. `uv sync --project workers/crawler`
3. `docker compose up -d postgres redis rabbitmq`
4. `pnpm test`
5. `pnpm build`
```

- [ ] **Step 2: Run the full repo verification**

Run: `pnpm install && uv sync --project workers/crawler && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: PASS

- [ ] **Step 3: Run the main services once**

Run: `docker compose up -d postgres redis rabbitmq && pnpm api:dev && pnpm web:dev && pnpm worker:dev`
Expected: the API prints a listening message, the web dev server starts, and the worker prints `SoiGia Worker is ready`

- [ ] **Step 4: Fix any mismatched docs or scripts discovered during verification**

```md
Update any command examples in `README.md` so they match the commands that actually passed in Step 2 and Step 3.
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: finalize scaffold verification notes"
```

## Self-Review

- Spec coverage:
  - Root workspace: Task 1
  - Shared packages: Task 2
  - Web app skeleton: Task 3
  - API scaffold and Prisma schema: Task 4
  - Worker skeleton: Task 5
  - Docker Compose and CI: Task 6
  - Final validation: Task 7
- Placeholder scan:
  - No unfinished markers or deferred implementation notes remain in tasks.
- Type consistency:
  - Shared names are consistent across tasks: `@soigia/config`, `@soigia/shared-types`, `HealthResponse`, `SectionCard`, `build_startup_message`.
