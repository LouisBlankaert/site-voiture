import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Logo et description */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-primary tracking-tight">AUTOGATE</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Intermédiaire automobile spécialisé en dépôt-vente, financement et reprise.
          </p>
          <p className="text-sm text-muted-foreground italic">
            "Ouvrez la porte vers votre prochaine voiture. Simplicité, Transparence, Confiance."
          </p>
        </div>
        
        {/* Navigation */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Accueil" },
              { href: "/voitures", label: "Nos Voitures" },
              { href: "/avis", label: "Avis Clients" },
              { href: "/a-propos", label: "À Propos" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Informations */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Informations</h3>
          <ul className="space-y-3">
            {[
              { href: "/mentions-legales", label: "Mentions Légales" },
              { href: "/politique-confidentialite", label: "Confidentialité" },
              { href: "/cgv", label: "CGV" },
              { href: "/preferences-cookies", label: "Préférences Cookies" },
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Contact */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Contact</h3>
          <address className="not-italic text-sm text-muted-foreground space-y-2">
            <p className="text-primary hover:underline">contact.autogate@gmail.com</p>
          </address>
        </div>
        
        {/* Assistance */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Assistance</h3>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Besoin d'aide ?
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Copyright et réseaux sociaux */}
      <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-muted-foreground">
          © {currentYear} AUTOGATE SRL. Société belge. Tous droits réservés.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          {[
            { label: "Instagram", icon: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></> },
          ].map((social) => (
            <a 
              key={social.label}
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors" 
              aria-label={social.label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
