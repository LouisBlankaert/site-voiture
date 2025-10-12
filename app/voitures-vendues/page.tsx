'use client';

import { useState, useEffect, useCallback } from 'react';
import { CarGrid } from '@/components/cars/car-grid';
import { FilterSidebar } from '@/components/cars/filter-sidebar-simple';
import { Car } from '@/types/car';
import { Skeleton } from '@/components/ui/skeleton';

export default function VoituresVenduesPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    brand?: string;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    minPrice: number;
    maxPrice: number;
    minYear: number;
    maxYear: number;
  }>({
    minPrice: 0,
    maxPrice: 100000,
    minYear: 2000,
    maxYear: new Date().getFullYear()
  });

  // Charger les voitures vendues
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars/sold');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Erreur lors du chargement des voitures vendues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Gérer le changement de filtres (mémorisé avec useCallback)
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  // Filtrer les voitures en fonction des filtres
  const filteredCars = cars.filter(car => {
    // Filtre par marque
    if (filters.brand && car.brand !== filters.brand) {
      return false;
    }
    
    // Filtre par prix
    if (car.price < filters.minPrice || car.price > filters.maxPrice) {
      return false;
    }
    
    // Filtre par année
    if (car.year < filters.minYear || car.year > filters.maxYear) {
      return false;
    }
    
    // Filtre par type de carburant
    if (filters.fuelType && car.fuelType !== filters.fuelType) {
      return false;
    }
    
    // Filtre par type de transmission
    if (filters.transmission && car.transmission !== filters.transmission) {
      return false;
    }
    
    // Filtre par type de carrosserie
    if (filters.bodyType && car.bodyType !== filters.bodyType) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Voitures Vendues</h1>
      <p className="text-muted-foreground mb-8">
        Ces véhicules ont déjà trouvé preneur. Découvrez notre historique de ventes.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtres */}
        <div className="hidden lg:block">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Liste des voitures */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-muted-foreground">
                  {filteredCars.length} {filteredCars.length === 1 ? 'voiture vendue' : 'voitures vendues'}
                  {filteredCars.length !== cars.length && ` (sur ${cars.length} au total)`}
                </p>
              </div>
              <CarGrid cars={filteredCars} soldBadge={true} />
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Aucune voiture vendue pour le moment</h3>
              <p className="text-muted-foreground">
                Revenez bientôt pour voir notre historique de ventes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
