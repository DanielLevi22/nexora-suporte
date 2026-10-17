import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Pool, RowDataPacket } from 'mysql2/promise';

interface MigrationRow extends RowDataPacket {
  version: string;
}

export async function runMigrations(
  pool: Pool,
  migrationsDir: string,
): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      version VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const files = (await readdir(migrationsDir))
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  const [rows] = await pool.query<MigrationRow[]>(
    'SELECT version FROM schema_migrations',
  );

  const executed = new Set(rows.map((row) => row.version));

  for (const file of files) {
    if (executed.has(file)) {
      console.log(`SKIP ${file}`);
      continue;
    }

    const sql = await readFile(join(migrationsDir, file), 'utf8');

    if (!sql.trim()) {
      throw new Error(`Migration vazia: ${file}`);
    }

    await pool.query(sql);

    await pool.execute('INSERT INTO schema_migrations (version) VALUES (?)', [
      file,
    ]);

    console.log(`OK ${file}`);
  }
}
