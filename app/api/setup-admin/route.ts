import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// IMPORTANT : Supprimez ce fichier après avoir créé votre admin !
export async function GET() {
  try {
    // Vérifier si un super admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN'
      }
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Un super admin existe déjà',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Créer un super admin
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Bl@nk@3rt', 10);
    const admin = await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'blankaertlouis@outlook.com',
        name: process.env.ADMIN_NAME || 'Louis Blankaert',
        password: adminPassword,
        role: Role.SUPER_ADMIN
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Super admin créé avec succès',
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du super admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
