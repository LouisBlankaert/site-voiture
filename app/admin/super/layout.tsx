'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Vérifier si l'utilisateur est un super-administrateur
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Afficher un écran de chargement pendant la vérification
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas un super-administrateur, ne rien afficher (la redirection se fera via useEffect)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Zone Super Admin</h1>
        <p className="text-gray-600 mb-6">
          Bienvenue dans la zone réservée aux super-administrateurs. Cette section vous permet de gérer
          les accès administrateurs de votre site.
        </p>
        
        <nav className="flex space-x-4 border-b pb-4">
          <Link
            href="/admin"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
          >
            ← Retour à l'administration
          </Link>
          <Link
            href="/admin/super/users"
            className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-100"
          >
            Gestion des administrateurs
          </Link>
        </nav>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
        {children}
      </div>
    </div>
  );
}
