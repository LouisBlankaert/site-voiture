"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car } from "@/types/car";
import { CarImage } from "@/components/ui/car-image";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les voitures depuis l'API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        let response = await fetch('/api/cars/admin');
        
        // Si l'API admin échoue, essayer l'API standard
        if (!response.ok) {
          if (response.status === 403) {
            response = await fetch('/api/cars');
            
            if (!response.ok) {
              throw new Error(`Erreur lors de la récupération des voitures: ${response.status}`);
            }
          } else {
            throw new Error(`Erreur lors de la récupération des voitures: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setAllCars(data);
        setDisplayedCars(data);
      } catch (err: any) {
        if (err.message && err.message.includes('403')) {
          setError('Vous n\'avez pas les droits d\'administrateur pour accéder à cette page.');
        } else {
          setError(`Erreur lors du chargement des voitures: ${err.message || 'Erreur inconnue'}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setDisplayedCars(allCars);
      return;
    }
    
    const filtered = allCars.filter((car) => 
      car.brand.toLowerCase().includes(term) || 
      car.model.toLowerCase().includes(term) ||
      car.status.toLowerCase().includes(term)
    );
    
    setDisplayedCars(filtered);
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      // Mettre à jour la liste des voitures
      const updatedCars = allCars.filter(car => car.id !== carId);
      setAllCars(updatedCars);
      setDisplayedCars(updatedCars);
      
      toast({
        title: "Voiture supprimée",
        description: "La voiture a été supprimée avec succès.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la voiture: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  // Afficher un message d'erreur si l'utilisateur n'est pas connecté ou n'est pas admin
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Administration</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Administration</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
          <Button 
            onClick={() => router.push('/')} 
            className="mt-4"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord d'administration</h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Gestion des voitures</h2>
              <p className="text-gray-600 mb-4">Ajouter, modifier ou supprimer des voitures.</p>
              <Button asChild>
                <Link href="/admin/voitures">Gérer les voitures</Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Ajouter une voiture</h2>
              <p className="text-gray-600 mb-4">Ajouter une nouvelle voiture à l'inventaire.</p>
              <Button asChild>
                <Link href="/admin/ajouter">Ajouter une voiture</Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Mon profil</h2>
              <p className="text-gray-600 mb-4">Gérer votre profil administrateur.</p>
              <Button asChild>
                <Link href="/admin/profil">Voir mon profil</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Voitures récentes</h2>
            
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Rechercher une voiture..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-md"
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : displayedCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCars.slice(0, 6).map((car) => (
                  <div key={car.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-[16/9] relative">
                      <CarImage
                        src={car.mainImage}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{car.brand} {car.model}</h3>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          car.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                          car.status === 'RESERVED' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {car.status === 'AVAILABLE' ? 'Disponible' : 
                           car.status === 'RESERVED' ? 'Réservée' : 'Vendue'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{car.year} • {car.mileage.toLocaleString()} km</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{car.price.toLocaleString()} €</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/voitures/${car.id}`}>
                              Gérer
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Aucune voiture trouvée
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
