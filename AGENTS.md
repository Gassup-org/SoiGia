# Repository Guidelines

## Project Structure & Module Organization
This repository is split into two TypeScript applications under `app/`:

- `app/front-end/`: Vite + React client. Main entry is `src/main.tsx`; shared UI lives in `src/layouts/`, static assets in `src/assets/`, and public files in `public/`.
- `app/back-end/`: Node.js API. Runtime code belongs in `src/`; Prisma schema and generated client inputs live in `prisma/`.

Project notes and diagrams are kept at the repo root in `description.md` and `diagrams(1).drawio`.

## Build, Test, and Development Commands
Run commands from the relevant app directory.

- `npm install`: install dependencies for that app.
- `npm run dev`: start the local dev server (`vite` in `front-end`, `tsx watch src/server.ts` in `back-end`).
- `npm run build`: create a production build. Frontend runs TypeScript build checks and Vite bundling; backend runs `prisma generate` and `tsc`.
- `npm run preview`: preview the built frontend locally.
- `npm run lint`: run ESLint in `app/front-end`.
- `npm run start`: run the compiled backend from `dist/server.js`.

## Coding Style & Naming Conventions
Use TypeScript with strict typing and ES module syntax. Follow the existing 2-space indentation used in JSON and config files. Prefer:

- `PascalCase` for React components
- `camelCase` for variables and functions
- `kebab-case` for new file names unless the file exports a component

Frontend linting is configured in `app/front-end/eslint.config.js` with `typescript-eslint` and React Hooks rules. Keep backend code organized by feature under `src/features/<domain>/`.

## Testing Guidelines
There is no committed test runner yet. For new work, add tests alongside the feature you touch and document the command needed to run them in the app’s `package.json`. Until a shared framework is introduced, treat `npm run build` and frontend `npm run lint` as the minimum pre-PR checks.

## Commit & Pull Request Guidelines
Recent commit history uses short, imperative summaries such as `structure` and `added: db diagram`. Keep commits focused and descriptive, for example `added: product routes` or `fix: frontend header layout`.

Pull requests should include:

- a short summary of the change
- linked issue or task context
- screenshots or screen recordings for UI updates
- notes on environment, schema, or API changes

## Security & Configuration Tips
Do not commit secrets or `.env` files. Review Prisma and server config changes carefully, and call out any new environment variables or external service dependencies in the PR description.
