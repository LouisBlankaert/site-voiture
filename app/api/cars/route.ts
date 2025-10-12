import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { CarStatus } from "@prisma/client";

// GET /api/cars
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Filtres
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    const fuelType = searchParams.get("fuelType");
    const transmission = searchParams.get("transmission");
    const bodyType = searchParams.get("bodyType");
    
    // Construction des filtres
    const filters: any = {
      // Par défaut, ne montrer que les voitures disponibles
      status: CarStatus.AVAILABLE
    };
    
    if (brand) {
      filters.brand = brand;
    }
    
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filters.price.lte = parseFloat(maxPrice);
      }
    }
    
    if (minYear || maxYear) {
      filters.year = {};
      if (minYear) {
        filters.year.gte = parseInt(minYear);
      }
      if (maxYear) {
        filters.year.lte = parseInt(maxYear);
      }
    }
    
    if (fuelType) {
      filters.fuelType = fuelType;
    }
    
    if (transmission) {
      filters.transmission = transmission;
    }
    
    if (bodyType) {
      filters.bodyType = bodyType;
    }
    
    // Récupération des voitures avec les filtres appliqués
    const cars = await prisma.car.findMany({
      where: filters,
      include: {
        features: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedCars = cars.map((car) => {
      const mainImage = car.images.find((image) => image.isMain) || car.images[0];
      
      return {
        ...car,
        mainImage: mainImage ? mainImage.url : "/images/car-placeholder.jpg",
        images: car.images.map((image) => image.url),
        features: car.features.map((feature) => feature.name),
      };
    });
    
    return NextResponse.json(formattedCars);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      { error: "Erreur lors de la récupération des voitures", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/cars
export async function POST(request: NextRequest) {
  try {
    console.log("API POST /api/cars appelée");
    const session = await getServerSession(authOptions);
    
    console.log("Session dans POST /api/cars:", JSON.stringify(session, null, 2));
    
    if (!session) {
      console.log("Pas de session dans POST /api/cars");
      return NextResponse.json(
        { error: "Vous n'êtes pas connecté" },
        { status: 403 }
      );
    }
    
    if (!session.user) {
      console.log("Pas d'utilisateur dans la session de POST /api/cars");
      return NextResponse.json(
        { error: "Informations utilisateur manquantes" },
        { status: 403 }
      );
    }
    
    console.log("Rôle de l'utilisateur dans POST /api/cars:", session.user.role);
    
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      console.log("L'utilisateur n'a pas les droits d'administrateur dans POST /api/cars");
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à créer une voiture" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    console.log("Données reçues dans POST /api/cars:", data);
    
    // Validation des données
    const requiredFields = [
      "brand", "model", "year", "price", "mileage", 
      "fuelType", "transmission", "bodyType", "power", 
      "color", "doors", "description"
    ];
    
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      console.log("Champs manquants:", missingFields);
      return NextResponse.json(
        { error: `Les champs suivants sont requis: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Vérifier que les tableaux features et images existent
    if (!Array.isArray(data.features)) {
      console.log("Le champ features n'est pas un tableau");
      data.features = [];
    }
    
    if (!Array.isArray(data.images)) {
      console.log("Le champ images n'est pas un tableau");
      data.images = [];
    }
    
    // Créer la voiture
    console.log("Tentative de création de la voiture avec les données:", {
      brand: data.brand,
      model: data.model,
      year: data.year,
      price: data.price,
      userId: session.user.id,
      features: data.features.length,
      images: data.images.length
    });
    
    // Créer d'abord la voiture sans le statut
    const carData = {
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      price: Number(data.price),
      mileage: Number(data.mileage),
      fuelType: data.fuelType,
      transmission: data.transmission,
      bodyType: data.bodyType,
      power: Number(data.power),
      color: data.color,
      doors: Number(data.doors),
      description: data.description,
      // Le statut sera défini par défaut à AVAILABLE dans le schéma Prisma
      userId: session.user.id,
    };
    
    // Créer la voiture avec les données de base
    const car = await prisma.car.create({
      data: carData,
    });
    
    console.log("Voiture créée avec succès, ID:", car.id);
    
    // Ajouter les caractéristiques
    if (Array.isArray(data.features) && data.features.length > 0) {
      console.log("Ajout des caractéristiques...");
      for (const featureName of data.features) {
        await prisma.feature.create({
          data: {
            name: featureName,
            carId: car.id,
          },
        });
      }
    }
    
    // Ajouter les images
    if (Array.isArray(data.images) && data.images.length > 0) {
      console.log("Ajout des images...");
      for (let i = 0; i < data.images.length; i++) {
        await prisma.image.create({
          data: {
            url: data.images[i],
            isMain: i === 0 || data.images[i] === data.mainImage,
            carId: car.id,
          },
        });
      }
    }
    
    // Récupérer la voiture avec ses relations
    const carWithRelations = await prisma.car.findUnique({
      where: { id: car.id },
      include: {
        features: true,
        images: true,
      },
    });
    
    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedCar = {
      ...carWithRelations,
      mainImage: carWithRelations?.images?.find((image) => image.isMain)?.url || 
                carWithRelations?.images?.[0]?.url || 
                "/images/car-placeholder.jpg",
      images: carWithRelations?.images?.map((image) => image.url) || [],
      features: carWithRelations?.features?.map((feature) => feature.name) || [],
    };
    
    return NextResponse.json(formattedCar, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    
    // Afficher plus de détails sur l'erreur
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    return NextResponse.json(
      { error: "Erreur lors de la création de la voiture", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
