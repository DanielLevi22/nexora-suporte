import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      service: 'nexora-api',
      timestamp: new Date(),
    };
  }
}
