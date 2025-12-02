import { Separator } from '@/shadcn/components/separator';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      <Separator className="opacity-50" />
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
          <p className="">
            © {year}
            <strong className="mx-1">Teddy Open Finance.</strong>
            Todos os direitos reservados.
          </p>
          <nav className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">
              Privacidade
            </a>
            <a href="#" className="hover:text-foreground">
              Termos de Serviço
            </a>
            <a href="#" className="hover:text-foreground">
              Contato
            </a>
            <a href="#" className="hover:text-foreground">
              Carreiras
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
