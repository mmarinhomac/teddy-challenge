import { createContext, useContext, useState, type ReactNode } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import type { Client } from '@teddy/api-services/account-service/clients';

export type ClientStatus = 'active' | 'inactive';

export type ClientFormValues = {
  name: string;
  email: string;
  document: string;
  status: ClientStatus;
};

interface ClientsContextValue {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  clientsLoading: boolean;
  setClientsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  clientsLoaded: boolean;
  setClientsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: Client | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  form: UseFormReturn<ClientFormValues>;
}

const ClientsContext = createContext<ClientsContextValue | null>(null);

interface ClientsProviderProps {
  children: ReactNode;
}

export function ClientsProvider({ children }: ClientsProviderProps) {
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const form = useForm<ClientFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      document: '',
      status: 'active',
    },
  });

  const value: ClientsContextValue = {
    loading,
    setLoading,
    drawerOpen,
    setDrawerOpen,
    clients,
    setClients,
    clientsLoading,
    setClientsLoading,
    clientsLoaded,
    setClientsLoaded,
    selectedClient,
    setSelectedClient,
    form,
  };

  return (
    <FormProvider {...form}>
      <ClientsContext.Provider value={value}>
        {children}
      </ClientsContext.Provider>
    </FormProvider>
  );
}

export function useClient() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientsProvider');
  }
  return context;
}
