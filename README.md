# HORS·LIGNE

**Une enquête dans le téléphone d'une disparue.**

Nora Valette, 27 ans, data scientist à Lyon, ne donne plus signe de vie depuis le samedi 31 octobre.
Sa sœur Jade a retrouvé son téléphone posé sur la table de la cuisine, et elle te l'a confié.
Fouille ses messages, ses photos, ses mails, ses mémos vocaux, déverrouille ses applis cachées…
et découvre où elle est, pourquoi elle est partie, et qui d'autre la cherche.

Puis décide de ce que tu fais de tout ce que tu sais.

## Jouer

Aucune installation, aucune dépendance. Ouvre `index.html` dans un navigateur récent, ou sers le dossier :

```bash
python3 -m http.server 8000
```

puis va sur <http://localhost:8000>.

🎧 C'est un jeu sonore. Les sons sont synthétisés en direct (Web Audio). Les appels, la messagerie et les mémos sont lus par la synthèse vocale française du navigateur, avec des sous-titres. Si aucune voix française n'est installée, seuls les sous-titres s'affichent.

Durée : de 45 min à 1 h 30. La progression est sauvegardée dans le navigateur.
Sur mobile, le jeu passe en plein écran.

## Ce qu'il y a dedans

- **Un téléphone complet** : écran verrouillé, accueil, île dynamique, bannières de notification, 18 applis (Messages, Téléphone, Photos, Mail, Notes, Plans, Calendrier, Navigateur, Réglages, Météo, Dictaphone, Calculatrice, Flux, Lumen, Azur, Ombre, Caméra, et ton Carnet).
- **Des événements en temps réel** : SMS qui arrivent pendant que tu joues, appels entrants (avec choix de réponses), messages vocaux laissés si tu ne décroches pas.
- **Un clavier qui marche vraiment** : compose les numéros que tu trouves. Certains répondent.
- **7 verrous** à faire sauter, chacun avec son indice caché ailleurs dans le téléphone.
- **33 indices** consignés dans ton carnet, en quatre pistes.
- **Une aide progressive** : appelle Jade, ou demande un indice dans ton carnet.
- **4 fins**.

## Le propos

Le jeu ne parle pas seulement d'une disparition. Il parle de ce qu'un téléphone dit de nous, et de ceux qui l'écoutent. Applis « de sécurité » qui revendent nos trajets, courtiers en données, CGU de 34 pages, consentement en une case cochée… À la fin, le jeu te renvoie ton propre comportement : en une heure, toi aussi, tu as tout appris de Nora.

## Avertissements

Fiction. Tous les personnages, entreprises, applications et numéros de téléphone sont inventés (les numéros utilisent les plages réservées à la fiction). Le jeu aborde la surveillance, le harcèlement et les violences conjugales.
Si toi ou quelqu'un de ton entourage êtes concernés : **3919** (Violences Femmes Info, gratuit, anonyme, 24 h/24), ou le **17** en cas d'urgence.

<details>
<summary>⚠️ Solution complète (spoilers)</summary>

| Verrou | Code | Où le trouver |
|---|---|---|
| Téléphone | `2209` | Fond d'écran (guirlande) + message de Jade : l'anniversaire de Kafka |
| Mail | `Biscotte` | « Mot de passe oublié » → premier animal → photo scannée de 2004 / post Flux |
| Lumen (mode dev) | 7 appuis sur la version, PIN `0806` | Messages de Théo + post Flux du lancement (08/06/2023) |
| Note « Si on me cherche » | `aspirateur` | Photo « Kafka vs son ennemi juré » |
| Coffre (Calculatrice) | `2847113` puis `=` | Mail DataNexa |
| Ombre | `bout du monde` | ombre.txt (coffre) + mémo « Mamie — Noël » |
| Banque Azur | `4719` | Messages de Théo (digicode = code CB) |
| Album supprimé | `2209` | — |

Conclusion : **Ouessant** · elle protège des preuves et doit les remettre à une journaliste · Morel est un détective privé payé par le PDG de Lumen.
</details>
