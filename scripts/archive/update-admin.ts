import * as bcrypt from 'bcrypt'

// Importer PrismaClient de manière dynamique pour éviter les problèmes d'importation
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdmin() {
  try {
    // Trouver l'administrateur existant
    const admin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (!admin) {
      console.error('Aucun administrateur trouvé')
      return
    }

    console.log('Administrateur actuel :', admin.name, admin.email)

    // Nouvelles informations - modifiez ces valeurs selon vos besoins
    const newName = 'Louis'
    const newEmail = 'nouveau@email.fr'
    const newPassword = 'nouveau_mot_de_passe'
    
    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Mettre à jour l'administrateur
    const updatedAdmin = await prisma.user.update({
      where: {
        id: admin.id
      },
      data: {
        name: newName,
        email: newEmail,
        password: hashedPassword,
      }
    })
    
    console.log('Administrateur mis à jour avec succès :', updatedAdmin.name, updatedAdmin.email)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'administrateur :', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdmin()
