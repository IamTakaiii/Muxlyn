import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getEnv } from '../config/env';
import * as schema from './schema';

const env = getEnv();
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 20000,
});

export const db = drizzle({ client: pool, schema });
export { pool as pgPool };
