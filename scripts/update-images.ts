// Utiliser l'instance singleton de prisma
import prisma from '../lib/prisma'

async function main() {
  // Mettre à jour les images pour la Renault Clio
  const clio = await prisma.car.findFirst({
    where: {
      brand: 'Renault',
      model: 'Clio'
    },
    include: {
      images: true
    }
  });

  if (clio) {
    // Supprimer les anciennes images
    await prisma.image.deleteMany({
      where: {
        carId: clio.id
      }
    });

    // Ajouter les nouvelles images
    await prisma.image.createMany({
      data: [
        {
          url: '/images/cars/renault-clio-1.jpg',
          carId: clio.id,
          isMain: true
        },
        {
          url: '/images/cars/renault-clio-2.jpg',
          carId: clio.id,
          isMain: false
        }
      ]
    });

    console.log('Images de la Renault Clio mises à jour');
  } else {
    console.log('Renault Clio non trouvée dans la base de données');
  }

  // Mettre à jour les images pour la Peugeot 3008
  const peugeot = await prisma.car.findFirst({
    where: {
      brand: 'Peugeot',
      model: '3008'
    },
    include: {
      images: true
    }
  });

  if (peugeot) {
    // Supprimer les anciennes images
    await prisma.image.deleteMany({
      where: {
        carId: peugeot.id
      }
    });

    // Ajouter les nouvelles images
    await prisma.image.createMany({
      data: [
        {
          url: '/images/cars/peugeot-3008-1.jpg',
          carId: peugeot.id,
          isMain: true
        },
        {
          url: '/images/cars/peugeot-3008-2.jpg',
          carId: peugeot.id,
          isMain: false
        }
      ]
    });

    console.log('Images de la Peugeot 3008 mises à jour');
  } else {
    console.log('Peugeot 3008 non trouvée dans la base de données');
  }

  console.log('Mise à jour des images terminée');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
