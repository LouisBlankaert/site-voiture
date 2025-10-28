'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { FallbackCarImage } from './fallback-car-image';

interface ProgressiveCarImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProgressiveCarImage({
  src,
  alt,
  className,
  width = 400,
  height = 300,
  priority = false,
}: ProgressiveCarImageProps) {
  // Déboguer la source de l'image
  console.log(`ProgressiveCarImage - Source pour ${alt}:`, src);
  
  // Vérifier si l'URL est relative ou absolue
  const isRelativeUrl = src && !src.startsWith('http') && !src.startsWith('data:');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isError, setIsError] = useState(false);
  const [origin, setOrigin] = useState('');

  // Réinitialiser l'état si la source change
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setCurrentSrc(src);
  }, [src]);

  // Récupérer l'origine du site côté client uniquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Générer une URL pour une version basse qualité (placeholder)
  // Vérifier si src est défini et non vide
  const validSrc = src && src !== '' ? src : '/images/car-placeholder.jpg';
  
  // Construire l'URL complète si nécessaire (en utilisant l'origine récupérée côté client)
  const fullSrc = isRelativeUrl && origin ? `${origin}${validSrc}` : validSrc;
  const lowQualitySrc = validSrc.includes('?') 
    ? `${validSrc}&quality=10&w=50` 
    : `${validSrc}?quality=10&w=50`;

  // Gérer les erreurs de chargement d'image
  const handleError = () => {
    console.error(`Erreur de chargement d'image pour ${alt}. Source: ${src}`);
    setIsError(true);
    setCurrentSrc('/images/car-placeholder.jpg');
    setIsLoading(false);
  };

  // Si l'image est en erreur ou n'a pas de source valide, afficher l'image de remplacement
  if (isError || !src || src === '') {
    return (
      <FallbackCarImage 
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }
  
  return (
    <div className={cn(
      'relative overflow-hidden rounded-md bg-muted',
      className
    )}>
      {/* Afficher un squelette de chargement uniquement au début */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      
      {/* Image principale - simplifié pour éviter les problèmes de disparition */}
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        priority={priority}
        unoptimized={true} // Désactiver l'optimisation pour toutes les images pour éviter les problèmes
      />
    </div>
  );
}
