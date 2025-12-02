import { useState } from 'react';

export default function CookieAccept() {
  const [accepted, setAccepted] = useState(
    typeof window !== 'undefined' &&
      window.localStorage.getItem('cookieAccepted') === 'true'
  );

  if (accepted) return null;

  const handleAccept = () => {
    setAccepted(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cookieAccepted', 'true');
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md bg-white/90 border border-gray-200 shadow-lg rounded-md px-4 py-3 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-sm">
      <span className="text-xs text-gray-700 flex-1 text-center sm:text-left">
        Usamos cookies para melhorar sua experiência. Ao continuar navegando,
        você concorda com nossa
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-orange-500 hover:text-orange-500/80 transition ml-1"
        >
          Política de Privacidade
        </a>
        .
      </span>
      <button
        onClick={handleAccept}
        className="bg-orange-500 text-white px-4 py-1.5 rounded-md text-xs font-medium shadow hover:bg-orange-500/90 transition"
      >
        Entendi
      </button>
    </div>
  );
}
