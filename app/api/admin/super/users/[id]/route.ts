import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

// GET - Récupérer un administrateur spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'utilisateur est un super-administrateur
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    // Récupérer l'administrateur
    const admin = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user: admin });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'administrateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'administrateur' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un administrateur
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'utilisateur est un super-administrateur
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    const { name, email, password, role } = await req.json();
    
    // Vérifier si l'administrateur existe
    const existingAdmin = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingAdmin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Préparer les données à mettre à jour
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email && email !== existingAdmin.email) {
      // Vérifier si l'email est déjà utilisé
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
      
      updateData.email = email;
    }
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Le mot de passe doit contenir au moins 8 caractères' },
          { status: 400 }
        );
      }
      
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (role) {
      updateData.role = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
    }
    
    // Mettre à jour l'administrateur
    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json({
      message: 'Administrateur mis à jour avec succès',
      user: updatedAdmin
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'administrateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'administrateur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un administrateur
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'utilisateur est un super-administrateur
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    // Vérifier si l'administrateur existe
    const admin = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Empêcher la suppression de son propre compte
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }
    
    // Supprimer l'administrateur
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: 'Administrateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'administrateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'administrateur' },
      { status: 500 }
    );
  }
}
