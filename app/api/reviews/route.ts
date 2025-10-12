import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/reviews - Récupérer tous les avis
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    // Calculer la note moyenne
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      reviews,
      stats: {
        count: reviews.length,
        averageRating: parseFloat(averageRating.toFixed(1))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Ajouter un nouvel avis
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier si l'utilisateur est connecté
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour laisser un avis' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    // Validation des données
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être comprise entre 1 et 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le commentaire doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis' },
        { status: 400 }
      );
    }

    // Créer le nouvel avis
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'avis' },
      { status: 500 }
    );
  }
}
