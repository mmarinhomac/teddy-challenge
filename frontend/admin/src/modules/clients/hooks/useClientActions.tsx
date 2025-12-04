import { useCallback } from 'react';
import { toast } from 'sonner';

import accountService from '@teddy/api-services/account-service';
import type { Client } from '@teddy/api-services/account-service/clients';

import { useClient } from '../context';

export function useClientActions() {
  const {
    setClients,
    setClientsLoaded,
    setClientsLoading,
    setSelectedClient,
    setLoading,
  } = useClient();

  const listClients = useCallback(async () => {
    try {
      setClientsLoading(true);
      const { data, error } = await accountService.clients.list();
      if (error) {
        throw error;
      }

      setClients(data ?? []);
      setClientsLoaded(true);
    } catch (error) {
      console.error('[clients] list error', error);
      toast.error('Não foi possível carregar os clientes.');
      setClientsLoaded(false);
    } finally {
      setClientsLoading(false);
    }
  }, [setClients, setClientsLoaded, setClientsLoading]);

  const getClientById = useCallback(
    async (id: string): Promise<Client | null> => {
      try {
        setLoading(true);
        const { data, error } = await accountService.clients.findById(id);
        if (error || !data) {
          throw error ?? new Error('Cliente não encontrado.');
        }

        setSelectedClient(data);
        return data;
      } catch (error) {
        console.error('[clients] detail error', error);
        toast.error('Não foi possível carregar os dados do cliente.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSelectedClient]
  );

  return {
    listClients,
    getClientById,
  };
}
