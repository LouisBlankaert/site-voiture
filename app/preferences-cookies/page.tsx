'use client';

import { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie-consent';
import { CookieType, resetCookieConsent } from '@/lib/cookies';
import { useToast } from '@/components/ui/use-toast';

export default function CookiePreferencesPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Toujours true car obligatoire
    analytics: false,
    preferences: false,
  });

  // Éviter les erreurs d'hydratation en rendant le composant uniquement côté client
  useEffect(() => {
    setMounted(true);
    
    // Charger les préférences de cookies existantes
    setCookiePreferences({
      essential: true, // Toujours true
      analytics: Cookies.get(CookieType.Analytics) === 'true',
      preferences: Cookies.get(CookieType.Preferences) === 'true',
    });
  }, []);

  const handleSavePreferences = () => {
    // Enregistrer les préférences dans les cookies
    Cookies.set(CookieType.Essential, 'true', { expires: 365 });
    Cookies.set(CookieType.Analytics, cookiePreferences.analytics ? 'true' : 'false', { expires: 365 });
    Cookies.set(CookieType.Preferences, cookiePreferences.preferences ? 'true' : 'false', { expires: 365 });
    
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de cookies ont été enregistrées.",
      variant: "default",
    });
  };

  const handleResetPreferences = () => {
    resetCookieConsent();
    setCookiePreferences({
      essential: true,
      analytics: false,
      preferences: false,
    });
    toast({
      title: "Préférences réinitialisées",
      description: "Vos préférences de cookies ont été réinitialisées.",
      variant: "default",
    });
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Préférences de Cookies</h1>
      
      <div className="prose max-w-none">
        <p className="mb-6">
          Sur cette page, vous pouvez personnaliser vos préférences en matière de cookies. Nous utilisons différents types de cookies pour optimiser votre expérience sur notre site.
        </p>

        <div className="space-y-6 mb-8">
          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Cookies essentiels</h3>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                </p>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  checked={cookiePreferences.essential} 
                  disabled={true}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Cookies analytiques</h3>
                <p className="text-sm text-muted-foreground">
                  Ces cookies nous permettent de comprendre comment vous utilisez notre site afin de l'améliorer.
                </p>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  checked={cookiePreferences.analytics} 
                  onChange={(e) => setCookiePreferences({...cookiePreferences, analytics: e.target.checked})}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Cookies de préférences</h3>
                <p className="text-sm text-muted-foreground">
                  Ces cookies permettent de mémoriser vos choix et préférences pour personnaliser votre expérience.
                </p>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  checked={cookiePreferences.preferences} 
                  onChange={(e) => setCookiePreferences({...cookiePreferences, preferences: e.target.checked})}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleSavePreferences}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Enregistrer mes préférences
          </button>
          <button 
            onClick={handleResetPreferences}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
