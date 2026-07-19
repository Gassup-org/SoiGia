import dotenv from 'dotenv';
import path from 'path';

const configPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: configPath });

export default function getEnvVariable(key: string): string | undefined {
  const value = process.env[key];
  return value !== undefined ? value : undefined;
}