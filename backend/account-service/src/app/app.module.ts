import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule } from '../config/config.module';

import { RootController } from './root.controller';
import { HealthController } from './health.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ClientsModule } from '../clients/clients.module';
import { RedisModule } from '../config/redis/redis.module';
import { DatabaseModule } from '../config/database/database.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    AppConfigModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    ClientsModule,
    RedisModule,
    DashboardModule,
  ],
  controllers: [RootController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
