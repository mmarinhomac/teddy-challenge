import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from './app/app.module';
import { User } from './users/user.entity';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const usersRepo = app.get<Repository<User>>(getRepositoryToken(User));

    const email = 'admin@teddy.com';
    const password = 'Teddy@123';

    const existing = await usersRepo.findOne({
      where: { email },
      withDeleted: false,
    });

    if (existing) {
      console.log(`Seed: user ${email} already exists (id=${existing.id}).`);
    } else {
      const user = usersRepo.create({ email, password, is_admin: true });
      // Password will be hashed via entity hooks (BeforeInsert)
      const saved = await usersRepo.save(user);
      console.log(`Seed: created admin user ${email} (id=${saved.id}).`);
    }
  } catch (err) {
    console.error('Seed: failed to create admin user', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();
