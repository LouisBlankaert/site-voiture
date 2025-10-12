import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET /api/cars/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const car = await prisma.car.findUnique({
      where: {
        id: params.id,
      },
      include: {
        features: true,
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedCar = {
      ...car,
      mainImage: car.images.find((image: { isMain: boolean; url: string }) => image.isMain)?.url || car.images[0]?.url || "/images/car-placeholder.jpg",
      images: car.images.map((image: { url: string }) => image.url),
      features: car.features.map((feature: { name: string }) => feature.name),
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la voiture" },
      { status: 500 }
    );
  }
}

// PUT /api/cars/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier cette voiture" },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Vérifier si la voiture existe
    const existingCar = await prisma.car.findUnique({
      where: {
        id: params.id,
      },
      include: {
        features: true,
        images: true,
      },
    });

    if (!existingCar) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour la voiture
    const car = await prisma.car.update({
      where: {
        id: params.id,
      },
      data: {
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        fuelType: data.fuelType,
        transmission: data.transmission,
        bodyType: data.bodyType,
        power: data.power,
        color: data.color,
        doors: data.doors,
        description: data.description,
      },
      include: {
        features: true,
        images: true,
      },
    });

    // Mettre à jour les caractéristiques
    // Supprimer les anciennes caractéristiques
    await prisma.feature.deleteMany({
      where: {
        carId: params.id,
      },
    });

    // Ajouter les nouvelles caractéristiques
    await prisma.feature.createMany({
      data: data.features.map((feature: string) => ({
        name: feature,
        carId: params.id,
      })),
    });

    // Mettre à jour les images
    // Supprimer les anciennes images
    await prisma.image.deleteMany({
      where: {
        carId: params.id,
      },
    });

    // Ajouter les nouvelles images
    await prisma.image.createMany({
      data: data.images.map((image: string, index: number) => ({
        url: image,
        carId: params.id,
        isMain: index === 0 || image === data.mainImage,
      })),
    });

    // Récupérer la voiture mise à jour avec toutes les relations
    const updatedCar = await prisma.car.findUnique({
      where: {
        id: params.id,
      },
      include: {
        features: true,
        images: true,
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedCar = {
      ...updatedCar,
      mainImage: updatedCar?.images.find((image: { isMain: boolean; url: string }) => image.isMain)?.url || updatedCar?.images[0]?.url || "/images/car-placeholder.jpg",
      images: updatedCar?.images.map((image: { url: string }) => image.url) || [],
      features: updatedCar?.features.map((feature: { name: string }) => feature.name) || [],
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la voiture" },
      { status: 500 }
    );
  }
}

// DELETE /api/cars/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cette voiture" },
        { status: 403 }
      );
    }

    // Vérifier si la voiture existe
    const car = await prisma.car.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer la voiture (les relations seront supprimées automatiquement grâce à onDelete: Cascade)
    await prisma.car.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la voiture" },
      { status: 500 }
    );
  }
}
