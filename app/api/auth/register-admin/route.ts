import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// Code secret pour créer un compte administrateur
// En production, ce code devrait être stocké dans une variable d'environnement
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "Bl@nk@3rt_Admin";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, adminCode } = await request.json();

    // Validation des données
    if (!name || !email || !password || !adminCode) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier le code administrateur
    if (adminCode !== ADMIN_SECRET_CODE) {
      return NextResponse.json(
        { error: "Code administrateur invalide" },
        { status: 403 }
      );
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Vérifier s'il existe déjà des utilisateurs
    const userCount = await prisma.user.count();
    
    // Déterminer le rôle (le premier utilisateur sera SUPER_ADMIN, les autres ADMIN)
    const role = userCount === 0 ? "SUPER_ADMIN" : "ADMIN";

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error registering admin:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
