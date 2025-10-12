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
      } catch (err: any) {
        console.error('Erreur lors du chargement des détails de la voiture:', err);
        setError(err.message || 'Impossible de charger les détails de la voiture');
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
        <h1 className="text-2xl font-bold mb-6">Détails de la voiture</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Détails de la voiture</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p>{error || "Voiture non trouvée"}</p>
          <Button 
            onClick={() => router.push('/admin/voitures')} 
            className="mt-4"
          >
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {car.brand} {car.model} ({car.year})
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin/voitures')}>
          Retour à la liste
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CarImageGallery 
            images={car.images} 
            mainImage={car.mainImage} 
            alt={`${car.brand} ${car.model}`} 
          />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Gestion du statut</h2>
            <CarStatusManager car={car} onStatusChange={handleStatusChange} />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Informations générales</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prix</p>
                  <p className="font-medium text-lg">{formatPrice(car.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kilométrage</p>
                  <p className="font-medium">{formatMileage(car.mileage)} km</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Année</p>
                  <p className="font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carburant</p>
                  <p className="font-medium">{car.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-medium">{car.transmission}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Puissance</p>
                  <p className="font-medium">{car.power} ch</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Couleur</p>
                  <p className="font-medium">{car.color}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Portes</p>
                  <p className="font-medium">{car.doors}</p>
                </div>
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
    </div>
  );
}
