import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { ClientFormValues } from '../context';
import { useClient } from '../context';
import { clientFormValidationRules } from './formRules';
import { useClientActions } from './useClientActions';
import { formatDocument } from '../utils/document';

const defaultValues: ClientFormValues = {
  name: '',
  email: '',
  document: '',
  status: 'active',
};

export function useViewClient() {
  const {
    viewDrawerOpen,
    setViewDrawerOpen,
    viewingClientId,
    setViewingClientId,
    setSelectedClient,
  } = useClient();
  const { getClientById } = useClientActions();

  const form = useForm<ClientFormValues>({
    mode: 'onSubmit',
    defaultValues,
  });

  const { register, setValue, watch, reset, formState } = form;

  const registerField = <TFieldName extends keyof ClientFormValues>(
    field: TFieldName
  ) => register(field, clientFormValidationRules[field]);

  const handleDocumentChange = useCallback(
    (value: string) => {
      setValue('document', formatDocument(value), {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const hydrateForm = useCallback(
    (values: ClientFormValues) => {
      reset({
        ...values,
        document: formatDocument(values.document),
      });
    },
    [reset]
  );

  useEffect(() => {
    if (!viewDrawerOpen || !viewingClientId) {
      return;
    }

    const loadClient = async () => {
      const data = await getClientById(viewingClientId);
      if (data) {
        hydrateForm({
          name: data.name,
          email: data.email,
          document: data.document,
          status: data.status,
        });
      }
    };

    void loadClient();
  }, [getClientById, hydrateForm, viewDrawerOpen, viewingClientId]);

  const closeDrawer = useCallback(() => {
    setViewDrawerOpen(false);
    setViewingClientId(null);
    setSelectedClient(null);
    hydrateForm(defaultValues);
  }, [hydrateForm, setSelectedClient, setViewDrawerOpen, setViewingClientId]);

  return {
    registerField,
    watch,
    errors: formState.errors,
    handleDocumentChange,
    viewDrawerOpen,
    closeDrawer,
  };
}
