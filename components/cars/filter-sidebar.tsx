import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CarBrand, FuelType, TransmissionType, CarBodyType } from '@/types/car';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const currentYear = new Date().getFullYear();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, currentYear]);
  const [brand, setBrand] = useState<string>('all');
  const [fuelType, setFuelType] = useState<string>('all');
  const [transmission, setTransmission] = useState<string>('all');
  const [bodyType, setBodyType] = useState<string>('all');
  
  // Créer et appliquer les filtres
  const applyFilters = () => {
    const filters = {
      ...(brand !== 'all' && { brand }),
      ...(fuelType !== 'all' && { fuelType }),
      ...(transmission !== 'all' && { transmission }),
      ...(bodyType !== 'all' && { bodyType }),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minYear: yearRange[0],
      maxYear: yearRange[1],
    };
    
    onFilterChange(filters);
  };
  
  // Appliquer les filtres initiaux
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    applyFilters();
  }, []);

  // Liste des marques disponibles
  const brands: CarBrand[] = [
    'Audi', 'BMW', 'Citroën', 'Dacia', 'Fiat', 'Ford', 'Honda', 'Hyundai', 
    'Kia', 'Mercedes', 'Nissan', 'Opel', 'Peugeot', 'Renault', 'Seat', 
    'Skoda', 'Toyota', 'Volkswagen', 'Volvo'
  ];

  // Liste des types de carburant
  const fuelTypes: FuelType[] = [
    'Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL', 'Hydrogène'
  ];

  // Liste des types de transmission
  const transmissionTypes: TransmissionType[] = [
    'Manuelle', 'Automatique', 'Semi-automatique'
  ];

  // Liste des types de carrosserie
  const bodyTypes: CarBodyType[] = [
    'Berline', 'Break', 'SUV', 'Coupé', 'Cabriolet', 'Monospace', 'Citadine', 'Utilitaire'
  ];

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setBrand('all');
    setFuelType('all');
    setTransmission('all');
    setBodyType('all');
    setPriceRange([0, 100000]);
    setYearRange([2000, currentYear]);
    
    // Appliquer les filtres après la réinitialisation
    setTimeout(() => {
      onFilterChange({
        minPrice: 0,
        maxPrice: 100000,
        minYear: 2000,
        maxYear: currentYear
      });
    }, 0);
  };

  // Formater le prix pour l'affichage
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filtres</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="w-full mb-4"
        >
          Réinitialiser les filtres
        </Button>
      </div>

      {/* Filtre par marque */}
      <div className="space-y-2">
        <Label htmlFor="brand">Marque</Label>
        <Select value={brand} onValueChange={(value) => {
          setBrand(value);
          setTimeout(applyFilters, 0);
        }}>
          <SelectTrigger id="brand">
            <SelectValue placeholder="Toutes les marques" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les marques</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par prix */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Prix</Label>
          <span className="text-sm text-muted-foreground">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          defaultValue={[0, 100000]}
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value as [number, number]);
            setTimeout(applyFilters, 0);
          }}
          min={0}
          max={100000}
          step={1000}
          className="py-4"
        />
      </div>

      {/* Filtre par année */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Année</Label>
          <span className="text-sm text-muted-foreground">
            {yearRange[0]} - {yearRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[2000, currentYear]}
          value={yearRange}
          onValueChange={(value) => {
            setYearRange(value as [number, number]);
            setTimeout(applyFilters, 0);
          }}
          min={2000}
          max={currentYear}
          step={1}
          className="py-4"
        />
      </div>

      {/* Filtre par type de carburant */}
      <div className="space-y-2">
        <Label htmlFor="fuelType">Carburant</Label>
        <Select value={fuelType} onValueChange={(value) => {
          setFuelType(value);
          setTimeout(applyFilters, 0);
        }}>
          <SelectTrigger id="fuelType">
            <SelectValue placeholder="Tous les carburants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les carburants</SelectItem>
            {fuelTypes.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par type de transmission */}
      <div className="space-y-2">
        <Label htmlFor="transmission">Transmission</Label>
        <Select value={transmission} onValueChange={(value) => {
          setTransmission(value);
          setTimeout(applyFilters, 0);
        }}>
          <SelectTrigger id="transmission">
            <SelectValue placeholder="Toutes les transmissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les transmissions</SelectItem>
            {transmissionTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par type de carrosserie */}
      <div className="space-y-2">
        <Label htmlFor="bodyType">Carrosserie</Label>
        <Select value={bodyType} onValueChange={(value) => {
          setBodyType(value);
          setTimeout(applyFilters, 0);
        }}>
          <SelectTrigger id="bodyType">
            <SelectValue placeholder="Toutes les carrosseries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les carrosseries</SelectItem>
            {bodyTypes.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
