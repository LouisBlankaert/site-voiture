import { CarImage } from "@/components/ui/car-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { Car } from "@/types/car";
import { CarImageGallery } from "@/components/cars/car-image-gallery";
import { ContactSellerButton } from "@/components/cars/contact-seller-button";

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  // Récupérer l'ID de la voiture depuis les paramètres
  const { id } = params;
  
  // Récupérer les données de la voiture depuis la base de données
  const car = await prisma.car.findUnique({
    where: {
      id,
    },
    include: {
      features: true,
      images: true,
      // Inclure les informations du vendeur (user)
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!car) {
    notFound();
  }
  
  // Trouver l'image principale
  const mainImage = car.images.find((image: any) => image.isMain)?.url;
  
  // Définir les types pour les données de la base de données
  interface DbFeature {
    id: string;
    name: string;
    carId: string;
  }

  interface DbImage {
    url: string;
    carId: string;
    isMain: boolean;
  }

  // Transformer les données pour correspondre au format attendu par le client
  const formattedCar: Car = {
    id: car.id,
    brand: car.brand as any,
    model: car.model,
    year: car.year,
    price: Number(car.price),
    mileage: car.mileage,
    fuelType: car.fuelType as any,
    transmission: car.transmission as any,
    bodyType: car.bodyType as any,
    power: car.power,
    color: car.color,
    doors: car.doors,
    description: car.description,
    status: car.status as any || 'AVAILABLE', // Ajouter le statut par défaut
    features: car.features.map((feature: DbFeature) => feature.name),
    images: car.images.map((image: DbImage) => image.url),
    mainImage: mainImage || car.images[0]?.url || '/images/car-placeholder.jpg',
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
  };

  // Formater le prix avec séparateur de milliers et symbole €
  const formattedPrice = new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(formattedCar.price);

  // Formater le kilométrage avec séparateur de milliers
  const formattedMileage = new Intl.NumberFormat('fr-BE').format(formattedCar.mileage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/voitures" className="text-primary hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Retour aux véhicules
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <CarImageGallery 
          images={formattedCar.images} 
          mainImage={formattedCar.mainImage} 
          alt={`${formattedCar.brand} ${formattedCar.model}`} 
        />

        {/* Details Section */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              {formattedCar.brand} {formattedCar.model}
            </h1>
            <p className="text-xl text-muted-foreground">{formattedCar.year}</p>
          </div>

          <div className="text-3xl font-bold text-primary mb-6">
            {formattedPrice}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H8c-.7 0-1.5.3-2 .8L3.9 9.9C3.3 10.4 3 11.2 3 12v5c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              <span>{formattedMileage} km</span>
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
              <span>{formattedCar.power} ch</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M7 13h10v8H7z" />
                <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5h18V8Z" />
                <path d="M10 8V6a2 2 0 0 1 4 0v2" />
              </svg>
              <span>{formattedCar.transmission}</span>
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
              {car.features.map((feature: { id: string; name: string; carId: string }, index: number) => (
                <Badge key={index} variant="outline">{feature.name}</Badge>
              ))}
            </div>
          </div>

          <div className="flex">
            <ContactSellerButton />
          </div>

        </div>
      </div>
    </div>
  );
}
