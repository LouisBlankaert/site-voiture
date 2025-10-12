"use client";

import { useState } from "react";
import { CarImage } from "@/components/ui/car-image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface CarImageGalleryProps {
  images: string[];
  mainImage: string;
  alt: string;
}

export function CarImageGallery({ images, mainImage, alt }: CarImageGalleryProps) {
  // État partagé pour toutes les modales
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const allImages = [mainImage, ...images.filter(img => img !== mainImage)];
  
  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };
  
  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Dialog partagé pour toutes les images */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>
            <VisuallyHidden>
              {`${alt} - Image ${currentImageIndex + 1}`}
            </VisuallyHidden>
          </DialogTitle>
          <div className="relative aspect-video">
            <CarImage
              src={allImages[currentImageIndex] || "/images/car-placeholder.jpg"}
              alt={`${alt} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
              onClick={handlePrevious}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Précédent</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
              onClick={handleNext}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="sr-only">Suivant</span>
            </Button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Image principale */}
      <div 
        className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer"
        onClick={() => {
          setCurrentImageIndex(0); // Afficher l'image principale
          setIsDialogOpen(true); // Ouvrir la modale
        }}
      >
        <CarImage
          src={mainImage || "/images/car-placeholder.jpg"}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/5 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium">
            Agrandir
          </span>
        </div>
      </div>
      
      {/* Miniatures des images */}
      <div className="grid grid-cols-3 gap-2">
        {allImages.map((image, index) => (
          <div 
            key={index} 
            className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setCurrentImageIndex(index); // Définir l'index de l'image sélectionnée
              setIsDialogOpen(true); // Ouvrir la modale
            }}
          >
            <CarImage
              src={image || "/images/car-placeholder.jpg"}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/5 hover:bg-black/20 transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
