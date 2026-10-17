import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2/promise';

import { DatabaseService } from './database.service';

vi.mock('mysql2/promise', () => ({
  createPool: vi.fn(),
}));

describe('DatabaseService', () => {
  const mockConnection = {
    ping: vi.fn(),
    release: vi.fn(),
  };

  const mockPool = {
    getConnection: vi.fn(),
    execute: vi.fn(),
    end: vi.fn(),
  };

  const mockConfigService = {
    getOrThrow: vi.fn((key: string) => {
      const config: Record<string, string> = {
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USER: 'nexora_user',
        DB_PASSWORD: 'test_password',
        DB_NAME: 'nexora_test',
      };

      return config[key];
    }),
  };

  let service: DatabaseService;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPool.getConnection.mockResolvedValue(mockConnection);
    mockPool.execute.mockResolvedValue([[], []]);
    mockPool.end.mockResolvedValue(undefined);
    mockConnection.ping.mockResolvedValue(undefined);

    vi.mocked(createPool).mockReturnValue(
      mockPool as unknown as ReturnType<typeof createPool>,
    );

    service = new DatabaseService(
      mockConfigService as unknown as ConfigService,
    );
  });

  it('deve criar o pool e validar a conexão', async () => {
    await service.onModuleInit();

    expect(createPool).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'localhost',
        port: 3306,
        user: 'nexora_user',
        database: 'nexora_test',
        connectionLimit: 10,
      }),
    );

    expect(mockPool.getConnection).toHaveBeenCalledOnce();
    expect(mockConnection.ping).toHaveBeenCalledOnce();
    expect(mockConnection.release).toHaveBeenCalledOnce();
  });

  it('deve executar uma consulta parametrizada', async () => {
    await service.onModuleInit();

    const expectedRows = [{ id: 1, nome: 'Teste' }];
    mockPool.execute.mockResolvedValueOnce([expectedRows, []]);

    const result = await service.query(
      'SELECT * FROM usuarios WHERE id = ?',
      [1],
    );

    expect(mockPool.execute).toHaveBeenCalledWith(
      'SELECT * FROM usuarios WHERE id = ?',
      [1],
    );

    expect(result).toEqual(expectedRows);
  });

  it('deve liberar a conexão mesmo se o ping falhar', async () => {
    mockConnection.ping.mockRejectedValueOnce(
      new Error('Database unavailable'),
    );

    await expect(service.onModuleInit()).rejects.toThrow(
      'Database unavailable',
    );

    expect(mockConnection.release).toHaveBeenCalledOnce();
  });

  it('deve encerrar o pool ao destruir o módulo', async () => {
    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(mockPool.end).toHaveBeenCalledOnce();
  });
});
