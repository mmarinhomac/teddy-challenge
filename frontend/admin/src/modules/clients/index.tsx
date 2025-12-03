import { CreateClientDrawer } from './components/create-client';

import { ClientsProvider } from './context';

export function ClientsDrawer() {
  return (
    <ClientsProvider>
      <CreateClientDrawer />
    </ClientsProvider>
  );
}
