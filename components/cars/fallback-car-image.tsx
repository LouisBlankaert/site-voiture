'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FallbackCarImageProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function FallbackCarImage({
  alt,
  className,
  width = 400,
  height = 300,
}: FallbackCarImageProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-md bg-muted',
      className
    )}>
      <Image
        src="/images/car-placeholder.jpg"
        alt={alt || "Image de voiture non disponible"}
        width={width}
        height={height}
        className="object-cover w-full h-full"
        unoptimized={true}
      />
    </div>
  );
}
