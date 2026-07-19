import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import getEnvVariable from './env.util.ts';

describe('getEnvVariable', () => {
  // Save the original process.env so each test can change env safely.
  const envBackup = process.env;

  beforeEach(() => {
    // Give every test a fresh copy, so env values from one test do not leak into another.
    process.env = { ...envBackup };
  });

  afterAll(() => {
    // Restore the real process.env after this test file finishes.
    process.env = envBackup;
  });

  it('returns the environment variable value as a string', () => {
    // Numeric-looking secrets should still stay strings.
    process.env.JWT_ACCESS_SECRET = '123456';

    expect(getEnvVariable('JWT_ACCESS_SECRET')).toBe('123456');
  });

  it('returns undefined when the environment variable does not exist', () => {
    // Missing config keys should be explicit undefined, so callers can apply defaults.
    delete process.env.UNKNOWN_CONFIG_KEY;

    expect(getEnvVariable('UNKNOWN_CONFIG_KEY')).toBeUndefined();
  });
});
