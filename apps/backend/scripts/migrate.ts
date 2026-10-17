import 'dotenv/config';

import { createPool } from 'mysql2/promise';
import { resolve } from 'node:path';
import { runMigrations } from '../src/database/migration-runner';

async function migrate(): Promise<void> {
  const pool = createPool({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 1,
    multipleStatements: false,
  });

  try {
    const migrationsDir = resolve(process.cwd(), 'src/database/migrations');

    await runMigrations(pool, migrationsDir);

    console.log('Migrations finalizadas.');
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error('Erro ao executar migrations:', error);
  process.exitCode = 1;
});
