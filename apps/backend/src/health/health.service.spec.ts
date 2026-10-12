import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar status ok e nome do serviço', () => {
    const result = service.check();
    expect(result).toMatchObject({
      status: 'ok',
      service: 'nexora-api',
    });
  });

  it('deve retornar um timestamp do tipo Date', () => {
    const result = service.check();
    expect(result.timestamp).instanceOf(Date);
  });

  it('deve gerar um timestamp correspondente ao momento da execução', () => {
    const before = new Date();
    const result = service.check();
    const after = new Date();

    expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });
  it('deve retornar a data atual', () => {
    const fixedDate = new Date('2026-10-12T10:00:00.000Z');

    vitest.useFakeTimers();
    vitest.setSystemTime(fixedDate);

    try {
      const result = service.check();

      expect(result.timestamp).toEqual(fixedDate);
    } finally {
      vitest.useRealTimers();
    }
  });
});
