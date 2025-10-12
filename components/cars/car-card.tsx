import { CarImage } from "@/components/ui/car-image";
import Link from "next/link";
import { Car } from "@/types/car";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CarCardProps {
  car: Car;
  soldBadge?: boolean; // Afficher un badge "Vendu" sur les voitures vendues
  showStatus?: boolean; // Afficher le statut de la voiture
}

export function CarCard({ car, soldBadge = false, showStatus = false }: CarCardProps) {
  console.log('CarCard - car:', car);
  console.log('CarCard - mainImage:', car.mainImage);
  
  // Formater le prix avec séparateur de milliers et symbole €
  const formattedPrice = new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(car.price);

  // Formater le kilométrage avec séparateur de milliers
  const formattedMileage = new Intl.NumberFormat('fr-BE').format(car.mileage);

  return (
    <Link href={`/voitures/${car.id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer card-hover">
        <div className="aspect-[16/9] relative overflow-hidden">
          <CarImage
            src={car.mainImage && car.mainImage !== '' ? car.mainImage : "/images/car-placeholder.jpg"}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover transition-transform hover:scale-105"
            priority
          />
          {/* Badge "Vendu" si la voiture est vendue et que soldBadge est true */}
          {(soldBadge || showStatus) && car.status === "SOLD" && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 hover:bg-red-600">
                Vendu
              </Badge>
            </div>
          )}
          {/* Badge "Réservé" si la voiture est réservée et que showStatus est true */}
          {showStatus && car.status === "RESERVED" && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Réservé
              </Badge>
            </div>
          )}
        </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <div className="text-xl font-bold text-primary">{formattedPrice}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H8c-.7 0-1.5.3-2 .8L3.9 9.9C3.3 10.4 3 11.2 3 12v5c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span className="text-sm">{formattedMileage} km</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M14 6.5a2 2 0 0 0-4 0c0 .5.2 1 .6 1.4L12 9l1.4-1.1c.4-.4.6-.9.6-1.4Z" />
              <path d="M12 13v8" />
              <path d="M12.5 9.5 16 7l2 4-3 2.5" />
              <path d="M11.5 9.5 8 7l-2 4 3 2.5" />
              <path d="m2 19 3-3" />
              <path d="m19 19 3-3" />
            </svg>
            <span className="text-sm">{car.power} ch</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M7 13h10v8H7z" />
              <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5h18V8Z" />
              <path d="M10 8V6a2 2 0 0 1 4 0v2" />
            </svg>
            <span className="text-sm">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            <span className="text-sm">{car.doors} portes</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary">{car.fuelType}</Badge>
          <Badge variant="outline">{car.bodyType}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
    </Link>
  );
}
