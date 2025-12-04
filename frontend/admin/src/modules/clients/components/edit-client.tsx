import { XIcon } from 'lucide-react';

import { Button } from '@/shadcn/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shadcn/components/drawer';
import { useClient } from '../context';
import { useEditClient } from '../hooks/useEditClient';
import { ClientFormFields } from './client-form-fields';

export function EditClientDrawer() {
  const { editingClient, setEditDrawerOpen } = useClient();
  const {
    registerField,
    watch,
    setValue,
    errors,
    onSubmit,
    loading,
    handleDocumentChange,
    editDrawerOpen,
    closeDrawer,
  } = useEditClient();

  const statusValue = watch('status') ?? 'active';
  const documentValue = watch('document') ?? '';

  if (!editingClient) {
    return null;
  }

  return (
    <Drawer
      direction="right"
      open={editDrawerOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDrawer();
        } else {
          setEditDrawerOpen(true);
        }
      }}
    >
      <DrawerContent
        data-vaul-no-drag
        className="z-1101 !h-full !max-h-none !w-full !m-0 !max-w-none md:!max-w-[600px]"
      >
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full h-full overflow-y-auto pb-8"
        >
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              Editar Cliente
            </DrawerTitle>

            <DrawerClose asChild>
              <Button variant="ghost" type="button">
                <XIcon />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <ClientFormFields
            registerField={registerField}
            errors={errors}
            statusValue={statusValue}
            onStatusChange={(value) =>
              setValue('status', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            documentValue={documentValue}
            onDocumentChange={handleDocumentChange}
          />

          <div className="mt-auto">
            <DrawerFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Atualizando...' : 'Salvar Alterações'}
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="outline" onClick={closeDrawer}>
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
