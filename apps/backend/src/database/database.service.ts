import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPool,
  type ExecuteValues,
  type Pool,
  type QueryResult,
} from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.pool = createPool({
      host: this.configService.getOrThrow<string>('DB_HOST'),
      port: Number(this.configService.getOrThrow<string>('DB_PORT')),
      user: this.configService.getOrThrow<string>('DB_USER'),
      password: this.configService.getOrThrow<string>('DB_PASSWORD'),
      database: this.configService.getOrThrow<string>('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
    });

    const connection = await this.pool.getConnection();

    try {
      await connection.ping();
    } finally {
      connection.release();
    }
  }

  async query<T extends QueryResult>(
    sql: string,
    params: ExecuteValues[] = [],
  ): Promise<T> {
    const [rows] = await this.pool.execute<T>(sql, params);

    return rows;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
