import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("root workspace files exist with required scripts", () => {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const workspace = fs.readFileSync("pnpm-workspace.yaml", "utf8");
  const envExample = fs.readFileSync(".env.example", "utf8");
  const gitignore = fs.readFileSync(".gitignore", "utf8");

  assert.equal(packageJson.name, "soigia");
  assert.deepEqual(packageJson.scripts, {
    dev: 'concurrently -n web,api,worker -c cyan,green,yellow "pnpm web:dev" "pnpm api:dev" "pnpm worker:dev"',
    "web:dev": "pnpm --filter @soigia/web dev",
    "api:dev": "pnpm --filter @soigia/api dev",
    "worker:dev": "uv run --project workers/crawler python -m src.main",
    build: "pnpm -r --if-present build",
    lint: "pnpm -r --if-present lint && pnpm worker:lint",
    test: "pnpm -r --if-present test && pnpm worker:test",
    typecheck: "pnpm -r --if-present typecheck",
    format: "prettier --check .",
    "worker:lint": "uv run --project workers/crawler ruff check .",
    "worker:test": "uv run --project workers/crawler pytest",
  });

  assert.match(workspace, /apps\/\*/);
  assert.match(workspace, /packages\/\*/);

  assert.match(envExample, /DATABASE_URL=/);
  assert.match(envExample, /REDIS_URL=/);
  assert.match(envExample, /RABBITMQ_URL=/);

  assert.match(gitignore, /^node_modules$/m);
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^workers\/crawler\/\.venv$/m);
});
