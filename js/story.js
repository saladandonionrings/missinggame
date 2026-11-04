/* ==========================================================
   HORS LIGNE — Scénario, personnages, contenus
   Tous les personnages, lieux d'entreprise et numéros sont fictifs.
   Les numéros utilisent les plages réservées à la fiction (ARCEP).
   ========================================================== */
const STORY = {};

/* ---------------- Contacts ---------------- */
STORY.contacts = [
  { id: 'jade',   name: 'Jade 💛',        short: 'Jade',   num: '06 39 98 12 03', col: '#ff9f0a', ini: 'J', fav: true, voice: 'jade' },
  { id: 'maman',  name: 'Maman',          short: 'Maman',  num: '06 39 98 44 50', col: '#ff6b9a', ini: 'M', fav: true, voice: 'maman' },
  { id: 'theo',   name: 'Théo (Lumen)',   short: 'Théo',   num: '06 39 98 27 88', col: '#5ac8fa', ini: 'T', voice: 'theo' },
  { id: 'mamie',  name: 'Mamie 🏠',        short: 'Mamie',  num: '02 61 91 48 06', col: '#a2845e', ini: 'O', fav: true },
  { id: 'lumen',  name: 'Lumen Support',  short: 'Lumen',  num: '04 65 71 20 20', col: '#8b7bff', ini: 'L' },
  { id: 'benali', name: 'Mme Benali (3e G)', short: 'Mme Benali', num: '06 39 98 61 17', col: '#30d158', ini: 'B' },
  { id: 'ines',   name: 'Inès',           short: 'Inès',   num: '06 39 98 33 40', col: '#bf5af2', ini: 'I' },
  { id: 'paul',   name: 'Paul',           short: 'Paul',   num: '06 39 98 52 19', col: '#64d2ff', ini: 'P' },
  { id: 'pelletier', name: 'Dr Pelletier', short: 'Dr Pelletier', num: '04 65 71 88 02', col: '#8e8e93', ini: 'DP' },
  { id: 'nepas',  name: 'NE PAS RÉPONDRE', short: 'NE PAS RÉPONDRE', num: '06 39 98 00 66', col: '#ff453a', ini: '⛔' },
];
STORY.morelNum = '06 39 98 71 44';
STORY.claireNum = '06 39 98 09 21';

/* ---------------- Indices ---------------- */
STORY.cats = [
  { id: 'L', name: 'Où est-elle ?' },
  { id: 'P', name: 'Pourquoi est-elle partie ?' },
  { id: 'M', name: 'Qui la cherche ?' },
  { id: 'D', name: 'Ce qui est en jeu' },
];
STORY.clues = {
  L1: { c: 'L', t: "31/10, 5h40 : Nora a confié Kafka à sa voisine. Un départ préparé." },
  L2: { c: 'L', t: "Plans : itinéraire Lyon → Brest prévu le 31/10. Et après Brest… rien." },
  L3: { c: 'L', t: "Météo : elle suit une seule ville en plus de Lyon et Nantes — Ouessant." },
  L4: { c: 'L', t: "Ouessant, 2019 : Nora et sa grand-mère, au pied du phare." },
  L5: { c: 'L', t: "Wi-Fi connu : « Ty_Odette » — la maison de mamie, à Lampaul." },
  L6: { c: 'L', t: "Quelqu'un décroche sur la ligne fixe de mamie… morte en 2024." },
  L7: { c: 'L', t: "Ombre : « Là où la lumière tourne. » Un phare." },
  L8: { c: 'L', t: "Recherche : horaires des bateaux Le Conquet → Ouessant." },
  L9: { c: 'L', t: "Banque : 400 € retirés en liquide le 30/10. Pour ne pas laisser de trace." },
  L10:{ c: 'L', t: "Mamie : « Personne ne viendra te chercher au bout du monde. »" },
  L11:{ c: 'L', t: "Appel masqué : le vent, la mer, une corne de brume." },
  P1: { c: 'P', t: "Note : la liste de tout ce que Lumen sait de Nora." },
  P2: { c: 'P', t: "Bastien Leroy (PDG) l'accuse d'avoir fouillé le module « Partenaires »." },
  P3: { c: 'P', t: "DataNexa achète les trajets de 2 847 113 appareils Lumen." },
  P4: { c: 'P', t: "Partenaires de Lumen : assureurs, recruteurs, régies pub… et particuliers." },
  P5: { c: 'P', t: "Requête #4471 : un homme a acheté la position de son ex. 49 €/mois." },
  P6: { c: 'P', t: "Article : à Villeurbanne, Léa M. agressée par son ex « grâce à une application »." },
  P7: { c: 'P', t: "Enregistrement : « Les données, c'est notre vrai produit. L'appli, c'est l'emballage. »" },
  P8: { c: 'P', t: "Dernier post : « Il y a des choses qu'on ne peut plus ignorer. »" },
  P9: { c: 'P', t: "29/10 : mise à pied conservatoire. Badge et ordinateur confisqués." },
  P10:{ c: 'P', t: "Elle est en contact avec Claire Asselin, journaliste au Contrepoint." },
  M1: { c: 'M', t: "Un « inspecteur Morel » appelle et veut savoir où est Nora." },
  M2: { c: 'M', t: "La police n'a aucun inspecteur Morel. Aucune enquête n'est ouverte." },
  M3: { c: 'M', t: "Le numéro de Morel : répondeur d'Argos Conseil, « investigations privées »." },
  M4: { c: 'M', t: "Bastien a payé Franck Morel (Argos) pour la retrouver et récupérer le téléphone." },
  M5: { c: 'M', t: "Photo supprimée : un homme dans une voiture, en bas de chez elle, le 29/10." },
  M6: { c: 'M', t: "Requête #5102 : Lumen piste ce téléphone en temps réel pour Argos." },
  M7: { c: 'M', t: "Morel sait ce que tu ouvres sur le téléphone. Comment ?" },
  D1: { c: 'D', t: "Jade partage sa position en permanence via Lumen." },
  D2: { c: 'D', t: "Nora à Jade : « Ne crois personne qui te dit qu'il veut m'aider. »" },
  D3: { c: 'D', t: "Recherche : « comment savoir si mon téléphone est suivi »." },
  D4: { c: 'D', t: "14 applis connaissent la position de Nora « toujours »." },
  D5: { c: 'D', t: "Requête #5103 : la prochaine cible d'Argos, c'est Jade." },
};

/* ---------------- Messages ---------------- */
// from: 'me' (Nora) | 'them' | nom (groupe)
STORY.threads = {
  jade: { name: 'Jade 💛', ini: 'J', col: '#ff9f0a', num: '06 39 98 12 03', msgs: [
    { day: 'Dim. 25 oct.' },
    { f: 'them', t: "tu viens à mon anniv le 12 ?? dis oui" },
    { f: 'me', t: "évidemment 🎂 j'ai déjà ton cadeau (non)" },
    { f: 'them', t: "🙄 je t'aime quand même" },
    { day: 'Mer. 28 oct.' },
    { f: 'them', t: "t'as une voix bizarre au tel hier. ça va ?" },
    { f: 'me', t: "fatiguée. le boulot. je t'expliquerai." },
    { f: 'me', t: "Jade, une question bête : t'as toujours Lumen sur ton tel ?" },
    { f: 'them', t: "bah oui c'est TON appli 😂 je partage ma position avec toi et maman, comme tu m'as dit" },
    { f: 'me', t: "ok." },
    { day: 'Ven. 30 oct.' },
    { f: 'me', t: "Je vais être injoignable quelques jours. Ne t'inquiète pas. Je t'aime fort." },
    { f: 'them', t: "??? comment ça injoignable" },
    { f: 'them', t: "Nora" },
    { day: 'Dim. 1 nov.' },
    { f: 'them', t: "NORA RÉPONDS" },
    { f: 'them', t: "je suis chez toi. ton tel est sur la table de la cuisine. Kafka est pas là. j'ai peur" },
  ]},
  maman: { name: 'Maman', ini: 'M', col: '#ff6b9a', num: '06 39 98 44 50', msgs: [
    { day: 'Jeu. 22 oct.' },
    { f: 'them', t: "Ma chérie, tu viens à la Toussaint ? On ira fleurir mamie ensemble." },
    { f: 'me', t: "Pas cette année maman. Trop de boulot. Bisous ❤️" },
    { f: 'them', t: "C'est la première fois que tu ne viens pas. Tu es sûre que ça va ?" },
    { f: 'me', t: "oui oui t'inquiète" },
    { day: 'Dim. 1 nov.' },
    { f: 'them', t: "Jade dit que tu ne réponds plus. Appelle-moi. Juste un mot." },
    { f: 'them', t: "Nora je t'en supplie" },
  ]},
  theo: { name: 'Théo (Lumen)', ini: 'T', col: '#5ac8fa', num: '06 39 98 27 88', msgs: [
    { day: 'Sam. 14 mars' },
    { f: 'them', t: "c'est quoi le digicode déjà ? je suis devant chez toi avec les croissants 🥐" },
    { f: 'me', t: "4719. (oui c'est aussi le code de ma carte bleue, je sais, je suis une experte en sécurité 🙃)" },
    { f: 'them', t: "la cordonnière la plus mal chaussée" },
    { day: 'Lun. 8 juin' },
    { f: 'them', t: "joyeux anniv Lumen 🎉 3 ans déjà" },
    { f: 'them', t: "au fait t'as vu le menu dev caché dans l'appli de prod ? 7 taps sur le numéro de version dans les réglages lol" },
    { f: 'me', t: "sérieux ?? et c'est protégé comment ?" },
    { f: 'them', t: "un PIN. la date de lancement de Lumen. Bastien est tellement prévisible 😂" },
    { day: 'Mar. 27 oct.' },
    { f: 'me', t: "Théo. Tu savais, pour les Partenaires ?" },
    { f: 'me', t: "Pour les « particuliers » ?" },
    { f: 'them', t: "on en parle pas par écrit stp" },
    { day: 'Jeu. 29 oct.' },
    { f: 'them', t: "Ils t'ont mise à pied ?? Bastien hurle dans l'open space" },
    { f: 'them', t: "il a appelé une boîte. Argos un truc. fais attention à toi" },
    { f: 'me', t: "Merci. Je sais ce que je fais." },
  ]},
  quiches: { name: 'Les Quiches 🥧', ini: '🥧', col: '#ffd60a', group: true, msgs: [
    { day: 'Lun. 26 oct.' },
    { f: 'Inès', t: "raclette samedi chez moi ?? 🧀🧀" },
    { f: 'Paul', t: "ouiiii" },
    { f: 'Inès', t: "Nora ?" },
    { f: 'me', t: "je peux pas, désolée 💔" },
    { f: 'Paul', t: "encore Lumen ? 🙄 ils te payent en fromage au moins" },
    { f: 'Inès', t: "on te garde une patate" },
    { day: 'Lun. 2 nov.' },
    { f: 'Inès', t: "quelqu'un a des nouvelles de Nora ? Jade m'a appelée en pleurs" },
    { f: 'Paul', t: "rien depuis jeudi. elle répond même pas sur Flux" },
    { f: 'Inès', t: "son dernier post m'a fait flipper" },
  ]},
  lumensms: { name: 'LUMEN', ini: 'L', col: '#8b7bff', sms: true, msgs: [
    { day: 'Ven. 16 oct.' },
    { f: 'them', t: "Lumen 💜 Nora, il est 23h12. Vous êtes bien rentrée ? Partagez votre trajet en un geste." },
    { day: 'Ven. 23 oct.' },
    { f: 'them', t: "Lumen 💜 Votre bilan de la semaine : 41 km parcourus en sécurité. Merci de nous faire confiance." },
    { day: 'Dim. 1 nov.' },
    { f: 'them', t: "Lumen 💜 Nous ne vous avons pas vue depuis 2 jours. Tout va bien ?" },
  ]},
  banque: { name: 'Banque Azur', ini: '€', col: '#0c8c6c', sms: true, msgs: [
    { day: 'Mer. 28 oct.' },
    { f: 'them', t: "BANQUE AZUR : Votre salaire de 2 650,00 € a été crédité." },
    { day: 'Ven. 30 oct.' },
    { f: 'them', t: "BANQUE AZUR : Opérations inhabituelles détectées sur votre compte. Ouvrez l'appli pour les consulter." },
  ]},
};
STORY.threadOrder = ['jade', 'maman', 'theo', 'quiches', 'lumensms', 'banque'];

/* ---------------- Mails ---------------- */
STORY.mails = [
  { id: 'fwd', from: 'Théo Marchal', addr: 'theo.marchal@ondes.fr', ini: 'T', col: '#5ac8fa', date: '30 oct.', time: '23:41', subj: 'Fwd: Mission — discrétion', clue: 'M4',
    body: `Je suis tombé là-dessus dans la boîte partagée de la direction. Je l'ai transféré depuis mon adresse perso.
Je suis désolé, Nora. J'aurais dû parler avant toi.
Efface ce mail.
— T.
<span class="quote"><b>De :</b> Bastien Leroy &lt;b.leroy@lumen.app&gt;
<b>À :</b> Franck Morel &lt;f.morel@argos-conseil.fr&gt;
<b>Objet :</b> Mission — discrétion

Franck,
Comme convenu au téléphone. Nora Valette, 27 ans, ex-data scientist. Elle a extrait des documents du module Partenaires et je la soupçonne de vouloir les remettre à la presse.
Retrouvez-la avant qu'elle parle à qui que ce soit. Récupérez le téléphone en priorité.
Nos équipes vous ouvrent un accès temps réel à son appareil (requête interne #5102), ainsi qu'à celui de ses proches si nécessaire.
Au besoin, présentez-vous comme vous l'entendez. Les familles parlent plus facilement à la police.
Facturez sur la ligne « Conseil juridique ».
B.</span>` },
  { id: 'claire', from: 'Claire Asselin', addr: 'c.asselin@lecontrepoint.fr', ini: 'CA', col: '#ff9f0a', date: '25 oct.', time: '19:02', subj: 'Re: Ce que je sais', clue: 'P10',
    body: `Bonjour Nora,

J'ai lu votre message trois fois. Si ce que vous décrivez est vrai, ce n'est pas un scandale tech, c'est une question de sécurité publique.

À partir de maintenant : plus aucun mail. Plus de SMS. Ils ont accès à votre messagerie pro, et peut-être à plus.
Installez « Ombre ». Choisissez une phrase de passe dont vous seule connaissez le sens. Rien de daté, rien d'écrit.

Je vous rappelle que la loi vous protège en tant que lanceuse d'alerte, à condition de passer par les bons canaux. Je vous mettrai en relation avec une avocate.

Prenez soin de vous. Vraiment.

Claire Asselin
Le Contrepoint — Investigation
${'06 39 98 09 21'}`,
    quote: `<span class="quote">Le 24 oct., Nora Valette a écrit :
Je travaille chez Lumen, l'appli de sécurité pour les femmes. 2,8 millions d'utilisatrices. Je peux prouver que nous vendons leurs trajets. À n'importe qui. J'ai des noms. J'ai une victime.</span>` },
  { id: 'bastien', from: 'Bastien Leroy', addr: 'b.leroy@lumen.app', ini: 'BL', col: '#8b7bff', date: '28 oct.', time: '08:17', subj: 'Accès non autorisé', clue: 'P2',
    body: `Nora,

Les journaux d'accès montrent que tu as consulté le module Partenaires à 14 reprises entre le 19 et le 27 octobre, dont trois exports.
Ce module ne relève pas de ton périmètre.

Je te demande de restituer immédiatement ton badge et ton ordinateur, et de supprimer toute copie.
Je te rappelle que tu as signé une clause de confidentialité.

Ne fais rien que tu pourrais regretter. Tu as une carrière devant toi. Et tu as une famille.

Bastien Leroy
CEO & co-fondateur — Lumen
« Ne rentrez plus jamais seule. »` },
  { id: 'rh', from: 'Lumen — Ressources Humaines', addr: 'rh@lumen.app', ini: 'RH', col: '#8b7bff', date: '29 oct.', time: '10:03', subj: 'Mise à pied conservatoire', clue: 'P9',
    body: `Madame,

Nous vous notifions par la présente votre mise à pied conservatoire à effet immédiat, dans l'attente d'un entretien préalable à une éventuelle sanction pouvant aller jusqu'au licenciement pour faute grave.

Votre badge et votre ordinateur professionnel ont été désactivés.
Votre accès aux outils internes est suspendu.

L'équipe RH vous souhaite une bonne journée.` },
  { id: 'datanexa', from: 'Nora Valette', addr: 'nora.valette@ondes.fr', ini: 'NV', col: '#c56b9b', date: '27 oct.', time: '00:12', subj: 'Fwd: DataNexa — facturation T3 (flux géoloc)', clue: 'P3',
    body: `(à garder. Ne pas supprimer.)

<span class="quote"><b>De :</b> facturation@datanexa.io
<b>À :</b> partenariats@lumen.app
<b>Objet :</b> Facturation T3 — flux géolocalisation

Bonjour,
Veuillez trouver ci-dessous le récapitulatif du trimestre.

<table><tr><th>Ligne</th><th>Volume</th><th>Montant</th></tr>
<tr><td>Appareils actifs (flux continu)</td><td><b>2 847 113</b></td><td>—</td></tr>
<tr><td>Points de localisation</td><td>4,1 milliards</td><td>0,004 € / point</td></tr>
<tr><td>Segment « Domicile / travail »</td><td>2,6 M profils</td><td>forfait</td></tr>
<tr><td>Segment « Santé » (cliniques, pharmacies…)</td><td>412 000 profils</td><td>premium</td></tr>
<tr><td>Accès « particuliers » (API Retrouver)</td><td>1 930 requêtes</td><td>49 € / mois</td></tr>
</table>
Rappel : conformément à nos CGU communes, les données sont « pseudonymisées ».
Merci pour ce trimestre record !
L'équipe DataNexa — « La donnée qui vous rapproche »</span>` },
  { id: 'lumenbilan', from: 'Lumen', addr: 'hello@lumen.app', ini: 'L', col: '#8b7bff', date: '1 nov.', time: '09:00', subj: '💜 Votre bilan sécurité d\'octobre',
    body: `Bonjour Nora,

Ce mois-ci, vous avez parcouru 168 km en sécurité avec Lumen.
Vous êtes rentrée chez vous 27 fois avant minuit. Bravo !
Lieu le plus fréquenté : Domicile (412 h).
2e lieu : Lumen SAS (176 h).
Nouveau lieu détecté : Cimetière de Loyasse (4 visites). Nous pensons à vous. 💜

Avec Lumen, vous n'êtes jamais seule.` },
  { id: 'mamie', from: 'Odette Le Guen', addr: 'odette.leguen29@ondes.fr', ini: 'O', col: '#a2845e', date: '12 juil. 2023', time: '16:44', subj: 'la maison', clue: 'L5',
    body: `Ma chérie,

Ton cousin Yann est venu installer « le ouifi », alors je t'écris avec la tablette, tu vois je suis moderne. Le réseau s'appelle Ty_Odette, comme la maison. Le code est sur le frigo.

Ici le vent souffle fort, le phare tourne toute la nuit, je dors comme un bébé.
Quand tu en auras assez de Lyon et de tes ordinateurs, la maison t'attend. La clé est toujours sous l'hortensia.

Personne ne viendra jamais te chercher ici, au bout du monde.

Je t'embrasse fort,
Mamie

Envoyé depuis ma tablette` },
  { id: 'flux', from: 'Flux', addr: 'notification@flux.social', ini: 'F', col: '#ff6b9a', date: '2 nov.', time: '07:30', subj: 'Vous avez manqué 37 notifications',
    body: `Nora, vos amis s'inquiètent de votre absence !
37 notifications vous attendent.
Inès et 11 autres personnes ont réagi à votre publication « Il y a des choses qu'on ne peut plus ignorer. »

Revenez vite. On vous garde une place. 🌊` },
  { id: 'colix', from: 'Colix', addr: 'suivi@colix.fr', ini: 'C', col: '#ffd60a', date: '30 oct.', time: '12:20', subj: 'Votre colis a été livré',
    body: `Votre colis « Sac à dos 40 L + lampe frontale » a été livré en point relais (Tabac Croix-Rousse).
Merci de votre confiance !` },
];

(() => { const order = ['flux', 'lumenbilan', 'fwd', 'colix', 'rh', 'bastien', 'datanexa', 'claire', 'mamie']; STORY.mails.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)); })();

/* ---------------- Notes ---------------- */
STORY.notes = [
  { id: 'lumensait', title: 'Ce que Lumen sait de moi', date: '27 oct. 2026', clue: 'P1',
    body: `Ce que Lumen sait de moi (et de 2,8 millions d'autres) :

• où je dors. À quelle heure je rentre.
• que je vais chez la gynéco le 3e mardi du mois.
• que je cours le dimanche quai Saint-Vincent, toujours seule, toujours à 7h.
• que je vais au cimetière de Loyasse depuis que mamie est partie.
• que j'ai passé une nuit aux urgences en mars.
• combien de temps je reste au bar le vendredi.
• qu'une fois par mois, je dors ailleurs.

Tout ça est revendu.
0,004 € le point.
Ma vie entière vaut moins qu'un centime.

Et j'ai écrit le code qui la vend.` },
  { id: 'courses', title: 'Courses 🛒', date: '29 oct. 2026',
    body: `• croquettes Kafka (x2 !!)
• pâtes
• <s>vin</s>
• batterie externe
• lampe frontale
• cadenas
• carte papier IGN 0417 ?
• espèces (pas de CB)
• ne PAS prendre le tel` },
  { id: 'livres', title: 'Livres à lire', date: '3 sept. 2026',
    body: `• Surveiller et punir — Foucault
• L'Âge du capitalisme de surveillance — Shoshana Zuboff
• 1984 (à relire, apparemment c'était pas un mode d'emploi)
• Le Phare du bout du monde — Jules Verne (pour mamie)` },
  { id: 'jadecadeau', title: 'Idées cadeau Jade 🎁 (12/11)', date: '20 oct. 2026',
    body: `• l'appareil photo argentique qu'elle regarde depuis 6 mois
• un week-end à deux, juste nous, sans téléphones
• lui dire que je suis fière d'elle (gratuit, mais je le fais jamais)` },
  { id: 'phrases', title: 'Phrases', date: '19 oct. 2026',
    body: `« Si vous n'avez rien à cacher, vous n'avez rien à craindre. »
→ Et si on demandait plutôt à ceux qui regardent ce qu'ILS ont à cacher ?

« Si c'est gratuit, c'est toi le produit. »
→ Lumen coûte 4,99 €/mois. On est quand même le produit.

« Ne rentrez plus jamais seule. »
→ C'est vrai. On n'est jamais seule. Il y a toujours quelqu'un qui regarde.` },
  { id: 'prive', title: 'Si on me cherche', date: '31 oct. 2026', locked: true, pass: 'aspirateur', hint: "Indice : l'ennemi juré de Kafka.",
    body: `Si c'est toi qui lis ça, Jade : je vais bien. Promis.

J'ai fait des copies de tout. Elles sont dans le coffre.
Le coffre, c'est la calculatrice. Elle ne fait pas que des additions.

Code : le nombre d'appareils que Lumen vend à DataNexa. Tape-le, puis « = ».

Si quelqu'un se présente comme policier et te demande où je suis : NE LUI DIS RIEN.

Et supprime Lumen de ton téléphone. Maintenant.` },
];

/* ---------------- Photos ---------------- */
STORY.photos = [
  { id: 'voisine', art: 'voisine', title: 'Sam. 31 oct. 2026', time: '05:40', place: 'Lyon 4e — Croix-Rousse', coords: '45.7745° N, 4.8320° E', cap: '', clue: 'L1', album: 'recent' },
  { id: 'croix', art: 'croixrousse', title: 'Mar. 20 oct. 2026', time: '18:52', place: 'Lyon 4e — Croix-Rousse', coords: '45.7745° N, 4.8320° E', cap: 'vue de chez moi 🌇', album: 'recent' },
  { id: 'board', art: 'whiteboard', title: 'Lun. 19 oct. 2026', time: '11:20', place: 'Lumen SAS — Lyon 2e', coords: '45.7520° N, 4.8270° E', cap: 'Réunion stratégie. Personne n\'a posé la question.', album: 'recent' },
  { id: 'kafka', art: 'kafka', title: 'Mar. 22 sept. 2026', time: '20:15', place: 'Lyon 4e — Croix-Rousse', coords: '45.7745° N, 4.8320° E', cap: 'Kafka a 3 ans 🎂 (il s\'en fiche)', album: 'recent', fav: true },
  { id: 'vacuum', art: 'kafkaVacuum', title: 'Dim. 6 sept. 2026', time: '10:03', place: 'Lyon 4e — Croix-Rousse', coords: '45.7745° N, 4.8320° E', cap: 'Kafka vs son ennemi juré : l\'aspirateur 😾', album: 'recent', fav: true },
  { id: 'selfie', art: 'selfie', title: 'Sam. 9 août 2025', time: '15:31', place: 'Pornic', coords: '47.1150° N, 2.1030° W', cap: 'Avec ma Jade ☀️', album: 'recent', fav: true },
  { id: 'party', art: 'party', title: 'Ven. 13 mars 2026', time: '22:47', place: 'Lumen SAS — Lyon 2e', coords: '45.7520° N, 4.8270° E', cap: '1 MILLION 💜 on l\'a fait', album: 'recent' },
  { id: 'bureau', art: 'bureau', title: 'Lun. 3 juil. 2023', time: '09:12', place: 'Lumen SAS — Lyon 2e', coords: '45.7520° N, 4.8270° E', cap: 'Jour 1 chez Lumen 🚀 « Plus aucune femme ne rentrera seule »', album: 'recent' },
  { id: 'ouessant', art: 'ouessant', title: 'Mer. 14 août 2019', time: '21:34', place: 'Lampaul, Île d\'Ouessant', coords: '48.4592° N, 5.1305° W', cap: 'Avec mamie, au pied du phare. Le bout du monde.', clue: 'L4', album: 'recent', fav: true },
  { id: 'biscotte', art: 'biscotte', title: '2004 (scan)', time: '', place: 'Inconnu', coords: '—', cap: 'Moi & Biscotte, mon tout premier animal 🐹', album: 'recent' },
  { id: 'voiture', art: 'voiture', title: 'Jeu. 29 oct. 2026', time: '22:14', place: 'Lyon 4e — Croix-Rousse', coords: '45.7745° N, 4.8320° E', cap: 'Il est encore là. Trois soirs de suite.', clue: 'M5', album: 'deleted' },
  { id: 'requete', art: 'requete', title: 'Lun. 26 oct. 2026', time: '23:58', place: 'Lyon 4e — Croix-Rousse', coords: '45.7745° N, 4.8320° E', cap: 'Capture d\'écran', clue: 'P5', album: 'deleted' },
];

/* ---------------- Calendrier ---------------- */
STORY.events = [
  { d: 14, m: 10, t: '10:00', title: 'Point stratégie Q4', loc: 'Lumen — salle Aurore', col: '#8b7bff' },
  { d: 19, m: 10, t: '11:00', title: 'Réunion Partenaires (pas invitée ?)', loc: 'Lumen', col: '#8b7bff' },
  { d: 24, m: 10, t: '21:00', title: 'Écrire à C.A.', loc: '', col: '#ff9f0a' },
  { d: 28, m: 10, t: '10:00', title: 'Convocation Bastien', loc: 'Lumen — bureau 4', col: '#ff453a' },
  { d: 30, m: 10, t: '14:00', title: 'Retirer espèces + colis', loc: 'Croix-Rousse', col: '#30d158' },
  { d: 31, m: 10, t: '05:30', title: 'Kafka → Mme Benali', loc: '3e gauche', col: '#30d158' },
  { d: 31, m: 10, t: '06:34', title: '🚆', loc: '', col: '#30d158' },
  { d: 1, m: 11, t: 'journée', title: 'Toussaint — fleurs pour mamie', loc: '', col: '#8e8e93' },
  { d: 2, m: 11, t: '09:45', title: 'C. — bateau', loc: '', col: '#ff9f0a' },
  { d: 12, m: 11, t: 'journée', title: '🎂 Anniversaire Jade — NE PAS RATER', loc: '', col: '#ff6b9a' },
];

/* ---------------- Navigateur ---------------- */
STORY.web = [
  { id: 'suivi', when: '31 oct. 04:52', url: 'techpratique.fr/telephone-suivi', title: 'Comment savoir si votre téléphone est suivi ?', clue: 'D3', cls: 'tech',
    html: `<div class="site">Tech Pratique</div><h1>Comment savoir si votre téléphone est suivi ?</h1><div class="by">Mis à jour le 12 octobre</div>
<p>Batterie qui fond, données mobiles qui s'envolent, applis que vous n'avez jamais installées… Les signes d'une surveillance existent, mais la menace la plus courante est beaucoup plus banale.</p>
<blockquote>« La plupart des gens ne sont pas espionnés par un logiciel malveillant. Ils sont suivis par les applications qu'ils ont eux-mêmes installées, avec leur consentement. »</blockquote>
<p>Une seule autorisation « Toujours » donnée à une appli de localisation suffit à reconstituer votre vie : domicile, travail, médecin, lieu de culte, relations.</p>
<p><b>La seule méthode vraiment sûre ?</b> Laisser le téléphone derrière soi.</p>` },
  { id: 'bateau', when: '30 oct. 23:20', url: 'traversees-iroise.fr/horaires', title: 'Horaires des traversées — Le Conquet ⇄ Ouessant', clue: 'L8', cls: 'ferry',
    html: `<div class="site">Traversées d'Iroise</div><h1>Horaires d'hiver — Le Conquet ⇄ Ouessant</h1><div class="by">Du 1er novembre au 31 mars</div>
<table><tr><th>Départ</th><th>Le Conquet</th><th>Ouessant</th></tr><tr><td>Tous les jours</td><td>09:45</td><td>11:00</td></tr><tr><td>Ven., sam., dim.</td><td>17:00</td><td>18:15</td></tr></table>
<p>⚠️ Par mauvais temps, les traversées peuvent être annulées. L'île peut rester isolée plusieurs jours.</p>
<p>Billets en vente au guichet du port. <b>Paiement en espèces accepté.</b></p>
<p>Ouessant : 8 km sur 4. 800 habitants. Le phare du Créac'h, l'un des plus puissants d'Europe, éclaire la mer d'Iroise toute la nuit.</p>` },
  { id: 'lea', when: '26 oct. 23:41', url: 'lyon-actu.fr/villeurbanne-agression', title: 'Villeurbanne : agressée par son ex, qui l\'avait localisée « grâce à une application »', clue: 'P6', cls: '',
    html: `<div class="site">Lyon Actu</div><h1>Villeurbanne : agressée par son ex-conjoint, qui l'avait localisée « grâce à une application »</h1><div class="by">12 septembre 2026 · Faits divers</div>
<p>Léa M., 31 ans, avait déménagé, changé de numéro et quitté les réseaux sociaux. Malgré une ordonnance d'éloignement, son ancien compagnon l'a attendue devant son nouveau lieu de travail, le 9 septembre au matin.</p>
<p>Lors de sa garde à vue, l'homme aurait déclaré avoir « acheté sa position en ligne, pour quelques euros ». Les enquêteurs n'ont pas, à ce stade, identifié le service utilisé.</p>
<blockquote>« Elle avait tout fait comme il fallait. Elle utilisait même une application de sécurité pour rentrer chez elle », confie une proche.</blockquote>
<p>Hospitalisée, la jeune femme est hors de danger.</p>
<div class="ad"><b>Publicité · Lumen 💜</b>Ne rentrez plus jamais seule. Partagez votre trajet avec ceux qui comptent. Essai gratuit 30 jours.</div>` },
  { id: 'sapin', when: '25 oct. 20:10', url: 'service-public.fr/lanceur-alerte', title: 'Lanceur d\'alerte : quelle protection ?', cls: 'gov',
    html: `<div class="site">Service Public</div><h1>Lanceur d'alerte : quelle protection ?</h1><div class="by">Vérifié le 1er septembre</div>
<p>Un lanceur d'alerte est une personne qui signale ou divulgue, sans contrepartie financière directe et de bonne foi, des informations portant sur un crime, un délit, une menace ou un préjudice pour l'intérêt général.</p>
<p>Le dispositif créé par la loi « Sapin 2 » (2016) a été renforcé en 2022. Le lanceur d'alerte bénéficie notamment d'une protection contre les mesures de représailles (licenciement, sanction, intimidation…).</p>
<p>Dans certaines conditions — danger grave et imminent, risque de représailles — la divulgation publique, y compris à la presse, est possible.</p>
<p>Le Défenseur des droits peut orienter et accompagner les lanceurs d'alerte.</p>` },
  { id: 'vendre', when: '19 oct. 22:03', url: 'recherche ▸ « applis sécurité femmes vendent données »', title: 'Est-ce que les applis de sécurité vendent nos données ?', cls: 'tech',
    html: `<div class="site">Recherche</div><h1>« est-ce que les applis de sécurité vendent nos données »</h1>
<p><b>Forum — il y a 2 ans :</b> « Lumen ? Non, c'est une start-up lyonnaise super engagée, elles ont même une charte éthique 💜 »</p>
<p><b>Forum — il y a 1 an :</b> « Leurs CGU font 34 pages. Article 17.4 : "partage avec des partenaires de confiance à des fins d'amélioration du service". Ça veut dire quoi, partenaires ? »</p>
<p><b>Forum — il y a 3 mois :</b> « Personne ne lit les CGU. C'est exactement pour ça qu'elles font 34 pages. »</p>` },
  { id: 'disparaitre', when: '29 oct. 01:15', url: 'recherche ▸ « disparaître quelques jours légalement »', title: 'Disparaître quelques jours : est-ce légal ?', cls: 'gov',
    html: `<div class="site">Recherche</div><h1>« disparaître quelques jours légalement »</h1>
<p>En France, un adulte a le droit de partir sans prévenir. On ne peut pas engager de recherches contre sa volonté, sauf « disparition inquiétante » (danger, vulnérabilité…).</p>
<p>Si la personne est retrouvée, la police peut l'informer que sa famille la cherche, mais ne communique pas sa localisation sans son accord.</p>
<p><i>Partir n'est pas un crime. Être retrouvé·e contre son gré, si.</i></p>` },
];

/* ---------------- Mémos vocaux ---------------- */
STORY.memos = [
  { id: 'mamie', title: 'Mamie — Noël', date: '24 déc. 2023', dur: '0:41', cls: 'cold', clue: 'L10', steps: [
    { sfx: 'wind' }, { wait: 900 },
    { who: 'nora', n: 'Nora', t: "Mamie, redis ce que tu m'as dit tout à l'heure. Pour que je l'enregistre." },
    { who: 'mamie', n: 'Mamie', t: "Oh, tu m'embêtes avec ton téléphone…" },
    { who: 'mamie', n: 'Mamie', t: "Je disais que cette maison, c'est le bout du monde. Ton grand-père l'appelait comme ça. Le bout du monde." },
    { gull: true },
    { who: 'mamie', n: 'Mamie', t: "Quand tu auras des soucis, ma chérie, viens ici. Personne ne viendra te chercher au bout du monde." },
    { foghorn: true }, { wait: 1200 },
    { who: 'nora', n: 'Nora', t: "Je t'aime, mamie." },
    { who: 'mamie', n: 'Mamie', t: "Et éteins-moi ce machin, on mange." },
  ]},
  { id: 'reunion', title: 'Réunion 14-10 (ne pas effacer)', date: '14 oct. 2026', dur: '1:12', cls: 'red', clue: 'P7', steps: [
    { sfx: 'office' }, { fx: '(enregistrement discret — voix étouffées)' }, { wait: 800 },
    { who: 'bastien', n: 'Bastien', t: "Les chiffres du trimestre sont excellents. Le segment particuliers explose." },
    { who: 'homme', n: 'Un associé', t: "Et le juridique ? Si ça sort ?" },
    { who: 'bastien', n: 'Bastien', t: "Ça ne sortira pas. Tout est dans les conditions d'utilisation. Elles ont cliqué sur accepter." },
    { who: 'bastien', n: 'Bastien', t: "Il faut arrêter de se mentir. Les données, c'est notre vrai produit. L'appli, c'est l'emballage." },
    { who: 'homme', n: 'Un associé', t: "Et les femmes qui l'utilisent pour rentrer chez elles ?" },
    { who: 'bastien', n: 'Bastien', t: "Elles se sentent en sécurité. C'est exactement ce qu'on leur vend. Le sentiment." },
    { fx: '(rires)' },
  ]},
  { id: 'idee', title: 'Idée appli !!!', date: '2 févr. 2022', dur: '0:28', cls: '', steps: [
    { sfx: 'crackle' }, { wait: 500 },
    { who: 'nora', n: 'Nora', t: "Ok, idée à trois heures du matin. Une appli. Tu rentres seule, tu appuies sur un bouton, et tes proches te suivent jusqu'à ta porte." },
    { who: 'nora', n: 'Nora', t: "Et si tu ne bouges plus, ça alerte. Plus aucune femme ne rentrerait seule. Jamais." },
    { who: 'nora', n: 'Nora', t: "On l'appellerait… Lumen. Comme une petite lumière dans la rue." },
    { who: 'nora', n: 'Nora', t: "Bon. Je dors. Mais c'est génial, non ?" },
  ]},
];

/* ---------------- Coffre (calculatrice) ---------------- */
STORY.vault = [
  { id: 'pourjade', kind: 'audio', name: 'Pour Jade.m4a', size: '1:04', clue: 'D2' },
  { id: 'ombrenote', kind: 'txt', name: 'ombre.txt', size: '1 Ko', title: 'Ombre',
    body: `Phrase de passe Ombre : ce que mamie appelait sa maison.
(trois mots — pas de majuscule, pas d'article)` },
  { id: 'partenaires', kind: 'csv', name: 'partenaires_export.csv', size: '48 Ko', clue: 'P4', title: 'Export — module Partenaires (extrait)',
    body: `partenaire ; type ; donnée achetée ; usage déclaré
DataNexa ; courtier ; flux complet ; « revente »
Assurvie ; assurance ; trajets nocturnes ; « tarification du risque »
Recrut'IQ ; recrutement ; lieux fréquentés ; « fiabilité candidat »
ADN Pub ; publicité ; visites santé ; « ciblage »
Habitat+ ; bailleurs ; heures de retour ; « solvabilité »
API Retrouver ; PARTICULIERS ; position temps réel ; « retrouver un proche »

<span class="stamp">SANS VÉRIFICATION</span>` },
  { id: 'req', kind: 'png', name: 'requete_4471.png', size: '312 Ko', photo: 'requete' },
];
STORY.pourJade = [
  { sfx: 'line' }, { wait: 600 },
  { who: 'nora', n: 'Nora', t: "Jade. Si tu écoutes ça, c'est que tu as trouvé le coffre. Je savais que tu y arriverais." },
  { who: 'nora', n: 'Nora', t: "Je vais bien. Je suis partie de moi-même. Personne ne m'a fait de mal." },
  { who: 'nora', n: 'Nora', t: "L'appli que j'ai construite vend la vie des femmes qu'elle prétend protéger. Une femme a été agressée à cause de nous. À cause de moi." },
  { who: 'nora', n: 'Nora', t: "Je dois remettre les preuves à quelqu'un de confiance, loin d'ici. Et pour ça, il faut que personne ne puisse me suivre. Pas même toi. Surtout pas avec ce téléphone." },
  { who: 'nora', n: 'Nora', t: "Ne crois personne qui te dit qu'il veut m'aider. Ils mentent très bien." },
  { who: 'nora', n: 'Nora', t: "Je serai là pour ton anniversaire. Promis. Je t'aime, ma Jade." },
];

/* ---------------- Ombre ---------------- */
STORY.ombre = [
  { day: '25 oct. — messages éphémères (24 h)' },
  { f: 'them', t: "C'est Claire. Vous êtes là ?" },
  { f: 'me', t: "Oui. Je ne sais pas par où commencer." },
  { f: 'them', t: "Par la victime. Vous parliez d'une victime." },
  { f: 'me', t: "Requête 4471. Un homme a payé 49 € par mois pour suivre son ex. Elle s'appelle Léa. Il l'a retrouvée. Il l'a frappée." },
  { f: 'me', t: "Les données venaient de chez nous. De mon code." },
  { burned: true },
  { day: '29 oct.' },
  { f: 'them', t: "Mon avocate confirme : vous êtes protégée. Mais seulement si on publie vite, et proprement." },
  { f: 'me', t: "Ils m'ont mise à pied. Il y a une voiture en bas de chez moi depuis trois soirs." },
  { f: 'them', t: "Alors on ne se voit pas à Lyon. Ils vous suivent par où ?" },
  { f: 'me', t: "Par mon téléphone. Par l'appli. MA propre appli. Bastien a lancé une requête interne sur moi." },
  { f: 'them', t: "Laissez-le. Partez sans. Où pouvez-vous aller où personne ne pensera à chercher ?" },
  { f: 'me', t: "Là où la lumière tourne. La maison de ma grand-mère. Pas de réseau, presque. Pas de Lumen. Le bout du monde." },
  { f: 'them', t: "Je vois. Je prendrai le bateau de 9h45 au Conquet, dimanche. Apportez tout." },
  { burned: true },
  { day: '31 oct. — 05:51' },
  { f: 'me', t: "Kafka est chez la voisine. Le téléphone reste sur la table. Jade va le trouver. Elle trouve toujours tout." },
  { f: 'me', t: "Et si ce n'est pas Jade qui lit ceci… toi qui as mon téléphone entre les mains : tu sais maintenant tout de moi. Où je dors. Qui j'aime. De quoi j'ai peur. Où je vais." },
  { f: 'me', t: "Exactement comme eux." },
  { f: 'me', t: "Alors réfléchis bien à ce que tu vas faire de tout ça." },
];

/* ---------------- Lumen (appli) ---------------- */
STORY.lumen = {
  proches: [
    { ini: 'J', col: '#ff9f0a', name: 'Jade', where: 'Lyon 4e — Croix-Rousse (près de chez vous)', ago: 'il y a 2 min', live: true },
    { ini: 'M', col: '#ff6b9a', name: 'Maman', where: 'Vienne — Domicile', ago: 'il y a 11 min', live: true },
    { ini: 'T', col: '#5ac8fa', name: 'Théo', where: 'Partage désactivé', ago: 'depuis le 29 oct.', live: false },
  ],
  trajets: [
    ['30 oct. 15:02', 'Croix-Rousse → Part-Dieu (gare) → Croix-Rousse'],
    ['30 oct. 13:48', 'Domicile → DAB Gros Caillou → Tabac Croix-Rousse'],
    ['29 oct. 10:41', 'Lumen SAS → Domicile (trajet rapide 🏃)'],
    ['26 oct. 23:30', 'Bar Le Fantôme → Domicile — 1,2 km'],
    ['25 oct. 07:00', 'Course quai Saint-Vincent — 8,4 km'],
    ['24 oct. 18:30', 'Cimetière de Loyasse → Domicile'],
  ],
};

/* ---------------- Fins ---------------- */
STORY.endings = {
  morel: { n: 1, label: 'Fin 1 / 4', title: 'Le maillon faible' },
  jade:  { n: 2, label: 'Fin 2 / 4', title: 'Le bon destinataire, le mauvais canal' },
  claire:{ n: 3, label: 'Fin 3 / 4', title: 'Hors ligne' },
  wipe:  { n: 4, label: 'Fin 4 / 4', title: 'Le silence' },
};
