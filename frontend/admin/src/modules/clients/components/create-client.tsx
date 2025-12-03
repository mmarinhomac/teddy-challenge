import { XIcon } from 'lucide-react';
import { IconPlus } from '@tabler/icons-react';

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

import { Input } from '@/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/select';
import { Label } from '@/shadcn/components/label';

import { useClient } from '../context';
import { useCreateClient } from '../hooks/useCreateClient';
import { InputErrorMessage } from '@/shadcn/components/input-error-message';

export function CreateClientDrawer() {
  const { drawerOpen, setDrawerOpen } = useClient();

  const {
    registerField,
    watch,
    setValue,
    errors,
    onSubmit,
    loading,
    handleDocumentChange,
  } = useCreateClient();

  const statusRegister = registerField('status');
  const statusValue = watch('status') ?? 'active';
  const documentRegister = registerField('document');
  const documentValue = watch('document') ?? '';

  return (
    <Drawer
      direction={'right'}
      open={drawerOpen}
      onOpenChange={(bool) => {
        if (bool === false) {
          // customResetForm();
          // setEditOn(false);
        }
        // setCampaignDrawerOpen(bool);
        setDrawerOpen(bool);
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
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full h-full overflow-y-auto pb-8"
        >
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

          <div className="flex flex-col gap-4 px-4 my-4">
            <div className="flex flex-col w-full gap-2">
              <Label>Nome do Cliente</Label>
              <Input placeholder="John Doe" {...registerField('name')} />
              <InputErrorMessage name="name" errors={errors} />
            </div>

            <div className="flex flex-col w-full gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="john.doe@example.com"
                {...registerField('email')}
              />
              <InputErrorMessage name="email" errors={errors} />
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col w-full gap-2">
                <Label>Documento (CPF/CNPJ)</Label>
                <Input
                  placeholder="000.000.000-00"
                  name={documentRegister.name}
                  ref={documentRegister.ref}
                  onBlur={documentRegister.onBlur}
                  value={documentValue}
                  onChange={(event) =>
                    handleDocumentChange(event.target.value)
                  }
                />
                <InputErrorMessage name="document" errors={errors} />
              </div>

              <div className="flex flex-col w-full gap-2">
                <Label>Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(value) => {
                    if (value === 'active' || value === 'inactive') {
                      setValue('status', value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent className="z-90000000">
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" {...statusRegister} value={statusValue} />
                <InputErrorMessage name="status" errors={errors} />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <DrawerFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Cliente'}
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="outline">
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
