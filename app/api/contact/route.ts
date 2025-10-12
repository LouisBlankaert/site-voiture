import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  console.log('API contact: Début de la requête');
  try {
    const body = await request.json();
    const { name, email, message, phone } = body;
    console.log('API contact: Données reçues:', { name, email, phone });

    // Validation des données
    if (!name || !email || !message) {
      console.log('API contact: Données manquantes');
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      );
    }
    
    // Vérifier les variables d'environnement
    console.log('API contact: EMAIL_USER existe:', !!process.env.EMAIL_USER);
    console.log('API contact: EMAIL_PASSWORD existe:', !!process.env.EMAIL_PASSWORD);

    // Configuration pour Gmail avec variables d'environnement
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Contenu de l'email
    const mailOptions = {
      from: `"Site AUTOGATE" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Vous recevrez les emails à la même adresse
      subject: `Nouveau message de contact de ${name}`,
      text: `
        Nom: ${name}
        Email: ${email}
        Téléphone: ${phone || 'Non fourni'}
        
        Message:
        ${message}
      `,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone || 'Non fourni'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      // Option pour que vous puissiez répondre directement à l'expéditeur
      replyTo: email
    };

    // Envoi de l'email
    console.log('API contact: Tentative d\'envoi d\'email');
    const info = await transporter.sendMail(mailOptions);
    console.log('API contact: Email envoyé avec succès:', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('API contact: Erreur lors de l\'envoi de l\'email:', error);
    // Afficher plus de détails sur l'erreur
    if (error instanceof Error) {
      console.error('API contact: Message d\'erreur:', error.message);
      console.error('API contact: Stack trace:', error.stack);
    }
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
