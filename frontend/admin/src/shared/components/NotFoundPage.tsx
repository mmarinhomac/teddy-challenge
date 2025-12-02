import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <div
          className={`mb-8 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
        >
          <h1 className="text-9xl font-extrabold text-gray-700">
            <span className="sr-only">Error</span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-300 to-orange-500">
              404
            </span>
          </h1>
        </div>

        <div
          className={`mb-10 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Ops! Página não encontrada
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            A página que você está procurando pode ter sido removida, teve seu
            nome alterado ou está temporariamente indisponível.
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-600 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow hover:shadow-md transition duration-200 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          >
            Voltar
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-linear-to-r from-orange-300 to-orange-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-200 focus:ring-2 focus:ring-purple-300 focus:outline-none"
          >
            Página inicial
          </button>
        </div>

        <div
          className={`mt-16 text-sm text-gray-500 transition-all duration-500 delay-800 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>
            Precisa de ajuda? Contate o{' '}
            <span className="text-blue-600 hover:text-blue-800 transition duration-200">
              suporte@teddyopenfinance.com.br
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
