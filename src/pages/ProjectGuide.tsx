import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faTasks,
  faUsers,
  faBoxOpen,
  faBuilding,
  faDoorOpen,
  faClipboardList,
  faLifeRing,
  faCog,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

const Section: React.FC<{ icon: any; title: string; id: string; img?: string }> = ({ icon, title, id, children, img }) => (
  <section id={id} className="mt-8 first:mt-0">
    <h2 className="text-xl font-semibold flex items-center mb-2">
      <FontAwesomeIcon icon={icon} className="mr-3 text-accent" />
      {title}
    </h2>
    {img && (
      <img
        src={img}
        alt={title}
        className="w-full max-w-3xl rounded-lg shadow-md my-4 border"
      />
    )}
    <div className="prose max-w-none">
      {children}
    </div>
  </section>
);

// Step list component for nicer numbered steps
const StepList: React.FC<{ steps: React.ReactNode[] }> = ({ steps }) => (
  <ol className="space-y-3 ml-2 sm:ml-4">
    {steps.map((step, i) => (
      <li key={i} className="flex items-start">
        <span className="flex-none mt-1 w-7 h-7 rounded-full bg-accent text-white font-semibold flex items-center justify-center mr-3">
          {i + 1}
        </span>
        <span className="flex-1">{step}</span>
      </li>
    ))}
  </ol>
);

// Callout component
const Callout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-l-4 border-accent bg-accent/5 p-4 rounded-md flex items-start text-sm mt-4">
    <FontAwesomeIcon icon={faInfoCircle} className="text-accent mr-2 mt-0.5" /> {children}
  </div>
);

const ProjectGuide: React.FC = () => {
  const [tocQuery, setTocQuery] = useState('');

  const sections = [
    { id: 'dashboard', title: 'Tableau de bord' },
    { id: 'missions', title: 'Missions' },
    { id: 'personnel', title: 'Personnel' },
    { id: 'ressources', title: 'Ressources' },
    { id: 'clients', title: 'Clients & Facturation' },
    { id: 'visiteurs', title: 'Visiteurs' },
    { id: 'conformite', title: 'Conformité' },
    { id: 'support', title: 'Support' },
    { id: 'parametres', title: 'Paramètres' },
  ];

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(tocQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Hero */}
      <header className="bg-gradient-to-r from-yale-blue to-oxford-blue text-white rounded-2xl p-10 shadow-lg mb-10 relative overflow-hidden">
        <h1 className="text-3xl font-bold drop-shadow-lg">Guide utilisateur&nbsp;: DMT Sécurité</h1>
        <p className="mt-2 text-white/90 max-w-3xl">Découvrez le fonctionnement global de la plateforme, pas à pas, avec des explications détaillées pour chaque module.</p>
        <img src="/logo192.png" className="absolute -right-10 -bottom-10 opacity-10 w-80 pointer-events-none select-none" />
      </header>

      <div className="lg:flex gap-8">
        {/* Sticky TOC */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 sticky top-4 self-start bg-white border border-gray-100 rounded-xl p-4 shadow-sm h-max">
          <h2 className="font-semibold text-sm text-gray-700 mb-3">Sommaire</h2>
          <input
            type="text"
            placeholder="Rechercher..."
            value={tocQuery}
            onChange={(e) => setTocQuery(e.target.value)}
            className="w-full mb-3 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <nav className="space-y-2 text-sm max-h-[60vh] overflow-y-auto pr-1 custom-scroll">
            {filteredSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-gray-600 hover:text-accent transition-colors"
              >
                {s.title}
              </a>
            ))}
            {filteredSections.length === 0 && (
              <p className="text-xs text-gray-400">Aucun résultat</p>
            )}
          </nav>
        </aside>

        <main className="flex-1">
          {/* Sections détaillées */}
          <Section
            id="dashboard"
            title="Tableau de bord"
            icon={faTachometerAlt}
            img="/logo512.png"
          >
            <p>
              Votre page d'accueil regroupe les indicateurs clés en temps réel&nbsp;: missions actives, alertes, KPI de
              performance et notifications. Cliquez sur une carte pour accéder directement au module concerné.
            </p>
            <h4 className="font-medium mt-4">Personnaliser votre vue</h4>
            <StepList
              steps={[
                <>Ouvrez le menu <em>⋯</em> situé en haut à droite de la tuile.</>,
                <>Sélectionnez <strong>Masquer</strong> ou <strong>Ajouter un widget</strong>.</>,
                <>Faites glisser les cartes pour les réorganiser.</>,
              ]}
            />
            <Callout>Astuce&nbsp;: double-cliquez sur une carte pour l'agrandir en plein écran.</Callout>
          </Section>

          <Section id="missions" title="Missions" icon={faTasks} img="/map-placeholder.jpg">
            <p>
              Planifiez, assignez et suivez les missions opérationnelles. Le <strong>calendrier</strong> offre une vue
              hebdomadaire ou mensuelle, tandis que l'onglet <em>Carte</em> affiche la géolocalisation des agents et des
              incidents en temps réel.
            </p>
            <h4 className="font-medium mt-4">Créer une mission</h4>
            <StepList
              steps={[
                <>Cliquez sur le bouton <strong>+ Nouvelle mission</strong>.</>,
                <>Renseignez le <strong>client</strong>, le <strong>lieu</strong> et les <strong>horaires</strong>.</>,
                <>Choisissez un ou plusieurs <strong>agents</strong>.</>,
                <>Enregistrez ; la mission apparaît alors dans la liste, le calendrier et la carte.</>,
              ]}
            />
            <h4 className="font-medium mt-6">Modifier ou annuler</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Survolez la mission et cliquez sur l'icône <em>✏️</em> pour modifier.</li>
              <li>Utilisez l'icône <em>🗑️</em> pour annuler (seul un superviseur ou admin peut supprimer définitivement).</li>
            </ul>
            <Callout>Raccourci&nbsp;: glisser-déposer une mission sur le calendrier pour changer sa date.</Callout>
          </Section>

          <Section id="personnel" title="Personnel" icon={faUsers}>
            <p>
              Gérez vos <strong>agents</strong>, <strong>employés</strong> et <strong>formations</strong>. Les feuilles de
              présence et demandes de congés sont centralisées pour un suivi RH simplifié.
            </p>
            <h4 className="font-medium mt-4">Ajouter un agent</h4>
            <StepList
              steps={[
                <>Dans l'onglet <em>Agents</em>, cliquez sur <strong>Ajouter</strong>.</>,
                <>Complétez le nom, l'e-mail, le rôle et le niveau d'accréditation.</>,
                <>Attribuez les <em>permissions</em> : cochez les modules accessibles.</>,
                <>Validez ; l'agent reçoit un e-mail d'activation.</>,
              ]}
            />
            <h4 className="font-medium mt-6">Modifier ou archiver</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Cliquez sur la ligne de l'agent puis <strong>Modifier</strong>.</li>
              <li>Pour désactiver temporairement&nbsp;: bascule <em>Statut actif</em>.</li>
              <li>Pour supprimer&nbsp;: bouton <em>Supprimer</em> (irréversible).</li>
            </ul>
            <h4>Gérer les congés</h4>
            <StepList
              steps={[
                <>L'employé soumet une demande dans <em>Congés</em>.</>,
                <>Le superviseur reçoit une notification et peut <strong>Approuver</strong> ou <strong>Refuser</strong>.</>,
                <>Les jours validés apparaissent automatiquement dans le planning.</>,
              ]}
            />
            <Callout>Un code couleur (vert = approuvé, rouge = refusé) s'affiche directement dans le calendrier.</Callout>
          </Section>

          <Section id="ressources" title="Ressources" icon={faBoxOpen}>
            <p>
              Suivez votre inventaire d'équipements et la flotte de véhicules. Recevez des alertes d'entretien ou de stock
              faible et générez des rapports d'utilisation.
            </p>
            <h4 className="font-medium mt-4">Ajouter un équipement</h4>
            <StepList
              steps={[
                <>Accédez à <em>Équipements</em> → <strong>Ajouter</strong>.</>,
                <>Saisissez le type, le numéro de série et l'état.</>,
                <>Assignez-le à une mission ou à un agent si nécessaire.</>,
              ]}
            />
            <h4 className="font-medium mt-6">Planifier un entretien</h4>
            <StepList
              steps={[
                <>Cliquez sur l'équipement, onglet <em>Maintenance</em>.</>,
                <>Choisissez la date et la périodicité ; une alerte sera créée.</>,
              ]}
            />
            <Callout>Pensez à joindre le manuel PDF pour faciliter le diagnostic terrain.</Callout>
          </Section>

          <Section id="clients" title="Clients & Facturation" icon={faBuilding}>
            <p>
              Accédez aux fiches clients, contrats et factures. Le module <em>Billing</em> permet de générer et d'envoyer des
              factures automatisées basées sur les missions réalisées.
            </p>
            <h4 className="font-medium mt-4">Créer un client</h4>
            <StepList
              steps={[
                <>Cliquez sur <strong>Nouveau client</strong>.</>,
                <>Renseignez les coordonnées et le contact principal.</>,
                <>Enregistrez pour activer le client dans le CRM.</>,
              ]}
            />
            <h4>Émettre une facture</h4>
            <StepList
              steps={[
                <>Sélectionnez le client puis <strong>Nouvelle facture</strong>.</>,
                <>Choisissez les missions ou services ; les montants sont pré-calculés.</>,
                <>Envoyez par e-mail ou téléchargez en PDF.</>,
              ]}
            />
            <Callout>Les factures payées sont marquées automatiquement « Réglée » grâce à l'intégration Stripe.</Callout>
          </Section>

          <Section id="visiteurs" title="Visiteurs" icon={faDoorOpen}>
            <p>
              Enregistrez les visiteurs, imprimez des badges et suivez l'historique des entrées/sorties. Connecté à la
              reconnaissance faciale pour un contrôle d'accès avancé.
            </p>
            <h4 className="font-medium mt-4">Enregistrer un visiteur</h4>
            <StepList
              steps={[
                <>Cliquez sur <strong>Arrivée</strong> puis scannez la pièce d'identité ou saisissez manuellement.</>,
                <>Attribuez un badge ; la photo est capturée automatiquement.</>,
              ]}
            />
            <h4 className="font-medium mt-6">Clôturer la visite</h4>
            <StepList
              steps={[
                <>Bouton <strong>Départ</strong> sur la ligne du visiteur.</>,
                <>Le badge est invalidé et l'historique mis à jour.</>,
              ]}
            />
            <Callout>Les données visiteurs sont conservées 30&nbsp;jours, conformément à la politique RGPD.</Callout>
          </Section>

          <Section id="conformite" title="Conformité" icon={faClipboardList}>
            <p>
              Centralisez vos rapports d'incident et documents de conformité. Des modèles pré-remplis accélèrent la
              rédaction et garantissent la cohérence des informations.
            </p>
            <h4 className="font-medium mt-4">Créer un rapport</h4>
            <StepList
              steps={[
                <>Cliquez sur <strong>Nouveau rapport</strong>.</>,
                <>Sélectionnez un modèle (incident, audit, etc.).</>,
                <>Ajoutez photos, vidéos ou pièces jointes.</>,
                <>Soumettez pour validation.</>,
              ]}
            />
            <Callout>Un système de versioning vous permet de revenir sur les modifications précédentes.</Callout>
          </Section>

          <Section id="support" title="Support" icon={faLifeRing}>
            <p>
              Le <strong>Help Desk</strong> permet de créer des tickets internes, tandis que <strong>Risk Management</strong>
              identifie et hiérarchise les risques opérationnels.
            </p>
            <h4 className="font-medium mt-4">Ouvrir un ticket</h4>
            <StepList
              steps={[
                <>Cliquez sur <strong>Nouveau ticket</strong>.</>,
                <>Choisissez la <em>catégorie</em> et décrivez le problème.</>,
                <>Ajoutez des pièces jointes si nécessaire puis <strong>Soumettre</strong>.</>,
              ]}
            />
            <Callout>Les SLA sont affichés dans la barre latérale du ticket pour un suivi clair.</Callout>
          </Section>

          <Section id="parametres" title="Paramètres" icon={faCog}>
            <p>
              Personnalisez votre profil, l'entreprise, les préférences d'interface, la sécurité et bien plus. Consultez le
              <em>Guide</em> intégré pour des explications détaillées.
            </p>
            <h4 className="font-medium mt-4">Modifier votre profil</h4>
            <StepList
              steps={[
                <>Onglet <strong>Profil</strong> puis mettez à jour nom, e-mail ou téléphone.</>,
                <>Cliquez sur <em>Enregistrer les modifications</em>.</>,
              ]}
            />
            <h4 className="font-medium mt-6">Activer la 2FA</h4>
            <StepList
              steps={[
                <>Onglet <strong>Sécurité</strong>.</>,
                <>Activez la bascule « Authentification à deux facteurs ».</>,
                <>Scannez le QR Code dans votre application d'authentification.</>,
              ]}
            />
            <Callout>La 2FA renforce drastiquement la sécurité de votre compte&nbsp;: nous la recommandons vivement.</Callout>
          </Section>
        </main>
      </div>
    </div>
  );
};

export default ProjectGuide; 