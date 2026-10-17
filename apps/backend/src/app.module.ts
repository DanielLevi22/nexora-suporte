import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ObserveModule } from './observe';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/backend/.env', '.env'],
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? '',
      appSecret: process.env.OBSERVE_APP_SECRET ?? '',
      serviceId: 'nexora-backend',
    }),
    HealthModule,
    DatabaseModule,
  ],
  providers: [AppService],
})
export class AppModule {}
