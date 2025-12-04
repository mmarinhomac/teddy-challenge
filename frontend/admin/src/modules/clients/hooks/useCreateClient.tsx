import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import accountService from '@teddy/api-services/account-service';

import { useClient } from '../context';
import type { ClientFormValues } from '../context';
import { clientFormValidationRules } from './formRules';
import { useClientActions } from './useClientActions';
import { formatDocument, normalizeDocument } from '../utils/document';
import { getApiErrorMessage } from '../utils/error';

export function useCreateClient() {
  const { setLoading, loading, setDrawerOpen } = useClient();
  const { listClients } = useClientActions();
  const form = useFormContext<ClientFormValues>();
  const { register, handleSubmit, reset, setValue, watch, formState } = form;

  const registerField = <TFieldName extends keyof ClientFormValues>(
    field: TFieldName
  ) => register(field, clientFormValidationRules[field]);

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
          const message = getApiErrorMessage(
            error,
            'Não foi possível criar o cliente.'
          );
          toast.error(message);
          return;
        }

        toast.success('Cliente criado com sucesso.');
        await listClients();
        reset();
        setDrawerOpen(false);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          'Erro inesperado ao criar o cliente.'
        );
        toast.error(message);
        console.error('[clients] create error', error);
      } finally {
        setLoading(false);
      }
    },
    [listClients, reset, setDrawerOpen, setLoading]
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
