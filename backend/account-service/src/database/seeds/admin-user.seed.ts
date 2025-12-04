import { INestApplicationContext } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/user.entity';

export async function seedAdminUser(
  app: INestApplicationContext
): Promise<void> {
  const usersRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const email = 'admin@teddy.com';
  const password = 'Teddy@123';

  const existing = await usersRepo.findOne({
    where: { email },
    withDeleted: false,
  });

  if (existing) {
    console.log(`Seed: user ${email} already exists (id=${existing.id}).`);
    return;
  }

  const user = usersRepo.create({ email, password, is_admin: true });
  const saved = await usersRepo.save(user);
  console.log(`Seed: created admin user ${email} (id=${saved.id}).`);
}
