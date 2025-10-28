import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

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

    // Créer un nom de fichier unique
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Créer le chemin du dossier de destination
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Vérifier si le dossier existe, sinon le créer
    try {
      if (!existsSync(uploadDir)) {
        console.log(`Dossier d'upload n'existe pas. Création de: ${uploadDir}`);
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (dirError) {
      console.error("Erreur lors de la création du dossier:", dirError);
      return NextResponse.json(
        { error: "Erreur lors de la création du dossier d'upload", details: dirError instanceof Error ? dirError.message : String(dirError) },
        { status: 500 }
      );
    }
    
    // Lire le contenu du fichier
    let bytes;
    try {
      bytes = await file.arrayBuffer();
    } catch (arrayBufferError) {
      console.error("Erreur lors de la lecture du fichier:", arrayBufferError);
      return NextResponse.json(
        { error: "Erreur lors de la lecture du fichier", details: arrayBufferError instanceof Error ? arrayBufferError.message : String(arrayBufferError) },
        { status: 500 }
      );
    }
    
    const buffer = Buffer.from(bytes);
    
    // Écrire le fichier sur le disque
    const filePath = join(uploadDir, fileName);
    try {
      await writeFile(filePath, buffer);
      console.log(`Fichier écrit avec succès: ${filePath}`);
    } catch (writeError) {
      console.error("Erreur lors de l'écriture du fichier:", writeError);
      return NextResponse.json(
        { error: "Erreur lors de l'écriture du fichier", details: writeError instanceof Error ? writeError.message : String(writeError) },
        { status: 500 }
      );
    }
    
    // Retourner l'URL du fichier téléchargé
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName
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
