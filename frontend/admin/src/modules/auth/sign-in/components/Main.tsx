import { useSignIn } from '../hooks/useSignIn';

import { Button } from '@/shadcn/components/button';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { InputErrorMessage } from '@/shadcn/components/input-error-message';
import { Logo } from '@/shared/components/Logo';

export default function SignInMain() {
  const { onSubmit, loading, errors, register } = useSignIn();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-background to-muted/30 flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4 h-10">
            <a
              href="/"
              aria-label="Ir para página inicial"
              className="inline-flex"
            >
              <Logo />
            </a>
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
          <div className="pt-2 text-center text-sm">
            <span className="text-muted-foreground">Não tem conta?</span>{' '}
            <a
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
