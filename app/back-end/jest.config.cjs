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
    '^\\.\\./config/app\\.config\\.js$': '<rootDir>/src/config/app.config.ts',
    '^\\./error\\.handler\\.js$': '<rootDir>/src/middlewares/error.handler.ts',
    '^\\./rest\\.response\\.js$': '<rootDir>/src/middlewares/rest.response.ts',
    '^\\./validation\\.js$': '<rootDir>/src/middlewares/validation.ts',
    '^\\./validation\\.middleware\\.js$': '<rootDir>/src/middlewares/validation.middleware.ts',
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
