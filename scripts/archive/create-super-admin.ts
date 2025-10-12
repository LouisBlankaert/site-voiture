const bcrypt = require('bcrypt');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour demander des informations de manière interactive
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer: string) => {
      resolve(answer);
    });
  });
}

async function createSuperAdmin() {
  try {
    console.log('=== Création d\'un compte Super Administrateur ===');
    console.log('Ce compte aura tous les droits sur le site et pourra gérer les autres administrateurs.');
    
    // Demander les informations nécessaires
    const name = await question('Nom complet: ');
    const email = await question('Email: ');
    const password = await question('Mot de passe (min. 8 caractères): ');
    
    if (password.length < 8) {
      console.error('❌ Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      // Si l'utilisateur existe, vérifier s'il est déjà un SUPER_ADMIN
      if (existingUser.role === 'SUPER_ADMIN' as any) {
        console.log('⚠️ Cet utilisateur est déjà un Super Administrateur.');
        
        // Proposer de mettre à jour le mot de passe
        const updatePassword = await question('Voulez-vous mettre à jour le mot de passe? (o/n): ');
        
        if (updatePassword.toLowerCase() === 'o') {
          const hashedPassword = await bcrypt.hash(password, 10);
          
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { 
              name,
              password: hashedPassword 
            }
          });
          
          console.log('✅ Mot de passe mis à jour avec succès.');
        }
        
        return;
      } else {
        // Proposer de promouvoir l'utilisateur existant
        const promote = await question('Cet utilisateur existe déjà. Voulez-vous le promouvoir en Super Administrateur? (o/n): ');
        
        if (promote.toLowerCase() === 'o') {
          const hashedPassword = await bcrypt.hash(password, 10);
          
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { 
              name,
              password: hashedPassword,
              role: 'SUPER_ADMIN' as any 
            }
          });
          
          console.log('✅ Utilisateur promu en Super Administrateur avec succès.');
        } else {
          console.log('❌ Opération annulée.');
        }
        
        return;
      }
    }
    
    // Créer un nouveau Super Administrateur
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const superAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN' as any
      }
    });
    
    console.log('✅ Super Administrateur créé avec succès:');
    console.log(`Nom: ${superAdmin.name}`);
    console.log(`Email: ${superAdmin.email}`);
    console.log('\n⚠️ IMPORTANT: Conservez ces informations en lieu sûr.');
    console.log('Ce compte a un accès complet à toutes les fonctionnalités du site.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du Super Administrateur:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createSuperAdmin();
