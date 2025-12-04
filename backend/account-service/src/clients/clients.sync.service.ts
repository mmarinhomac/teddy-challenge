import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

import { Client } from './client.entity';
import { REDIS_CLIENT } from '../config/redis/redis.module';

type ViewUpdate = {
  id: string;
  increment: number;
};

@Injectable()
export class ClientsSyncService {
  private readonly logger = new Logger(ClientsSyncService.name);
  private static readonly VIEW_KEY_PATTERN = 'client:views:*';
  private static readonly SCAN_COUNT = 250;

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis
  ) {}

  @Cron('*/5 * * * *')
  async handleSyncViews(): Promise<void> {
    try {
      const keys = await this.scanViewKeys();
      if (!keys.length) {
        return;
      }

      const updates = await this.readAndResetCounters(keys);
      if (!updates.length) {
        return;
      }

      const persisted = await this.persistUpdates(updates);
      if (persisted > 0) {
        this.logger.log(`Synced view counters for ${persisted} clients`);
      }
    } catch (error) {
      this.logger.error(
        'Failed to sync client view counters',
        error.stack ?? error.message
      );
    }
  }

  private async scanViewKeys(): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, batch] = await this.redisClient.scan(
        cursor,
        'MATCH',
        ClientsSyncService.VIEW_KEY_PATTERN,
        'COUNT',
        ClientsSyncService.SCAN_COUNT
      );
      cursor = nextCursor;
      if (batch.length) {
        keys.push(...batch);
      }
    } while (cursor !== '0');

    return keys;
  }

  private async readAndResetCounters(keys: string[]): Promise<ViewUpdate[]> {
    if (!keys.length) {
      return [];
    }

    const pipeline = this.redisClient.pipeline();
    keys.forEach((key) => pipeline.call('GETDEL', key));
    const responses = await pipeline.exec();

    if (!responses) {
      return [];
    }

    const updates: ViewUpdate[] = [];

    responses.forEach(([error, value], index) => {
      const key = keys[index];
      if (error) {
        this.logger.error(
          `Failed to read Redis counter for ${key}`,
          error.stack ?? error.message
        );
        return;
      }

      const increment = Number(value);
      if (!Number.isFinite(increment) || increment <= 0) {
        return;
      }

      const clientId = this.extractClientId(key);
      if (clientId) {
        updates.push({ id: clientId, increment });
      }
    });

    return updates;
  }

  private async persistUpdates(updates: ViewUpdate[]): Promise<number> {
    if (!updates.length) {
      return 0;
    }

    const valuesSql = updates
      .map((_, index) => `($${index * 2 + 1}::uuid, $${index * 2 + 2}::int)`)
      .join(', ');
    const params = updates.flatMap(({ id, increment }) => [id, increment]);

    const sql = `
      UPDATE clients AS c
      SET view_count = c.view_count + v.increment
      FROM (VALUES ${valuesSql}) AS v(id, increment)
      WHERE c.id = v.id
      RETURNING c.id;
    `;

    const result = await this.clientsRepository.query(sql, params);
    const updatedCount = Array.isArray(result) ? result.length : 0;

    if (updatedCount < updates.length) {
      const skipped = updates.length - updatedCount;
      this.logger.warn(
        `Skipped ${skipped} Redis view counters for missing clients`
      );
    }

    return updatedCount;
  }

  private extractClientId(key: string): string | null {
    const segments = key.split(':');
    return segments.length ? segments[segments.length - 1] : null;
  }
}
