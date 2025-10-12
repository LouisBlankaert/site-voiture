import { Car } from "@/types/car";
import { CarCard } from "@/components/cars/car-card";

interface CarGridProps {
  cars: Car[];
  soldBadge?: boolean; // Afficher un badge "Vendu" sur les voitures vendues
  showStatus?: boolean; // Afficher le statut de la voiture (disponible, réservée, vendue)
}

export function CarGrid({ cars, soldBadge = false, showStatus = false }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium">Aucune voiture trouvée</h3>
        <p className="text-muted-foreground mt-2">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard 
          key={car.id} 
          car={car} 
          soldBadge={soldBadge} 
          showStatus={showStatus} 
        />
      ))}
    </div>
  );
}
