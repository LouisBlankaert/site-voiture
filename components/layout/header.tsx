import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "./auth-header";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-medium tracking-tight text-primary">AUTOGATE</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
            >
              Accueil
            </Link>
            <Link 
              href="/voitures" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
            >
              Nos Voitures
            </Link>
            <Link 
              href="/voitures-vendues" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
            >
              Voitures Vendues
            </Link>
            <Link 
              href="/avis" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
            >
              Avis Clients
            </Link>
            <Link 
              href="/a-propos" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
            >
              À Propos
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
            >
              Contact
            </Link>
          </nav>
        </div>
        <AuthHeader />
      </div>
    </header>
  );
}
