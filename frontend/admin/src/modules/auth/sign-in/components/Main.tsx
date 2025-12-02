import { useForm } from 'react-hook-form';

import { useSignIn } from '../hooks/useSignIn';
import type { SignInDTO } from '../../types';

import { Button } from '@/shadcn/components/button';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { InputErrorMessage } from '@/shadcn/components/input-error-message';

const defaultValues: SignInDTO = {
  email: '',
  password: '',
};

export default function SignInMain() {
  const methods = useForm<SignInDTO>({ defaultValues });
  const { register } = methods;

  const { onSubmit, loading, errors } = useSignIn();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-background to-muted/30 flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
            <span className="text-primary text-lg">∞</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Entrar
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse sua conta com e-mail e senha
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="group relative space-y-5 rounded-2xl border bg-card/95 p-6 shadow-lg backdrop-blur-sm sm:p-7"
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-11"
              {...register('email', {
                required: 'E-mail é obrigatório.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'E-mail inválido.',
                },
              })}
            />
            <InputErrorMessage name="email" errors={errors} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              className="h-11"
              {...register('password', {
                required: 'Senha é obrigatória.',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres.',
                },
              })}
            />
            <InputErrorMessage name="password" errors={errors} />
          </div>

          <Button type="submit" disabled={loading} className="h-11 w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos Termos e Política de
            Privacidade.
          </div>
        </form>
      </div>
    </div>
  );
}
