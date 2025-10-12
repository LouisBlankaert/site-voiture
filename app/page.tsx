import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarGrid } from "@/components/cars/car-grid";
import { GoogleReviews } from "@/components/ui/google-reviews";
import prisma from "@/lib/prisma";
import { Car } from "@/types/car";

// Définir les types pour les données de la base de données
interface DbFeature {
  id: string;
  name: string;
  carId: string;
}

interface DbImage {
  id: string;
  url: string;
  carId: string;
  isMain: boolean;
}

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
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  mainImageId: string | null;
  features: DbFeature[];
  images: DbImage[];
}

export default async function Home() {
  // Récupérer uniquement les voitures disponibles (non vendues) depuis la base de données
  const dbCars = await prisma.car.findMany({
    where: {
      status: 'AVAILABLE' // Ne sélectionner que les voitures disponibles
    },
    include: {
      features: true,
      images: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3, // Limiter à 3 voitures pour l'affichage en vedette
  });
  
  // Convertir les données de la BD au format attendu par l'application
  const featuredCars: Car[] = dbCars.map((car: DbCar) => ({
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
    status: 'AVAILABLE' as any, // Toutes les voitures sélectionnées sont disponibles
    features: car.features.map((feature: DbFeature) => feature.name),
    images: car.images.filter((img: DbImage) => !img.isMain).map((img: DbImage) => img.url),
    mainImage: car.images.find((img: DbImage) => img.isMain)?.url || car.images[0]?.url || '/images/car-placeholder.jpg',
    createdAt: car.createdAt,
    updatedAt: car.updatedAt
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Style Apple */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Ouvrez la porte</span> vers votre prochaine voiture.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            AUTOGATE, intermédiaire automobile spécialisé en dépôt-vente, financement et reprise. Simplicité, Transparence, Confiance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 py-6 text-base font-medium" asChild>
              <Link href="/voitures">Voir nos véhicules</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-medium" asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
          
          {/* Décoration de fond style Apple */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Featured Cars Section - Style Apple */}
      <section className="py-20 md:py-28">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 md:mb-0">
              <span className="font-semibold">Véhicules</span> en vedette
            </h2>
            <Button variant="ghost" className="group" asChild>
              <Link href="/voitures" className="flex items-center gap-2">
                Voir tous les véhicules
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            </Button>
          </div>
          <div className="overflow-hidden">
            <CarGrid cars={featuredCars} />
          </div>
        </div>
      </section>

      {/* Services Section - Style Apple */}
      <section className="py-24 bg-secondary/20">
        <div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-4">
            Nos <span className="font-semibold">Services</span>
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Intermédiation automobile 100% digitale, disponible 24h/24 et 7j/7
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Vente de véhicules */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6 transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H8c-.7 0-1.5.3-2 .8L3.9 9.9C3.3 10.4 3 11.2 3 12v5c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Dépôt-vente</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nous commercialisons votre véhicule sans l'acheter, en vous garantissant le meilleur prix et une transparence totale.
              </p>
            </div>
            
            {/* Garantie */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6 transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Reprise de véhicule</h3>
              <p className="text-muted-foreground leading-relaxed">
                Évaluation juste et transparente de votre ancien véhicule, avec des offres compétitives et sans engagement.
              </p>
            </div>
            
            {/* Financement */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6 transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Financement sur mesure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Solutions de financement personnalisées adaptées au marché belge pour faciliter l'acquisition de votre véhicule.
              </p>
            </div>
            
            {/* Livraison */}
            <div className="flex flex-col items-center text-center group mt-12 md:mt-0">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6 transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Livraison en Belgique</h3>
              <p className="text-muted-foreground leading-relaxed">
                Service de livraison à domicile disponible partout en Belgique, pour vous éviter tout déplacement inutile.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section des avis temporairement masquée en attendant la validation Google Business
      <section className="py-24">
        <div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-4">
            Ce que <span className="font-semibold">disent</span> nos clients
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Découvrez les expériences de nos clients satisfaits
          </p>
          
          <div className="max-w-5xl mx-auto">
            <GoogleReviews compact={true} />
          </div>
        </div>
      </section>
      */}

      {/* CTA Section - Style Apple */}
      <section className="py-24 relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
              Prêt à trouver votre <span className="font-semibold">prochaine voiture</span> ?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Parcourez notre sélection de véhicules de qualité ou contactez-nous pour un rendez-vous personnalisé.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow" 
                asChild
              >
                <Link href="/voitures">Voir nos véhicules</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 py-6 text-base font-medium border-primary/30 hover:border-primary/60" 
                asChild
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Décoration de fond style Apple */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </section>
    </div>
  );
}
