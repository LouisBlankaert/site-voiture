import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

// Configuration - Utiliser des variables d'environnement ou des valeurs par défaut
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';

// Vérifier que le mot de passe est fourni
if (!ADMIN_PASSWORD) {
  console.error('ERREUR: Vous devez définir la variable d\'environnement ADMIN_PASSWORD');
  console.error('Exemple: ADMIN_PASSWORD="mot_de_passe_sécurisé" pnpm create-super-admin');
  process.exit(1);
}

async function createSuperAdmin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Vérification si le super admin existe déjà...');
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });
    
    if (existingUser) {
      console.log(`Un utilisateur avec l'email ${ADMIN_EMAIL} existe déjà.`);
      console.log('Rôle actuel:', existingUser.role);
      
      if (existingUser.role !== Role.SUPER_ADMIN) {
        console.log('Mise à jour du rôle en SUPER_ADMIN...');
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: Role.SUPER_ADMIN }
        });
        console.log('Rôle mis à jour avec succès.');
      }
      
      return;
    }
    
    // Hacher le mot de passe
    console.log('Création du compte super admin...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    // Créer le super admin
    const superAdmin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: Role.SUPER_ADMIN
      }
    });
    
    console.log('Super admin créé avec succès:');
    console.log(`- Email: ${superAdmin.email}`);
    console.log(`- Nom: ${superAdmin.name}`);
    console.log(`- Rôle: ${superAdmin.role}`);
    console.log('\nVous pouvez maintenant vous connecter avec ces identifiants.');
    
  } catch (error) {
    console.error('Erreur lors de la création du super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction
createSuperAdmin();
