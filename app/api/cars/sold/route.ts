import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Car } from '@/types/car';

export async function GET() {
  try {
    // Récupérer toutes les voitures avec le statut SOLD
    const soldCars = await prisma.car.findMany({
      where: {
        status: 'SOLD'
      },
      include: {
        features: true,
        images: true,
      },
      orderBy: {
        soldDate: 'desc', // Les plus récemment vendues en premier
      },
    });

    // Transformer les données pour correspondre au format attendu par le client
    const formattedCars: Car[] = soldCars.map((car) => ({
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
      status: car.status as any,
      soldDate: car.soldDate || undefined,
      features: car.features.map((feature) => feature.name),
      images: car.images.filter((img) => !img.isMain).map((img) => img.url),
      mainImage: car.images.find((img) => img.isMain)?.url || car.images[0]?.url || '/images/car-placeholder.jpg',
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    }));

    return NextResponse.json(formattedCars);
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures vendues:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des voitures vendues' },
      { status: 500 }
    );
  }
}
