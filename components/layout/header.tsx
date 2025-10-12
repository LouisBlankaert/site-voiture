"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "./auth-header";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/voitures", label: "Nos Voitures" },
    { href: "/voitures-vendues", label: "Voitures Vendues" },
    { href: "/avis", label: "Avis Clients" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-medium tracking-tight text-primary">AUTOGATE</span>
            </Link>
            
            {/* Menu de navigation desktop */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <AuthHeader />
            
            {/* Bouton hamburger pour mobile */}
            <button 
              className="md:hidden flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu principal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isMenuOpen ? "hidden" : "block"}
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isMenuOpen ? "block" : "hidden"}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-base py-2 font-medium text-foreground/80 transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
