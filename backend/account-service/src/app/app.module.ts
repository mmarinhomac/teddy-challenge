import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppConfigModule } from '../config/config.module';

import { RootController } from './root.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    AppConfigModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production', // depois trocar para migrations
        logging: ['error', 'warn'],
      }),
    }),
  ],
  controllers: [RootController, HealthController],
})
export class AppModule {}
