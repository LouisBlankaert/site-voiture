import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voitures Vendues | AUTOGATE',
  description: 'Découvrez les véhicules récemment vendus par AUTOGATE.'
};

export default function VoituresVenduesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
