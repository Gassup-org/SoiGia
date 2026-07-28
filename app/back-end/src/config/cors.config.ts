import getEnvVariable from './env.util.ts';

export default class CorsConfig {
  readonly origin: string[];
  readonly methods: string[];
  readonly allowedHeaders: string[];
  readonly credentials: boolean;

  constructor() {
    this.origin = this.getAllowedOrigins();
    this.methods = this.getAllowedMethods();
    this.allowedHeaders = this.getAllowedHeaders();
    this.credentials = this.getCredentials();
  }

  private getAllowedOrigins(): string[] {
    const origins = getEnvVariable('CORS_ALLOWED_ORIGINS') as string;
    return origins ? origins.split(',') : ['*'];
  }

  private getAllowedMethods(): string[] {
    const methods = getEnvVariable('CORS_ALLOWED_METHODS') as string;
    return methods ? methods.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  }

  private getAllowedHeaders(): string[] {
    const headers = getEnvVariable('CORS_ALLOWED_HEADERS') as string;
    return headers ? headers.split(',') : ['Content-Type', 'Authorization'];
  }

  private getCredentials(): boolean {
    const credentials = getEnvVariable('CORS_CREDENTIALS') as string;
    return credentials === 'true';
  }
}
