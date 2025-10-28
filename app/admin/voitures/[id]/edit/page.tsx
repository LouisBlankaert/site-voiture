"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarBrand, FuelType, TransmissionType, CarBodyType } from "@/types/car";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

// Liste des équipements courants pour les voitures
const commonFeatures = [
  "Climatisation", "GPS", "Bluetooth", "Régulateur de vitesse", "Caméra de recul",
  "Sièges chauffants", "Toit ouvrant", "Jantes alliage", "Vitres électriques",
  "Fermeture centralisée", "Aide au stationnement", "Système audio premium",
  "Phares LED", "Démarrage sans clé", "Volant multifonction", "Système d'alarme",
  "Contrôle de stabilité", "Système de freinage d'urgence", "Détecteur d'angle mort"
];

export default function EditCarPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Utiliser React.use pour déballer params si c'est une Promise
  const resolvedParams = typeof params === 'object' && !('then' in params) ? params : use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCommonFeatures, setShowCommonFeatures] = useState(false);
  
  // Définir le type pour les données du formulaire
  interface CarFormData {
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
    features: string[];
    mainImage: string;
    images: string[];
  }

  const [carFormData, setCarFormData] = useState<CarFormData>({
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
    features: [],
    mainImage: "",
    images: [],
  });

  const [feature, setFeature] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isDragging, setIsDragging] = useState(false);

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

  // Charger les données de la voiture
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données de la voiture");
        }
        
        const carData = await response.json();
        
        setCarFormData({
          brand: carData.brand || "",
          model: carData.model || "",
          year: carData.year || new Date().getFullYear(),
          price: carData.price || 0,
          mileage: carData.mileage || 0,
          fuelType: carData.fuelType || "",
          transmission: carData.transmission || "",
          bodyType: carData.bodyType || "",
          power: carData.power || 0,
          color: carData.color || "",
          doors: carData.doors || 5,
          description: carData.description || "",
          features: carData.features || [],
          mainImage: carData.mainImage || "",
          images: carData.images || [],
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la voiture",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchCarData();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number = value;
    
    // Convert numeric values
    if (type === 'number') {
      parsedValue = value ? Number(value) : 0;
    }
    
    setCarFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const addFeature = () => {
    if (feature.trim() !== "") {
      setCarFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature("");
    }
  };

  const addCommonFeature = (feat: string) => {
    if (!carFormData.features.includes(feat)) {
      setCarFormData(prev => ({
        ...prev,
        features: [...prev.features, feat]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setCarFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (imageUrl.trim() !== "") {
      setCarFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...carFormData.images];
    const removedImage = newImages[index];
    
    // Si l'image supprimée était l'image principale, réinitialiser l'image principale
    if (removedImage === carFormData.mainImage) {
      setCarFormData(prev => ({
        ...prev,
        mainImage: newImages.length > 1 ? newImages[0] : "",
        images: newImages.filter((_, i) => i !== index)
      }));
    } else {
      setCarFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const setMainImage = (url: string) => {
    setCarFormData(prev => ({
      ...prev,
      mainImage: url
    }));
  };

  // Gestion du drag and drop pour les images
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    for (const file of newFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de l'upload: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Ajouter l'URL de l'image téléchargée à la liste des images
        setCarFormData(prev => ({
          ...prev,
          images: [...prev.images, result.url]
        }));
        
        // Si c'est la première image ou s'il n'y a pas d'image principale, la définir comme principale
        if (carFormData.images.length === 0 || !carFormData.mainImage) {
          setCarFormData(prev => ({
            ...prev,
            mainImage: result.url
          }));
        }
        
        toast({
          title: "Succès",
          description: `Image ${file.name} téléchargée avec succès`,
        });
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        toast({
          title: "Erreur",
          description: `Échec du téléchargement de ${file.name}`,
          variant: "destructive",
        });
      }
    }
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
      if (carFormData.images.length > 0 && !carFormData.mainImage) {
        throw new Error("Veuillez sélectionner une image principale");
      }
      
      // Préparer les données pour l'API
      const carData = {
        ...carFormData,
      };
      
      console.log("Données envoyées à l'API:", carData);
      
      // Envoyer les données à l'API
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API:", response.status, errorData);
        throw new Error(errorData.error || errorData.details || "Erreur lors de la modification de la voiture");
      }
      
      const result = await response.json();
      
      // Afficher un toast de succès
      toast({
        title: "Voiture modifiée avec succès",
        description: `${carFormData.brand} ${carFormData.model} a été mise à jour.`,
        variant: "default",
      });
      
      // Rediriger vers la page d'administration
      router.push("/admin/voitures");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la modification de la voiture",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des données...</p>
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
                value={carFormData.brand}
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
                value={carFormData.model}
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
                value={carFormData.year}
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
                value={carFormData.price}
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
                value={carFormData.mileage}
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
                value={carFormData.power}
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
                value={carFormData.fuelType}
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
                value={carFormData.transmission}
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
                value={carFormData.bodyType}
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
                value={carFormData.color}
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
                value={carFormData.doors}
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
              value={carFormData.description}
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
            
            <div className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCommonFeatures(!showCommonFeatures)}
              >
                {showCommonFeatures ? "Masquer" : "Afficher"} les équipements courants
              </Button>
              
              {showCommonFeatures && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="font-medium mb-2">Équipements courants:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonFeatures.map((feat, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`justify-start ${carFormData.features.includes(feat) ? 'bg-primary/10' : ''}`}
                        onClick={() => addCommonFeature(feat)}
                      >
                        {carFormData.features.includes(feat) ? '✓ ' : '+ '}{feat}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {carFormData.features.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Équipements ajoutés:</h3>
                <ul className="space-y-2">
                  {carFormData.features.map((feat, index) => (
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
            {/* Zone de drag & drop pour les images */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Glissez et déposez vos images ici, ou</p>
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary/80">
                    <span>Parcourir vos fichiers</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP jusqu'à 10MB</p>
              </div>
            </div>

            {/* Méthode alternative d'ajout d'image par URL */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Ou ajouter une image par URL:</h3>
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
            </div>
            
            {carFormData.images.length > 0 && (
              <div className="border rounded-md p-4 mt-4">
                <h3 className="font-medium mb-4">Images ajoutées:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {carFormData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                        <img 
                          src={img} 
                          alt={`Image ${index + 1}`} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setMainImage(img)}
                            className={carFormData.mainImage === img ? "bg-green-500 text-white hover:bg-green-600" : ""}
                          >
                            {carFormData.mainImage === img ? "Principale" : "Définir principale"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeImage(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      {carFormData.mainImage === img && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/voitures")}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}
