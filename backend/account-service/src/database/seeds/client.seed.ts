import { INestApplicationContext } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '../../clients/client.entity';

const TOTAL_CLIENTS = 80;
const VIEW_COUNT_MIN = 1;
const VIEW_COUNT_MAX = 5;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

type Period = {
  label: string;
  percentage: number;
  minDaysAgo: number;
  maxDaysAgo: number;
};

const PERIODS: Period[] = [
  { label: 'historical', percentage: 0.6, minDaysAgo: 30, maxDaysAgo: 90 },
  { label: 'recent', percentage: 0.3, minDaysAgo: 7, maxDaysAgo: 30 },
  { label: 'immediate', percentage: 0.1, minDaysAgo: 0, maxDaysAgo: 7 },
];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDateBetween = (minDaysAgo: number, maxDaysAgo: number): Date => {
  const now = Date.now();
  const min = now - maxDaysAgo * MS_IN_DAY;
  const max = now - minDaysAgo * MS_IN_DAY;
  const timestamp = randomInt(min, max);
  return new Date(timestamp);
};

const generateDocument = (index: number): string => {
  const base = (10000000000 + index).toString();
  return base.padEnd(11, '0');
};

export async function seedClients(app: INestApplicationContext): Promise<void> {
  const clientsRepository = app.get<Repository<Client>>(
    getRepositoryToken(Client)
  );

  const existingCount = await clientsRepository.count();
  if (existingCount >= TOTAL_CLIENTS) {
    console.log(
      `Seed: ${existingCount} clients already exist, skipping client.seed.ts`
    );
    return;
  }

  const clients: Client[] = [];
  let sequence = existingCount + 1;

  let generated = 0;

  PERIODS.forEach((period, periodIndex) => {
    let targetCount = Math.floor(TOTAL_CLIENTS * period.percentage);
    if (periodIndex === PERIODS.length - 1) {
      targetCount = TOTAL_CLIENTS - generated;
    }

    for (let i = 0; i < targetCount; i++) {
      const createdAt = randomDateBetween(period.minDaysAgo, period.maxDaysAgo);
      const name = `Cliente Seed ${periodIndex + 1}-${sequence}`;
      const email = `cliente.seed.${sequence}@teddy.com`;
      const document = generateDocument(sequence);

      const client = clientsRepository.create({
        name,
        email,
        document,
        status: 'active',
        viewCount: randomInt(VIEW_COUNT_MIN, VIEW_COUNT_MAX),
      });

      client.createdAt = createdAt;
      client.updatedAt = createdAt;

      clients.push(client);
      sequence += 1;
      generated += 1;
    }
  });

  const saved = await clientsRepository.save(clients);
  console.log(`Seed: generated ${saved.length} historical clients.`);
}
