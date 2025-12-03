import { useFormContext } from 'react-hook-form';

import { useAuth } from '@teddy/auth';

import accountService from '@teddy/api-services/account-service';
import type { SignInDTO } from '../../types';
import { toast } from 'sonner';

type SignInForm = SignInDTO;

export function useSignIn() {
  const { state, setLoading, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useFormContext<SignInForm>();

  const onSubmit = handleSubmit(async (values) => {
    try {
      clearErrors();
      setLoading(true);

      const { data, error } = await accountService.auth.signIn(values);

      if (error || !data || !data.access_token || !data.user) {
        toast.error(error?.message || 'Ocorreu um erro na tentativa de login.');
        return;
      }

      setUser(data.user);
      localStorage.setItem('access_token', data.access_token);

      toast.success('Login realizado com sucesso!');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err: any) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  });

  return {
    loading: state.loading,
    errors: errors,
    onSubmit,
    register,
  };
}
