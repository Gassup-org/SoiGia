import getEnvVariable from "./env.util.ts";
import DatabaseConfig from "./database.config.ts";
import CorsConfig from "./cors.config.ts";

export class AppConfig {
  readonly PORT: number;
  readonly NODE_ENV: string;
  readonly CLIENT_URL: string;

  readonly JWT_ACCESS_SECRET: string;
  readonly JWT_REFRESH_SECRET: string;
  readonly JWT_ACCESS_EXPIRES_IN: string;
  readonly JWT_REFRESH_EXPIRES_IN: string;

  readonly databaseConfig: DatabaseConfig;
  readonly corsOptions: CorsConfig;

  constructor() {
    this.PORT = Number(getEnvVariable("PORT")) || 3000;
    this.NODE_ENV = getEnvVariable("NODE_ENV") as string || "development";
    this.CLIENT_URL = getEnvVariable("CLIENT_URL") as string || "http://localhost:5173";

    this.JWT_ACCESS_SECRET = getEnvVariable("JWT_ACCESS_SECRET") as string || "default_access_secret";
    this.JWT_REFRESH_SECRET = getEnvVariable("JWT_REFRESH_SECRET") as string || "default_refresh_secret";
    this.JWT_ACCESS_EXPIRES_IN = getEnvVariable("JWT_ACCESS_EXPIRES_IN") as string || "15m";
    this.JWT_REFRESH_EXPIRES_IN = getEnvVariable("JWT_REFRESH_EXPIRES_IN") as string || "7d";

    this.databaseConfig = new DatabaseConfig();
    this.corsOptions = new CorsConfig();
  }
}

const appConfig = new AppConfig();
export default appConfig;
