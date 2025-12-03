import { useCallback } from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';
import { toast } from 'sonner';

import accountService from '@teddy/api-services/account-service';

import { useClient } from '../context';
import type { ClientFormValues } from '../context';
import {
  formatDocument,
  isValidDocument,
  normalizeDocument,
} from '../utils/document';

type ValidationRules = {
  [K in keyof ClientFormValues]: RegisterOptions<ClientFormValues, K>;
};

const validationRules: ValidationRules = {
  name: {
    required: 'O nome é obrigatório.',
    minLength: {
      value: 3,
      message: 'O nome deve ter ao menos 3 caracteres.',
    },
  },
  email: {
    required: 'O e-mail é obrigatório.',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Informe um e-mail válido.',
    },
  },
  document: {
    required: 'O documento é obrigatório.',
    validate: (value) =>
      (isValidDocument(value) && true) || 'Informe um CPF/CNPJ válido.',
  },
  status: {
    required: 'Selecione um status.',
    validate: (value) =>
      value === 'active' ||
      value === 'inactive' ||
      'Selecione um status válido.',
  },
};

export function useCreateClient() {
  const { setLoading, loading, setDrawerOpen } = useClient();
  const form = useFormContext<ClientFormValues>();
  const { register, handleSubmit, reset, setValue, watch, formState } = form;

  const registerField = <TFieldName extends keyof ClientFormValues>(
    field: TFieldName
  ) => register(field, validationRules[field]);

  const handleDocumentChange = useCallback(
    (value: string) => {
      const masked = formatDocument(value);
      setValue('document', masked, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const submitHandler = useCallback(
    async (values: ClientFormValues) => {
      try {
        setLoading(true);

        const payload = {
          ...values,
          document: normalizeDocument(values.document),
        };

        const { data, error } = await accountService.clients.create(payload);

        if (error || !data) {
          toast.error('Não foi possível criar o cliente.');
          return;
        }

        toast.success('Cliente criado com sucesso.');
        reset();
        setDrawerOpen(false);
      } catch (error) {
        toast.error('Erro inesperado ao criar o cliente.');
        console.error('[clients] create error', error);
      } finally {
        setLoading(false);
      }
    },
    [reset, setDrawerOpen, setLoading]
  );

  const onSubmit = handleSubmit(submitHandler);

  return {
    registerField,
    setValue,
    watch,
    errors: formState.errors,
    onSubmit,
    loading,
    handleDocumentChange,
  };
}
