import getEnvVariable from './env.util.ts';

class DatabaseConfig {
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_USERNAME: string;
  readonly DB_PASSWORD: string;
  readonly DB_NAME: string;
  readonly DB_URL: string;

  constructor() {
    this.DB_HOST = getEnvVariable('DB_HOST') as string || 'localhost';
    this.DB_PORT = Number(getEnvVariable('DB_PORT')) || 5432;
    this.DB_USERNAME = getEnvVariable('DB_USERNAME') as string || 'postgres';
    this.DB_PASSWORD = getEnvVariable('DB_PASSWORD') as string || 'password';
    this.DB_NAME = getEnvVariable('DB_NAME') as string || 'mydatabase';
    this.DB_URL = this.buildDatabaseUrl();
  }

  private buildDatabaseUrl(): string {
    return `postgres://${this.DB_USERNAME}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`;
  }

}

export default DatabaseConfig;
