import { createContext, useContext, useState, type ReactNode } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

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
  form: UseFormReturn<ClientFormValues>;
}

const ClientsContext = createContext<ClientsContextValue | null>(null);

interface ClientsProviderProps {
  children: ReactNode;
}

export function ClientsProvider({ children }: ClientsProviderProps) {
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
