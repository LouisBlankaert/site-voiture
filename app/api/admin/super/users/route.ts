import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

// GET - Récupérer tous les administrateurs
export async function GET(req: NextRequest) {
  try {
    // Vérifier si l'utilisateur est un super-administrateur
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    // Récupérer tous les administrateurs (ADMIN et SUPER_ADMIN)
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ users: admins });
  } catch (error) {
    console.error('Erreur lors de la récupération des administrateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des administrateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel administrateur
export async function POST(req: NextRequest) {
  try {
    // Vérifier si l'utilisateur est un super-administrateur
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    const { name, email, password, role = 'ADMIN' } = await req.json();
    
    // Validation des données
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }
    
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer le nouvel administrateur
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'
      }
    });
    
    // Exclure le mot de passe de la réponse
    const { password: _, ...adminWithoutPassword } = newAdmin;
    
    return NextResponse.json({
      message: 'Administrateur créé avec succès',
      user: adminWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'administrateur' },
      { status: 500 }
    );
  }
}
