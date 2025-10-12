'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface GoogleReviewsProps {
  compact?: boolean;
}

export function GoogleReviews({ compact = false }: GoogleReviewsProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un chargement pour l'iframe Google
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Ce que disent nos clients</h3>
          <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Bientôt disponible
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md flex flex-col items-center justify-center min-h-[120px] text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 mb-2">
                <path d="M17 14V2" />
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H9" />
                <path d="M13 2h2.5a2 2 0 0 1 1.92 1.44L20 12" />
                <path d="M12 14h.01" />
              </svg>
              <p className="text-sm text-muted-foreground">Les avis clients seront bientôt disponibles</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/avis">
              Voir tous nos avis
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled title="En cours d'activation">
            <span className="flex items-center opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-2">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
              </svg>
              Bientôt disponible
            </span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Nos avis clients</h2>
      
      {/* Section étoiles et moyenne temporairement masquée en attendant les vrais avis Google */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <h3 className="font-semibold text-blue-700">Avis en cours d'activation</h3>
        </div>
        <p className="text-blue-600 text-sm">
          Notre profil Google Business est en cours de validation. Les avis seront bientôt disponibles.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col items-center justify-center min-h-[150px] text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 mb-3">
              <path d="M17 14V2" />
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H9" />
              <path d="M13 2h2.5a2 2 0 0 1 1.92 1.44L20 12" />
              <path d="M12 14h.01" />
            </svg>
            <p className="text-muted-foreground mb-1">Les avis clients seront bientôt disponibles</p>
            <p className="text-xs text-muted-foreground">Notre profil Google Business est en cours de validation</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="outline" disabled title="En cours d'activation">
          <span className="flex items-center opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-2">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
            </svg>
            Bientôt disponible
          </span>
        </Button>
      </div>
    </div>
  );
}
