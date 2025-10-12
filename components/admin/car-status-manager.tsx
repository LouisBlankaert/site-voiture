'use client';

import { useState } from 'react';
import { Car, CarStatus } from '@/types/car';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface CarStatusManagerProps {
  car: Car;
  onStatusChange?: (updatedCar: Car) => void;
}

export function CarStatusManager({ car, onStatusChange }: CarStatusManagerProps) {
  const [status, setStatus] = useState<CarStatus>(car.status);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour mettre à jour le statut de la voiture
  const updateCarStatus = async () => {
    if (status === car.status) {
      toast({
        title: "Aucun changement",
        description: "Le statut est identique à l'actuel.",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/cars/${car.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      const updatedCar = await response.json();
      
      toast({
        title: "Statut mis à jour",
        description: `La voiture est maintenant ${getStatusLabel(status).toLowerCase()}.`,
      });

      // Appeler le callback si fourni
      if (onStatusChange) {
        onStatusChange(updatedCar);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la voiture.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status: CarStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'RESERVED':
        return 'Réservée';
      case 'SOLD':
        return 'Vendue';
      default:
        return status;
    }
  };

  // Obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: CarStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500 hover:bg-green-600';
      case 'RESERVED':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'SOLD':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Statut actuel:</span>
        <Badge className={getStatusColor(car.status)}>
          {getStatusLabel(car.status)}
        </Badge>
        {car.status === 'SOLD' && car.soldDate && (
          <span className="text-sm text-muted-foreground">
            (Vendue le {new Date(car.soldDate).toLocaleDateString('fr-BE')})
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={(value) => setStatus(value as CarStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Changer le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">Disponible</SelectItem>
            <SelectItem value="RESERVED">Réservée</SelectItem>
            <SelectItem value="SOLD">Vendue</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={updateCarStatus} 
          disabled={isLoading || status === car.status}
        >
          {isLoading ? 'Mise à jour...' : 'Mettre à jour le statut'}
        </Button>
      </div>
    </div>
  );
}
