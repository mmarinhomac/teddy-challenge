import { DataTable } from './components/data-table';

import { ClientsProvider } from './context';
import { ClientLoader } from './loader';

export function ClientsTable() {
  return (
    <ClientsProvider>
      <ClientLoader />
      <DataTable />
    </ClientsProvider>
  );
}
