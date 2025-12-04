import { useCallback, useEffect } from 'react';

import { debounceTimeout } from '@teddy/utils/time';

import { useClient } from '../context';
import { useClientActions } from './useClientActions';

export const useClientEffect = () => {
  const { clientsLoaded } = useClient();
  const { listClients } = useClientActions();

  const loadData = useCallback(() => {
    listClients();
  }, [listClients]);

  useEffect(() => {
    if (clientsLoaded) return;
    debounceTimeout('load-client-data', loadData, 300, 'teddyAdminLayer');
  }, [clientsLoaded, loadData]);
};
