import { BadgeCheck } from 'lucide-react';

import { Button } from '@/shadcn/components/button';

export default function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mb-6 flex items-center gap-3">
          <BadgeCheck />
          Confiado por mais de 1 milhão de clientes
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Somos a fintech de infraestrutura que conecta bancos, fintechs e
          originadores.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Entregamos a tecnologia e a inteligência que libertam dos sistemas
          legados, reduzem custos e escalam a nova geração do crédito.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              window.location.href = '/sign-up';
            }}
          >
            Cadastre-se
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              window.location.href = '/sign-in';
            }}
          >
            Faça o login
          </Button>
        </div>
      </div>
    </section>
  );
}
