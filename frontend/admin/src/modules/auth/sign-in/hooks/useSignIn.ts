import { useAuth } from '../../hooks/useAuth';
import { useFormContext } from 'react-hook-form';
import type { SignInDTO } from '../../types';
import { mockSignIn } from '../../mocks/authService';

type SignInForm = SignInDTO;

export function useSignIn() {
  const { state, setLoading, setUser } = useAuth();
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<SignInForm>();

  const onSubmit = handleSubmit(async (values) => {
    clearErrors();
    setLoading(true);

    try {
      const user = await mockSignIn(values);
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
