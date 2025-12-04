import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Client } from '../clients/client.entity';
import { User } from '../users/user.entity';

export interface DashboardResponse {
  totals: {
    totalActiveClients: number;
    totalSystemUsers: number;
    totalClientViews: number;
  };
  recentActivity: {
    clientsCreatedLast30Minutes: number;
  };
  growthData: Array<{
    day: string;
    newClients: number;
    newUsers: number;
  }>;
}

const GROWTH_WINDOW_DAYS = 60;

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async getDashboard(): Promise<DashboardResponse> {
    const [
      totalActiveClients,
      totalSystemUsers,
      totalClientViews,
      clientsCreatedLast30Minutes,
      growthData,
    ] = await Promise.all([
      this.clientsRepository.count({
        where: { deletedAt: IsNull(), status: 'active' },
      }),
      this.usersRepository.count(),
      this.getTotalClientViews(),
      this.getClientsCreatedLast30Minutes(),
      this.getGrowthData(),
    ]);

    return {
      totals: {
        totalActiveClients,
        totalSystemUsers,
        totalClientViews,
      },
      recentActivity: {
        clientsCreatedLast30Minutes,
      },
      growthData,
    };
  }

  private async getTotalClientViews(): Promise<number> {
    const result = await this.clientsRepository
      .createQueryBuilder('client')
      .select('COALESCE(SUM(client.viewCount), 0)', 'total')
      .getRawOne<{ total: string }>();

    return Number(result?.total ?? 0);
  }

  private async getClientsCreatedLast30Minutes(): Promise<number> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const result = await this.clientsRepository
      .createQueryBuilder('client')
      .select('COUNT(client.id)', 'count')
      .where('client.createdAt >= :from', { from: thirtyMinutesAgo })
      .andWhere('client.deletedAt IS NULL')
      .getRawOne<{ count: string }>();

    return Number(result?.count ?? 0);
  }

  private async getGrowthData(): Promise<DashboardResponse['growthData']> {
    const sql = `
      WITH series AS (
        SELECT generate_series(
          date_trunc('day', NOW()) - INTERVAL '${GROWTH_WINDOW_DAYS} days',
          date_trunc('day', NOW()),
          '1 day'
        ) AS day
      ),
      client_counts AS (
        SELECT date_trunc('day', created_at) AS day, COUNT(*) AS count
        FROM clients
        WHERE created_at >= date_trunc('day', NOW()) - INTERVAL '${GROWTH_WINDOW_DAYS} days'
        GROUP BY 1
      ),
      user_counts AS (
        SELECT date_trunc('day', created_at) AS day, COUNT(*) AS count
        FROM users
        WHERE created_at >= date_trunc('day', NOW()) - INTERVAL '${GROWTH_WINDOW_DAYS} days'
        GROUP BY 1
      )
      SELECT
        to_char(series.day, 'YYYY-MM-DD') AS day,
        COALESCE(client_counts.count, 0) AS "newClients",
        COALESCE(user_counts.count, 0) AS "newUsers"
      FROM series
      LEFT JOIN client_counts ON client_counts.day = series.day
      LEFT JOIN user_counts ON user_counts.day = series.day
      ORDER BY series.day;
    `;

    type GrowthRow = {
      day: string;
      newClients: string | number | null;
      newUsers: string | number | null;
    };

    const rows: GrowthRow[] = await this.clientsRepository.query(sql);

    return rows.map((row) => ({
      day: row.day,
      newClients: Number(row.newClients ?? 0),
      newUsers: Number(row.newUsers ?? 0),
    }));
  }
}
