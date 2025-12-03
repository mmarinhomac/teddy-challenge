import { XIcon } from 'lucide-react';
// import { toast } from 'sonner';

import { Button } from '@/shadcn/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shadcn/components/drawer';
import { IconPlus } from '@tabler/icons-react';

// import { useCreateClientActions } from './hooks/useCreateClientActions';
// import { InputErrorMessage } from '@/shadcn/components/input-error-message';
// import { useClientContext } from '../../context';

export function CreateClientDrawer() {
  return (
    <Drawer
      direction={'right'}
      open={true}
      onOpenChange={(bool) => {
        if (bool === false) {
          // customResetForm();
          // setEditOn(false);
        }
        // setCampaignDrawerOpen(bool);
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          Novo Cliente
        </Button>
      </DrawerTrigger>

      <DrawerContent
        data-vaul-no-drag
        className="z-1101 !h-full !max-h-none !w-full !m-0 !max-w-none md:!max-w-[600px]"
      >
        <div className="w-full h-full overflow-y-auto pb-8">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              Novo Cliente
            </DrawerTitle>

            <DrawerClose asChild>
              <Button variant="ghost">
                <XIcon />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 my-4"></div>
          <DrawerFooter>
            <Button onClick={() => {}}>Salvar Cliente</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
