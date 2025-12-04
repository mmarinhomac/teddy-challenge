import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';

import { AppModule } from '../../app/app.module';
import { seedAdminUser } from './admin-user.seed';
import { seedClients } from './client.seed';

type SeedRunner = {
  name: string;
  run: (app: INestApplicationContext) => Promise<void>;
};

const seeds: SeedRunner[] = [
  { name: 'admin-user', run: seedAdminUser },
  { name: 'clients', run: seedClients },
];

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  let failed = false;

  try {
    for (const seed of seeds) {
      console.log(`Seed: starting ${seed.name}`);
      await seed.run(app);
      console.log(`Seed: finished ${seed.name}`);
    }
  } catch (error) {
    failed = true;
    console.error('Seed: execution failed', error);
  } finally {
    await app.close();
  }

  process.exit(failed ? 1 : 0);
}

bootstrap();
