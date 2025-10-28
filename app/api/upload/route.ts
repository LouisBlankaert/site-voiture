import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v4 as uuidv4 } from "uuid";
// La bibliothèque next-cloudinary est principalement pour les composants côté client
// Pour l'API serveur, nous utilisons directement cloudinary

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à télécharger des fichiers" },
        { status: 403 }
      );
    }

    // Récupérer le fichier depuis la requête
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Seuls les formats JPEG, PNG, WEBP et GIF sont acceptés." },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux. La taille maximale est de 10MB." },
        { status: 400 }
      );
    }
    
    // Pour l'instant, nous allons utiliser une solution temporaire
    // En production, vous devrez configurer Cloudinary correctement
    
    // Générer un nom de fichier unique pour simuler l'upload
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `voiture_${uuidv4()}.${fileExtension}`;
    
    // En production, vous feriez un vrai upload vers Cloudinary ici
    // Pour l'instant, nous simulons une URL Cloudinary
    const simulatedCloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/voitures/${uniqueFilename}`;
    
    console.log('Simulation d\'upload Cloudinary:', simulatedCloudinaryUrl);
    
    // Retourner l'URL simulée
    return NextResponse.json({ 
      success: true, 
      url: simulatedCloudinaryUrl,
      fileName: uniqueFilename
    });
    
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors du téléchargement du fichier",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
