import { NextResponse } from 'next/server';

export async function GET() {
  // Cette route est uniquement pour tester les variables d'environnement
  // Ne pas utiliser en production car elle expose des informations sensibles
  
  console.log('ENV TEST: Vérification des variables d\'environnement');
  console.log('ENV TEST: EMAIL_USER existe:', !!process.env.EMAIL_USER);
  console.log('ENV TEST: EMAIL_PASSWORD existe:', !!process.env.EMAIL_PASSWORD);
  
  // Masquer les informations sensibles mais montrer les premières lettres pour vérification
  const emailUser = process.env.EMAIL_USER || '';
  const emailPassword = process.env.EMAIL_PASSWORD || '';
  
  return NextResponse.json({
    emailUserExists: !!process.env.EMAIL_USER,
    emailPasswordExists: !!process.env.EMAIL_PASSWORD,
    emailUserPrefix: emailUser.substring(0, 3) + '...',
    emailPasswordLength: emailPassword.length,
    nodeEnv: process.env.NODE_ENV,
    envFiles: '.env et/ou .env.local',
  });
}
