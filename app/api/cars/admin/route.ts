import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { Car } from '@/types/car';

export async function GET() {
  try {
    // Vérifier que l'utilisateur est connecté et est un administrateur
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Vous n'êtes pas connecté" },
        { status: 403 }
      );
    }
    
    if (!session.user) {
      return NextResponse.json(
        { error: "Informations utilisateur manquantes" },
        { status: 403 }
      );
    }
    
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à accéder à cette ressource" },
        { status: 403 }
      );
    }

    // Récupérer toutes les voitures, quel que soit leur statut
    const cars = await prisma.car.findMany({
      include: {
        features: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transformer les données pour correspondre au format attendu par le client
    const formattedCars: Car[] = cars.map((car) => ({
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
    console.error('Erreur lors de la récupération des voitures pour l\'admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des voitures' },
      { status: 500 }
    );
  }
}
