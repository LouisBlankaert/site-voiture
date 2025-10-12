import { useState } from "react";
import { CarBrand, FuelType, TransmissionType, CarBodyType } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterValues {
  brand?: CarBrand;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  bodyType?: CarBodyType;
}

interface CarFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export function CarFilters({ onFilterChange }: CarFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({});

  const brands: CarBrand[] = [
    "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", 
    "Kia", "Mercedes", "Nissan", "Opel", "Peugeot", "Renault", "Seat", 
    "Skoda", "Toyota", "Volkswagen", "Volvo"
  ];

  const fuelTypes: FuelType[] = [
    "Essence", "Diesel", "Électrique", "Hybride", "GPL", "Hydrogène"
  ];

  const transmissions: TransmissionType[] = [
    "Manuelle", "Automatique", "Semi-automatique"
  ];

  const bodyTypes: CarBodyType[] = [
    "Berline", "Break", "SUV", "Coupé", "Cabriolet", "Monospace", "Citadine", "Utilitaire"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number | undefined = value;
    
    // Convert numeric values
    if (name.includes('min') || name.includes('max')) {
      parsedValue = value ? Number(value) : undefined;
    }
    
    // Update filters
    setFilters(prev => ({
      ...prev,
      [name]: parsedValue || undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="font-medium text-lg">Filtres</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Marque</label>
        <select 
          name="brand" 
          value={filters.brand || ""} 
          onChange={handleInputChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Toutes les marques</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prix min</label>
          <Input
            type="number"
            name="minPrice"
            placeholder="Min €"
            value={filters.minPrice || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prix max</label>
          <Input
            type="number"
            name="maxPrice"
            placeholder="Max €"
            value={filters.maxPrice || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Année min</label>
          <Input
            type="number"
            name="minYear"
            placeholder="Min"
            value={filters.minYear || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Année max</label>
          <Input
            type="number"
            name="maxYear"
            placeholder="Max"
            value={filters.maxYear || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Carburant</label>
        <select 
          name="fuelType" 
          value={filters.fuelType || ""} 
          onChange={handleInputChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Tous les carburants</option>
          {fuelTypes.map(fuel => (
            <option key={fuel} value={fuel}>{fuel}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Transmission</label>
        <select 
          name="transmission" 
          value={filters.transmission || ""} 
          onChange={handleInputChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Toutes les transmissions</option>
          {transmissions.map(transmission => (
            <option key={transmission} value={transmission}>{transmission}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type de carrosserie</label>
        <select 
          name="bodyType" 
          value={filters.bodyType || ""} 
          onChange={handleInputChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Tous les types</option>
          {bodyTypes.map(bodyType => (
            <option key={bodyType} value={bodyType}>{bodyType}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">Appliquer</Button>
        <Button type="button" variant="outline" onClick={resetFilters}>Réinitialiser</Button>
      </div>
    </form>
  );
}
