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
