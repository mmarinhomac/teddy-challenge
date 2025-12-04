import { memo } from 'react';
import { type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form';

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
import { InputErrorMessage } from '@/shadcn/components/input-error-message';

import type { ClientFormValues, ClientStatus } from '../context';

interface ClientFormFieldsProps {
  registerField: <TFieldName extends keyof ClientFormValues>(
    field: TFieldName
  ) => UseFormRegisterReturn;
  errors: FieldErrors<ClientFormValues>;
  statusValue: ClientStatus;
  onStatusChange: (value: ClientStatus) => void;
  documentValue: string;
  onDocumentChange: (value: string) => void;
  disabled?: boolean;
}

export const ClientFormFields = memo(function ClientFormFields({
  registerField,
  errors,
  statusValue,
  onStatusChange,
  documentValue,
  onDocumentChange,
  disabled = false,
}: ClientFormFieldsProps) {
  const nameRegister = registerField('name');
  const emailRegister = registerField('email');
  const documentRegister = registerField('document');
  const statusRegister = registerField('status');

  return (
    <div className="flex flex-col gap-4 px-4 my-4">
      <div className="flex flex-col w-full gap-2">
        <Label>Nome do Cliente</Label>
        <Input placeholder="John Doe" disabled={disabled} {...nameRegister} />
        <InputErrorMessage name="name" errors={errors} />
      </div>

      <div className="flex flex-col w-full gap-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="john.doe@example.com"
          disabled={disabled}
          {...emailRegister}
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
            onChange={(event) => onDocumentChange(event.target.value)}
            disabled={disabled}
          />
          <InputErrorMessage name="document" errors={errors} />
        </div>

        <div className="flex flex-col w-full gap-2">
          <Label>Status</Label>
          <Select
            value={statusValue}
            onValueChange={(value) => {
              if (value === 'active' || value === 'inactive') {
                onStatusChange(value);
              }
            }}
            disabled={disabled}
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
  );
});
