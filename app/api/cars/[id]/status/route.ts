import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// PATCH /api/cars/[id]/status - Mettre à jour le statut d'une voiture
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier que l'utilisateur est connecté et est un administrateur ou super admin
    if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier le statut d'une voiture" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    // Vérifier que le statut est valide
    if (!["AVAILABLE", "RESERVED", "SOLD"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la voiture
    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        status,
        // Si la voiture est marquée comme vendue, enregistrer la date de vente
        soldDate: status === "SOLD" ? new Date() : null,
      },
      include: {
        features: true,
        images: true,
      },
    });

    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedCar = {
      ...updatedCar,
      mainImage: updatedCar.images.find((image) => image.isMain)?.url || 
                updatedCar.images[0]?.url || 
                "/images/car-placeholder.jpg",
      images: updatedCar.images.map((image) => image.url),
      features: updatedCar.features.map((feature) => feature.name),
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("Error updating car status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de la voiture" },
      { status: 500 }
    );
  }
}
