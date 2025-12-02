import { useAuth } from '../../hooks/useAuth';
import { useFormContext } from 'react-hook-form';
import type { SignUpDTO } from '../../types';
import { mockSignUp } from '../../mocks/authService';

type SignUpForm = SignUpDTO;

export function useSignUp() {
  const { state, setLoading, setUser } = useAuth();
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<SignUpForm>();

  const onSubmit = handleSubmit(async (values) => {
    clearErrors();
    setLoading(true);

    try {
      const user = await mockSignUp({ ...values, name: values.name.trim() });
      setUser(user);
    } catch (err: any) {
      const e =
        err?.code && err?.message
          ? err
          : { code: 'UNKNOWN', message: 'Erro inesperado.' };
      setError('email', e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  });

  return {
    loading: state.loading,
    errors: errors,
    onSubmit,
  };
}
