"use client";

import { useState, useEffect } from "react";
import { CarGrid } from "@/components/cars/car-grid";
import { CarFilters } from "@/components/cars/car-filters";
import { Car, CarBrand, FuelType, TransmissionType, CarBodyType } from "@/types/car";
import { demoCars } from "@/lib/demo-cars";

// Interface pour les données de voiture venant de la BD
interface DbCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  power: number;
  color: string;
  doors: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  mainImageId: string | null;
  features: { id: string; name: string; carId: string; }[];
  images: { id: string; url: string; carId: string; isMain: boolean; }[];
}

// Interface pour les filtres
interface FilterValues {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
}

export default function VoituresPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        console.log('Tentative de récupération des voitures depuis l\'API...');
        const response = await fetch('/api/cars');
        
        if (response.ok) {
          const data = await response.json();
          console.log('API response:', data);
          
          if (Array.isArray(data) && data.length > 0) {
            // Convertir les données de la BD au format attendu par l'application
            const formattedCars: Car[] = data.map((car: DbCar) => {
              const mainImage = car.images.find(img => img.isMain)?.url || 
                               car.images[0]?.url || 
                               '/images/car-placeholder.jpg';
              
              return {
                id: car.id,
                brand: car.brand as CarBrand,
                model: car.model,
                year: car.year,
                price: Number(car.price),
                mileage: car.mileage,
                fuelType: car.fuelType as FuelType,
                transmission: car.transmission as TransmissionType,
                bodyType: car.bodyType as CarBodyType,
                power: car.power,
                color: car.color,
                doors: car.doors,
                description: car.description,
                status: car.status as any,
                features: car.features.map(feature => feature.name),
                images: car.images.filter(img => !img.isMain).map(img => img.url),
                mainImage: mainImage,
                createdAt: new Date(car.createdAt),
                updatedAt: new Date(car.updatedAt)
              };
            });
            
            // Mettre à jour les voitures uniquement si nous en avons récupéré
            setCars(formattedCars);
            setFilteredCars(formattedCars);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des voitures:', error);
        // En cas d'erreur, on garde les voitures de démonstration
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  const handleFilterChange = (filters: FilterValues) => {
    const filtered = cars.filter((car) => {
      // Filtre par marque
      if (filters.brand && car.brand !== filters.brand) {
        return false;
      }

      // Filtre par prix min et max
      if (filters.minPrice && car.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && car.price > filters.maxPrice) {
        return false;
      }

      // Filtre par année min et max
      if (filters.minYear && car.year < filters.minYear) {
        return false;
      }
      if (filters.maxYear && car.year > filters.maxYear) {
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

    setFilteredCars(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nos Véhicules</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <CarFilters onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Chargement des véhicules...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">Aucun véhicule trouvé</p>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-muted-foreground">
                  {filteredCars.length} véhicule{filteredCars.length > 1 ? 's' : ''} trouvé{filteredCars.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <CarGrid cars={filteredCars} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
