export type CarBrand = 
  | "Audi" 
  | "BMW" 
  | "Citroën" 
  | "Dacia" 
  | "Fiat" 
  | "Ford" 
  | "Honda" 
  | "Hyundai" 
  | "Kia" 
  | "Mercedes" 
  | "Nissan" 
  | "Opel" 
  | "Peugeot" 
  | "Renault" 
  | "Seat" 
  | "Skoda" 
  | "Toyota" 
  | "Volkswagen" 
  | "Volvo";

export type FuelType = 
  | "Essence" 
  | "Diesel" 
  | "Électrique" 
  | "Hybride" 
  | "GPL" 
  | "Hydrogène";

export type TransmissionType = 
  | "Manuelle" 
  | "Automatique" 
  | "Semi-automatique";

export type CarBodyType = 
  | "Berline" 
  | "Break" 
  | "SUV" 
  | "Coupé" 
  | "Cabriolet" 
  | "Monospace" 
  | "Citadine" 
  | "Utilitaire";

export type CarStatus = 
  | "AVAILABLE" 
  | "RESERVED" 
  | "SOLD";

export interface Car {
  id: string;
  brand: CarBrand;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: CarBodyType;
  power: number; // en chevaux (ch)
  color: string;
  doors: number;
  description: string;
  status: CarStatus; // Statut de la voiture (disponible, réservée, vendue)
  soldDate?: Date; // Date de vente (optionnelle)
  features: string[]; // options et équipements
  images: string[]; // URLs des images
  mainImage: string; // URL de l'image principale
  createdAt: Date;
  updatedAt: Date;
}
