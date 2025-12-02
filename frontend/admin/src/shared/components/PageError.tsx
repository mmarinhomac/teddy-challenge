import { useNavigate } from 'react-router-dom';
import { CircleX } from 'lucide-react';

import { Button } from '../../shadcn/components/button';

export const PageError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col justify-center items-center h-full w-full sm:w-[700px]">
        <CircleX className="text-red-500 h-10 w-10" />
        <span className="mt-4 text-center">
          Algo inesperado aconteceu, nós já coletamos o erro para analisar, se o
          problema persistir, entre em contato com o suporte.
        </span>
        <div className="flex gap-4">
          <Button
            className="mt-4 hover:bg-gray-200"
            variant="secondary"
            onClick={() => (window.location.href = '/')}
          >
            Voltar para a página inicial
          </Button>
          <Button
            className="mt-4 hover:bg-gray-500"
            onClick={() => navigate(0)}
          >
            Recarregar página atual
          </Button>
        </div>
      </div>
    </div>
  );
};
