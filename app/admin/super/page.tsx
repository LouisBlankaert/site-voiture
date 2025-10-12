'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SuperAdminPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Super Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Gestion des administrateurs</h2>
          <p className="text-gray-600 mb-4">
            Gérez les comptes administrateurs de votre site. Vous pouvez créer, modifier et supprimer des comptes administrateurs.
          </p>
          <Link
            href="/admin/super/users"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Gérer les administrateurs
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Votre compte</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Nom</p>
            <p className="font-medium">{session?.user?.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Rôle</p>
            <p className="font-medium">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                {session?.user?.role}
              </span>
            </p>
          </div>
          <Link
            href="/admin/profil"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Modifier mon profil
          </Link>
        </div>
      </div>
    </div>
  );
}
