// Script pour ajouter une voiture de test
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTestCar() {
  try {
    console.log('Tentative d\'ajout d\'une voiture de test...');
    
    // Récupérer un utilisateur administrateur
    const admin = await prisma.user.findFirst({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN']
        }
      }
    });
    
    if (!admin) {
      console.error('Aucun administrateur trouvé dans la base de données');
      return;
    }
    
    console.log(`Administrateur trouvé: ${admin.name} (${admin.email})`);
    
    // Créer une voiture de test
    const car = await prisma.car.create({
      data: {
        brand: 'Peugeot',
        model: '308',
        year: 2022,
        price: 25000,
        mileage: 15000,
        fuelType: 'Essence',
        transmission: 'Manuelle',
        bodyType: 'Berline',
        power: 130,
        color: 'Bleu',
        doors: 5,
        description: 'Voiture de test en excellent état',
        status: 'AVAILABLE',
        userId: admin.id,
        features: {
          create: [
            { name: 'Climatisation' },
            { name: 'GPS' },
            { name: 'Bluetooth' },
            { name: 'Régulateur de vitesse' }
          ]
        },
        images: {
          create: [
            { 
              url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop',
              isMain: true 
            },
            {
              url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop',
              isMain: false
            }
          ]
        }
      }
    });
    
    console.log('Voiture de test ajoutée avec succès:', car.id);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la voiture de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestCar();
