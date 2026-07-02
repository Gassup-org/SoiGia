# Repository Guidelines

## Project Structure & Module Organization

This repository is split into two Node/TypeScript apps under `app/`.
The frontend lives in `app/front-end` and uses Vite, React, and TypeScript. Place UI code in `src/components`, page-level views in `src/pages`, route definitions in `src/routes`, API clients in `src/services`, shared hooks in `src/hooks`, state in `src/store`, and static assets in `public` or `src/assets`.
The backend lives in `app/back-end` and uses Express, Prisma, and TypeScript. Keep feature code under `src/features/<feature>`, shared middleware in `src/middlewares`, configuration in `src/config`, utilities in `src/utils`, and database schema changes in `prisma/schema.prisma`.

## Build, Test, and Development Commands

Run commands from the relevant app directory.

```bash
cd app/front-end && npm install
cd app/front-end && npm run dev       # start Vite locally
cd app/front-end && npm run build     # type-check and build frontend
cd app/front-end && npm run lint      # run ESLint

cd app/back-end && npm install
cd app/back-end && npm run dev        # start backend with tsx watch
cd app/back-end && npm run build      # generate Prisma client and compile TS
cd app/back-end && npm start          # run compiled dist/server.js
```

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow the existing style: ES modules, single quotes, no semicolons, and two-space indentation. Use `PascalCase` for React components, `camelCase` for functions and variables, and lowercase feature folders such as `src/features/product`. Keep controller and route files named consistently, for example `product.controllers.ts` and `product.routes.ts`.

## Testing Guidelines

No test runner is currently configured. When adding tests, colocate them near the code they cover or use a clear `__tests__` folder, and name files `*.test.ts` or `*.test.tsx`. Prefer integration tests for backend routes and component tests for user-facing frontend behavior. Document any new test command in the matching `package.json`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative messages such as `added: db diagram` and `added: project description`. Keep commits focused and use concise messages in the same style, for example `added: product routes` or `fixed: login validation`.

Pull requests should include a brief summary, the areas changed (`front-end`, `back-end`, `prisma`), test or lint results, linked issues when relevant, and screenshots for visible UI changes. Mention required environment variables or database migrations before requesting review.

## Security & Configuration Tips

Do not commit secrets, `.env` files, generated build output, or local database dumps. Backend changes that touch Prisma should include the schema update and clear migration or deployment notes.
