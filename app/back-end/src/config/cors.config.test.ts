import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import CorsConfig from './cors.config.ts';

describe('CorsConfig', () => {
  // Save the original process.env so CORS-specific env changes stay isolated.
  const envBackup = process.env;

  beforeEach(() => {
    // Clear CORS env keys before every test to make defaults predictable.
    process.env = { ...envBackup };
    delete process.env.CORS_ALLOWED_ORIGINS;
    delete process.env.CORS_ALLOWED_METHODS;
    delete process.env.CORS_ALLOWED_HEADERS;
  });

  afterAll(() => {
    // Restore the real process.env after this test file finishes.
    process.env = envBackup;
  });

  it('uses default CORS values when environment variables are missing', () => {
    const config = new CorsConfig();

    // These field names match what the cors package expects.
    expect(config.origin).toEqual(['*']);
    expect(config.methods).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
    expect(config.allowedHeaders).toEqual(['Content-Type', 'Authorization']);
  });

  it('uses CORS environment variables when they are provided', () => {
    // Comma-separated env values become arrays for the cors middleware options.
    process.env.CORS_ALLOWED_ORIGINS = 'http://localhost:5173,https://soigia.example';
    process.env.CORS_ALLOWED_METHODS = 'GET,POST';
    process.env.CORS_ALLOWED_HEADERS = 'Content-Type,Authorization,X-Request-Id';

    const config = new CorsConfig();

    expect(config.origin).toEqual(['http://localhost:5173', 'https://soigia.example']);
    expect(config.methods).toEqual(['GET', 'POST']);
    expect(config.allowedHeaders).toEqual(['Content-Type', 'Authorization', 'X-Request-Id']);
  });
});
