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
