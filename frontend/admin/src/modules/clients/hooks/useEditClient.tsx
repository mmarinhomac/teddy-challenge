import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import accountService from '@teddy/api-services/account-service';

import { useClient, type ClientFormValues } from '../context';
import { clientFormValidationRules } from './formRules';
import { formatDocument, normalizeDocument } from '../utils/document';
import { getApiErrorMessage } from '../utils/error';

export function useEditClient() {
  const {
    editingClient,
    setEditingClient,
    editDrawerOpen,
    setEditDrawerOpen,
    setClients,
    setLoading,
    loading,
  } = useClient();

  const form = useForm<ClientFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      document: '',
      status: 'active',
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = form;

  useEffect(() => {
    if (editingClient) {
      reset({
        name: editingClient.name,
        email: editingClient.email,
        document: formatDocument(editingClient.document),
        status: editingClient.status,
      });
    } else {
      reset({
        name: '',
        email: '',
        document: '',
        status: 'active',
      });
    }
  }, [editingClient, reset]);

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

  const closeDrawer = useCallback(() => {
    setEditDrawerOpen(false);
    setEditingClient(null);
  }, [setEditDrawerOpen, setEditingClient]);

  const submitHandler = useCallback(
    async (values: ClientFormValues) => {
      if (!editingClient) {
        return;
      }

      try {
        setLoading(true);
        const payload = {
          ...values,
          document: normalizeDocument(values.document),
        };

        const { data, error } = await accountService.clients.update(
          editingClient.id,
          payload
        );

        if (error || !data) {
          const message = getApiErrorMessage(
            error,
            'Não foi possível atualizar o cliente.'
          );
          toast.error(message);
          return;
        }

        toast.success('Cliente atualizado com sucesso.');
        setClients((prev) =>
          prev.map((client) => (client.id === data.id ? data : client))
        );
        closeDrawer();
      } catch (error) {
        console.error('[clients] update error', error);
        const message = getApiErrorMessage(
          error,
          'Erro inesperado ao atualizar o cliente.'
        );
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [closeDrawer, editingClient, setClients, setLoading]
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
    editDrawerOpen,
    closeDrawer,
    editingClient,
  };
}
