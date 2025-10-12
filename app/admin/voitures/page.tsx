'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Charger toutes les voitures
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars/admin');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error('Erreur lors du chargement des voitures:', err);
        setError('Impossible de charger la liste des voitures');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filtrer les voitures en fonction de la recherche et du statut
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
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
  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Administration - Gestion des voitures</h1>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Administration - Gestion des voitures</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administration - Gestion des voitures</h1>
        <Button asChild>
          <Link href="/admin/voitures/new">Ajouter une voiture</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tous les statuts</option>
              <option value="AVAILABLE">Disponibles</option>
              <option value="RESERVED">Réservées</option>
              <option value="SOLD">Vendues</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voiture</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de vente</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={car.mainImage} 
                          alt={`${car.brand} ${car.model}`} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{car.brand} {car.model}</p>
                          <p className="text-sm text-muted-foreground">{car.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(car.price)}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(car.status)}>
                        {getStatusLabel(car.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {car.soldDate ? new Date(car.soldDate).toLocaleDateString('fr-BE') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/voitures/${car.id}`}>
                            Gérer
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucune voiture trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
