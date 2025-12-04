import type { RegisterOptions } from 'react-hook-form';

import type { ClientFormValues } from '../context';
import { isValidDocument } from '../utils/document';

export type ValidationRules = {
  [K in keyof ClientFormValues]: RegisterOptions<ClientFormValues, K>;
};

export const clientFormValidationRules: ValidationRules = {
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
