import { AccountServiceInstance, apiResult, ApiResultProps } from '../base';

export interface DashboardTotals {
  totalActiveClients: number;
  totalSystemUsers: number;
  totalClientViews: number;
}

export interface DashboardRecentActivity {
  clientsCreatedLast30Minutes: number;
}

export interface DashboardGrowthItem {
  day: string;
  newClients: number;
  newUsers: number;
}

export interface DashboardResponse {
  totals: DashboardTotals;
  recentActivity: DashboardRecentActivity;
  growthData: DashboardGrowthItem[];
}

export const getDashboard = async (): Promise<
  ApiResultProps<DashboardResponse | null>
> => {
  try {
    const { data } = await AccountServiceInstance.get<DashboardResponse>(
      '/dashboard'
    );
    return apiResult(data, null);
  } catch (error) {
    return apiResult(null, error);
  }
};

export default {
  getDashboard,
};
