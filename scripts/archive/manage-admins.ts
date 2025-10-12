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

async function authenticateSuperAdmin(): Promise<boolean> {
  console.log('=== Authentification Super Administrateur ===');
  
  const email = await question('Email du Super Admin: ');
  const password = await question('Mot de passe: ');
  
  const superAdmin = await prisma.user.findFirst({
    where: {
      email,
      role: 'SUPER_ADMIN' as any
    }
  });
  
  if (!superAdmin) {
    console.error('❌ Aucun Super Administrateur trouvé avec cet email.');
    return false;
  }
  
  const passwordValid = await bcrypt.compare(password, superAdmin.password);
  
  if (!passwordValid) {
    console.error('❌ Mot de passe incorrect.');
    return false;
  }
  
  console.log(`✅ Authentifié en tant que ${superAdmin.name}`);
  return true;
}

async function listAdmins() {
  const admins = await prisma.user.findMany({
    where: {
      role: 'ADMIN' as any
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  console.log('\n=== Liste des Administrateurs ===');
  
  if (admins.length === 0) {
    console.log('Aucun administrateur trouvé.');
    return;
  }
  
  admins.forEach((admin: any, index: number) => {
    console.log(`\n${index + 1}. ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Créé le: ${admin.createdAt.toLocaleDateString()}`);
  });
}

async function createAdmin() {
  console.log('\n=== Création d\'un nouvel Administrateur ===');
  
  const name = await question('Nom: ');
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
    console.error('❌ Un utilisateur avec cet email existe déjà.');
    return;
  }
  
  // Créer le nouvel administrateur
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newAdmin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN' as any
    }
  });
  
  console.log('✅ Administrateur créé avec succès:');
  console.log(`Nom: ${newAdmin.name}`);
  console.log(`Email: ${newAdmin.email}`);
}

async function deleteAdmin() {
  await listAdmins();
  
  const email = await question('\nEmail de l\'administrateur à supprimer: ');
  
  const admin = await prisma.user.findFirst({
    where: {
      email,
      role: 'ADMIN' as any
    }
  });
  
  if (!admin) {
    console.error('❌ Aucun administrateur trouvé avec cet email.');
    return;
  }
  
  const confirm = await question(`Êtes-vous sûr de vouloir supprimer l'administrateur ${admin.name}? (o/n): `);
  
  if (confirm.toLowerCase() !== 'o') {
    console.log('❌ Opération annulée.');
    return;
  }
  
  await prisma.user.delete({
    where: { id: admin.id }
  });
  
  console.log('✅ Administrateur supprimé avec succès.');
}

async function resetAdminPassword() {
  await listAdmins();
  
  const email = await question('\nEmail de l\'administrateur dont vous souhaitez réinitialiser le mot de passe: ');
  
  const admin = await prisma.user.findFirst({
    where: {
      email,
      role: 'ADMIN' as any
    }
  });
  
  if (!admin) {
    console.error('❌ Aucun administrateur trouvé avec cet email.');
    return;
  }
  
  const newPassword = await question('Nouveau mot de passe (min. 8 caractères): ');
  
  if (newPassword.length < 8) {
    console.error('❌ Le mot de passe doit contenir au moins 8 caractères.');
    return;
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id: admin.id },
    data: { password: hashedPassword }
  });
  
  console.log('✅ Mot de passe réinitialisé avec succès.');
}

async function manageAdmins() {
  try {
    const isAuthenticated = await authenticateSuperAdmin();
    
    if (!isAuthenticated) {
      return;
    }
    
    while (true) {
      console.log('\n=== Gestion des Administrateurs ===');
      console.log('1. Lister les administrateurs');
      console.log('2. Créer un nouvel administrateur');
      console.log('3. Supprimer un administrateur');
      console.log('4. Réinitialiser le mot de passe d\'un administrateur');
      console.log('0. Quitter');
      
      const choice = await question('\nChoisissez une option (0-4): ');
      
      switch (choice) {
        case '1':
          await listAdmins();
          break;
        case '2':
          await createAdmin();
          break;
        case '3':
          await deleteAdmin();
          break;
        case '4':
          await resetAdminPassword();
          break;
        case '0':
          console.log('Au revoir!');
          return;
        default:
          console.log('❌ Option invalide. Veuillez réessayer.');
      }
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

manageAdmins();
