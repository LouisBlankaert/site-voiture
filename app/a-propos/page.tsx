
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">À Propos d'AUTOGATE</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Notre Histoire</h2>
        <div className="bg-primary/5 p-6 rounded-lg mb-6 italic text-lg">
          "Ouvrez la porte vers votre prochaine voiture. Simplicité, Transparence, Confiance."
        </div>
        <p className="text-muted-foreground mb-4">
          Fondée par deux passionnés d'automobile, AUTOGATE est née de l'envie de proposer une alternative honnête, humaine et transparente à l'achat et la vente de véhicules d'occasion.
        </p>
        <p className="text-muted-foreground mb-4">
          Dans un marché souvent dominé par les marges et les négociations biaisées, nous avons choisi un modèle d'intermédiation : pas de stock, pas d'enjeux commerciaux cachés. Juste vous, nous, et une vente bien faite.
        </p>
        <p className="text-muted-foreground">
          En tant qu'entreprise 100% digitale, nous offrons un service disponible 24h/24 et 7j/7, avec une livraison de votre véhicule directement à votre domicile, partout en Belgique.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Notre Entreprise</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><span className="font-medium">Dépôt-vente</span> : Nous commercialisons votre véhicule sans l'acheter, en vous garantissant le meilleur prix</li>
          <li><span className="font-medium">Financement</span> : Solutions personnalisées pour faciliter l'acquisition de votre véhicule</li>
          <li><span className="font-medium">Reprise</span> : Évaluation juste et transparente de votre ancien véhicule</li>
          <li><span className="font-medium">Services 100% en ligne</span> : Disponible 24h/24 et 7j/7 pour vous accompagner</li>
          <li><span className="font-medium">Livraison en Belgique</span> : Votre véhicule livré à domicile partout en Belgique</li>
          <li><span className="font-medium">Transparence totale</span> : Pas de stock, pas d'enjeux commerciaux cachés</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-muted/20 p-6 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-full mb-4 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Service 100% en ligne</h3>
          <p className="text-muted-foreground">
            Notre modèle full digital vous permet de réaliser toutes les étapes de votre projet automobile en ligne, sans déplacement.
          </p>
        </div>
        <div className="bg-muted/20 p-6 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-full mb-4 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Livraison en Belgique</h3>
          <p className="text-muted-foreground">
            Nous assurons la livraison de votre véhicule directement à votre domicile, partout en Belgique.
          </p>
        </div>
        <div className="bg-muted/20 p-6 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-full mb-4 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Disponibilité 24/7</h3>
          <p className="text-muted-foreground">
            Notre plateforme est accessible 24h/24 et 7j/7, vous permettant de consulter nos offres et services à tout moment.
          </p>
        </div>
      </div>


      <div>
        <h2 className="text-2xl font-semibold mb-4">Notre Approche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Intermédiation</h3>
            <p className="text-muted-foreground mb-4">
              Contrairement aux concessionnaires traditionnels, nous agissons comme intermédiaires entre vendeurs et acheteurs, sans stock propre, ce qui élimine les conflits d'intérêts et garantit une transparence totale.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Honnêteté</h3>
            <p className="text-muted-foreground">
              Nous privilégions une approche honnête et humaine dans toutes nos interactions. Pas de tactiques de vente agressives, juste des conseils sincères et personnalisés.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Transparence</h3>
            <p className="text-muted-foreground mb-4">
              Chaque aspect de notre service est transparent : de l'état du véhicule à nos commissions, en passant par les conditions de financement. Aucune surprise, aucun frais caché.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Service Complet</h3>
            <p className="text-muted-foreground">
              Notre modèle d'intermédiation s'étend à tous les aspects de la transaction : dépôt-vente, financement, reprise, livraison et services associés, pour une expérience fluide et sans stress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
