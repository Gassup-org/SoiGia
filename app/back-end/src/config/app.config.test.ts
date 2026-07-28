import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { AppConfig } from './app.config.ts';

describe('AppConfig', () => {
  // Save the original process.env so tests can safely replace app config values.
  const envBackup = process.env;

  beforeEach(() => {
    // Clear all env keys AppConfig reads, including nested DatabaseConfig keys.
    process.env = { ...envBackup };
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_ACCESS_EXPIRES_IN;
    delete process.env.JWT_REFRESH_EXPIRES_IN;
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

  it('uses default app values when environment variables are missing', () => {
    const config = new AppConfig();

    // With no relevant env values, AppConfig should expose the hard-coded defaults.
    expect(config.PORT).toBe(3000);
    expect(config.NODE_ENV).toBe('development');
    expect(config.JWT_ACCESS_SECRET).toBe('default_access_secret');
    expect(config.JWT_REFRESH_SECRET).toBe('default_refresh_secret');
    expect(config.JWT_ACCESS_EXPIRES_IN).toBe('15m');
    expect(config.JWT_REFRESH_EXPIRES_IN).toBe('7d');
    expect(config.databaseConfig.DB_URL).toBe('postgres://postgres:password@localhost:5432/mydatabase');
    expect(config.corsOptions.origin).toEqual(['*']);
  });

  it('uses app environment variables when they are provided', () => {
    // Set env values before creating AppConfig because the constructor reads process.env.
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'test';
    process.env.JWT_ACCESS_SECRET = 'access_secret';
    process.env.JWT_REFRESH_SECRET = 'refresh_secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '30m';
    process.env.JWT_REFRESH_EXPIRES_IN = '14d';

    const config = new AppConfig();

    // Provided env values should override the defaults.
    expect(config.PORT).toBe(4000);
    expect(config.NODE_ENV).toBe('test');
    expect(config.JWT_ACCESS_SECRET).toBe('access_secret');
    expect(config.JWT_REFRESH_SECRET).toBe('refresh_secret');
    expect(config.JWT_ACCESS_EXPIRES_IN).toBe('30m');
    expect(config.JWT_REFRESH_EXPIRES_IN).toBe('14d');
  });
});
