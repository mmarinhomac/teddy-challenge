import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth } from '@teddy/auth';

import accountService from '@teddy/api-services/account-service';
import type { SignInDTO } from '../../types';

type SignInForm = SignInDTO;

export function useSignIn() {
  const navigate = useNavigate();

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
        navigate('/dashboard');
      }, 1500);
    } catch {
      setUser(null);
      toast.error('Ocorreu um erro na tentativa de login.');
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
