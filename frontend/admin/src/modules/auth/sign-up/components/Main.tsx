import { useForm } from 'react-hook-form';
import { useSignUp } from '../hooks/useSignUp';
import type { SignUpDTO } from '../../types';

import { Button } from '@/shadcn/components/button';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { InputErrorMessage } from '@/shadcn/components/input-error-message';

const defaultValues: SignUpDTO = {
  name: '',
  email: '',
  password: '',
};

export default function SignUpMain() {
  const methods = useForm<SignUpDTO>({ defaultValues });
  const { register } = methods;

  const { onSubmit, loading, errors } = useSignUp();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-background to-muted/30 flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
            <span className="text-primary text-lg">∞</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Criar conta
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre-se com nome, e-mail e senha
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="group relative space-y-5 rounded-2xl border bg-card/95 p-6 shadow-lg backdrop-blur-sm sm:p-7"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              className="h-11"
              {...register('name', {
                required: 'Nome é obrigatório.',
                minLength: {
                  value: 2,
                  message: 'Nome deve ter pelo menos 2 caracteres.',
                },
              })}
            />
            <InputErrorMessage name="name" errors={errors} />
          </div>

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
            {loading ? 'Cadastrando...' : 'Cadastrar'}
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
