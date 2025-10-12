import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            Retour à l&apos;accueil
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/voitures">
            Voir nos voitures
          </Link>
        </Button>
      </div>
    </div>
  );
}
