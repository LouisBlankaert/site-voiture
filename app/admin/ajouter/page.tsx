"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarBrand, FuelType, TransmissionType, CarBodyType } from "@/types/car";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

// Liste des équipements courants pour les voitures
const commonFeatures = [
  "Climatisation", "GPS", "Bluetooth", "Régulateur de vitesse", "Caméra de recul",
  "Sièges chauffants", "Toit ouvrant", "Jantes alliage", "Vitres électriques",
  "Fermeture centralisée", "Aide au stationnement", "Système audio premium",
  "Phares LED", "Démarrage sans clé", "Volant multifonction", "Système d'alarme",
  "Contrôle de stabilité", "Système de freinage d'urgence", "Détecteur d'angle mort"
];

// Catégories d'équipements avec options
const equipmentCategories = [
  {
    name: "Confort",
    options: [
      "Climatisation automatique", "Climatisation bi-zone", "Climatisation tri-zone", 
      "Sièges chauffants", "Sièges ventilés", "Sièges massants", 
      "Volant chauffant", "Accès sans clé", "Démarrage sans clé", 
      "Rétroviseurs rabattables électriquement", "Toit panoramique", "Toit ouvrant"
    ]
  },
  {
    name: "Technologie",
    options: [
      "Système de navigation GPS", "Apple CarPlay", "Android Auto", 
      "Bluetooth", "Chargeur à induction", "Prises USB", 
      "Système audio premium", "Écran tactile", "Tableau de bord numérique", 
      "Affichage tête haute", "Commandes vocales"
    ]
  },
  {
    name: "Sécurité",
    options: [
      "Régulateur de vitesse adaptatif", "Freinage d'urgence automatique", "Détection des piétons", 
      "Alerte de franchissement de ligne", "Maintien dans la voie", "Détecteur d'angle mort", 
      "Caméra 360°", "Caméra de recul", "Aide au stationnement avant", "Aide au stationnement arrière", 
      "Système d'alarme", "Airbags multiples"
    ]
  },
  {
    name: "Extérieur",
    options: [
      "Jantes alliage", "Phares LED", "Phares adaptatifs", "Feux de jour LED", 
      "Vitres teintées", "Barres de toit", "Attelage", "Rétroviseurs chauffants",
      "Capteur de pluie", "Capteur de luminosité"
    ]
  }
];

export default function AddCarPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCommonFeatures, setShowCommonFeatures] = useState(false);
  const [showEquipmentCategories, setShowEquipmentCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
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

  const addCommonFeature = (feat: string) => {
    if (!formData.features.includes(feat)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feat]
      }));
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
  
  // Fonction onDrop supprimée car nous utilisons maintenant uniquement le widget Cloudinary

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Vérifier si l'utilisateur est connecté
      if (!session) {
        throw new Error("Vous devez être connecté pour ajouter une voiture");
      }
      
      // Vérifier si une image principale est sélectionnée
      if (formData.images.length > 0 && !formData.mainImage) {
        throw new Error("Veuillez sélectionner une image principale");
      }
      
      // Préparer les données pour l'API - ne pas envoyer le champ status
      const carData = {
        ...formData,
        // Le status sera défini côté serveur
      };
      
      console.log("Données envoyées à l'API:", carData);
      
      // Envoyer les données à l'API
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API:", response.status, errorData);
        throw new Error(errorData.error || errorData.details || "Erreur lors de l'ajout de la voiture");
      }
      
      const result = await response.json();
      
      // Afficher un toast de succès
      toast({
        title: "Voiture ajoutée avec succès",
        description: `${formData.brand} ${formData.model} a été ajoutée à votre inventaire.`,
        variant: "default",
      });
      
      // Rediriger vers la page d'administration
      router.push("/admin/voitures");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de l'ajout de la voiture",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Ajouter une Nouvelle Voiture</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
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

            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCommonFeatures(!showCommonFeatures)}
                >
                  {showCommonFeatures ? "Masquer" : "Afficher"} les équipements courants
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEquipmentCategories(!showEquipmentCategories)}
                >
                  {showEquipmentCategories ? "Masquer" : "Afficher"} les catégories d'équipements
                </Button>
              </div>
              
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
                        className={`justify-start ${formData.features.includes(feat) ? 'bg-primary/10' : ''}`}
                        onClick={() => addCommonFeature(feat)}
                      >
                        {formData.features.includes(feat) ? '✓ ' : '+ '}{feat}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {showEquipmentCategories && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="font-medium mb-4">Catégories d'équipements:</h3>
                  <div className="space-y-4">
                    {equipmentCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="border rounded p-3">
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => {
                            setExpandedCategories(prev => {
                              if (prev.includes(category.name)) {
                                return prev.filter(cat => cat !== category.name);
                              } else {
                                return [...prev, category.name];
                              }
                            });
                          }}
                        >
                          <h4 className="font-medium">{category.name}</h4>
                          <span>{expandedCategories.includes(category.name) ? '▼' : '►'}</span>
                        </div>
                        
                        {expandedCategories.includes(category.name) && (
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                            {category.options.map((option, optionIndex) => (
                              <Button
                                key={optionIndex}
                                type="button"
                                variant="outline"
                                size="sm"
                                className={`justify-start ${formData.features.includes(option) ? 'bg-primary/10' : ''}`}
                                onClick={() => addCommonFeature(option)}
                              >
                                {formData.features.includes(option) ? '✓ ' : '+ '}{option}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            {/* Widget d'upload Cloudinary */}
            <CldUploadWidget
              uploadPreset="voitures_preset"
              onSuccess={(result: any, { widget }: any) => {
                console.log('Upload réussi:', result);
                // Typage explicite pour éviter les erreurs
                const info = result?.info;
                if (info && info.secure_url) {
                  const secureUrl = info.secure_url as string;
                  
                  // Ajouter l'URL de l'image téléchargée à la liste des images
                  setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, secureUrl]
                  }));
                  
                  // Si c'est la première image ou s'il n'y a pas d'image principale, la définir comme principale
                  if (formData.images.length === 0 || formData.mainImage === "") {
                    setFormData(prev => ({
                      ...prev,
                      mainImage: secureUrl
                    }));
                  }
                  
                  toast({
                    title: "Succès",
                    description: `Image téléchargée avec succès`,
                  });
                  
                  widget.close();
                }
              }}
              options={{
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 10,
                resourceType: "image",
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: "voitures_preset",
                folder: "voitures",
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
                maxFileSize: 10000000, // 10MB
              }}
            >
              {({ open }) => {
                return (
                  <div 
                    onClick={() => open()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                  >
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Cliquez pour télécharger vos images
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP jusqu'à 10MB</p>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>
            
            {/* Méthode alternative d'ajout d'image par URL */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Ou ajouter une image par URL:</h3>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL de l'image (ex: https://exemple.com/image.jpg)"
                />
                <Button type="button" onClick={addImage}>
                  Ajouter
                </Button>
              </div>
            </div>
            
            {formData.images.length > 0 && (
              <div className="border rounded-md p-4 mt-4">
                <h3 className="font-medium mb-4">Images ajoutées:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                        {/* Toujours utiliser une balise img standard car les URLs de Cloudinary sont déjà optimisées */}
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
                            className={formData.mainImage === img ? "bg-green-500 text-white hover:bg-green-600" : ""}
                          >
                            {formData.mainImage === img ? "Principale" : "Définir principale"}
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
                      {formData.mainImage === img && (
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
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer la voiture"}
          </Button>
        </div>
      </form>
    </div>
  );
}
