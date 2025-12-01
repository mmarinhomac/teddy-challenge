import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

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
