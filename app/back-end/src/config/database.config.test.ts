import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import DatabaseConfig from './database.config.ts';

describe('DatabaseConfig', () => {
  // Save the original process.env so tests can freely modify database env values.
  const envBackup = process.env;

  beforeEach(() => {
    // Start each test from a clean env state for the database config keys.
    process.env = { ...envBackup };
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_NAME;
  });

  afterAll(() => {
    // Restore the real process.env after this test file finishes.
    process.env = envBackup;
  });

  it('uses default database values when environment variables are missing', () => {
    const config = new DatabaseConfig();

    // When no DB_* env is provided, DatabaseConfig should fall back to local defaults.
    expect(config.DB_HOST).toBe('localhost');
    expect(config.DB_PORT).toBe(5432);
    expect(config.DB_USERNAME).toBe('postgres');
    expect(config.DB_PASSWORD).toBe('password');
    expect(config.DB_NAME).toBe('mydatabase');
    expect(config.DB_URL).toBe('postgres://postgres:password@localhost:5432/mydatabase');
  });

  it('uses database environment variables when they are provided', () => {
    // Set DB_* env values before creating the config because the constructor reads process.env.
    process.env.DB_HOST = 'db';
    process.env.DB_PORT = '5433';
    process.env.DB_USERNAME = 'soigia_user';
    process.env.DB_PASSWORD = 'secret';
    process.env.DB_NAME = 'soigia';

    const config = new DatabaseConfig();

    // Provided env values should override defaults and be reflected in the generated URL.
    expect(config.DB_HOST).toBe('db');
    expect(config.DB_PORT).toBe(5433);
    expect(config.DB_USERNAME).toBe('soigia_user');
    expect(config.DB_PASSWORD).toBe('secret');
    expect(config.DB_NAME).toBe('soigia');
    expect(config.DB_URL).toBe('postgres://soigia_user:secret@db:5433/soigia');
  });
});
