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

import { ClientFormFields } from './client-form-fields';
import { useViewClient } from '../hooks/useViewClient';

export function ViewClientDrawer() {
  const {
    registerField,
    errors,
    watch,
    handleDocumentChange,
    viewDrawerOpen,
    closeDrawer,
  } = useViewClient();

  const statusValue = watch('status') ?? 'active';
  const documentValue = watch('document') ?? '';

  return (
    <Drawer
      direction="right"
      open={viewDrawerOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDrawer();
        }
      }}
    >
      <DrawerContent
        data-vaul-no-drag
        className="z-1101 !h-full !max-h-none !w-full !m-0 !max-w-none md:!max-w-[600px]"
      >
        <form className="flex flex-col w-full h-full overflow-y-auto pb-8">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              Detalhes do Cliente
            </DrawerTitle>

            <DrawerClose asChild>
              <Button variant="ghost" type="button" onClick={closeDrawer}>
                <XIcon />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <ClientFormFields
            registerField={registerField}
            errors={errors}
            statusValue={statusValue}
            onStatusChange={() => undefined}
            documentValue={documentValue}
            onDocumentChange={handleDocumentChange}
            disabled
          />

          <div className="mt-auto">
            <DrawerFooter>
              <Button type="button" variant="outline" onClick={closeDrawer}>
                Fechar
              </Button>
            </DrawerFooter>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
