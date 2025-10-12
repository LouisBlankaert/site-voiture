import * as bcrypt from 'bcrypt'

// Importer PrismaClient de manière dynamique pour éviter les problèmes d'importation
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Liste des administrateurs à créer
const adminsToCreate = [
  {
    name: 'Premier Admin',
    email: 'admin1@exemple.fr',
    password: 'password1'
  }
  // Ajoutez autant d'administrateurs que vous le souhaitez ici
]

async function createAdmins() {
  try {
    console.log('Début de la création des administrateurs...')
    
    for (const admin of adminsToCreate) {
      // Vérifier si un utilisateur avec cet email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: {
          email: admin.email
        }
      })

      if (existingUser) {
        console.log(`⚠️ Un utilisateur avec l'email ${admin.email} existe déjà. Ignoré.`)
        continue
      }
      
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(admin.password, 10)
      
      // Créer le nouvel administrateur
      const newAdmin = await prisma.user.create({
        data: {
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          role: 'ADMIN',
        }
      })
      
      console.log('✅ Administrateur créé avec succès :', newAdmin.name, newAdmin.email)
    }
    
    console.log('\nCréation des administrateurs terminée !')
  } catch (error) {
    console.error('\n❌ Erreur lors de la création des administrateurs :', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmins()
