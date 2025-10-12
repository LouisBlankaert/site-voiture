import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration des Voitures | AUTOGATE',
  description: 'Gérez les voitures de votre inventaire AUTOGATE.'
};

export default function AdminVoituresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
