/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^\\./app\\.config\\.js$': '<rootDir>/src/config/app.config.ts',
    '^\\./cors\\.config\\.js$': '<rootDir>/src/config/cors.config.ts',
    '^\\./database\\.config\\.js$': '<rootDir>/src/config/database.config.ts',
    '^\\./env\\.util\\.js$': '<rootDir>/src/config/env.util.ts',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        useESM: true,
      },
    ],
  },
};
