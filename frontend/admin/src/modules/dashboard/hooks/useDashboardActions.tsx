import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import accountService from '@teddy/api-services/account-service';
import { debounceTimeout } from '@teddy/utils/time';

import { useDashboard } from '../context';

export function useDashboardActions() {
  const { setLoaded, setLoading, setData } = useDashboard();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await accountService.dashboard.getDashboard();
      if (error || !data) {
        toast.error('Não foi possível carregar os dados do dashboard.');
        setLoaded(false);
        return false;
      }

      setData(data);
      setLoaded(true);
      return true;
    } catch (error) {
      console.error('[dashboard] load error', error);
      toast.error('Não foi possível carregar os dados do dashboard.');
      setLoaded(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setData, setLoaded, setLoading]);

  useEffect(() => {
    debounceTimeout('load-dashboard-data', loadData, 300, 'teddyAdminLayer');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { loadData };
}
