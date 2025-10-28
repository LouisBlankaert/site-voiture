// Configuration de Cloudinary
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: 'voitures_preset', // Créez ce preset dans votre dashboard Cloudinary
};
