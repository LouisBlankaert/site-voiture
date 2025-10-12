"use client";

import { useState } from "react";
import Image from "next/image";

interface CarImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function CarImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
}: CarImageProps) {
  const [error, setError] = useState(false);
  
  // Image par défaut en cas d'erreur
  const fallbackSrc = "/images/car-placeholder.jpg";
  
  // Gérer l'erreur de chargement d'image
  const handleError = () => {
    setError(true);
  };

  // Utiliser l'image par défaut si src est vide ou en cas d'erreur
  const imageSrc = !src || src === '' || error ? fallbackSrc : src;
  
  console.log('CarImage - src:', src);
  console.log('CarImage - imageSrc:', imageSrc);
  
  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized={imageSrc.endsWith('.svg')}
    />
  );
}
