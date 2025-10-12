"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex items-center gap-2">
      {status === "loading" ? (
        <div className="animate-pulse h-10 w-24 bg-muted rounded-md"></div>
      ) : session ? (
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">{session.user.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md overflow-hidden shadow-lg border z-10">
              <div className="px-4 py-2 border-b">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
              <div className="py-1">
                {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                  <>
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      href="/admin/voitures"
                      className="px-4 py-2 text-sm text-primary font-medium hover:bg-muted flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H8c-.7 0-1.5.3-2 .8L3.9 9.9C3.3 10.4 3 11.2 3 12v5c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                      Gestion des voitures
                    </Link>
                    <Link
                      href="/admin/profil"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    {session.user.role === "SUPER_ADMIN" && (
                      <Link
                        href="/admin/super/users"
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gérer les administrateurs
                      </Link>
                    )}
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Aucun bouton visible pour les utilisateurs non connectés
        null
      )}
    </div>
  );
}
