import { createPortal } from 'react-dom';
import { Logo } from './Logo';

export const PageLoading = () => {
  return createPortal(
    <div className="w-screen h-screen fixed top-0 right-0 z-1200 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-2 animate-pulse delay-500">
        <Logo />

        <span className="text-gray-500 text-sm">Carregando...</span>
      </div>
    </div>,
    document.body
  );
};
