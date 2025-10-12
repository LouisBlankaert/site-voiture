import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/cars/[id]/comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        carId: params.id,
      },
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
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commentaires" },
      { status: 500 }
    );
  }
}

// POST /api/cars/[id]/comments
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour laisser un commentaire" },
        { status: 401 }
      );
    }

    const { content, rating } = await request.json();

    if (!content || !rating) {
      return NextResponse.json(
        { error: "Le contenu et la note sont requis" },
        { status: 400 }
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

    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content,
        rating,
        carId: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du commentaire" },
      { status: 500 }
    );
  }
}
