import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration | AUTOGATE',
  description: 'Panneau d\'administration AUTOGATE.'
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
