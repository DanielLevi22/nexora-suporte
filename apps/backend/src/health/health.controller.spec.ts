import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: {
    check: ReturnType<typeof vi.fn<HealthService['check']>>;
  };

  beforeEach(async () => {
    const healthServiceMock = {
      check: vi.fn<HealthService['check']>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: healthServiceMock,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = healthServiceMock;
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('deve chamar o método check do HealthService', () => {
      controller.check();

      expect(healthService.check).toHaveBeenCalledOnce();
    });

    it('deve retornar os dados fornecidos pelo HealthService', () => {
      const expectedResponse = {
        status: 'ok',
        service: 'nexora-api',
        timestamp: new Date('2026-10-12T10:00:00.000Z'),
      };

      healthService.check.mockReturnValue(expectedResponse);

      const result = controller.check();

      expect(result).toEqual(expectedResponse);
      expect(healthService.check).toHaveBeenCalledOnce();
    });
  });
});
