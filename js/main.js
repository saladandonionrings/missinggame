/* ==========================================================
   HORS LIGNE — Scénarisation : appels, événements, intro, fins
   ========================================================== */

/* ---------------- choix de réponses (SMS) ---------------- */
const CHOICES = {
  jade0: [
    { label: "Je m'y mets. On va la retrouver.", then() { Msg.receive('jade', ["Merci. Vraiment.", "Je reste à côté de mon téléphone."]); } },
    { label: "Tu es sûre qu'elle veut qu'on la retrouve ?", then() { Msg.receive('jade', ["…", "Je sais pas. Mais moi j'ai besoin de savoir qu'elle va bien."]); } },
  ],
  jadeCheck: [
    { label: "Oui. Un « inspecteur Morel », de la police judiciaire.", then() { flag('toldJadeMorel'); Msg.receive('jade', ["Un inspecteur ??", "Les flics m'ont dit hier qu'ils ne cherchaient PAS Nora. Qu'elle était majeure.", "Attends. J'appelle le commissariat."]); } },
    { label: "Non, personne.", then() { flag('lieJade'); Msg.receive('jade', ["Ok…", "Moi j'ai rappelé la police ce matin. Toujours la même réponse : « majeure et libre ». Ils ne font rien."]); } },
  ],
  jadePolice: [
    { label: "Alors qui c'est ?", then() { Msg.receive('jade', ["J'en sais rien. Mais il ment.", "Cherche son nom dans ses mails. Rappelle son numéro. Et ne lui dis RIEN."]); } },
    { label: "D'accord. Je ne lui dirai rien.", then() { Msg.receive('jade', ["Merci. Je deviens folle."]); } },
  ],
  jadeLumen: [
    { label: "Supprime-le. Tout de suite. Je t'expliquerai.", then() { flag('jadeDeletedLumen'); Msg.receive('jade', ["…ok. C'est fait.", "Tu me fais peur, là."]); } },
    { label: "Je ne sais pas encore. Garde-le pour l'instant.", then() { Msg.receive('jade', ["Ok. Mais dis-moi vite."]); } },
  ],
  morel1: [
    { label: "Je n'ai encore rien trouvé.", then() { Msg.receive('morel', ["Cherchez mieux. Le temps joue contre elle."]); } },
    { label: "Comment avez-vous eu ce numéro ?", then() { Msg.receive('morel', ["C'est le numéro de Nora, que vous utilisez. Et trouver les gens, c'est mon métier."]); } },
  ],
  morel2: [
    { label: "Je ne sais pas où elle est.", then() { Msg.receive('morel', ["Vous mentez mal. Comme elle."]); } },
    { label: "Vous n'êtes pas policier.", then() { Msg.receive('morel', ["Et vous n'êtes pas sa sœur.", "Nous tenons tous les deux un téléphone qui ne nous appartient pas. Réfléchissez à qui vous voulez aider."]); } },
  ],
};

/* ---------------- messageries dynamiques ---------------- */
const VOICEMAILS = {
  vm_maman2: { who: 'Maman', date: "aujourd'hui", steps: [{ who: 'maman', n: 'Maman', t: "C'est encore maman. Je sais que ce n'est pas toi qui as le téléphone, Jade m'a dit. Mais j'avais besoin d'entendre ta messagerie. Ta voix. Pardon." }] },
  vm_morel: { who: '+33 6 39 98 71 44', date: "aujourd'hui", clue: 'M1', steps: [{ who: 'morel', n: 'Inspecteur Morel', t: "Bonjour. Inspecteur Franck Morel, police judiciaire. Je sais que vous avez le téléphone de Nora Valette. Elle est peut-être en danger. Rappelez-moi, ou écrivez-moi à ce numéro. Le moindre lieu. Personne d'autre." }] },
  vm_bastien: { who: 'NE PAS RÉPONDRE', date: "aujourd'hui",
    get clue() { return knows.morel() ? 'M4' : null; },
    get steps() { return [{ who: 'bastien', n: 'Bastien Leroy', t: knows.morel()
      ? "C'est Bastien Leroy. Je sais que ce n'est pas Nora qui a ce téléphone. Il contient des données qui appartiennent à Lumen. Remettez-le à monsieur Morel. Il saura vous trouver, de toute façon."
      : "C'est Bastien Leroy. Je sais que ce n'est pas Nora qui a ce téléphone. Il contient des données qui appartiennent à Lumen. Quelqu'un passera le chercher. Il saura vous trouver, de toute façon." }]; } },
  vm_masked: { who: 'Numéro masqué', date: "aujourd'hui", clue: 'L11', steps: [{ sfx: 'sea' }, { wait: 1500 }, { fx: "(personne ne parle)" }, { gull: true }, { wait: 1500 }, { foghorn: true }, { wait: 2000 }, { breath: true }, { fx: "(fin du message)" }] },
};
function addMail(id) {
  S.lateMails = S.lateMails || [];
  if (S.lateMails.includes(id)) return;
  S.lateMails.unshift(id); save();
  const m = STORY.lateMails[id]; m.time = nowHM();
  Bus.emit('mail'); OS.badges();
  OS.notify({ app: 'mail', title: m.from, body: m.subj, onTap: () => OS.open('mail') });
}
function addVoicemail(id) { if (!S.voicemails.some(v => v.id === id)) { S.voicemails.unshift({ id, heard: false }); save(); OS.badges(); OS.notify({ app: 'phone', title: 'Nouveau message vocal', body: VOICEMAILS[id].who, onTap: () => OS.open('phone', null, { tab: 'vm' }) }); } }

/* ---------------- numéros appelables ---------------- */
const robot = t => ({ who: 'robot', n: 'Messagerie', t });
const beep = { fn: () => Sound.fx.beep() };
// fin de messagerie façon iPhone : bip, enregistrement court (durée fixe), puis raccroché automatique
const vmEnd = (sec = 4) => [beep, { rec: sec }, { wait: 500 }];
const CALLS = {
  resolve(raw) {
    const n = raw.replace(/\D/g, '').replace(/^33/, '0');
    const is = num => n === num.replace(/\D/g, '');
    if (['17', '112', '15', '18', '114', '3919'].includes(n)) return { rings: 1, steps: [robot(n === '3919' ? "Le 3919, Violences Femmes Info, existe vraiment : gratuit, anonyme, 24 heures sur 24. Mais ici, tu es dans une fiction. Appelle-le depuis ton propre téléphone si tu en as besoin." : "Tu es dans une fiction. Si tu as réellement besoin d'aide, compose ce numéro depuis ton propre téléphone. Ici, personne ne viendra.")] };
    if (is('0639981203')) return this.jade();
    if (is('0639984450')) return { rings: 1, steps: [{ who: 'maman', n: 'Maman', t: "Allô ? Nora ? … Ah. C'est toi. Jade m'a dit." }, { who: 'maman', n: 'Maman', t: "Tu as trouvé quelque chose ? … Non ? … Elle parlait tellement de sa grand-mère, ces derniers temps. De sa maison, là-bas, au bout du monde." }, { who: 'maman', n: 'Maman', t: "Appelle-moi dès que tu sais. Je ne dors plus." }] };
    if (is('0639982788')) return this.theo();
    if (is('0261914806')) return this.mamie();
    if (is(STORY.morelNum)) return { rings: 2, steps: [{ who: 'argos', n: 'Répondeur', t: "Vous êtes bien chez Argos Conseil. Investigations privées, recherche de personnes, intelligence économique." }, { who: 'argos', n: 'Répondeur', t: "Laissez-nous un message, nous vous rappellerons." }, { fn: () => clue('M3') }, ...vmEnd()] };
    if (is(STORY.claireNum)) return { rings: 3, steps: [{ who: 'claire', n: 'Claire Asselin', t: "Claire Asselin, Le Contrepoint. Laissez-moi un message." }, { who: 'claire', n: 'Claire Asselin', t: "Si vous êtes une source : pas ici. Vous savez où me trouver." }, { fn: () => clue('P10') }, ...vmEnd()] };
    if (is('0465712020')) return { rings: 1, steps: [{ sfx: 'hold' }, robot("Bienvenue chez Lumen. Ne rentrez plus jamais seule."), robot("Votre sécurité est notre priorité. Temps d'attente estimé : quarante-sept minutes."), { wait: 3500 }, robot("Pour signaler un problème de confidentialité, merci de consulter l'article dix-sept point quatre de nos conditions d'utilisation."), { wait: 2500 }, robot("Au revoir."), { stopsfx: 'hold' }] };
    if (is('0639986117')) return this.benali();
    if (is('0639980066')) return this.bastien();
    if (is('0639983340')) return { rings: 3, steps: [{ who: 'jade', n: 'Inès (messagerie)', t: "C'est Inès ! Laisse un message, ou mieux, envoie un mème." }, ...vmEnd()] };
    if (is('0639985219')) return { rings: 3, steps: [{ who: 'homme', n: 'Paul (messagerie)', t: "Paul. Bip. Voilà." }, ...vmEnd()] };
    if (is('0465718802')) return { rings: 2, steps: [robot("Le cabinet du docteur Pelletier est fermé. En cas d'urgence, composez le 15.")] };
    if (is('0639989027')) return { rings: 0, steps: [robot("Vous appelez le numéro de ce téléphone. Ligne occupée.")] };
    return { rings: 1, steps: [robot("Le numéro que vous avez demandé n'est pas attribué. Veuillez vérifier votre saisie.")] };
  },
  jade() {
    const first = !has('calledJade'); flag('calledJade');
    return { rings: 1, steps: [
      { who: 'jade', n: 'Jade', t: first ? "Allô ?! C'est toi ? Pardon, je suis à cran. Tu as du nouveau ?" : "Allô ? Du nouveau ?" },
      { who: 'jade', n: 'Jade', t: Hints.jadeLine() },
      { who: 'jade', n: 'Jade', t: "Rappelle-moi si tu trouves quoi que ce soit. N'importe quoi." },
    ] };
  },
  theo() {
    if (has('lumenDev') && !has('theoTalked')) {
      flag('theoTalked');
      return { rings: 3, steps: [
        { who: 'theo', n: 'Théo', t: "… Allô. Je sais que ce n'est pas elle." },
        { who: 'theo', n: 'Théo', t: "Je ne peux pas parler longtemps. Si tu as ouvert le menu dev, tu as vu les requêtes. Tu as vu son nom. Et celui de Jade." },
        { who: 'theo', n: 'Théo', t: "C'est moi qui ai codé l'API Retrouver. On m'a dit que c'était pour les familles. J'ai voulu y croire." },
        { who: 'theo', n: 'Théo', t: "Ce téléphone, ils le voient. Chaque appli que tu ouvres, ils le voient. Fais attention à ce que tu fais avec." },
        { fx: '(il raccroche)' },
      ] };
    }
    return { rings: 4, steps: [{ who: 'theo', n: 'Théo (messagerie)', t: "Théo. Laissez un message." }, ...vmEnd()] };
  },
  mamie() {
    S.calledMamie = (S.calledMamie || 0) + 1; save();
    if (S.calledMamie === 1) return { rings: 4, kind: 'voicemail-silent', steps: [
      { sfx: 'wind' }, { fx: "(quelqu'un a décroché)" }, { wait: 1500 }, { breath: true }, { foghorn: true }, { wait: 1200 },
      { fn: () => clue('L6') }, { who: 'nora', n: 'Une voix, très bas', t: "… Jade ?" }, { wait: 1800 }, { fx: '(on raccroche)' }, { stopsfx: 'wind' },
    ] };
    return { rings: 6, steps: [robot("Votre correspondant n'est pas joignable pour le moment.")] };
  },
  benali() {
    return { rings: 2, steps: [
      { who: 'maman', n: 'Mme Benali', t: "Allô ? Ah, c'est le portable de Nora ! Vous êtes sa sœur ? Non ? Une amie. Bon." },
      { who: 'maman', n: 'Mme Benali', t: "Le chat va très bien, il a déjà mangé un bout de mon rideau. Elle me l'a amené samedi, à l'aube, avec ses croquettes." },
      { who: 'maman', n: 'Mme Benali', t: "Elle m'a dit qu'elle partait voir la mer quelques jours. Elle avait un grand sac. Elle avait l'air… soulagée, je dirais." },
      { who: 'maman', n: 'Mme Benali', t: "Ah, et un monsieur est passé hier. Très poli. Il voulait savoir si elle avait laissé une adresse. Je lui ai dit que je ne savais rien. C'est vrai, d'ailleurs." },
      { fn: () => clue('L1') },
    ] };
  },
  bastien() {
    if (has('bastienTalked')) return { rings: 5, steps: [{ who: 'bastien', n: 'Messagerie', t: "Bastien Leroy. Laissez un message." }, ...vmEnd()] };
    flag('bastienTalked');
    return { rings: 2, steps: [
      { who: 'bastien', n: '« NE PAS RÉPONDRE »', t: "Nora ? … Nora, c'est toi ?" },
      { wait: 1200 },
      { who: 'bastien', n: '« NE PAS RÉPONDRE »', t: "Qui est à l'appareil ? … Peu importe. Écoutez-moi bien." },
      ...(knows.morel()
        ? [{ who: 'bastien', n: '« NE PAS RÉPONDRE »', t: "Ce téléphone contient des données qui appartiennent à Lumen. Remettez-le à monsieur Morel, et tout ira bien pour tout le monde. Pour elle aussi." }, { fx: '(il raccroche)' }, { fn: () => clue('M4') }]
        : [{ who: 'bastien', n: '« NE PAS RÉPONDRE »', t: "Ce téléphone contient des données qui appartiennent à Lumen. Quelqu'un va venir le récupérer. Donnez-le-lui, et tout ira bien pour tout le monde. Pour elle aussi." }, { fx: '(il raccroche)' }]),
    ] };
  },
};

/* ---------------- scénario temps réel ---------------- */
const EVENTS = [
  { id: 'jadeWelcome', after: 'unlocked', delay: 3, run() {
    Msg.receive('jade', ["T'as réussi ?! 😭", "Ok. Fouille tout. Messages, photos, notes, mails… je m'en fiche de sa vie privée, je veux juste savoir qu'elle va bien.", "La police dit qu'elle est majeure. Qu'elle est « sûrement partie de son plein gré ».", "Moi j'y crois pas. Elle serait jamais partie sans me prévenir. Et elle aurait JAMAIS laissé son téléphone.", "Si t'es bloqué·e, appelle-moi. Je réponds toujours 📞"]).then(() => Msg.setChoices('jade', 'jade0'));
  } },
  { id: 'lumenPing1', after: 'unlocked', delay: 50, run() { OS.notify({ app: 'lumen', title: 'Lumen', body: "Nora, cela fait 4 jours que vous n'avez partagé aucun trajet. Tout va bien ? 💜", onTap: () => OS.open('lumen') }); } },
  { id: 'mamanCall', after: 'unlocked', delay: 110, call: true, run() {
    Call.incoming({ name: 'Maman', ini: 'M', col: '#ff6b9a', script: [
      { who: 'maman', n: 'Maman', t: "Nora ?! Nora, c'est toi ?" },
      { choice: [{ label: "Non, désolé·e… je suis un·e ami·e de Jade." }, { label: "(ne rien dire)", steps: [{ wait: 1500 }, { who: 'maman', n: 'Maman', t: "… Allô ? Je vous entends respirer. Vous êtes l'ami de Jade, c'est ça ?" }] }] },
      { who: 'maman', n: 'Maman', t: "Pardon. J'appelle ce numéro toutes les heures. Je sais que c'est bête." },
      { who: 'maman', n: 'Maman', t: "Elle ne venait pas à la Toussaint. Pour la première fois de sa vie. Depuis que sa grand-mère est partie, elle n'est plus pareille." },
      { who: 'maman', n: 'Maman', t: "Elle parlait tout le temps de sa maison, là-bas. Du bout du monde." },
      { who: 'maman', n: 'Maman', t: "Trouvez-la. S'il vous plaît." },
    ], onMiss: () => setTimeout(() => addVoicemail('vm_maman2'), 4000) });
  } },
  { id: 'fluxMemory', after: 'unlocked', delay: 190, run() { OS.notify({ app: 'flux', title: 'Flux', body: "Souvenir 🌊 Il y a 7 ans, vous étiez au bout du monde. Revivez ce moment !", onTap: () => OS.open('flux') }); } },
  { id: 'morelCall', after: 'mailOpen', delay: 28, call: true, run() {
    ensureThread('morel');
    Call.incoming({ name: '+33 6 39 98 71 44', ini: '?', col: '#48484a', script: [
      { fn: () => clue('M1') },
      { who: 'morel', n: '« Inspecteur Morel »', t: "Bonjour. Inspecteur Franck Morel, police judiciaire de Lyon." },
      { who: 'morel', n: '« Inspecteur Morel »', t: "Vous êtes en possession du téléphone de Nora Valette. Ne me demandez pas comment je le sais." },
      { who: 'morel', n: '« Inspecteur Morel »', t: "Mademoiselle Valette est peut-être en danger. Elle est aussi en possession de documents volés." },
      { choice: [
        { label: "Comment avez-vous eu ce numéro ?", steps: [{ who: 'morel', n: '« Inspecteur Morel »', t: "C'est le sien. Et trouver les gens, c'est mon métier." }] },
        { label: "Qu'est-ce que vous voulez ?", steps: [{ who: 'morel', n: '« Inspecteur Morel »', t: "Une seule chose : savoir où elle est. Pour sa sécurité." }] },
      ] },
      { who: 'morel', n: '« Inspecteur Morel »', t: "Si vous trouvez un lieu, un nom, une adresse, écrivez-le-moi. À ce numéro. Personne d'autre." },
      { who: 'morel', n: '« Inspecteur Morel »', t: "Et n'en parlez pas à la famille. Ça compliquerait l'enquête. Bonne journée." },
    ], onMiss: () => setTimeout(() => addVoicemail('vm_morel'), 3500) });
  } },
  { id: 'morelSms', after: 'ev_morelCall', delay: 8, run() { Msg.receive('morel', ["Inspecteur Morel. Voici mon numéro.", "Le moindre lieu, écrivez-le-moi. Le temps joue contre elle."]).then(() => Msg.setChoices('morel', 'morel1')); } },
  { id: 'lumenPing2', after: 'ev_morelCall', delay: 45, run() { OS.notify({ app: 'lumen', title: 'Lumen', body: "📍 Votre position a été partagée avec 1 partenaire de confiance." }); } },
  { id: 'jadeCheck', after: 'ev_morelCall', delay: 60, run() { Msg.receive('jade', ["Du nouveau de ton côté ?", "Quelqu'un t'a contacté·e sur son téléphone ?"]).then(() => Msg.setChoices('jade', 'jadeCheck')); } },
  { id: 'jadeCheck2', after: 'lieJade', delay: 120, run() { Msg.receive('jade', ["Maman vient de m'appeler.", "Un homme l'a appelée chez elle. Il s'est présenté comme policier et voulait savoir si Nora avait « une maison de famille ».", "T'es sûr·e que personne ne t'a appelé·e ?"]).then(() => Msg.setChoices('jade', 'jadeCheck')); } },
  { id: 'jadePolice', after: 'toldJadeMorel', delay: 25, run() { Msg.receive('jade', ["J'ai appelé le commissariat.", "AUCUNE enquête n'est ouverte. Et il n'y a pas d'inspecteur Morel. Personne de ce nom.", "Ce type n'est pas flic."]).then(() => { clue('M2'); Msg.setChoices('jade', 'jadePolice'); }); } },
  { id: 'theoWarn', after: 'lumenDev', delay: 18, run() { Msg.receive('theo', ["C'est toi qui as le tel de Nora ? Jade m'a dit.", "Je viens de recevoir une alerte : quelqu'un s'est connecté au mode dev depuis son appareil.", "Si tu as vu la 5102, tu sais qu'ils suivent ce téléphone. En ce moment.", "Et la 5103… c'est Jade. Elle a Lumen. Elle partage sa position. Tu comprends ?", "Je peux rien faire de plus. Ils lisent mes messages pro. Efface cette conversation."]); } },
  { id: 'morelKnows', after: 'vaultOpen', delay: 12, run() { Sound.fx.glitch(); $('#screen').classList.add('glitch'); setTimeout(() => $('#screen').classList.remove('glitch'), 1100); ensureThread('morel'); Msg.receive('morel', ["Vous venez d'ouvrir un dossier chiffré.", "Ces fichiers sont des pièces sensibles. Ne les transférez à personne."]).then(() => clue('M7')); } },
  { id: 'lumenPing3', after: 'vaultOpen', delay: 70, run() { OS.notify({ app: 'lumen', title: 'Lumen', body: "💜 Nora, vous semblez stressée. Découvrez Lumen Sérénité, notre programme premium." }); } },
  { id: 'masked', after: 'ombreOpen', delay: 22, call: true, cond: () => has('ombreRead'), run() {
    Call.incoming({ name: 'Numéro masqué', ini: '?', col: '#1c1c1e', masked: true, script: [
      { sfx: 'sea' }, { wait: 1500 }, { fx: '(personne ne parle)' }, { fn: () => clue('L11') }, { gull: true }, { wait: 1200 }, { foghorn: true }, { wait: 1800 }, { breath: true }, { wait: 800 }, { fx: '(on raccroche)' },
    ], onMiss: () => setTimeout(() => addVoicemail('vm_masked'), 3000) });
  } },
  { id: 'morelThreat', after: 'ombreOpen', delay: 55, cond: () => has('ev_morelCall'), run() { Msg.receive('morel', ["Je sais que vous êtes proche.", "Le téléphone que vous tenez se trouve rue d'Austerlitz, Lyon 4e. Je pourrais passer le chercher.", "Ou vous pouvez simplement me donner le lieu."]).then(() => Msg.setChoices('morel', 'morel2')); } },
  { id: 'jadeFinal', after: 'ombreOpen', delay: 95, run() { Msg.receive('jade', ["Théo m'a appelée. Il dit que tu as trouvé des trucs. Il avait une voix bizarre.", "Quand tu es prêt·e, ouvre ton carnet. Et dis-moi tout.", "Je dois savoir."]); } },
  { id: 'mailSecu', after: 'mailOpen', delay: 70, run() { addMail('secu'); } },
  { id: 'fluxStalk', after: 'readArgos', delay: 25, run() { OS.notify({ app: 'flux', title: 'Flux', body: "bastien.leroy a consulté votre profil 6 fois aujourd'hui.", onTap: () => OS.open('flux') }); } },
  { id: 'nexaPromo', after: 'readDatanexa', delay: 60, run() { addMail('nexa'); } },
  { id: 'jadeLumen', after: 'noteOpen', delay: 30, run() { Msg.receive('jade', ["Je relis tous ses messages et je pense à un truc.", "Elle m'a demandé la semaine dernière si j'avais encore Lumen sur mon téléphone. Pourquoi elle m'aurait demandé ça ?", "Je l'ai toujours. Je partage ma position avec elle et maman."]).then(() => Msg.setChoices('jade', 'jadeLumen')); } },
  { id: 'calRemind', after: 'unlocked', delay: 330, run() { OS.notify({ app: 'calendar', title: 'Calendrier', body: "Rappel : 🎂 Anniversaire Jade dans 8 jours — NE PAS RATER", onTap: () => OS.open('calendar') }); } },
  { id: 'bankIdle', after: 'unlocked', delay: 260, run() { OS.notify({ app: 'bank', title: 'Banque Azur', body: "Votre carte n'a pas été utilisée depuis 4 jours. Pour votre sécurité, nous surveillons votre compte. 💚" }); } },
  { id: 'adHike', after: 'bankOpen', delay: 20, run() { OS.notify({ app: 'flux', title: 'Flux · Sponsorisé', body: "📍 Vous étiez près de Décathlon récemment. -20 % sur la randonnée côtière ! 🌊" }); } },
  { id: 'lumenAlert', after: 'lumenDev', delay: 50, run() { Sound.fx.glitch(); OS.notify({ app: 'lumen', title: 'Lumen — Sécurité', body: "⚠️ Activité inhabituelle détectée sur votre compte. Un conseiller va vous contacter.", sound: null }); } },
  { id: 'meteoAlert', after: 'vaultOpen', delay: 35, run() { OS.notify({ app: 'weather', title: 'Météo · Ouessant', body: "Vigilance orange vent. Traversées vers les îles du Ponant annulées demain matin.", onTap: () => OS.open('weather') }); } },
  { id: 'photoMemory', after: 'ev_masked', delay: 30, run() { OS.notify({ app: 'photos', title: 'Photos', body: "Nouveau souvenir : « Mamie » — 1 photo, 1 lieu.", onTap: () => OS.open('photos', null, { photo: 'ouessant' }) }); } },
  { id: 'jadeMail', after: 'lumenOpen', delay: 140, run() { addMail('jadefw'); } },
  { id: 'healthNudge', after: 'unlocked', delay: 400, run() { OS.notify({ app: 'health', title: 'Santé', body: "Vous n'avez fait aucun pas depuis 4 jours. Bougez un peu ! 🚶‍♀️", onTap: () => OS.open('health') }); } },
  { id: 'bastienCall', after: 'readBastienDel', delay: 22, call: true, cond: () => !has('bastienTalked'), run() {
    const c = CALLS.bastien();
    Call.incoming({ name: 'NE PAS RÉPONDRE', ini: '⛔', col: '#ff453a', script: c.steps, onMiss: () => setTimeout(() => addVoicemail('vm_bastien'), 3500) });
  } },
  { id: 'quichesWorry', after: 'unlocked', delay: 230, run() { Msg.receive('quiches', ["Jade dit que quelqu'un a le téléphone de Nora ??", "si tu lis ça, qui que tu sois : dis-lui qu'on l'aime. et qu'on lui garde une patate 🥔"], { notifyTitle: 'Les Quiches 🥧 · Inès' }); } },
  { id: 'jadeStory', after: 'unlocked', delay: 290, run() { OS.notify({ app: 'flux', title: 'Flux', body: "jade.vlt a publié une story : « AVIS DE RECHERCHE — Nora, 27 ans. Partagez 🙏 »", onTap: () => OS.open('flux') }); } },
  { id: 'contrepointNews', after: 'mailOpen', delay: 160, run() { addMail('news'); } },
  { id: 'adminCode', after: 'lumenDev', delay: 85, run() { Msg.receive('lumensms', ["LUMEN : Votre code de connexion administrateur est 771204. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message."], { notifyTitle: 'LUMEN' }); } },
  { id: 'lumenNight', after: 'heardDeletedMemo', delay: 30, run() { OS.notify({ app: 'lumen', title: 'Lumen', body: "💜 Vous utilisez votre téléphone tard le soir. Lumen Sérénité vous aide à mieux dormir. Essai gratuit !" }); } },
  { id: 'morelDeleted', after: 'readBastienDel', delay: 75, cond: () => has('ev_morelCall'), run() { ensureThread('morel'); Msg.receive('morel', ["Je vois que vous lisez des conversations supprimées.", "Certaines choses sont effacées pour de bonnes raisons."]); } },
  { id: 'battery', after: 'unlocked', delay: 480, run() { OS.notify({ app: 'settings', title: 'Batterie faible', body: `${S.battery} % de batterie restante. Le téléphone de Nora n'a pas été chargé depuis 4 jours.` }); } },
];
function tick() {
  if (!S.started || OS.ended || !has('unlocked')) return;
  for (const e of EVENTS) {
    if (S.flags['ev_' + e.id]) continue;
    if (!S.flags[e.after]) continue;
    if (Date.now() - S.flags[e.after] < e.delay * 1000) continue;
    if (e.cond && !e.cond()) continue;
    if (e.call && (OS.inCall || OS.overlayOn)) continue;
    flag('ev_' + e.id);
    try { e.run(); } catch (err) { console.error(err); }
    break;
  }
}

/* ---------------- principal ---------------- */
const Main = {
  init() {
    if (S.threadOrder) { S.threadOrder.forEach(ensureThread); STORY.threadOrder = S.threadOrder.filter((x, i, a) => a.indexOf(x) === i); }
    Object.keys(S.msgs).forEach(ensureThread);
    Sound.setMuted(!!S.muted);
    document.body.insertAdjacentHTML('beforeend', '<div id="saProbe" style="position:fixed;top:0;left:0;width:1px;height:env(safe-area-inset-top,0px);pointer-events:none;visibility:hidden"></div><div id="rotate">📱↻<br><span>Tourne ton téléphone à la verticale</span></div>');
    this.fit(); window.addEventListener('resize', () => this.fit());
    if (window.visualViewport) visualViewport.addEventListener('resize', () => this.fit());
    window.addEventListener('orientationchange', () => setTimeout(() => this.fit(), 250));
    document.addEventListener('gesturestart', e => e.preventDefault());
    OS.init();
    this.syncMute();
    $('#sideMute').onclick = () => { const m = !Sound.muted; Sound.setMuted(m); S.muted = m; save(); this.syncMute(); };
    setInterval(tick, 1000);
    setInterval(() => {
      if (!S.started || OS.ended || document.hidden) return;
      S.playMs += 1000;
      if (S.playMs % 240000 === 0 && S.battery > 6) { S.battery--; OS.battery(); }
      if (S.playMs % 5000 === 0) save();
    }, 1000);
    this.intro();
  },
  syncMute() { $('#sideMute').textContent = Sound.muted ? '🔇 Son coupé' : '🔊 Son activé'; },
  fit() {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const vw = window.visualViewport ? visualViewport.width : innerWidth;
    let vh = window.visualViewport ? visualViewport.height : innerHeight;
    // Paysage = orientation réelle de l'appareil. La hauteur visible ne compte pas :
    // le clavier virtuel la réduit et ferait croire à un téléphone couché.
    const typingNow = document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (typingNow) this._lastTyping = Date.now();
    const justTyped = Date.now() - (this._lastTyping || 0) < 1500; // le clavier est encore en train de se fermer
    const so = screen.orientation && screen.orientation.type;
    const devLand = typeof window.orientation === 'number' ? Math.abs(window.orientation) === 90   // iPhone et Android : orientation physique
      : so ? so.startsWith('landscape') : innerWidth > innerHeight;
    const land = touch && devLand && !typingNow && !justTyped && Math.min(screen.width, screen.height) < 520;
    if (justTyped && !typingNow) setTimeout(() => this.fit(), 1600);
    // Mode téléphone : décidé sur la largeur et l'orientation, jamais sur la hauteur (clavier).
    const mob = vw <= 560 || (touch && !devLand && vw <= 820) || (typingNow && document.body.classList.contains('mobile'));
    document.body.classList.toggle('mobile', mob);
    document.body.classList.toggle('landscape', land);
    const ph = $('#phone'), wrap = $('#phoneWrap');
    if (mob) {
      // Le clavier virtuel réduit la hauteur visible : on garde la mise en page d'avant.
      const typing = document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if (typing && this._mobH) vh = this._mobVH;
      this._mobVH = vh;
      const s = vw / 390;
      const H = Math.round(vh / s);
      this._mobH = H;
      ph.style.width = '390px'; ph.style.height = H + 'px';
      ph.style.transform = `scale(${s})`;
      wrap.style.width = vw + 'px'; wrap.style.height = vh + 'px';
      document.body.classList.toggle('short', H < 790);
      document.body.classList.toggle('vshort', H < 720);
      // Encoche réelle (iPhone) : la vraie barre d'état remplace la nôtre.
      const probe = $('#saProbe');
      const top = probe ? probe.getBoundingClientRect().height : 0;
      document.body.classList.toggle('notch', top > 20);
      return;
    }
    ph.style.width = ''; ph.style.height = '';
    document.body.classList.remove('short', 'vshort', 'notch');
    const sideW = innerWidth > 960 ? 300 : 0;
    $('#side').style.display = sideW ? '' : 'none';
    const s = Math.min((innerHeight - 32) / 868, (innerWidth - sideW - 32) / 414, 1.15);
    $('#phone').style.transform = `scale(${s})`;
    $('#phoneWrap').style.width = 414 * s + 'px';
    $('#phoneWrap').style.height = 868 * s + 'px';
  },

  intro() {
    const I = $('#intro');
    const resume = S.started;
    I.className = 'on';
    I.innerHTML = `<div class="in-title">HORS<span>·</span>LIGNE</div><div class="in-sub">une enquête dans le téléphone d'une disparue</div>
      ${resume ? `<button class="in-btn go" style="animation-delay:1.2s">Reprendre l'enquête</button><button class="in-btn ghost new" style="animation-delay:1.4s">Nouvelle partie</button>` : `<button class="in-btn go" style="animation-delay:1.2s">Commencer</button>`}
      <div class="in-note">🎧 Jeu sonore : mets un casque, monte le son.<br>Durée : 45 min à 1 h 30 · progression sauvegardée automatiquement.</div>
      <div class="in-warn">Fiction. Tous les personnages, entreprises, numéros et applications sont inventés. Le jeu aborde la surveillance, le harcèlement et les violences conjugales.</div>`;
    $('.go', I).onclick = () => { Sound.init(); resume ? this.resume() : this.prologue(); };
    const nb = $('.new', I); if (nb) nb.onclick = () => twice(nb, 'Cliquer encore pour tout effacer', () => this.reset());
  },
  async prologue() {
    const I = $('#intro');
    Sound.layer('drone', true);
    const lines = [
      "Nora Valette, 27 ans, data scientist à Lyon.",
      "Depuis le samedi 31 octobre, plus personne n'a de nouvelles.",
      "La police dit qu'elle est majeure. Qu'elle est sûrement partie « de son plein gré ».",
      "Sa sœur Jade a retrouvé son téléphone, posé sur la table de la cuisine.",
      "Elle te l'a confié. Tu es « doué·e avec les téléphones ».",
    ];
    I.innerHTML = `<div class="in-lines">${lines.map((l, i) => `<p style="animation-delay:${i * 2.1}s">${esc(l)}</p>`).join('')}<p class="big" style="animation-delay:${lines.length * 2.1 + 0.4}s">Trouve Nora.</p></div>
      <button class="in-btn go" style="animation-delay:${lines.length * 2.1 + 1.6}s">Allumer le téléphone</button><button class="in-btn ghost skip" style="position:fixed;bottom:24px;right:24px;animation-delay:.5s;padding:8px 16px;font-size:12px;margin:0">Passer ›</button>`;
    const go = () => { I.className = ''; I.innerHTML = ''; this.boot(); };
    $('.go', I).onclick = go; $('.skip', I).onclick = go;
  },
  async boot() {
    S.started = true; save();
    const B = h(`<div class="boot"><div class="logo"></div><div class="bar"><div></div></div></div>`);
    $('#screen').appendChild(B);
    Sound.fx.boot();
    await sleep(3200);
    B.style.transition = 'opacity .6s'; B.style.opacity = '0';
    OS.showLock();
    await sleep(600); B.remove();
    const n = [
      { app: 'phone', title: 'Appels manqués', body: 'Jade 💛 (7) · Maman (3) · Théo (1) · Numéro masqué', when: 'dim.' },
      { app: 'lumen', title: 'Lumen', body: "Nora, nous ne vous avons pas vue depuis 4 jours. Tout va bien ? 💜", when: 'hier' },
      { app: 'flux', title: 'Flux', body: "Inès et 11 autres personnes ont réagi à votre publication.", when: 'hier' },
      { app: 'messages', title: 'Jade 💛', body: "C'est moi qui t'ai donné son tel. Le code ? Elle m'avait dit en rigolant que c'était « l'anniversaire de Kafka » 🐱", when: 'il y a 5 min' },
    ];
    for (const x of n) { await sleep(900); OS.lockNotif(x); Sound.fx[x.app === 'messages' ? 'message' : 'notif'](); }
  },
  resume() {
    $('#intro').className = '';
    Sound.layer('drone', true);
    if (S.lastEnding && has('concluded')) { this.endingScreen(S.lastEnding, true); }
    if (has('unlocked')) {
      OS.locked = false;
      $('#lock').classList.add('hidden');
      $('#wall').innerHTML = ART.homewall();
      OS.renderHome(); $('#home').classList.add('on');
    } else {
      OS.showLock();
      OS.lockNotif({ app: 'messages', title: 'Jade 💛', body: "Le code ? Elle m'avait dit que c'était « l'anniversaire de Kafka » 🐱", when: 'il y a 5 min' });
    }
  },
  reset() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} location.reload(); },

  /* ---------- décision finale ---------- */
  decision() {
    flag('concluded');
    const b = $('.carnet .vbody'); if (!b) return;
    const canClaire = has('ombreOpen');
    b.innerHTML = `<div class="cn-small">Tu sais.</div>
      <div class="cn-cat"><h3>Elle est à Ouessant.</h3><div class="cn-clue">Dans la maison de sa grand-mère, au bout du monde. Elle protège des preuves. Un détective payé par Lumen la traque à travers ce téléphone.${S.clues.D5 ? " Et bientôt, à travers celui de Jade." : ""}</div></div>
      <div class="cn-cat"><h3>Que fais-tu de ce que tu sais ?</h3></div>
      <button class="cn-btn sec dc" data-k="morel">📩 Envoyer « Ouessant » à Morel. Il a l'air de vouloir la protéger.</button>
      <button class="cn-btn sec dc" data-k="jade">💬 Écrire à Jade : « Elle est à Ouessant. Elle va bien. »</button>
      <button class="cn-btn sec dc" data-k="claire" ${canClaire ? '' : 'disabled style="opacity:.45"'}>🌓 Prévenir Claire via Ombre, puis appeler Jade : « Supprime Lumen. »${canClaire ? '' : '<br><small>(tu n\'as trouvé aucun canal sûr pour joindre la journaliste)</small>'}</button>
      <button class="cn-btn sec dc" data-k="wipe">🗑 Ne rien dire à personne. Effacer le téléphone.</button><div style="height:30px"></div>`;
    b.onclick = e => { const x = e.target.closest('.dc'); if (!x || x.disabled) return; b.onclick = null; this.choose(x.dataset.k); };
    setTimeout(() => { if (!OS.ended) OS.notify({ app: 'messages', title: '+33 6 39 98 71 44', body: 'Alors ? Où est-elle ?', sound: 'message' }); }, 2500);
    setTimeout(() => { if (!OS.ended) OS.notify({ app: 'messages', title: 'Jade 💛', body: "Tu sais où elle est. Je le sens. Dis-moi. S'il te plaît.", sound: 'message' }); }, 6500);
  },
  async choose(k) {
    OS.ended = true;
    S.lastEnding = k; if (!S.endings.includes(k)) S.endings.push(k); save();
    Sound.fx.sent();
    if (k === 'morel') { pushMsg('morel', { f: 'me', t: 'Ouessant.' }); }
    if (k === 'jade') { pushMsg('jade', { f: 'me', t: 'Elle est à Ouessant. Elle va bien.' }); }
    await sleep(1400);
    if (k === 'morel') Sound.fx.glitch();
    if (k === 'claire') Sound.fx.success();
    $('#screen').style.transition = 'filter 1.5s'; $('#screen').style.filter = 'brightness(0)';
    await sleep(1600);
    this.endingScreen(k);
  },
  endingScreen(k, fromResume = false) {
    OS.ended = true;
    const E = STORY.endings[k];
    const mins = Math.max(1, Math.round(S.playMs / 60000));
    const T = mins >= 60 ? `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')}` : `${mins} minutes`;
    const tot = Object.keys(STORY.clues).length, got = Object.keys(S.clues).length, pct = Math.round(got / tot * 100);
    const rank = pct >= 100 ? 'Algorithme' : pct >= 85 ? 'Fin limier' : pct >= 60 ? 'Enquêteur·rice' : pct >= 35 ? 'Curieux·se' : 'Passant·e';
    const T_ = {
      morel: { txt: ["Tu tapes un seul mot. « Ouessant. » Envoyé.", "Morel répond en quatre secondes : « Merci. Vous avez fait ce qu'il fallait. »", "Le lendemain, le bateau de 9 h 45 compte un passager de plus. Un homme en parka neuve, qui ne regarde pas la mer.", "Sur une île de 800 habitants, une jeune femme arrivée seule en novembre, tout le monde sait où elle dort. Il n'a même pas besoin de chercher.", "Claire Asselin n'a jamais reçu les documents. Nora a signé un accord « à l'amiable ». Elle n'a plus jamais parlé de Lumen."],
        paper: { mast: 'Lyon Actu', sec: 'Économie', h: "Lumen lève 40 millions d'euros et vise l'Europe", chap: "« Notre mission n'a pas changé : que plus aucune femme ne rentre seule », se félicite Bastien Leroy, PDG de la start-up lyonnaise.", p: ["L'application revendique désormais 3,4 millions d'utilisatrices. Interrogée sur des rumeurs de revente de données, la direction évoque « des allégations sans fondement d'une ancienne salariée, qui les a depuis retirées »."] },
        last: "Une semaine plus tard, Jade a reçu un message d'un numéro inconnu. Trois mots : « Pourquoi as-tu parlé ? » Ce n'était pas elle qui avait parlé." },
      jade: { txt: ["Tu écris à Jade : « Elle est à Ouessant. Elle va bien. »", "Jade ne répond pas. Elle est déjà dans le train.", "Elle n'a pas supprimé Lumen. Personne ne lui a dit de le faire. Requête #5103 : déclenchée.", "À Brest, une voiture la suit jusqu'au Conquet. Sur le bateau, un homme en parka s'assoit deux rangs derrière elle.", "Les deux sœurs se retrouvent au pied du phare, en larmes. Morel arrive vingt minutes plus tard."],
        paper: { mast: 'Le Contrepoint', sec: 'Enquête', h: "Lumen soupçonnée de revendre les trajets de ses utilisatrices", chap: "Lumen dément « fermement » et annonce une plainte en diffamation. La lanceuse d'alerte, retrouvée par un détective privé, s'est refusée à tout commentaire.", p: ["Privée des documents originaux, « remis spontanément » à un mandataire de l'entreprise, la rédaction n'a pu publier qu'une partie de ses éléments."] },
        last: "Tu as fait confiance à la bonne personne. Pas au bon canal. Le danger n'était pas Jade. C'était le téléphone dans sa poche." },
      claire: { txt: ["Tu ouvres Ombre. Tu écris à C. : « Je ne suis pas Nora. J'ai son téléphone. Elle est en sécurité tant que personne ne sait. Dites-lui que Jade l'aime. »", "Puis tu appelles Jade. Pas un message : ta voix. « Supprime Lumen. Maintenant. Ne me demande pas pourquoi. Elle va bien. Elle sera là le 12. »", "Tu éteins le téléphone de Nora. Quelque part, sur un serveur, la requête #5102 affiche : SIGNAL PERDU.", "Morel envoie trois messages. Puis plus rien.", "Huit jours plus tard…"],
        paper: { mast: 'Le Contrepoint', sec: 'Révélations', h: "Lumen : l'appli qui promettait de nous protéger vendait nos trajets", chap: "Contrats, tarifs, requêtes : notre enquête, fondée sur les documents d'une ancienne data scientist, révèle comment la position de 2,8 millions de femmes a été revendue — y compris à des particuliers.", p: ["La CNIL a annoncé l'ouverture d'une procédure et le parquet a été saisi. Bastien Leroy a quitté ses fonctions.", "La lanceuse d'alerte a tenu à transmettre un message : « Je ne veux pas qu'on supprime les applis de sécurité. Je veux qu'on arrête de vendre celles qui les utilisent. »"] },
        last: "Le 12 novembre, à Nantes, quelqu'un a sonné chez Jade. Elle tenait un appareil photo argentique emballé dans du papier journal. Le journal du jour." },
      wipe: { txt: ["Tu ne dis rien. À personne.", "Réglages → Effacer contenu et réglages. L'écran devient blanc, puis noir.", "Les preuves, les photos, la voix de mamie, le mémo pour Jade : tout disparaît. Lumen ne peut plus suivre ce téléphone. Personne ne peut.", "Morel ne trouve rien. Jade non plus.", "Pendant onze jours, Jade ne dort presque pas. Elle colle des affiches. Elle appelle les hôpitaux."],
        paper: { mast: 'Le Contrepoint', sec: 'Révélations', h: "Lumen : l'appli qui promettait de nous protéger vendait nos trajets", chap: "Le douzième jour, l'enquête de Claire Asselin paraît. Nora avait gardé ses propres copies. Elle n'avait pas besoin de toi pour ça.", p: ["La CNIL a ouvert une procédure. L'entreprise est placée sous enquête."] },
        last: "Nora est rentrée. Jade l'a serrée si fort qu'elle a eu mal. Puis elle a demandé : « Pourquoi personne ne m'a rien dit ? » Le silence protège. Il blesse aussi." },
    }[k];
    if (k === 'jade' && has('jadeDeletedLumen')) T_.txt[2] = "Elle avait supprimé Lumen, comme tu le lui avais dit. Mais ton message est parti de CE téléphone. Celui qu'Argos lit en direct, journal compris.";
    const d = i => `animation-delay:${fromResume ? 0 : i}s`;
    let t = 0.4;
    const html = `<div class="end-wrap">
      <div class="end-txt">${T_.txt.map(x => `<p style="${d(t += 1.6)}">${esc(x)}</p>`).join('')}</div>
      <div class="paper" style="${d(t += 1.8)}"><div class="mast">${esc(T_.paper.mast)}</div><div class="dateline">${esc(T_.paper.sec)} · ${k === 'wipe' ? '16' : '12'} novembre 2026</div><h2>${esc(T_.paper.h)}</h2><div class="chap">${esc(T_.paper.chap)}</div>${T_.paper.p.map(x => `<p>${esc(x)}</p>`).join('')}</div>
      <div class="end-txt"><p class="q" style="${d(t += 1.5)}">${esc(T_.last)}</p></div>
      <div style="text-align:center;margin-top:30px;opacity:0;animation:fadeUp 1s forwards;${d(t += 1.6)}"><div class="end-label">${E.label}</div><div class="end-title">${esc(E.title)}</div></div>
      <div style="opacity:0;animation:fadeUp 1s forwards;${d(t += 1)}">
        <div class="end-stats"><div><b>${T}</b><small>dans sa vie</small></div><div><b>${got}/${tot}</b><small>indices</small></div><div><b>${esc(rank)}</b><small>rang</small></div></div>
        <div class="end-refl">
          <p>Tu as passé ${T} dans la vie de Nora.</p>
          <p>Tu sais où elle dort. Ce qu'elle achète. Qui elle aime. De quoi elle a peur. Où elle se cache. Tu as écouté la voix de sa grand-mère morte.</p>
          <p>Tu n'avais qu'un téléphone et un peu de patience.</p>
          <p class="big">Lumen en avait 2 847 113.<br>Et il ne lui faut pas ${T}.</p>
          <p>Personne, dans cette histoire, n'a rien piraté. Tout a été accepté, coché, autorisé. Une case à la fois. « Si vous n'avez rien à cacher… » Nora n'avait rien à cacher. Elle avait une vie.</p>
          ${pct >= 100 ? `<p><b>Tu as tout trouvé. Absolument tout.</b> Exactement comme l'aurait fait un algorithme. Est-ce que c'est une victoire ?</p>` : ''}
          <p>Au début, Jade t'a dit : « je m'en fiche de sa vie privée, je veux juste savoir qu'elle va bien ». C'est exactement la phrase que Lumen écrit sur ses publicités.</p>
        </div>
        <div class="end-tips"><b>Ce soir, deux minutes pour toi :</b><ul>
          <li>Réglages → Confidentialité → Localisation : passe sur « Jamais » ou « Pendant l'utilisation » tout ce qui n'a pas besoin de te suivre.</li>
          <li>Supprime les applis que tu n'as pas ouvertes depuis trois mois.</li>
          <li>Tu as le droit de demander à une entreprise quelles données elle détient sur toi (RGPD, droit d'accès).</li>
          <li>Si quelqu'un te surveille, te suit ou te menace : <b style="display:inline">3919</b> (Violences Femmes Info, gratuit, anonyme, 24 h/24), ou le 17 en urgence.</li>
        </ul></div>
        <div class="end-found">${Object.keys(STORY.endings).map(x => `<span class="${S.endings.includes(x) ? 'got' : ''}">${S.endings.includes(x) ? '✓ ' + esc(STORY.endings[x].title) : '🔒 Fin ' + STORY.endings[x].n}</span>`).join('')}</div>
        <div class="end-btns"><button class="again">↺ Revenir à la décision</button><button class="ghost newg">Nouvelle partie</button><button class="ghost cred">Crédits</button></div>
        <div class="credits" style="display:none;color:#777;font-size:13px;line-height:1.7;text-align:center;margin-bottom:40px">HORS·LIGNE — un jeu original.<br>Écriture, code, sons et images générés pour ce jeu, sans aucun fichier externe : les sons sont synthétisés, les voix sont celles de ton navigateur.<br>Personnages, entreprises, applications et numéros sont fictifs (plages de numéros réservées à la fiction).<br>Ouessant, elle, existe. Il n'y a presque pas de réseau. Allez-y.</div>
      </div></div>`;
    const En = $('#ending');
    En.innerHTML = html; En.className = 'on'; En.scrollTop = 0;
    Sound.stopLayers();
    if (k === 'claire') { Sound.layer('sea', true); setTimeout(() => Sound.gull(), 3000); }
    else if (k === 'morel') { Sound.layer('drone', true); setTimeout(() => Sound.fx.heart(), 2000); setTimeout(() => Sound.fx.heart(), 3200); }
    else Sound.layer('wind', true);
    $('.again', En).onclick = () => {
      En.className = ''; En.innerHTML = ''; Sound.stopLayers(); Sound.layer('drone', true);
      OS.ended = false; S.lastEnding = null; save();
      $('#screen').style.filter = '';
      OS.open('carnet'); setTimeout(() => this.decision(), 100);
    };
    $('.newg', En).onclick = e => twice(e.currentTarget, 'Cliquer encore pour tout effacer', () => this.reset());
    $('.cred', En).onclick = () => { const c = $('.credits', En); c.style.display = c.style.display === 'none' ? 'block' : 'none'; };
  },
};

window.addEventListener('DOMContentLoaded', () => Main.init());
