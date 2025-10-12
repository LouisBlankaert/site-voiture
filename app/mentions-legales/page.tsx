export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Informations légales</h2>
          <p>
            Le site web autogate.be est édité par :
          </p>
          <p className="mt-4">
            <strong>LGLCOMPANY SRL</strong> opérant sous le nom commercial <strong>AUTOGATE</strong><br />
            Société à Responsabilité Limitée de droit belge<br />
            Siège social : Rue du Chamois 27, 1180 Uccle, Belgique<br />
            Numéro d&apos;entreprise : BE 1023.482.236<br />
            Numéro de TVA : BE 1023.482.236<br />
            Email : contact@autogate.be<br />
            Téléphone : +32 486 25 19 26
          </p>
          <p className="mt-4">
            Inscrite à la Banque-Carrefour des Entreprises (BCE) sous le numéro BE 1023.482.236
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Directeur de la publication</h2>
          <p>
            Le directeur de la publication du site est Louis Blankaert, en qualité de gérant de la société LGLCOMPANY SRL.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Hébergement</h2>
          <p>
            Le site autogate.be est hébergé par :<br />
            Louis Blankaert<br />
            Rue du Chamois 27<br />
            1180 Uccle<br />
            Belgique<br />
            Téléphone : +32 486 25 19 26
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu du site autogate.be (structure, textes, logos, images, vidéos, graphismes, etc.) est la propriété exclusive de LGLCOMPANY SRL ou de ses partenaires et est protégé par les lois belges et internationales relatives à la propriété intellectuelle.
          </p>
          <p className="mt-4">
            Toute reproduction totale ou partielle du contenu du site sans l&apos;autorisation expresse de LGLCOMPANY SRL est strictement interdite et constituerait une contrefaçon sanctionnée par les articles XI.164 et suivants du Code de droit économique belge.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Liens hypertextes</h2>
          <p>
            Le site autogate.be peut contenir des liens hypertextes vers d&apos;autres sites internet. LGLCOMPANY SRL n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Données personnelles</h2>
          <p>
            Les informations concernant la collecte et le traitement des données personnelles sont détaillées dans notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p>
            Le site autogate.be utilise des cookies pour améliorer l&apos;expérience utilisateur. Pour plus d&apos;informations sur l&apos;utilisation des cookies, veuillez consulter notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes mentions légales sont soumises au droit belge. En cas de litige, les tribunaux belges de l&apos;arrondissement judiciaire de Bruxelles seront seuls compétents.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
          <p>
            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l&apos;adresse suivante : contact@autogate.be
          </p>
        </section>
      </div>
    </div>
  );
}
