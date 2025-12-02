import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const allowedOrigins = configService.get<string>('CORS_ORIGIN')?.split(',');

  app.enableCors({
    origin: allowedOrigins, // Usa a lista de origens
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Teddy Open Finance API')
    .setDescription('MVP - Auth, Clients, Metrics')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  const url = await app.getUrl();
  Logger.log(`🚀 API running: ${url}`);
  Logger.log(`📘 Swagger: ${url}/docs`);
  Logger.log(`❤️ Health: ${url}/healthz`);
}

bootstrap();
