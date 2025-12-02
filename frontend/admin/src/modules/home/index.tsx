import { Logo } from '@/shared/components/Logo';
import Footer from './components/Footer';
import Hero from './components/Hero';

export default function HomeModule() {
  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex mb-4 h-10">
          <a
            href="/"
            aria-label="Ir para página inicial"
            className="inline-flex"
          >
            <Logo />
          </a>
        </div>
      </div>

      <Hero />
      <Footer />
    </main>
  );
}
