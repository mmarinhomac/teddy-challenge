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

  const resolveErrorMessage = useCallback(
    (error: unknown, fallback: string) => {
      if (error && typeof error === 'object') {
        type MaybeAxiosError = {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        const message = (error as MaybeAxiosError).response?.data?.message;
        if (typeof message === 'string' && message.trim().length > 0) {
          return message;
        }
      }
      return fallback;
    },
    []
  );

  const listClients = useCallback(async (): Promise<boolean> => {
    try {
      setClientsLoading(true);
      const { data, error } = await accountService.clients.list();
      if (error) {
        const message = resolveErrorMessage(
          error,
          'Não foi possível carregar os clientes.'
        );
        toast.error(message);
        setClientsLoaded(false);
        return false;
      }

      setClients(data ?? []);
      setClientsLoaded(true);
      return true;
    } catch (error) {
      console.error('[clients] list error', error);
      const message = resolveErrorMessage(
        error,
        'Não foi possível carregar os clientes.'
      );
      toast.error(message);
      setClientsLoaded(false);
      return false;
    } finally {
      setClientsLoading(false);
    }
  }, [resolveErrorMessage, setClients, setClientsLoaded, setClientsLoading]);

  const getClientById = useCallback(
    async (id: string): Promise<Client | null> => {
      try {
        setLoading(true);
        const { data, error } = await accountService.clients.findById(id);
        if (error || !data) {
          const message = resolveErrorMessage(
            error,
            'Não foi possível carregar os dados do cliente.'
          );
          toast.error(message);
          setSelectedClient(null);
          return null;
        }

        setSelectedClient(data);
        return data;
      } catch (error) {
        console.error('[clients] detail error', error);
        const message = resolveErrorMessage(
          error,
          'Não foi possível carregar os dados do cliente.'
        );
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [resolveErrorMessage, setLoading, setSelectedClient]
  );

  const deleteClient = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        const { error } = await accountService.clients.remove(id);
        if (error) {
          const message = resolveErrorMessage(
            error,
            'Não foi possível remover o cliente.'
          );
          toast.error(message);
          return false;
        }

        setClients((prev) => prev.filter((client) => client.id !== id));
        toast.success('Cliente removido com sucesso.');
        return true;
      } catch (error) {
        console.error('[clients] delete error', error);
        const message = resolveErrorMessage(
          error,
          'Não foi possível remover o cliente.'
        );
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [resolveErrorMessage, setClients, setLoading]
  );

  return {
    listClients,
    getClientById,
    deleteClient,
  };
}
