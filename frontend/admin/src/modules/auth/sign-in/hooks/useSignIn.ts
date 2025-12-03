import { useAuth } from '../../hooks/useAuth';
import { useFormContext } from 'react-hook-form';
import type { SignInDTO } from '../../types';
import accountService from '@teddy/api-services/account-service';

type SignInForm = SignInDTO;

export function useSignIn() {
  const { state, setLoading, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    getValues,
  } = useFormContext<SignInForm>();

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log('Submitting', values);
      const valuesFromGet = getValues();
      console.log('Values from getValues:', valuesFromGet);
      clearErrors();
      setLoading(true);

      const { data, error } = await accountService.auth.signIn(values);

      if (error || !data) {
        console.log('Sign-in error:', error);

        return;
      }

      console.log('Sign-in successful:', data);
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
