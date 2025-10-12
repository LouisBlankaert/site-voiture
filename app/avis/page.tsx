'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AvisPage() {
  const router = useRouter();
  
  // Redirection automatique vers la page d'accueil après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-blue-100 p-6 rounded-full inline-flex mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Page temporairement indisponible</h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Notre système d'avis clients est en cours de mise en place. Cette page sera disponible dès que notre profil Google Business aura été validé.
        </p>
        
        <p className="text-muted-foreground mb-8">
          Vous serez redirigé automatiquement vers la page d'accueil dans quelques secondes.
        </p>
        
        <Button asChild size="lg">
          <Link href="/">Retourner à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}
