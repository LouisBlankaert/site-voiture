"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarBrand, FuelType, TransmissionType, CarBodyType, Car } from "@/types/car";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { use } from "react";

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export default function EditCarPage({ params }: { params: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  
  // Utiliser use() pour déballer les paramètres comme recommandé par Next.js
  const resolvedParams = use(params) as { id: string };
  const carId = resolvedParams.id;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: "",
    transmission: "",
    bodyType: "",
    power: 0,
    color: "",
    doors: 5,
    description: "",
    features: [] as string[],
    mainImage: "",
    images: [] as string[],
  });

  const [feature, setFeature] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/cars/${carId}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        
        const carData = await response.json();
        
        // Initialiser le formulaire avec les données de la voiture
        setFormData({
          brand: carData.brand,
          model: carData.model,
          year: carData.year,
          price: carData.price,
          mileage: carData.mileage,
          fuelType: carData.fuelType,
          transmission: carData.transmission,
          bodyType: carData.bodyType,
          power: carData.power,
          color: carData.color,
          doors: carData.doors,
          description: carData.description,
          features: carData.features || [],
          mainImage: carData.mainImage || "",
          images: carData.images || [],
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement de la voiture:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la voiture",
          variant: "destructive",
        });
        router.push("/admin/voitures");
      }
    };
    
    fetchCar();
  }, [carId, router, toast]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number = value;
    
    // Convert numeric values
    if (type === 'number') {
      parsedValue = value ? Number(value) : 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const addFeature = () => {
    if (feature.trim() !== "") {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (imageUrl.trim() !== "") {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setMainImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      mainImage: url
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Vérifier si l'utilisateur est connecté
      if (!session) {
        throw new Error("Vous devez être connecté pour modifier une voiture");
      }
      
      // Vérifier si une image principale est sélectionnée
      if (formData.images.length > 0 && !formData.mainImage) {
        throw new Error("Veuillez sélectionner une image principale");
      }
      
      // Envoyer les données à l'API
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de la voiture");
      }
      
      const result = await response.json();
      
      // Afficher un toast de succès
      toast({
        title: "Voiture mise à jour avec succès",
        description: `${formData.brand} ${formData.model} a été mise à jour.`,
        variant: "default",
      });
      
      // Rediriger vers la page d'administration
      router.push("/admin/voitures");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la mise à jour de la voiture",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Modifier la Voiture</h1>
        <Button variant="outline" onClick={() => router.push("/admin/voitures")}>
          Retour à la liste
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            {error}
          </div>
        )}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informations Générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="brand" className="text-sm font-medium">
                Marque <span className="text-red-500">*</span>
              </label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionner une marque</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium">
                Modèle <span className="text-red-500">*</span>
              </label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Année <span className="text-red-500">*</span>
              </label>
              <Input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Prix (€) <span className="text-red-500">*</span>
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mileage" className="text-sm font-medium">
                Kilométrage <span className="text-red-500">*</span>
              </label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="power" className="text-sm font-medium">
                Puissance (ch) <span className="text-red-500">*</span>
              </label>
              <Input
                id="power"
                name="power"
                type="number"
                min="0"
                value={formData.power}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fuelType" className="text-sm font-medium">
                Carburant <span className="text-red-500">*</span>
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionner un type de carburant</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="transmission" className="text-sm font-medium">
                Transmission <span className="text-red-500">*</span>
              </label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionner un type de transmission</option>
                {transmissions.map(transmission => (
                  <option key={transmission} value={transmission}>{transmission}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bodyType" className="text-sm font-medium">
                Type de carrosserie <span className="text-red-500">*</span>
              </label>
              <select
                id="bodyType"
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionner un type de carrosserie</option>
                {bodyTypes.map(bodyType => (
                  <option key={bodyType} value={bodyType}>{bodyType}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                Couleur <span className="text-red-500">*</span>
              </label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="doors" className="text-sm font-medium">
                Nombre de portes <span className="text-red-500">*</span>
              </label>
              <Input
                id="doors"
                name="doors"
                type="number"
                min="2"
                max="7"
                value={formData.doors}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description détaillée <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            ></textarea>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Équipements et Options</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder="Ajouter un équipement (ex: Climatisation)"
              />
              <Button type="button" onClick={addFeature}>
                Ajouter
              </Button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Équipements ajoutés:</h3>
                <ul className="space-y-2">
                  {formData.features.map((feat, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{feat}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFeature(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de l'image (ex: /images/cars/voiture.jpg)"
              />
              <Button type="button" onClick={addImage}>
                Ajouter
              </Button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Images ajoutées:</h3>
                <ul className="space-y-2">
                  {formData.images.map((img, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`main-${index}`}
                          name="mainImage"
                          checked={formData.mainImage === img}
                          onChange={() => setMainImage(img)}
                        />
                        <label htmlFor={`main-${index}`} className="text-sm">
                          Image principale
                        </label>
                        <span className="truncate max-w-md">{img}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeImage(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Mettre à jour la voiture"}
          </Button>
        </div>
      </form>
    </div>
  );
}
