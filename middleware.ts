import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Vérifier si le chemin commence par /admin/super - réservé aux super-admins
  if (path.startsWith('/admin/super')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Si l'utilisateur n'est pas connecté ou n'est pas un super-admin, rediriger vers la page de connexion
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  // Vérifier si le chemin commence par /admin (mais pas /admin/super)
  else if (path.startsWith('/admin')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Si l'utilisateur n'est pas connecté ou n'est ni admin ni super-admin, rediriger vers la page de connexion
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Protéger les routes d'authentification sauf la page de connexion
  if (path.startsWith('/auth') && path !== '/auth/login') {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};
