'use client';

import { useState, useEffect } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);

  // Éviter les erreurs d'hydratation en rendant le composant uniquement côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAcceptAll = () => {
    // Définir les cookies pour chaque type
    Cookies.set('cookie_essential', 'true', { expires: 365 });
    Cookies.set('cookie_analytics', 'true', { expires: 365 });
    Cookies.set('cookie_preferences', 'true', { expires: 365 });
  };

  const handleDeclineAll = () => {
    // Accepter uniquement les cookies essentiels
    Cookies.set('cookie_essential', 'true', { expires: 365 });
    Cookies.set('cookie_analytics', 'false', { expires: 365 });
    Cookies.set('cookie_preferences', 'false', { expires: 365 });
  };

  if (!mounted) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accepter tous les cookies"
      declineButtonText="Uniquement les essentiels"
      enableDeclineButton
      onAccept={handleAcceptAll}
      onDecline={handleDeclineAll}
      style={{ 
        background: "#1e293b", 
        padding: "16px",
        zIndex: 9999,
      }}
      buttonStyle={{ 
        background: "#3b82f6", 
        color: "white", 
        fontSize: "14px",
        borderRadius: "6px",
        padding: "8px 16px"
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid #cbd5e1",
        color: "white",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "8px 16px"
      }}
      contentStyle={{
        flex: "1 0 300px",
        margin: "15px"
      }}
    >
      <span className="text-sm">
        Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer sur ce site, vous acceptez notre utilisation des cookies.{" "}
        <Link href="/politique-confidentialite" className="text-blue-300 hover:underline">
          En savoir plus
        </Link>
      </span>
    </CookieConsent>
  );
}
