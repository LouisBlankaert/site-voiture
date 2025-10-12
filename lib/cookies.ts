import { Cookies } from 'react-cookie-consent';

// Types de cookies utilisés dans l'application
export enum CookieType {
  Essential = 'cookie_essential',
  Analytics = 'cookie_analytics',
  Preferences = 'cookie_preferences',
}

// Vérifier si un type de cookie spécifique est accepté
export function isCookieAccepted(type: CookieType): boolean {
  // Les cookies essentiels sont toujours acceptés
  if (type === CookieType.Essential) return true;
  
  const cookieValue = Cookies.get(type);
  return cookieValue === 'true';
}

// Définir un cookie avec une durée d'expiration (en jours)
export function setCookie(name: string, value: string, days: number = 365): void {
  Cookies.set(name, value, { expires: days });
}

// Récupérer la valeur d'un cookie
export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

// Supprimer un cookie
export function removeCookie(name: string): void {
  Cookies.remove(name);
}

// Vérifier si les préférences de cookies ont été définies
export function hasCookieConsent(): boolean {
  return !!Cookies.get(CookieType.Essential);
}

// Réinitialiser tous les consentements de cookies
export function resetCookieConsent(): void {
  removeCookie(CookieType.Essential);
  removeCookie(CookieType.Analytics);
  removeCookie(CookieType.Preferences);
}
