'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CarStatusManager } from '@/components/admin/car-status-manager';
import { Car } from '@/types/car';
import { CarImageGallery } from '@/components/cars/car-image-gallery';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

interface AdminCarDetailPageProps {
  params: {
    id: string;
  };
}

export default function AdminCarDetailPage({ params }: { params: any }) {
  // Utiliser React.use() pour déballer les paramètres
  const resolvedParams = use(params) as { id: string };
  const id = resolvedParams.id;
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les détails de la voiture
  useEffect(() => {
    console.log('Chargement des détails de la voiture avec ID:', id);
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cars/${id}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de la voiture:', err);
        setError('Impossible de charger les détails de la voiture');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  // Gérer la mise à jour du statut
  const handleStatusChange = (updatedCar: Car) => {
    setCar(updatedCar);
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Formater le kilométrage
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('fr-BE').format(mileage);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/voitures" className="text-primary hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour à la liste
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/voitures" className="text-primary hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour à la liste
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p>{error || "Voiture non trouvée"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/voitures" className="text-primary hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Retour à la liste des voitures
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Administration - Gestion de la voiture</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Statut de la voiture</h2>
          <CarStatusManager car={car} onStatusChange={handleStatusChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <CarImageGallery 
          images={car.images} 
          mainImage={car.mainImage} 
          alt={`${car.brand} ${car.model}`} 
        />

        {/* Details Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">
              {car.brand} {car.model}
            </h2>
            <p className="text-xl text-muted-foreground">{car.year}</p>
          </div>

          <div className="text-3xl font-bold text-primary mb-6">
            {formatPrice(car.price)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H8c-.7 0-1.5.3-2 .8L3.9 9.9C3.3 10.4 3 11.2 3 12v5c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              <span>{formatMileage(car.mileage)} km</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M14 6.5a2 2 0 0 0-4 0c0 .5.2 1 .6 1.4L12 9l1.4-1.1c.4-.4.6-.9.6-1.4Z" />
                <path d="M12 13v8" />
                <path d="M12.5 9.5 16 7l2 4-3 2.5" />
                <path d="M11.5 9.5 8 7l-2 4 3 2.5" />
                <path d="m2 19 3-3" />
                <path d="m19 19 3-3" />
              </svg>
              <span>{car.power} ch</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M7 13h10v8H7z" />
                <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5h18V8Z" />
                <path d="M10 8V6a2 2 0 0 1 4 0v2" />
              </svg>
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>{car.doors} portes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
              <span>{car.bodyType}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M11 2a2 2 0 0 0-2 2" />
              </svg>
              <span>{car.color}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{car.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, index) => (
                <Badge key={index} variant="outline">{feature}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button size="lg" className="flex-1" asChild>
              <Link href={`/admin/voitures/${car.id}/edit`}>
                Modifier la voiture
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
