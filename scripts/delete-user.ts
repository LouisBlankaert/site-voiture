// Importer PrismaClient de manière dynamique pour éviter les problèmes d'importation
import prisma from '../lib/prisma'

// Email de l'utilisateur à supprimer
const emailToDelete = 'votre_email@exemple.fr' // Remplacez par l'email que vous souhaitez supprimer

async function deleteUser() {
  try {
    console.log(`Recherche de l'utilisateur avec l'email: ${emailToDelete}...`)
    
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: {
        email: emailToDelete
      }
    })

    if (!user) {
      console.log(`❌ Aucun utilisateur trouvé avec l'email: ${emailToDelete}`)
      return
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: {
        id: user.id
      }
    })
    
    console.log(`✅ Utilisateur avec l'email ${emailToDelete} supprimé avec succès !`)
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'utilisateur :', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUser()
