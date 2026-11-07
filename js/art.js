/* ==========================================================
   HORS LIGNE — Illustrations (SVG génératif, aucun fichier image)
   ========================================================== */
const ART = (() => {
  let n = 0;
  const uid = () => 'g' + (++n);
  const svg = (w, h, inner, par = 'xMidYMid slice') => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${par}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  // Aléatoire déterministe : une image est toujours identique d'un affichage à l'autre.
  const seeded = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // Filtres « appareil photo » : grain de capteur, flous de profondeur de champ, vignettage.
  const defs = g => `<filter id="${g}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 1 1 0 -1  1 1 1 0 -1  1 1 1 0 -1  0 0 0 0 1"/></filter>
    <filter id="${g}b1" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1"/></filter>
    <filter id="${g}b3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${g}b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="${g}b20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
    <radialGradient id="${g}vig" cx="50%" cy="50%" r="75%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient>`;
  const finish = (g, w, h, { grain = .4, vig = .7 } = {}) => `<rect width="${w}" height="${h}" fill="url(#${g}vig)" opacity="${vig}"/><rect width="${w}" height="${h}" filter="url(#${g}gr)" opacity="${grain}" style="mix-blend-mode:overlay"/>`;

  /* Kafka : chat entièrement noir aux yeux verts, pelage texturé, lumière de côté */
  function catSit(x, y, s, { g, r: R, rim = '#ffb47a' }) {
    const col = '#222228';
    let fur = '';
    for (let i = 0; i < 90; i++) { const a = R() * Math.PI * 2, k = .86 + R() * .18; const px = Math.cos(a) * 56 * k, py = 26 + Math.sin(a) * 48 * k; if (py > 70) continue; fur += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} l${(Math.cos(a) * 7 + R() * 3 - 1.5).toFixed(1)} ${(Math.sin(a) * 7 + R() * 3 - 1.5).toFixed(1)}" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>`; }
    for (let i = 0; i < 50; i++) { const a = Math.PI * .85 + R() * Math.PI * 1.3, k = .92 + R() * .12; const px = Math.cos(a) * 44 * k, py = -48 + Math.sin(a) * 42 * k; fur += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} l${(Math.cos(a) * 6).toFixed(1)} ${(Math.sin(a) * 6).toFixed(1)}" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/>`; }
    let sheen = ''; for (let i = 0; i < 30; i++) { const px = -40 + R() * 70, py = -10 + R() * 70; sheen += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} l${(R() * 4 - 2).toFixed(1)} 6" stroke="#4a4652" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`; }
    let chest = ''; for (let i = 0; i < 16; i++) { const t = i / 15, px = -20 + t * 40, py = 16 + Math.sin(t * Math.PI) * 4; chest += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} l${(R() * 4 - 2).toFixed(1)} -7" stroke="#f2eee8" stroke-width="2.4" stroke-linecap="round"/>`; }
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <defs><radialGradient id="${g}iris" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="#e4ffb8"/><stop offset=".55" stop-color="#6cc848"/><stop offset="1" stop-color="#2a6a1e"/></radialGradient>
      <radialGradient id="${g}chest" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfc8c0"/></radialGradient></defs>
      <path d="M48 66 C96 62 104 14 82 -2 C76 -6 70 0 76 6 C90 22 80 52 46 54Z" fill="${col}"/>
      <path d="M-58 72 C-68 18 -46 -12 0 -14 C46 -12 68 18 58 72 Z" fill="${col}"/>${fur}${sheen}
      <ellipse cx="-22" cy="70" rx="13" ry="7" fill="#2c2c33"/><ellipse cx="22" cy="70" rx="13" ry="7" fill="#2c2c33"/>
      <circle cx="0" cy="-48" r="44" fill="${col}"/>
      <path d="M-40 -64 L-36 -112 L-8 -84 Z" fill="${col}"/><path d="M40 -64 L36 -112 L8 -84 Z" fill="${col}"/>
      <path d="M-33 -72 L-31 -100 L-15 -82 Z" fill="#c87a8a" opacity=".75"/><path d="M33 -72 L31 -100 L15 -82 Z" fill="#c87a8a" opacity=".75"/>
      <path d="M-34 -96 l-3 -8 M-30 -92 l-1 -9 M34 -96 l3 -8 M30 -92 l1 -9" stroke="#eee" stroke-width="1" opacity=".6"/>
      <ellipse cx="-17" cy="-50" rx="10" ry="12" fill="url(#${g}iris)"/><ellipse cx="17" cy="-50" rx="10" ry="12" fill="url(#${g}iris)"/>
      <ellipse cx="-17" cy="-49" rx="3.4" ry="10" fill="#0a0a0a"/><ellipse cx="17" cy="-49" rx="3.4" ry="10" fill="#0a0a0a"/>
      <circle cx="-13.5" cy="-55" r="2.6" fill="#fff"/><circle cx="20.5" cy="-55" r="2.6" fill="#fff"/><circle cx="-19" cy="-44" r="1" fill="#fff" opacity=".7"/><circle cx="15" cy="-44" r="1" fill="#fff" opacity=".7"/>
      <path d="M-28 -60 Q-17 -66 -6 -60 M6 -60 Q17 -66 28 -60" stroke="#111" stroke-width="2" fill="none"/>
      <path d="M-5 -31 Q0 -28 5 -31 L0 -25 Z" fill="#e58a9a"/>
      <path d="M0 -25 Q-6 -17 -12 -20 M0 -25 Q6 -17 12 -20" stroke="#111" stroke-width="1.8" fill="none"/>
      <path d="M-14 -27 L-60 -36 M-14 -23 L-60 -22 M-14 -19 L-56 -8 M14 -27 L60 -36 M14 -23 L60 -22 M14 -19 L56 -8" stroke="#eee" stroke-width="1" opacity=".75"/>
      <path d="M-56 60 C-64 10 -44 -30 -30 -40 C-46 -60 -44 -84 -30 -88" stroke="${rim}" stroke-width="3" fill="none" opacity=".55" filter="url(#${g}b1)"/>
    </g>`;
  }

  return {
    /* ======================================================================
       PHOTOS — chaque image est « photographiée » : lumière, profondeur de
       champ, grain du capteur, vignettage. Aléatoire déterministe par image.
       ====================================================================== */

    /* Fond d'écran verrouillé : anniversaire de Kafka (le code est sur la guirlande) */
    kafka() {
      const g = uid(), R = seeded(7);
      const P0 = [62, 120], P1 = [150, 168], P2 = [238, 120];
      const chars = ['2', '2', '·', '0', '9'];
      let flags = '';
      chars.forEach((c, i) => {
        const t = 0.12 + i * 0.19;
        const x = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
        const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
        const col = ['#ffd84a', '#ff7aa8', '#8be3ff', '#b6ff8b', '#c9a6ff'][i];
        const rot = (t - .5) * 26;
        flags += `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-13 0 L13 0 L0 30 Z" fill="${col}"/><path d="M0 0 L13 0 L0 30 Z" fill="#000" opacity=".12"/><path d="M-13 0 L13 0" stroke="#fff" stroke-width="1" opacity=".5"/><text y="16" font-family="Arial Black,Arial" font-weight="900" font-size="13" text-anchor="middle" fill="#3a1830">${c}</text></g>`;
      });
      let bokeh = '';
      for (let i = 0; i < 26; i++) { const c = ['#ffcf7a', '#ff9a6a', '#ffe9b0', '#ff7aa8'][i % 4]; bokeh += `<circle cx="${R() * 300}" cy="${R() * 250}" r="${5 + R() * 16}" fill="${c}" opacity="${0.12 + R() * 0.3}"/>`; }
      let lights = '';
      for (let i = 0; i < 12; i++) { const x = 10 + i * 26, y = 60 + Math.sin(i * .8) * 10; lights += `<circle cx="${x}" cy="${y}" r="10" fill="#ffd27a" opacity=".55" filter="url(#${g}b8)"/><circle cx="${x}" cy="${y}" r="2.2" fill="#fff6d8"/>`; }
      let conf = '';
      for (let i = 0; i < 26; i++) conf += `<rect x="${R() * 300}" y="${330 + R() * 70}" width="${3 + R() * 4}" height="${2 + R() * 3}" fill="${['#ffd84a', '#ff7aa8', '#8be3ff', '#c9a6ff'][i % 4]}" transform="rotate(${R() * 180} ${R() * 300} ${360})" opacity=".9"/>`;
      return svg(300, 400, `<defs>${defs(g)}
        <radialGradient id="${g}bg" cx="28%" cy="30%" r="90%"><stop offset="0" stop-color="#ffb47a"/><stop offset=".35" stop-color="#b8456a"/><stop offset=".75" stop-color="#3a1634"/><stop offset="1" stop-color="#140818"/></radialGradient>
        <linearGradient id="${g}tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3b26"/><stop offset="1" stop-color="#1e0f0a"/></linearGradient>
        <linearGradient id="${g}ck" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8c8a8"/><stop offset=".45" stop-color="#fff0dc"/><stop offset="1" stop-color="#c8a080"/></linearGradient>
        <linearGradient id="${g}ht" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5a8f"/><stop offset=".55" stop-color="#ff9ab8"/><stop offset="1" stop-color="#d63a6a"/></linearGradient>
        <radialGradient id="${g}fl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4c0"/><stop offset=".3" stop-color="#ffcf5a" stop-opacity=".8"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient></defs>
        <rect width="300" height="400" fill="url(#${g}bg)"/>
        <g filter="url(#${g}b8)">${bokeh}</g>
        <rect x="222" y="20" width="70" height="150" rx="4" fill="#1a2440" opacity=".55" filter="url(#${g}b3)"/>
        ${Array.from({ length: 9 }, () => `<circle cx="${230 + R() * 55}" cy="${40 + R() * 120}" r="${1 + R() * 2}" fill="#ffd9a0" opacity=".7" filter="url(#${g}b1)"/>`).join('')}
        ${lights}
        <path d="M${P0} Q${P1} ${P2}" stroke="#fff" stroke-width="1.4" fill="none" opacity=".85"/>${flags}
        <rect y="322" width="300" height="78" fill="url(#${g}tb)"/>
        <path d="M0 322 H300" stroke="#a0663a" stroke-width="1.5" opacity=".6"/>
        ${catSit(150, 262, .92, { g, r: R, rim: '#ffb47a' })}
        <g transform="translate(150 184) rotate(-10) scale(.86) translate(-150 -214)"><path d="M120 214 L150 140 L180 214 Q150 224 120 214Z" fill="url(#${g}ht)"/>
          <path d="M131 188 Q150 194 169 188 M139 166 Q150 170 161 166" stroke="#ffe066" stroke-width="5" fill="none"/>
          ${Array.from({ length: 6 }, (_, i) => `<circle cx="${135 + i * 6}" cy="${205 - (i % 2) * 6}" r="2" fill="#fff" opacity=".8"/>`).join('')}
          <circle cx="150" cy="140" r="9" fill="#ffe066"/><circle cx="147" cy="137" r="3" fill="#fff" opacity=".7"/></g>
        <ellipse cx="150" cy="368" rx="70" ry="10" fill="#000" opacity=".45" filter="url(#${g}b3)"/>
        <ellipse cx="150" cy="362" rx="66" ry="11" fill="#f4f0ea"/>
        <rect x="100" y="320" width="100" height="40" fill="url(#${g}ck)"/><ellipse cx="150" cy="360" rx="50" ry="7" fill="#c8a080"/>
        <ellipse cx="150" cy="320" rx="50" ry="8" fill="#ff8ab0"/>
        <path d="M100 320 q0 12 6 12 q6 0 6 -8 q2 14 9 14 q7 0 7 -10 q3 10 9 10 q6 0 6 -12 q3 16 10 16 q7 0 7 -12 q2 8 8 8 q6 0 6 -8 q2 12 8 12 q6 0 6 -12Z" fill="#ff8ab0"/>
        ${Array.from({ length: 14 }, () => `<rect x="${106 + R() * 88}" y="${314 + R() * 10}" width="4" height="1.6" rx=".8" fill="${['#fff', '#ffe066', '#8be3ff'][Math.floor(R() * 3)]}" transform="rotate(${R() * 180} 150 318)"/>`).join('')}
        <text x="150" y="314" font-family="Arial Black,Arial" font-size="30" font-weight="900" text-anchor="middle" fill="#ffd84a" stroke="#a0402a" stroke-width="1.5">3</text>
        <circle cx="150" cy="278" r="30" fill="url(#${g}fl)" filter="url(#${g}b3)"/>
        <path d="M150 290 q-6 -9 0 -18 q6 9 0 18" fill="#ffcf4a"/><path d="M150 288 q-2.5 -5 0 -10 q2.5 5 0 10" fill="#fff8d8"/>
        ${conf}
        ${finish(g, 300, 400, { grain: .45, vig: .9 })}`);
    },

    /* Fond d'écran accueil */
    homewall() {
      const g = uid(), g2 = uid();
      return svg(390, 844, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1640"/><stop offset=".55" stop-color="#3b1d4a"/><stop offset="1" stop-color="#0d0a18"/></linearGradient>
        <radialGradient id="${g2}" cx="70%" cy="30%" r="60%"><stop offset="0" stop-color="#ff7a9a" stop-opacity=".55"/><stop offset="1" stop-color="#ff7a9a" stop-opacity="0"/></radialGradient></defs>
        <rect width="390" height="844" fill="url(#${g})"/><rect width="390" height="844" fill="url(#${g2})"/>
        <circle cx="80" cy="640" r="220" fill="#6c5bff" opacity=".18"/><circle cx="330" cy="760" r="160" fill="#2ac2ff" opacity=".1"/>`);
    },

    /* Kafka contre l'aspirateur : lumière du matin, parquet */
    kafkaVacuum() {
      const g = uid(), R = seeded(11);
      let planks = '';
      for (let i = -6; i < 14; i++) { const x0 = 200 + i * 60, x1 = 200 + i * 22; const c = ['#9a6a42', '#8a5c38', '#a47448', '#7e5232'][((i % 4) + 4) % 4]; planks += `<path d="M${x1} 250 L${x1 + 22} 250 L${x0 + 60} 400 L${x0} 400Z" fill="${c}"/><path d="M${x1} 250 L${x0} 400" stroke="#4a2e1a" stroke-width="1.2" opacity=".6"/>`; }
      let grainW = ''; for (let i = 0; i < 40; i++) { const x = R() * 400, y = 260 + R() * 140; grainW += `<path d="M${x} ${y} q20 ${R() * 4 - 2} 40 0" stroke="#5a3a22" stroke-width=".8" fill="none" opacity=".35"/>`; }
      let spikes = '';
      for (let i = 0; i <= 24; i++) { const t = i / 24, x = -66 + t * 120, y = -30 - Math.sin(t * Math.PI) * 44; const a = -Math.PI / 2 + (t - .5) * 1.6; spikes += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * (8 + R() * 6)).toFixed(1)} ${(Math.sin(a) * (8 + R() * 6)).toFixed(1)}" stroke="#2a2a30" stroke-width="3.2" stroke-linecap="round"/>`; }
      let tail = ''; for (let i = 0; i < 26; i++) { const t = i / 26, x = -70 - Math.sin(t * 2.6) * 34, y = 20 - t * 96; tail += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(R() * 16 - 8).toFixed(1)} ${(R() * 10 - 5).toFixed(1)}" stroke="#2a2a30" stroke-width="5" stroke-linecap="round"/>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e6d2"/><stop offset="1" stop-color="#cdb79a"/></linearGradient>
        <linearGradient id="${g}vac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a6a"/><stop offset=".5" stop-color="#d42a40"/><stop offset="1" stop-color="#8a1426"/></linearGradient>
        <linearGradient id="${g}sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".85"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></linearGradient>
        <radialGradient id="${g}eye" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e4ffb8"/><stop offset=".7" stop-color="#6cc848"/><stop offset="1" stop-color="#2a6a1e"/></radialGradient></defs>
        <rect width="400" height="260" fill="url(#${g}wall)"/>
        <rect x="270" y="10" width="110" height="150" fill="#dfefff"/><path d="M325 10 V160 M270 85 H380" stroke="#f8f4ec" stroke-width="6"/><rect x="266" y="6" width="118" height="158" fill="none" stroke="#f8f4ec" stroke-width="8"/>
        <path d="M150 0 Q170 120 160 250" stroke="#e6d2b2" stroke-width="40" opacity=".5" filter="url(#${g}b8)"/>
        <rect y="244" width="400" height="16" fill="#efe4d2"/><rect y="256" width="400" height="4" fill="#bca482"/>
        ${planks}${grainW}
        <polygon points="270,160 380,160 340,400 120,400" fill="url(#${g}sun)" opacity=".55" filter="url(#${g}b3)"/>
        <polygon points="380,0 420,0 420,400 240,400" fill="#fff6dc" opacity=".12" filter="url(#${g}b20)"/>
        <ellipse cx="298" cy="318" rx="62" ry="10" fill="#000" opacity=".35" filter="url(#${g}b3)"/>
        <g filter="url(#${g}b1)"><rect x="246" y="222" width="104" height="90" rx="30" fill="url(#${g}vac)"/>
        <path d="M262 236 q40 -14 80 0" stroke="#fff" stroke-width="4" opacity=".45" fill="none" stroke-linecap="round"/>
        <rect x="262" y="250" width="70" height="26" rx="12" fill="#2a1418" opacity=".55"/><circle cx="318" cy="263" r="5" fill="#7dffa0"/>
        <circle cx="266" cy="312" r="13" fill="#1a1a1e"/><circle cx="266" cy="312" r="5" fill="#555"/><circle cx="332" cy="312" r="13" fill="#1a1a1e"/><circle cx="332" cy="312" r="5" fill="#555"/>
        <path d="M252 262 C200 250 196 170 228 128" stroke="#2c2c30" stroke-width="11" fill="none" stroke-linecap="round"/>
        <path d="M252 262 C200 250 196 170 228 128" stroke="#555" stroke-width="11" stroke-dasharray="2 5" fill="none"/>
        <rect x="221" y="44" width="13" height="88" rx="6" fill="#b8b8c0"/><rect x="216" y="30" width="24" height="20" rx="6" fill="#2c2c30"/></g>
        ${[0, 1, 2].map(i => `<path d="M${236 - i * 10} ${210 + i * 14} q-14 -4 -26 2" stroke="#6a5a4a" stroke-width="2" fill="none" opacity=".5"/>`).join('')}
        <ellipse cx="120" cy="320" rx="80" ry="10" fill="#000" opacity=".35" filter="url(#${g}b3)"/>
        <g transform="translate(118 268)">${tail}
          <path d="M-74 46 C-82 -10 -50 -76 -6 -74 C40 -72 62 -20 56 46 L44 46 C40 10 30 -10 10 -10 C-14 -10 -40 8 -50 46Z" fill="#2a2a30"/>
          ${spikes}
          <path d="M-60 46 L-66 46 L-62 6 Z M-36 46 L-44 46 L-40 12Z" fill="#2a2a30"/><path d="M34 46 L44 46 L44 8Z M52 46 L60 46 L58 10Z" fill="#2a2a30"/>
          
          <circle cx="66" cy="-36" r="34" fill="#2a2a30"/>
          <path d="M42 -52 L30 -76 L58 -64Z M88 -56 L104 -74 L98 -42Z" fill="#2a2a30"/><path d="M44 -56 L37 -70 L53 -63Z" fill="#c87a8a" opacity=".6"/>
          
          <ellipse cx="58" cy="-40" rx="9" ry="10" fill="url(#${g}eye)"/><ellipse cx="82" cy="-40" rx="9" ry="10" fill="url(#${g}eye)"/>
          <circle cx="58" cy="-39" r="6.5" fill="#111"/><circle cx="82" cy="-39" r="6.5" fill="#111"/><circle cx="60" cy="-43" r="2" fill="#fff"/><circle cx="84" cy="-43" r="2" fill="#fff"/>
          <path d="M60 -16 Q70 -6 80 -16 Q76 -2 70 -2 Q64 -2 60 -16Z" fill="#5a1a22"/><path d="M63 -15 l2 7 l2 -6 M73 -15 l2 7 l2 -6" fill="#fff"/>
          <path d="M66 -24 l4 3 l4 -3Z" fill="#d88a9a"/>
          <path d="M50 -22 L22 -28 M50 -18 L24 -14 M90 -22 L118 -30 M90 -18 L118 -14" stroke="#ddd" stroke-width="1" opacity=".75"/>
          <path d="M-70 -20 C-60 -70 -10 -82 30 -66" stroke="#ffe8c0" stroke-width="2.5" fill="none" opacity=".45" filter="url(#${g}b1)"/></g>
        ${finish(g, 400, 400, { grain: .35, vig: .55 })}`);
    },

    /* Polaroïd numérisé : Nora et Luna (chaton tigré gris), 2004 */
    biscotte() {
      const g = uid(), R = seeded(5);
      let paper = ''; for (let i = 0; i < 60; i++) paper += `<circle cx="${R() * 400}" cy="${R() * 400}" r="${R() * 1.2}" fill="#8a7a60" opacity=".35"/>`;
      let dots = ''; for (let y = 50; y < 300; y += 22) for (let x = 64; x < 340; x += 22) dots += `<g transform="translate(${x + ((y / 22) % 2) * 11} ${y})"><circle r="3" fill="#e0a0a0"/><circle r="1.2" fill="#f6e0a0"/></g>`;
      let stripes = ''; for (let i = 0; i < 6; i++) stripes += `<path d="M126 ${250 + i * 9} H274" stroke="#f4f0e8" stroke-width="4"/>`;
      return svg(400, 400, `<defs>${defs(g)}
        <filter id="${g}old"><feColorMatrix type="matrix" values=".78 .16 .04 0 .07  .08 .78 .08 0 .05  .06 .14 .64 0 .05  0 0 0 1 0"/></filter>
        <radialGradient id="${g}flash" cx="52%" cy="45%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
        <radialGradient id="${g}skin" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#ffe2c8"/><stop offset="1" stop-color="#e8a880"/></radialGradient>
        <radialGradient id="${g}kit" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#b4b4bc"/><stop offset="1" stop-color="#6e6e78"/></radialGradient>
        <radialGradient id="${g}keye" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#c8f4ec"/><stop offset=".55" stop-color="#5ab8c0"/><stop offset="1" stop-color="#3a8a6a"/></radialGradient>
        <linearGradient id="${g}leak" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a2a" stop-opacity=".65"/><stop offset=".4" stop-color="#ffb060" stop-opacity="0"/></linearGradient></defs>
        <rect width="400" height="400" fill="#e9e4da"/>${paper}
        <g transform="rotate(-3 200 200)">
        <rect x="44" y="30" width="320" height="356" fill="#000" opacity=".25" filter="url(#${g}b8)"/>
        <rect x="40" y="24" width="320" height="356" fill="#fbf8f1"/><rect x="40" y="24" width="320" height="356" fill="none" stroke="#e4dccb"/>
        <g filter="url(#${g}old)"><clipPath id="${g}cl"><rect x="60" y="44" width="280" height="256"/></clipPath><g clip-path="url(#${g}cl)">
          <rect x="60" y="44" width="280" height="256" fill="#f2d6c0"/>${dots}
          <rect x="250" y="60" width="70" height="96" fill="#5a8ac8"/><rect x="256" y="66" width="58" height="84" fill="#ffd84a"/><circle cx="285" cy="100" r="18" fill="#ff7a4a"/><text x="285" y="138" font-family="Arial" font-weight="900" font-size="11" fill="#2a3a8a" text-anchor="middle">POP!</text>
          <rect x="60" y="240" width="280" height="60" fill="#8a6aa0"/><path d="M60 246 Q200 230 340 246" stroke="#a88ac0" stroke-width="10" fill="none"/>
          <path d="M120 300 C118 252 150 234 200 234 C250 234 282 252 280 300Z" fill="#d6404a"/>${stripes}
          <path d="M146 150 C140 196 150 220 162 226 L238 226 C250 220 260 196 254 150Z" fill="#4a2a12"/>
          <ellipse cx="200" cy="160" rx="52" ry="58" fill="url(#${g}skin)"/>
          <defs><linearGradient id="${g}hairG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4a22"/><stop offset="1" stop-color="#3e220c"/></linearGradient><clipPath id="${g}fr"><path d="M146 154 C143 104 174 91 200 91 C226 91 257 104 254 154 C251 143 247 138 241 141 C233 133 223 139 214 135 C206 141 196 135 188 139 C178 133 168 141 160 137 C154 143 150 147 146 154Z"/></clipPath></defs>
          <path d="M146 154 C143 104 174 91 200 91 C226 91 257 104 254 154 C251 143 247 138 241 141 C233 133 223 139 214 135 C206 141 196 135 188 139 C178 133 168 141 160 137 C154 143 150 147 146 154Z" fill="url(#${g}hairG)"/>
          <g clip-path="url(#${g}fr)"><path d="M200 96 Q172.5 110 150.0 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q179.4 110 162.5 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q186.2 110 175.0 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q193.1 110 187.5 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q200.0 110 200.0 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q206.9 110 212.5 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q213.8 110 225.0 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q220.6 110 237.5 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M200 96 Q227.5 110 250.0 140" stroke="#3a1e0a" stroke-width="1.3" fill="none" opacity=".4"/><path d="M160 113 Q200 99 238 113" stroke="#a0703c" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/></g>
          <ellipse cx="180" cy="158" rx="6" ry="7" fill="#2a1a0a"/><ellipse cx="220" cy="158" rx="6" ry="7" fill="#2a1a0a"/><circle cx="182" cy="155" r="2" fill="#fff"/><circle cx="222" cy="155" r="2" fill="#fff"/>
          <path d="M170 146 q10 -6 20 0 M210 146 q10 -6 20 0" stroke="#4a2a12" stroke-width="2.5" fill="none"/>
          <path d="M178 186 Q200 206 222 186 Q200 196 178 186Z" fill="#a0302a"/><path d="M186 188 h28" stroke="#fff" stroke-width="3"/>
          <circle cx="166" cy="178" r="10" fill="#ff8a8a" opacity=".45"/><circle cx="234" cy="178" r="10" fill="#ff8a8a" opacity=".45"/>
          <g transform="translate(200 268) scale(1.35) translate(-200 -262)"><ellipse cx="200" cy="276" rx="38" ry="22" fill="url(#${g}kit)"/>
          ${[0, 1, 2, 3].map(i => `<path d="M${176 + i * 14} 262 q4 12 0 26" stroke="#4e4e56" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}
          <path d="M184 230 L178 204 L196 224Z M216 230 L222 204 L204 224Z" fill="#8c8c94"/><path d="M185 226 L181 210 L192 223Z M215 226 L219 210 L208 223Z" fill="#e8aab4"/>
          <circle cx="200" cy="244" r="23" fill="url(#${g}kit)"/>
          <path d="M193 233 L196 226 L200 231 L204 226 L207 233" stroke="#4e4e56" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M178 240 q6 2 9 0 M178 247 q6 2 9 0 M222 240 q-6 2 -9 0 M222 247 q-6 2 -9 0" stroke="#4e4e56" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M188 258 q12 8 24 0 q-2 8 -12 8 q-10 0 -12 -8Z" fill="#d8d8de"/>
          <ellipse cx="191" cy="243" rx="6.4" ry="7.2" fill="url(#${g}keye)"/><ellipse cx="209" cy="243" rx="6.4" ry="7.2" fill="url(#${g}keye)"/>
          <circle cx="191" cy="244" r="3" fill="#111"/><circle cx="209" cy="244" r="3" fill="#111"/><circle cx="193" cy="240.5" r="1.6" fill="#fff"/><circle cx="211" cy="240.5" r="1.6" fill="#fff"/>
          <path d="M197.5 252 h5 l-2.5 3Z" fill="#e88a9a"/><path d="M200 255 q-3 4 -6 2 M200 255 q3 4 6 2" stroke="#3a3a40" stroke-width="1.2" fill="none"/>
          <path d="M190 254 L170 250 M190 257 L172 259 M210 254 L230 250 M210 257 L228 259" stroke="#fff" stroke-width=".8"/>
          <ellipse cx="191" cy="294" rx="6" ry="4" fill="#9a9aa2"/><ellipse cx="209" cy="294" rx="6" ry="4" fill="#9a9aa2"/>
          </g><ellipse cx="160" cy="276" rx="18" ry="11" fill="url(#${g}skin)"/><ellipse cx="240" cy="276" rx="18" ry="11" fill="url(#${g}skin)"/>
          <rect x="60" y="44" width="280" height="256" fill="url(#${g}flash)"/>
        </g></g>
        <rect x="60" y="44" width="280" height="256" fill="url(#${g}leak)"/>
        ${Array.from({ length: 14 }, () => `<circle cx="${60 + R() * 280}" cy="${44 + R() * 256}" r="${R() * 1.5}" fill="#fff" opacity=".7"/>`).join('')}
        <path d="M${80 + R() * 200} 44 l${R() * 20 - 10} 256" stroke="#fff" stroke-width=".6" opacity=".35"/>
        <text x="200" y="348" font-family="Caveat,cursive" font-size="34" fill="#2a3a8a" text-anchor="middle" transform="rotate(-1 200 348)">Moi &amp; Luna — 2004 ♥</text></g>
        ${finish(g, 400, 400, { grain: .25, vig: .25 })}`);
    },

    /* Premier jour chez Lumen, 2023 */
    bureau() {
      const g = uid(), R = seeded(23);
      let city = ''; let x = 0; while (x < 400) { const w = 18 + R() * 36, hh = 40 + R() * 90; city += `<rect x="${x}" y="${150 - hh}" width="${w}" height="${hh}" fill="#b8c8d8" opacity=".8"/>`; for (let k = 0; k < 5; k++) city += `<rect x="${x + 4 + R() * (w - 8)}" y="${150 - hh + 6 + R() * (hh - 12)}" width="3" height="4" fill="#e8f0f8"/>`; x += w + 2; }
      let leaves = ''; for (let i = 0; i < 7; i++) { const a = -2.4 + i * .55, l = 50 + R() * 26; leaves += `<path d="M44 266 Q${44 + Math.cos(a) * l * .5 - 14} ${266 + Math.sin(a) * l * .5} ${44 + Math.cos(a) * l} ${266 + Math.sin(a) * l} Q${44 + Math.cos(a) * l * .5 + 14} ${266 + Math.sin(a) * l * .5} 44 266Z" fill="${i % 2 ? '#2f7a44' : '#3a8a50'}"/><path d="M44 266 L${44 + Math.cos(a) * l * .9} ${266 + Math.sin(a) * l * .9}" stroke="#1f5a30" stroke-width="1.2"/>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe2f4"/><stop offset="1" stop-color="#f4f6f8"/></linearGradient>
        <linearGradient id="${g}desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8d2b0"/><stop offset="1" stop-color="#b8946a"/></linearGradient>
        <radialGradient id="${g}scr" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3a2b8a"/><stop offset="1" stop-color="#0e0a26"/></radialGradient>
        <radialGradient id="${g}glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#d9d2ff"/><stop offset=".4" stop-color="#8b7bff" stop-opacity=".6"/><stop offset="1" stop-color="#8b7bff" stop-opacity="0"/></radialGradient></defs>
        <rect width="400" height="270" fill="url(#${g}sky)"/>
        <g filter="url(#${g}b3)">${city}<rect y="150" width="400" height="120" fill="#e4e8ec"/>
          ${[0, 1, 2, 3].map(i => `<rect x="${20 + i * 100}" y="170" width="70" height="40" rx="4" fill="#cfd6dc"/><circle cx="${55 + i * 100}" cy="160" r="9" fill="#a0a8b0"/>`).join('')}</g>
        ${[0, 100, 200, 300, 400].map(xx => `<rect x="${xx - 4}" y="0" width="8" height="270" fill="#8a96a2"/>`).join('')}
        <rect y="0" width="400" height="10" fill="#7a8692"/>
        <rect y="262" width="400" height="138" fill="url(#${g}desk)"/><path d="M0 262 H400" stroke="#8a6a44" stroke-width="3"/>
        <ellipse cx="185" cy="292" rx="110" ry="10" fill="#000" opacity=".2" filter="url(#${g}b3)"/>
        <rect x="170" y="236" width="30" height="40" fill="#2a2a32"/><rect x="132" y="272" width="106" height="10" rx="4" fill="#2a2a32"/>
        <rect x="74" y="90" width="222" height="150" rx="10" fill="#18181e"/><rect x="82" y="98" width="206" height="134" rx="3" fill="url(#${g}scr)"/>
        <circle cx="185" cy="152" r="40" fill="url(#${g}glow)"/><circle cx="185" cy="152" r="14" fill="#efeaff"/>
        <circle cx="185" cy="152" r="24" fill="none" stroke="#8b7bff" stroke-width="1.2" opacity=".7"/><circle cx="185" cy="152" r="33" fill="none" stroke="#8b7bff" stroke-width="1" opacity=".35"/>
        <text x="185" y="208" font-family="Inter,Arial" font-weight="800" letter-spacing="6" font-size="14" fill="#efeaff" text-anchor="middle">LUMEN</text>
        <text x="185" y="222" font-family="Inter,Arial" font-size="7.5" fill="#b8b0e8" text-anchor="middle">Ne rentrez plus jamais seule.</text>
        <path d="M82 98 L170 98 L82 180Z" fill="#fff" opacity=".06"/>
        <g transform="rotate(7 286 116)"><rect x="262" y="92" width="48" height="48" fill="#000" opacity=".15" transform="translate(2 3)"/><rect x="262" y="92" width="48" height="48" fill="#ffe66a"/>
          <text x="286" y="112" font-family="Caveat,cursive" font-size="14" fill="#333" text-anchor="middle">rentrer</text><text x="286" y="128" font-family="Caveat,cursive" font-size="14" fill="#333" text-anchor="middle">seule ? ✗</text></g>
        <g transform="rotate(-5 92 104)"><rect x="70" y="84" width="40" height="40" fill="#ff9ac0"/><text x="90" y="108" font-family="Caveat,cursive" font-size="16" fill="#333" text-anchor="middle">J1 !!</text></g>
        <path d="M318 214 q-6 -16 2 -28 q-8 -14 0 -24" stroke="#fff" stroke-width="3" fill="none" opacity=".5" filter="url(#${g}b1)"/>
        <rect x="304" y="222" width="40" height="58" rx="5" fill="#fbfbfb"/><path d="M344 236 q18 6 0 28" stroke="#fbfbfb" stroke-width="7" fill="none"/><rect x="304" y="270" width="40" height="10" fill="#e8e8e8"/>
        <text x="324" y="252" font-family="Inter,Arial" font-size="8" fill="#8b7bff" text-anchor="middle" font-weight="800" letter-spacing="1">LUMEN</text>
        <path d="M220 300 q30 16 80 6" stroke="#6b4fc5" stroke-width="4" fill="none"/><rect x="290" y="296" width="54" height="34" rx="4" fill="#fff" transform="rotate(-8 317 313)"/>
        <g transform="rotate(-8 317 313)"><rect x="296" y="302" width="14" height="16" fill="#c56b9b"/><text x="314" y="311" font-family="Inter,Arial" font-size="6" font-weight="700" fill="#222">Nora V.</text><text x="314" y="320" font-family="Inter,Arial" font-size="5" fill="#666">Data Science</text></g>
        ${leaves}<rect x="26" y="262" width="38" height="36" rx="4" fill="#d8784a"/><rect x="26" y="262" width="38" height="6" fill="#b85a30"/>
        ${finish(g, 400, 400, { grain: .25, vig: .45 })}`);
    },

    /* Ouessant, 2019 — le phare et le bout du monde */
    ouessant() {
      const g = uid(), R = seeded(3);
      let glit = ''; for (let i = 0; i < 70; i++) { const y = 252 + Math.pow(R(), 1.6) * 140, sp = 12 + (y - 252) * .9; glit += `<rect x="${112 + (R() - .5) * sp}" y="${y}" width="${4 + R() * 14}" height="${1 + R() * 1.6}" rx="1" fill="#ffe8b0" opacity="${.35 + R() * .6}"/>`; }
      let waves = ''; for (let i = 0; i < 26; i++) { const y = 256 + i * 6 + R() * 4; waves += `<path d="M${R() * 400} ${y} q${10 + R() * 20} -2 ${30 + R() * 30} 0" stroke="#7aa0c8" stroke-width="1" fill="none" opacity=".25"/>`; }
      let heather = ''; for (let i = 0; i < 90; i++) { const x = R() * 400, y = 330 + R() * 70; if (x > 150 && x < 230 && y < 350) continue; heather += `<circle cx="${x}" cy="${y}" r="${1 + R() * 2.2}" fill="${['#a05aa0', '#c07ac0', '#7a3a7a', '#d8a040'][Math.floor(R() * 4)]}" opacity=".85"/>`; }
      let grass = ''; for (let i = 0; i < 60; i++) { const x = R() * 400, y = 340 + R() * 60; grass += `<path d="M${x} ${y} q${R() * 6 - 3} -8 ${R() * 8 - 4} -14" stroke="#3a4a2a" stroke-width="1.2" fill="none"/>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a6a"/><stop offset=".3" stop-color="#6a3a7a"/><stop offset=".5" stop-color="#e0706a"/><stop offset=".6" stop-color="#ffb070"/><stop offset=".64" stop-color="#ffe0a0"/></linearGradient>
        <linearGradient id="${g}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5a8a"/><stop offset=".25" stop-color="#2a3a6a"/><stop offset="1" stop-color="#0a1430"/></linearGradient>
        <radialGradient id="${g}sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff8e0"/><stop offset=".25" stop-color="#ffe0a0"/><stop offset=".6" stop-color="#ffa060" stop-opacity=".5"/><stop offset="1" stop-color="#ff7050" stop-opacity="0"/></radialGradient>
        <linearGradient id="${g}beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6c8" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient>
        <linearGradient id="${g}tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8b8b0"/><stop offset=".4" stop-color="#fff4ec"/><stop offset="1" stop-color="#a89890"/></linearGradient>
        <linearGradient id="${g}band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a10"/><stop offset=".4" stop-color="#2a2a34"/><stop offset="1" stop-color="#050508"/></linearGradient>
        <linearGradient id="${g}rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a34"/><stop offset="1" stop-color="#120c14"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g}sky)"/>
        ${[[60, 70, 120, 6], [250, 50, 160, 5], [150, 120, 200, 7], [320, 140, 120, 5], [40, 170, 140, 4]].map(([x, y, w, hh]) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${hh}" fill="#ff9aa0" opacity=".5" filter="url(#${g}b3)"/><ellipse cx="${x}" cy="${y + 3}" rx="${w / 2.4}" ry="${hh / 2}" fill="#4a2a5a" opacity=".35" filter="url(#${g}b1)"/>`).join('')}
        <circle cx="112" cy="246" r="70" fill="url(#${g}sun)"/><circle cx="112" cy="246" r="20" fill="#fff8e0"/>
        <path d="M0 250 L60 249 L66 244 L80 245 L86 250 L400 250" fill="#2a2440"/>
        <rect y="250" width="400" height="150" fill="url(#${g}sea)"/>${waves}${glit}
        <path d="M280 250 L300 246 L318 247 L332 250Z" fill="#1a1428"/>
        <path d="M180 400 L196 330 C220 300 256 290 300 286 L330 270 L360 268 L400 262 L400 400Z" fill="url(#${g}rock)"/>
        <path d="M0 400 L0 330 C40 320 80 330 110 350 C130 362 150 380 160 400Z" fill="url(#${g}rock)"/>
        <path d="M196 330 C220 300 256 290 300 286" stroke="#ff9a70" stroke-width="2" fill="none" opacity=".5"/>
        <rect x="318" y="248" width="48" height="24" fill="#e8dcd4"/><path d="M314 250 L342 236 L370 250Z" fill="#5a4a52"/><rect x="326" y="256" width="7" height="9" fill="#ffd27a"/><rect x="346" y="256" width="7" height="9" fill="#ffd27a" opacity=".6"/>
        <polygon points="291,270 297,110 315,110 321,270" fill="url(#${g}tower)"/>
        ${[0, 1, 2, 3].map(i => { const y1 = 252 - i * 38, y0 = y1 - 18, w0 = 3 + (270 - y0) * .0375, w1 = 3 + (270 - y1) * .0375; return `<polygon points="${291 + (270 - y1) * .0375},${y1} ${291 + (270 - y0) * .0375},${y0} ${321 - (270 - y0) * .0375},${y0} ${321 - (270 - y1) * .0375},${y1}" fill="url(#${g}band)"/>`; }).join('')}
        <rect x="293" y="102" width="26" height="8" fill="#1a1a22"/><path d="M291 102 H321" stroke="#1a1a22" stroke-width="2"/>
        ${[294, 299, 304, 309, 314].map(xx => `<path d="M${xx} 96 V102" stroke="#1a1a22" stroke-width="1"/>`).join('')}
        <rect x="297" y="84" width="18" height="14" fill="#fff2b0"/><circle cx="306" cy="91" r="14" fill="#fff4c0" opacity=".7" filter="url(#${g}b3)"/>
        <path d="M296 84 Q306 72 316 84Z" fill="#1a1a22"/><path d="M306 72 V66" stroke="#1a1a22" stroke-width="1.5"/>
        <polygon points="306,91 0,40 0,120" fill="url(#${g}beam)" opacity=".35" transform="scale(-1 1) translate(-612 0)" filter="url(#${g}b3)"/>
        <polygon points="306,91 400,58 400,112" fill="url(#${g}beam)" opacity=".55" filter="url(#${g}b1)"/>
        ${heather}${grass}
        <g transform="translate(222 312)"><path d="M0 0 C-5 -24 -3 -42 6 -47 C15 -42 18 -24 13 0Z" fill="#1a1018"/><circle cx="6" cy="-53" r="7" fill="#1a1018"/>
          <path d="M-2 -46 C-18 -36 -22 -16 -16 -2 L0 -10Z" fill="#3a1a3a"/><path d="M0 -44 C-14 -42 -30 -40 -40 -34" stroke="#3a1a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M2 -58 C-8 -60 -16 -56 -22 -52" stroke="#5a5a6a" stroke-width="2" fill="none" opacity=".8"/></g>
        <g transform="translate(206 316)"><path d="M0 0 C-2 -14 0 -24 5 -26 C10 -24 12 -14 10 0Z" fill="#1a1018"/><circle cx="5" cy="-30" r="5" fill="#1a1018"/><path d="M8 -20 L18 -26" stroke="#1a1018" stroke-width="3" stroke-linecap="round"/></g>
        ${[[50, 120], [74, 132], [96, 112], [140, 96]].map(([x, y], i) => `<path d="M${x} ${y} q5 -${4 + i} 10 0 q5 -${4 + i} 10 0" stroke="#1a1428" stroke-width="1.8" fill="none"/>`).join('')}
        ${finish(g, 400, 400, { grain: .35, vig: .7 })}`);
    },

    /* Soirée « 1 million » chez Lumen */
    party() {
      const g = uid(), R = seeded(17);
      let conf = ''; for (let i = 0; i < 90; i++) { const x = R() * 400, y = R() * 330; conf += `<rect x="${x}" y="${y}" width="${3 + R() * 4}" height="${8 + R() * 10}" fill="${['#ff6b9a', '#8b7bff', '#ffd84a', '#5ae0ff', '#fff'][i % 5]}" transform="rotate(${R() * 180} ${x} ${y})" opacity="${.5 + R() * .5}"/>`; }
      let bokeh = ''; for (let i = 0; i < 30; i++) bokeh += `<circle cx="${R() * 400}" cy="${R() * 260}" r="${6 + R() * 22}" fill="${['#ff6b9a', '#8b7bff', '#5ae0ff', '#ffd84a'][i % 4]}" opacity="${.1 + R() * .25}"/>`;
      let crowd = ''; for (let i = 0; i < 12; i++) { const x = -10 + i * 38 + R() * 14, y = 330 + R() * 26, s = .8 + R() * .5; crowd += `<g transform="translate(${x} ${y}) scale(${s})"><circle r="17" fill="#07051a"/><path d="M-34 80 C-34 30 34 30 34 80Z" fill="#07051a"/>${R() > .55 ? `<path d="M18 20 L${32 + R() * 10} -40" stroke="#07051a" stroke-width="10" stroke-linecap="round"/><rect x="${26 + R() * 8}" y="-62" width="14" height="24" rx="3" fill="#cfe0ff"/><rect x="${26}" y="-62" width="14" height="24" rx="3" fill="#cfe0ff" opacity=".6" filter="url(#${g}b3)"/>` : ''}</g>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <radialGradient id="${g}bg" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#3a2b8a"/><stop offset=".6" stop-color="#140d38"/><stop offset="1" stop-color="#05040f"/></radialGradient>
        <linearGradient id="${g}cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9bfff" stop-opacity=".55"/><stop offset="1" stop-color="#c9bfff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${g}cone2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8ab0" stop-opacity=".5"/><stop offset="1" stop-color="#ff8ab0" stop-opacity="0"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g}bg)"/>
        <polygon points="80,0 110,0 220,400 -40,400" fill="url(#${g}cone)" filter="url(#${g}b8)"/>
        <polygon points="300,0 330,0 440,400 180,400" fill="url(#${g}cone2)" filter="url(#${g}b8)"/>
        <g filter="url(#${g}b8)">${bokeh}</g>
        <text x="200" y="160" font-family="Inter,Arial" font-weight="800" font-size="62" letter-spacing="12" text-anchor="middle" fill="none" stroke="#a99cff" stroke-width="9" opacity=".6" filter="url(#${g}b8)">LUMEN</text>
        <text x="200" y="160" font-family="Inter,Arial" font-weight="800" font-size="62" letter-spacing="12" text-anchor="middle" fill="none" stroke="#efeaff" stroke-width="2.5">LUMEN</text>
        <text x="200" y="214" font-family="Inter,Arial" font-weight="800" font-size="30" text-anchor="middle" fill="none" stroke="#ff8ab0" stroke-width="6" opacity=".6" filter="url(#${g}b3)">1 000 000</text>
        <text x="200" y="214" font-family="Inter,Arial" font-weight="800" font-size="30" text-anchor="middle" fill="#ffe0ec">1 000 000</text>
        <text x="200" y="240" font-family="Inter,Arial" font-size="11" letter-spacing="4" text-anchor="middle" fill="#c9bfff">UTILISATRICES EN SÉCURITÉ 💜</text>
        ${[[34, 44, '#ff6b9a'], [366, 40, '#8b7bff'], [76, 30, '#ffd84a'], [326, 72, '#5ae0ff']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="24" ry="30" fill="${c}" opacity=".9"/><ellipse cx="${x - 8}" cy="${y - 10}" rx="6" ry="9" fill="#fff" opacity=".45"/><path d="M${x} ${y + 30} l-3 6 h6z" fill="${c}"/><path d="M${x} ${y + 36} q8 30 -4 70" stroke="#fff" stroke-width="1" fill="none" opacity=".5"/>`).join('')}
        ${conf}${crowd}
        <g filter="url(#${g}b8)" opacity=".9"><path d="M346 300 L376 300 L366 350 L356 350Z" fill="#fff" opacity=".35"/><path d="M361 350 V392 M346 392 H376" stroke="#fff" stroke-width="3" opacity=".4"/></g>
        ${finish(g, 400, 400, { grain: .5, vig: .8 })}`);
    },

    /* 31 octobre, 5 h 40 : Kafka confié à la voisine (photo au flash) */
    voisine() {
      const g = uid(), R = seeded(31);
      let wood = ''; for (let i = 0; i < 40; i++) { const x = 116 + R() * 168; wood += `<path d="M${x} 22 q${R() * 6 - 3} 160 ${R() * 4 - 2} 326" stroke="#4a3018" stroke-width="${.5 + R()}" fill="none" opacity=".35"/>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <radialGradient id="${g}flash" cx="52%" cy="54%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".9"/></radialGradient>
        <linearGradient id="${g}door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a3818"/><stop offset=".5" stop-color="#7a5028"/><stop offset="1" stop-color="#4a2e14"/></linearGradient>
        <linearGradient id="${g}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfc0a0"/><stop offset="1" stop-color="#9a8a6a"/></linearGradient>
        <linearGradient id="${g}brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8e08a"/><stop offset="1" stop-color="#a07a20"/></linearGradient>
        <radialGradient id="${g}eye" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f8ffd0"/><stop offset=".5" stop-color="#b8ff6a"/><stop offset="1" stop-color="#3a8a20" stop-opacity=".2"/></radialGradient></defs>
        <rect width="400" height="400" fill="url(#${g}wall)"/>
        <rect y="290" width="400" height="110" fill="#6a5a48"/>${Array.from({ length: 8 }, (_, i) => `<path d="M0 ${300 + i * 14} H400" stroke="#4a3e30" stroke-width="1" opacity=".5"/>`).join('')}
        <path d="M20 400 L60 160 M44 400 L80 170" stroke="#2a2018" stroke-width="5"/><path d="M14 200 L90 150" stroke="#2a2018" stroke-width="8" stroke-linecap="round"/>
        <rect x="340" y="150" width="26" height="36" rx="4" fill="#e8e0d0"/><circle cx="353" cy="168" r="7" fill="#ff8a2a"/><circle cx="353" cy="168" r="14" fill="#ff8a2a" opacity=".35" filter="url(#${g}b3)"/>
        <rect x="104" y="14" width="192" height="338" fill="#3a2a1a"/>
        <rect x="112" y="22" width="176" height="330" fill="url(#${g}door)"/>${wood}
        <rect x="128" y="40" width="144" height="118" fill="none" stroke="#3a2412" stroke-width="3"/><rect x="132" y="44" width="136" height="110" fill="none" stroke="#8a6034" stroke-width="1" opacity=".6"/>
        <rect x="128" y="178" width="144" height="156" fill="none" stroke="#3a2412" stroke-width="3"/>
        <circle cx="200" cy="120" r="5" fill="url(#${g}brass)"/><circle cx="200" cy="120" r="2" fill="#222"/>
        <rect x="166" y="60" width="68" height="24" rx="2" fill="url(#${g}brass)"/><text x="200" y="77" font-family="Georgia,serif" font-size="12" font-weight="700" text-anchor="middle" fill="#3a2a0a" letter-spacing="2">BENALI</text>
        <text x="200" y="104" font-family="Georgia,serif" font-size="11" text-anchor="middle" fill="#e8d0a0">3e — G</text>
        <rect x="252" y="204" width="22" height="8" rx="3" fill="url(#${g}brass)"/><circle cx="263" cy="226" r="6" fill="url(#${g}brass)"/>
        <g transform="rotate(-5 222 238)"><rect x="190" y="206" width="70" height="66" fill="#000" opacity=".3" transform="translate(3 4)"/><rect x="190" y="206" width="70" height="66" fill="#fff07a"/><path d="M190 206 h70 v8 h-70z" fill="#f0dc5a"/>
          <text x="225" y="226" font-family="Caveat,cursive" font-size="13" text-anchor="middle" fill="#1a1a3a">Merci Mme B. ♥</text>
          <text x="225" y="242" font-family="Caveat,cursive" font-size="12" text-anchor="middle" fill="#1a1a3a">croquettes 2x/j</text>
          <text x="225" y="258" font-family="Caveat,cursive" font-size="12" text-anchor="middle" fill="#1a1a3a">je reviens vite</text></g>
        <rect x="120" y="344" width="160" height="30" rx="3" fill="#6a4a2a"/><text x="200" y="364" font-family="Arial" font-weight="900" font-size="12" letter-spacing="3" text-anchor="middle" fill="#3a2410">BIENVENUE</text>
        <ellipse cx="96" cy="384" rx="70" ry="10" fill="#000" opacity=".4" filter="url(#${g}b3)"/>
        <rect x="32" y="290" width="128" height="92" rx="16" fill="#8e8e96"/><rect x="32" y="290" width="128" height="26" rx="12" fill="#a8a8b0"/><rect x="70" y="282" width="52" height="14" rx="7" fill="#6e6e76"/>
        <rect x="48" y="324" width="96" height="50" rx="6" fill="#0a0a0c"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${54 + i * 13}" y="324" width="4" height="50" fill="#9a9aa2"/>`).join('')}
        <ellipse cx="88" cy="350" rx="7" ry="6" fill="url(#${g}eye)"/><ellipse cx="108" cy="350" rx="7" ry="6" fill="url(#${g}eye)"/><circle cx="88" cy="350" r="2" fill="#fff"/><circle cx="108" cy="350" r="2" fill="#fff"/>
        <rect x="292" y="320" width="74" height="56" rx="4" fill="#c8a060"/><rect x="292" y="320" width="74" height="12" fill="#a07a3a"/><circle cx="329" cy="352" r="12" fill="#ff7a4a"/><text x="329" y="356" font-family="Arial" font-size="9" font-weight="900" text-anchor="middle" fill="#fff">CAT</text>
        <rect width="400" height="400" fill="url(#${g}flash)"/>
        ${finish(g, 400, 400, { grain: .7, vig: .3 })}`);
    },

    /* 29 octobre, 22 h 14 : la voiture en bas de chez elle (zoom x3, pluie) */
    voiture() {
      const g = uid(), R = seeded(29);
      let drops = ''; for (let i = 0; i < 70; i++) { const x = R() * 400, y = R() * 400, r = 1 + R() * 4; drops += `<circle cx="${x}" cy="${y}" r="${r}" fill="#1a2030" opacity=".5"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .4}" fill="#ffd8a0" opacity=".45"/>`; }
      let streaks = ''; for (let i = 0; i < 14; i++) { const x = R() * 400, y = R() * 300; streaks += `<path d="M${x} ${y} q${R() * 4 - 2} 40 ${R() * 6 - 3} ${50 + R() * 60}" stroke="#8a90a0" stroke-width="${1 + R() * 1.5}" fill="none" opacity=".35"/>`; }
      let rain = ''; for (let i = 0; i < 60; i++) { const x = R() * 400, y = R() * 300; rain += `<path d="M${x} ${y} l-3 14" stroke="#ffcf8a" stroke-width="1" opacity="${.15 + R() * .3}"/>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="1" stop-color="#10141c"/></linearGradient>
        <radialGradient id="${g}lamp" cx="62%" cy="10%" r="70%"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".75"/><stop offset=".45" stop-color="#ff8a2a" stop-opacity=".18"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient>
        <linearGradient id="${g}wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1410"/><stop offset="1" stop-color="#05060a"/></linearGradient>
        <linearGradient id="${g}car" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3e48"/><stop offset=".5" stop-color="#1c1f26"/><stop offset="1" stop-color="#0c0d10"/></linearGradient>
        <filter id="${g}soft"><feGaussianBlur stdDeviation="1.8"/></filter></defs>
        <rect width="400" height="400" fill="url(#${g}bg)"/>
        <g filter="url(#${g}soft)">
          <rect y="0" width="400" height="200" fill="#0a0c12"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${20 + i * 48}" y="${40 + (i % 3) * 30}" width="18" height="24" fill="${i % 3 === 1 ? '#ffcf7a' : '#151820'}" opacity="${i % 3 === 1 ? .55 : 1}"/>`).join('')}
          <rect y="270" width="400" height="130" fill="url(#${g}wet)"/><rect y="256" width="400" height="16" fill="#1c1a18"/>
          <path d="M0 270 L400 270" stroke="#3a3228" stroke-width="2"/>
          <rect x="252" y="40" width="6" height="232" fill="#1a1a1a"/><path d="M255 46 q22 -4 30 12" stroke="#1a1a1a" stroke-width="5" fill="none"/><ellipse cx="284" cy="60" rx="13" ry="5" fill="#ffd090"/>
          <rect width="400" height="400" fill="url(#${g}lamp)"/>
          <ellipse cx="270" cy="340" rx="44" ry="50" fill="#ff9a3a" opacity=".1"/><path d="M250 290 l6 110 M300 290 l-4 110 M270 300 l2 100" stroke="#ffb060" stroke-width="5" opacity=".18"/>
          <path d="M104 286 C114 246 146 232 200 230 C256 228 294 244 314 286Z" fill="url(#${g}car)"/>
          <rect x="84" y="276" width="252" height="44" rx="14" fill="url(#${g}car)"/>
          <path d="M140 278 C152 256 172 248 200 247 C232 247 260 256 272 278Z" fill="#06070a"/>
          <path d="M210 250 C232 250 256 258 266 276 L210 276Z" fill="#ff9a3a" opacity=".12"/>
          <circle cx="196" cy="262" r="11" fill="#000"/><path d="M180 278 C180 266 212 266 212 278Z" fill="#000"/>
          <rect x="204" y="262" width="7" height="11" rx="1.5" fill="#cfe0ff" opacity=".85"/><circle cx="208" cy="268" r="9" fill="#cfe0ff" opacity=".25"/>
          <path d="M84 296 H336" stroke="#ff9a3a" stroke-width="1.5" opacity=".35"/>
          <circle cx="128" cy="322" r="18" fill="#050505"/><circle cx="292" cy="322" r="18" fill="#050505"/>
          <rect x="86" y="292" width="16" height="7" rx="2" fill="#ff3a2a" opacity=".6"/>
          <path d="M100 336 H320" stroke="#ff9a3a" stroke-width="10" opacity=".08"/>
          ${rain}
        </g>
        ${streaks}${drops}
        <rect width="34" height="400" fill="#000" opacity=".85"/><rect x="366" width="34" height="400" fill="#000" opacity=".85"/><rect width="400" height="22" fill="#000" opacity=".8"/>
        <rect x="34" y="22" width="332" height="378" fill="none" stroke="#2a2420" stroke-width="3"/>
        ${finish(g, 400, 400, { grain: 1, vig: .9 })}
        <text x="44" y="386" font-family="monospace" font-size="12" fill="#ff5a5a" opacity=".85">● 22:14   x3,0</text>`);
    },

    /* Pornic, août 2025 : Nora et Jade */
    selfie() {
      const g = uid(), R = seeded(13);
      let sand = ''; for (let i = 0; i < 80; i++) sand += `<circle cx="${R() * 400}" cy="${290 + R() * 110}" r="${R() * 1.4}" fill="#b89a6a" opacity=".6"/>`;
      let hairJ = ''; for (let i = 0; i < 26; i++) { const a = Math.PI * 1.05 + (i / 25) * Math.PI * .9; hairJ += `<path d="M${272 + Math.cos(a) * 52} ${276 + Math.sin(a) * 52} q${R() * 10 - 5} -6 ${R() * 8 - 4} -14" stroke="#e08a3a" stroke-width="2" fill="none" opacity=".7"/>`; }
      let freck = ''; for (let i = 0; i < 18; i++) freck += `<circle cx="${252 + R() * 40}" cy="${282 + R() * 14}" r="1.1" fill="#b8643a" opacity=".6"/>`;
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4aa8f0"/><stop offset="1" stop-color="#c8ecff"/></linearGradient>
        <linearGradient id="${g}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a7ab0"/><stop offset="1" stop-color="#5ad0d0"/></linearGradient>
        <radialGradient id="${g}skinN" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#f6cfa8"/><stop offset="1" stop-color="#c88a5e"/></radialGradient>
        <radialGradient id="${g}skinJ" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe2cc"/><stop offset="1" stop-color="#e8aa88"/></radialGradient>
        <radialGradient id="${g}flare" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#fffbe0" stop-opacity=".8"/><stop offset="1" stop-color="#fff0a0" stop-opacity="0"/></radialGradient>
        <linearGradient id="${g}lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a3a5a"/><stop offset=".5" stop-color="#6ab0e0"/><stop offset="1" stop-color="#1a2030"/></linearGradient></defs>
        <rect width="400" height="200" fill="url(#${g}sky)"/>
        ${[[80, 60, 70], [300, 90, 90]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="16" fill="#fff" opacity=".7" filter="url(#${g}b8)"/>`).join('')}
        <rect y="196" width="400" height="74" fill="url(#${g}sea)"/>${Array.from({ length: 16 }, () => `<path d="M${R() * 400} ${204 + R() * 60} q10 -3 20 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".55"/>`).join('')}
        <path d="M0 196 L40 186 L70 192 L100 196Z" fill="#5a6a5a"/><path d="M0 262 Q200 252 400 266 L400 290 L0 290Z" fill="#fff" opacity=".6"/>
        <rect y="280" width="400" height="120" fill="#f0d6a0"/>${sand}
        <circle cx="352" cy="56" r="80" fill="url(#${g}flare)"/>${[[300, 110, 10, .25], [250, 170, 18, .15], [190, 240, 8, .3]].map(([x, y, r, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffe0a0" opacity="${o}"/>`).join('')}
        <g filter="url(#${g}b1)"><g transform="translate(140 290)"><path d="M-96 140 C-96 60 96 60 96 140Z" fill="#2a6a8a"/><path d="M-24 50 L0 80 L24 50" fill="#f6cfa8"/>
          <rect x="-16" y="30" width="32" height="30" fill="url(#${g}skinN)"/>
          <path d="M-70 -10 C-82 50 -64 90 -50 100 L-40 20Z M70 -10 C82 50 66 92 52 100 L40 20Z" fill="#2a1808"/>
          <ellipse cx="0" cy="-6" rx="60" ry="66" fill="url(#${g}skinN)"/>
          <path d="M-62 -10 C-70 -90 70 -90 62 -10 C56 -48 30 -66 -4 -64 C-34 -64 -56 -46 -62 -10Z" fill="#2a1808"/>
          <path d="M-62 -10 C-50 -60 -10 -70 20 -60 C-10 -54 -40 -40 -62 -10Z" fill="#4a2c14" opacity=".8"/>
          <rect x="-54" y="-26" width="46" height="28" rx="12" fill="url(#${g}lens)"/><rect x="8" y="-26" width="46" height="28" rx="12" fill="url(#${g}lens)"/><path d="M-8 -14 h16" stroke="#111" stroke-width="4"/>
          <path d="M-50 -22 l14 18 M12 -22 l14 18" stroke="#fff" stroke-width="3" opacity=".45"/><path d="M-54 -16 h-10 M54 -16 h10" stroke="#111" stroke-width="3"/>
          <path d="M-26 28 Q0 50 26 28 Q0 40 -26 28Z" fill="#b8403a"/><path d="M-18 30 Q0 38 18 30" stroke="#fff" stroke-width="4" fill="none"/>
          <ellipse cx="-38" cy="16" rx="11" ry="7" fill="#ff8a7a" opacity=".35"/><ellipse cx="38" cy="16" rx="11" ry="7" fill="#ff8a7a" opacity=".35"/>
          <path d="M-3 6 q3 6 6 0" stroke="#a86a44" stroke-width="2" fill="none"/></g>
        <g transform="translate(272 296)"><path d="M-84 130 C-84 56 84 56 84 130Z" fill="#e8506a"/><path d="M-40 70 h80" stroke="#fff" stroke-width="6" opacity=".6"/>
          <rect x="-14" y="30" width="28" height="30" fill="url(#${g}skinJ)"/>
          <ellipse cx="0" cy="-8" rx="54" ry="58" fill="url(#${g}skinJ)"/>
          <path d="M-56 -14 C-50 -70 50 -72 56 -14 C42 -44 -40 -46 -56 -14Z" fill="#d8782a"/>${hairJ}
          <circle cx="4" cy="-74" r="24" fill="#d8782a"/><circle cx="-4" cy="-80" r="9" fill="#f0a050" opacity=".6"/>
          <path d="M-56 -14 C-62 10 -58 26 -50 36 L-46 -2Z" fill="#d8782a"/>
          <ellipse cx="-20" cy="-10" rx="6.5" ry="7.5" fill="#fff"/><ellipse cx="20" cy="-10" rx="6.5" ry="7.5" fill="#fff"/><circle cx="-19" cy="-9" r="4.5" fill="#3a6a3a"/><circle cx="21" cy="-9" r="4.5" fill="#3a6a3a"/><circle cx="-19" cy="-9" r="2" fill="#111"/><circle cx="21" cy="-9" r="2" fill="#111"/><circle cx="-17.5" cy="-11" r="1.4" fill="#fff"/><circle cx="22.5" cy="-11" r="1.4" fill="#fff"/>
          <path d="M-30 -22 q10 -6 20 -1 M10 -23 q10 -5 20 1" stroke="#a0501a" stroke-width="2.5" fill="none"/>
          ${freck.replace(/cx="(\d+(\.\d+)?)"/g, (m, v) => `cx="${(+v - 272).toFixed(1)}"`).replace(/cy="(\d+(\.\d+)?)"/g, (m, v) => `cy="${(+v - 296).toFixed(1)}"`)}
          <path d="M-22 18 Q0 40 22 18 Q0 30 -22 18Z" fill="#fff" stroke="#c0403a" stroke-width="3"/>
          <ellipse cx="-34" cy="10" rx="10" ry="6" fill="#ff8a8a" opacity=".4"/><ellipse cx="34" cy="10" rx="10" ry="6" fill="#ff8a8a" opacity=".4"/></g></g>
        <g transform="translate(366 318) rotate(18)"><path d="M-15 0 L0 56 L15 0Z" fill="#d8a060"/>${[0, 1, 2, 3].map(i => `<path d="M-12 ${6 + i * 11} L12 ${12 + i * 11} M12 ${6 + i * 11} L-12 ${12 + i * 11}" stroke="#a87038" stroke-width="1"/>`).join('')}
          <circle cy="-6" r="17" fill="#ffb0c8"/><circle cx="-5" cy="-24" r="14" fill="#fff4d0"/><path d="M-14 4 q4 10 8 0 q4 10 8 0" fill="#ffb0c8"/></g>
        ${finish(g, 400, 400, { grain: .25, vig: .35 })}`);
    },

    /* Coucher de soleil sur les toits de la Croix-Rousse, Fourvière au loin */
    croixrousse() {
      const g = uid(), R = seeded(19);
      let roofs = '', x = -10;
      while (x < 410) {
        const w = 34 + R() * 46, hh = 70 + R() * 80, top = 400 - hh, zinc = R() > .5;
        roofs += `<rect x="${x}" y="${top}" width="${w}" height="${hh}" fill="#1a0f1e"/><path d="M${x - 3} ${top} L${x + w / 2} ${top - 14 - R() * 10} L${x + w + 3} ${top}Z" fill="${zinc ? '#2a2236' : '#3a1a1e'}"/>`;
        if (R() > .35) { const cx = x + 6 + R() * (w - 18); roofs += `<rect x="${cx}" y="${top - 30}" width="10" height="22" fill="#24161e"/>${[0, 1].map(k => `<rect x="${cx + 1 + k * 4}" y="${top - 36}" width="3" height="7" fill="#7a3a2a"/>`).join('')}`; }
        if (R() > .6) roofs += `<path d="M${x + w / 2} ${top - 20} V${top - 46} M${x + w / 2 - 8} ${top - 40} H${x + w / 2 + 8} M${x + w / 2 - 5} ${top - 34} H${x + w / 2 + 5}" stroke="#24161e" stroke-width="1.5"/>`;
        for (let r = 0; r < 4; r++) for (let c = 0; c < Math.floor(w / 14); c++) if (R() > .45) roofs += `<rect x="${x + 5 + c * 14}" y="${top + 10 + r * 20}" width="7" height="11" fill="${R() > .4 ? '#ffcf7a' : '#ff9a5a'}" opacity="${.5 + R() * .45}"/>`;
        x += w;
      }
      let birds = ''; for (let i = 0; i < 6; i++) { const bx = 60 + R() * 260, by = 60 + R() * 90, s = 3 + R() * 4; birds += `<path d="M${bx - s} ${by} q${s / 2} -${s / 2} ${s} 0 q${s / 2} -${s / 2} ${s} 0" stroke="#2a1a2a" stroke-width="1.4" fill="none"/>`; }
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a6a"/><stop offset=".35" stop-color="#8a4a8a"/><stop offset=".6" stop-color="#ff7a7a"/><stop offset=".8" stop-color="#ffb070"/><stop offset="1" stop-color="#ffd8a0"/></linearGradient>
        <radialGradient id="${g}sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4d0"/><stop offset=".3" stop-color="#ffd080" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a5a" stop-opacity="0"/></radialGradient></defs>
        <rect width="400" height="400" fill="url(#${g}sky)"/>
        ${[[80, 90, 160], [280, 60, 200], [200, 150, 240]].map(([cx, cy, w]) => `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="7" fill="#ffb0a0" opacity=".55" filter="url(#${g}b3)"/>`).join('')}
        <circle cx="236" cy="236" r="70" fill="url(#${g}sun)"/><circle cx="236" cy="240" r="22" fill="#fff4d0" opacity=".95"/>
        <path d="M0 260 C60 240 120 226 180 224 C230 222 290 232 400 250 L400 290 L0 290Z" fill="#6a3a5a" opacity=".75"/>
        <g fill="#4a2440"><rect x="196" y="196" width="44" height="30"/>${[198, 206, 228, 236].map(tx => `<rect x="${tx}" y="180" width="6" height="18"/><path d="M${tx - 1} 180 L${tx + 3} 172 L${tx + 7} 180Z"/>`).join('')}<path d="M214 196 L218 170 L222 196Z"/><path d="M200 196 h36 l-4 -8 h-28Z"/></g>
        <g fill="#4a2440"><path d="M146 226 L152 150 L156 150 L162 226Z"/><path d="M150 166 h8 M149 186 h10 M148 206 h12" stroke="#4a2440" stroke-width="2"/><path d="M154 150 V138" stroke="#4a2440" stroke-width="1.5"/></g>
        ${birds}${roofs}
        ${finish(g, 400, 400, { grain: .3, vig: .55 })}`);
    },

    /* Tableau blanc de la réunion stratégie */
    whiteboard() {
      const g = uid();
      return svg(400, 400, `<defs>${defs(g)}
        <linearGradient id="${g}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4dae0"/><stop offset="1" stop-color="#aab2ba"/></linearGradient>
        <linearGradient id="${g}glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${g}table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a3a"/><stop offset="1" stop-color="#2a2018"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g}wall)"/>
        <g transform="matrix(1 .03 -.02 1 6 0)">
          <rect x="22" y="22" width="356" height="276" rx="5" fill="#aab4bc"/><rect x="28" y="28" width="344" height="264" rx="3" fill="#fbfcfc"/>
          <text x="44" y="70" font-family="Caveat,cursive" font-size="32" fill="#1a4a9a">Q4 — OBJECTIFS 🚀</text>
          <path d="M44 78 q80 6 170 0" stroke="#1a4a9a" stroke-width="2" fill="none"/>
          <text x="48" y="110" font-family="Caveat,cursive" font-size="23" fill="#222">• 3M utilisatrices</text>
          <text x="48" y="140" font-family="Caveat,cursive" font-size="23" fill="#222">• Monétisation « Partenaires » x3</text>
          <text x="48" y="170" font-family="Caveat,cursive" font-size="23" fill="#222">• Rétention : notifs « rassurantes »</text>
          <text x="48" y="200" font-family="Caveat,cursive" font-size="23" fill="#222">• Nouveau segment : particuliers 💰</text>
          <path d="M290 186 q20 -10 40 4 q-10 22 -36 10" stroke="#1a8a4a" stroke-width="2.5" fill="none"/><text x="300" y="220" font-family="Caveat,cursive" font-size="16" fill="#1a8a4a">+94k€</text>
          <path d="M40 228 L350 226" stroke="#d62a2a" stroke-width="3"/>
          <text x="200" y="256" font-family="Caveat,cursive" font-size="27" fill="#d62a2a" text-anchor="middle" transform="rotate(-3 200 268)">QUI SONT LES</text><text x="200" y="284" font-family="Caveat,cursive" font-size="27" fill="#d62a2a" text-anchor="middle" transform="rotate(-3 200 268)">« PARTENAIRES » ???</text>
          <rect x="300" y="36" width="56" height="50" fill="#ffe66a" transform="rotate(4 328 60)"/><text x="328" y="58" font-family="Caveat,cursive" font-size="13" fill="#333" text-anchor="middle" transform="rotate(4 328 60)">NE PAS</text><text x="328" y="74" font-family="Caveat,cursive" font-size="13" fill="#333" text-anchor="middle" transform="rotate(4 328 60)">EFFACER</text>
          <rect x="28" y="28" width="344" height="264" fill="url(#${g}glare)"/>
          <rect x="22" y="296" width="356" height="12" rx="3" fill="#8a949c"/>${['#1a4a9a', '#d62a2a', '#1a8a4a', '#222'].map((c, i) => `<rect x="${60 + i * 26}" y="292" width="20" height="6" rx="3" fill="${c}"/>`).join('')}
        </g>
        <path d="M-20 400 L40 330 L360 330 L420 400Z" fill="url(#${g}table)"/>
        <g filter="url(#${g}b3)"><rect x="60" y="340" width="110" height="60" rx="6" fill="#c8ccd2"/><rect x="250" y="338" width="60" height="40" rx="20" fill="#e8e8e8"/></g>
        ${finish(g, 400, 400, { grain: .25, vig: .5 })}`);
    },

    /* Capture d'écran annotée : la requête #4471 */
    requete() {
      return svg(400, 400, `<rect width="400" height="400" fill="#0a0c0a"/>
        <rect width="400" height="40" fill="#1a1d1a"/><circle cx="16" cy="20" r="5" fill="#ff5f57"/><circle cx="32" cy="20" r="5" fill="#febc2e"/><circle cx="48" cy="20" r="5" fill="#28c840"/>
        <rect x="66" y="10" width="300" height="20" rx="10" fill="#0a0c0a"/><text x="80" y="24" font-family="monospace" font-size="11" fill="#8aa08a">🔒 admin.lumen.internal/requetes/4471</text>
        <rect y="40" width="400" height="26" fill="#102010"/><text x="14" y="58" font-family="monospace" font-size="12" fill="#9dff9d">lumen-admin › requêtes › #4471</text>
        <g font-family="monospace" font-size="12.5" fill="#9dff9d">
        <text x="16" y="92"><tspan fill="#4f8f4f">REQUÊTE  </tspan>#4471</text><text x="16" y="112"><tspan fill="#4f8f4f">CLIENT   </tspan>particulier (via DataNexa)</text>
        <text x="16" y="132"><tspan fill="#4f8f4f">CIBLE    </tspan>L. M. — 31 ans — Villeurbanne</text><text x="16" y="152"><tspan fill="#4f8f4f">TYPE     </tspan>suivi quotidien (14 pts/j)</text>
        <text x="16" y="172"><tspan fill="#4f8f4f">TARIF    </tspan>49 € / mois</text><text x="16" y="192"><tspan fill="#4f8f4f">MOTIF    </tspan>« retrouver une proche »</text>
        <text x="16" y="212" fill="#ffd36b"><tspan fill="#4f8f4f">VÉRIF.   </tspan>aucune</text><text x="16" y="232"><tspan fill="#4f8f4f">STATUT   </tspan>LIVRÉ — 112 jours</text></g>
        <path d="M12 199 C10 216 90 220 120 214 C140 210 130 198 100 198 C60 198 14 196 12 199Z" stroke="#ff4a4a" stroke-width="2.5" fill="none"/>
        <path d="M14 120 C12 140 260 142 268 132 C274 120 180 116 20 118Z" stroke="#ff4a4a" stroke-width="2.5" fill="none"/>
        <path d="M300 140 C330 170 330 220 300 250" stroke="#ff4a4a" stroke-width="2.5" fill="none"/><path d="M300 250 l2 -12 M300 250 l12 -4" stroke="#ff4a4a" stroke-width="2.5"/>
        <text x="200" y="290" font-family="Caveat,cursive" font-size="30" fill="#ff5a5a" text-anchor="middle">C'est son ex.</text>
        <text x="200" y="324" font-family="Caveat,cursive" font-size="28" fill="#ff5a5a" text-anchor="middle">On lui a VENDU où elle était.</text>
        <text x="200" y="354" font-family="Caveat,cursive" font-size="22" fill="#ff5a5a" text-anchor="middle">→ article Lyon Actu 12/09</text>
        <text x="384" y="390" font-family="monospace" font-size="9" fill="#4f8f4f" text-anchor="end">capture 26/10 23:58</text>`);
    },

    /* carte de Lyon : Saône, Rhône, Presqu'île, Croix-Rousse */
    mapLyon(focus = null) {
      let streets = '';
      const grid = (x0, y0, w, hh, ang, step, col = '#2a2b33') => { let g = ''; for (let i = 0; i <= w; i += step) g += `<path d="M${i} 0 V${hh}" stroke="${col}" stroke-width="${i % (step * 4) === 0 ? 4 : 1.6}"/>`; for (let j = 0; j <= hh; j += step) g += `<path d="M0 ${j} H${w}" stroke="${col}" stroke-width="${j % (step * 4) === 0 ? 4 : 1.6}"/>`; return `<g transform="translate(${x0} ${y0}) rotate(${ang})">${g}</g>`; };
      streets += grid(-60, -40, 260, 360, 8, 22);   // ouest / Fourvière
      streets += grid(110, 40, 200, 240, -14, 18);  // Croix-Rousse
      streets += grid(150, 280, 140, 300, 4, 16);   // Presqu'île
      streets += grid(250, 120, 220, 520, -4, 20);  // rive gauche / Part-Dieu
      const pins = {
        home: [200, 150, '#ff9f0a', 'Domicile', '🏠'], work: [196, 372, '#8b7bff', 'Lumen SAS', '💼'],
        gare: [335, 318, '#30d158', 'Part-Dieu', '🚆'], loyasse: [62, 236, '#8e8e93', 'Loyasse', '🕯️'],
        dab: [246, 190, '#ff453a', 'DAB', '💶'],
      };
      const pin = k => { const [x, y, c, label, emo] = pins[k]; const f = focus === k;
        return `<g transform="translate(${x} ${y})">${f ? `<circle r="34" fill="${c}" opacity=".25"><animate attributeName="r" values="18;40;18" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".45;0;.45" dur="1.8s" repeatCount="indefinite"/></circle>` : ''}
          <path d="M0 6 C-12 -6 -16 -14 -16 -22 A16 16 0 1 1 16 -22 C16 -14 12 -6 0 6Z" fill="${c}" stroke="#fff" stroke-width="2.5" transform="${f ? 'scale(1.25)' : ''}"/><text y="-17" text-anchor="middle" font-size="14">${emo}</text>
          <text y="24" text-anchor="middle" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#fff" stroke="#111" stroke-width="3.5" paint-order="stroke">${label}</text></g>`; };
      const lbl = (x, y, t, sz = 11, col = '#6c6f80', it = false) => `<text x="${x}" y="${y}" font-family="Inter,Arial" font-size="${sz}" font-weight="700" letter-spacing="2" fill="${col}" text-anchor="middle" ${it ? 'font-style="italic" letter-spacing="0"' : ''}>${t}</text>`;
      return svg(390, 844, `<rect width="390" height="844" fill="#1b1c21"/>${streets}
        <path d="M-10 120 C30 110 60 140 40 200 C20 260 40 300 90 310 L120 300 L110 0 L-10 0Z" fill="#1e2a22" opacity=".9"/>
        <ellipse cx="335" cy="150" rx="48" ry="58" fill="#20352a"/><path d="M318 140 q16 -20 30 4 q-10 18 -30 -4z" fill="#1f3a5a"/>
        <path d="M70 -10 C100 70 80 140 118 200 C150 252 128 330 150 410 C162 460 180 500 200 540 C206 600 200 700 204 860" stroke="#203f63" stroke-width="30" fill="none" stroke-linecap="round"/>
        <path d="M410 40 C350 120 318 190 296 270 C280 340 262 430 214 530" stroke="#203f63" stroke-width="40" fill="none" stroke-linecap="round"/>
        <path d="M70 -10 C100 70 80 140 118 200 C150 252 128 330 150 410 C162 460 180 500 200 540 C206 600 200 700 204 860" stroke="#2a5585" stroke-width="2" fill="none" opacity=".6"/>
        ${[60, 200, 330, 450].map(y => `<path d="M${y < 300 ? 270 : 230} ${y + 40} h${y < 300 ? 70 : 60}" stroke="#3a3b45" stroke-width="5"/>`).join('')}
        ${lbl(178, 92, 'CROIX-ROUSSE')}${lbl(196, 430, "PRESQU'ÎLE")}${lbl(330, 380, 'PART-DIEU')}${lbl(58, 330, 'FOURVIÈRE')}${lbl(335, 222, "Parc de la Tête d'Or", 10, '#4f7a5f', true)}
        ${lbl(100, 120, 'Saône', 12, '#4d7fb5', true)}${lbl(338, 92, 'Rhône', 12, '#4d7fb5', true)}
        ${Object.keys(pins).map(pin).join('')}
        <g transform="translate(350 470)"><circle r="16" fill="#2c2c2e"/><path d="M0 -10 L5 4 L0 1 L-5 4Z" fill="#ff453a"/><text y="13" font-size="7" fill="#aaa" text-anchor="middle" font-family="Arial">N</text></g>`);
    },

    /* carte de France (projection simple lon/lat) avec l'itinéraire de Nora */
    mapFrance() {
      const P = ([lo, la]) => [((lo + 5.6) * 0.688 * 38.5 + 14).toFixed(1), ((51.4 - la) * 38.5 + 96).toFixed(1)];
      const coast = [[2.55,51.09],[1.85,50.95],[1.6,50.73],[1.6,50.2],[1.1,49.95],[0.1,49.5],[-0.3,49.3],[-1.26,49.67],[-1.95,49.72],[-1.6,48.84],[-1.5,48.64],[-2.0,48.65],[-2.75,48.52],[-3.45,48.82],[-3.98,48.72],[-4.6,48.6],[-4.77,48.36],[-4.5,48.25],[-4.73,48.04],[-4.37,47.8],[-3.37,47.7],[-3.12,47.48],[-2.75,47.5],[-2.2,47.27],[-2.25,47.0],[-1.78,46.5],[-1.15,46.15],[-1.05,45.6],[-1.25,45.2],[-1.2,44.65],[-1.4,44.0],[-1.56,43.48],[-1.78,43.37],[-1.4,43.25],[-0.6,42.9],[0.7,42.8],[1.73,42.5],[3.17,42.43],[3.05,42.7],[3.2,43.1],[3.6,43.4],[4.2,43.5],[4.6,43.35],[5.35,43.3],[5.93,43.1],[6.6,43.2],[7.0,43.55],[7.5,43.78],[7.65,44.15],[6.95,44.4],[7.0,45.0],[6.8,45.4],[7.05,45.9],[6.8,46.4],[6.2,46.4],[6.1,46.25],[6.4,46.7],[6.9,47.3],[7.58,47.58],[7.55,48.1],[7.8,48.6],[8.2,48.97],[7.4,49.15],[6.7,49.2],[6.36,49.47],[5.9,49.5],[5.4,49.6],[4.85,50.15],[4.2,49.95],[3.6,50.4],[3.1,50.8]];
      const pts = coast.map(P).map(p => p.join(',')).join(' ');
      const city = (lo, la, name, main = false, dx = 8, dy = 4) => { const [x, y] = P([lo, la]); return `<circle cx="${x}" cy="${y}" r="${main ? 6 : 3}" fill="${main ? '#fff' : '#6b7a8c'}" ${main ? 'stroke="#0a84ff" stroke-width="3"' : ''}/><text x="${+x + dx}" y="${+y + dy}" font-family="Inter,Arial" font-size="${main ? 13 : 11}" font-weight="${main ? 700 : 500}" fill="${main ? '#fff' : '#8494a8'}" ${dx < 0 ? 'text-anchor="end"' : ''}>${name}</text>`; };
      const route = [[4.86,45.76],[4.6,46.6],[3.6,47.6],[2.3,48.72],[0.2,48.2],[-1.68,48.11],[-2.8,48.5],[-4.49,48.39]].map(P);
      const [bx, by] = P([-4.49, 48.39]), [cx, cy] = P([-4.77, 48.36]), [ox, oy] = P([-5.09, 48.46]);
      return svg(390, 844, `<rect width="390" height="844" fill="#0e1824"/>
        ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${60 + i * 40} H390" stroke="#132030" stroke-width="1"/><path d="M${i * 40} 0 V844" stroke="#132030" stroke-width="1"/>`).join('')}
        <polygon points="${pts}" fill="#1d2a38" stroke="#3b5068" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M${route.map(p => p.join(' ')).join(' L')}" stroke="#0a84ff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M${bx} ${by} L${cx} ${cy} Q${(+cx + +ox) / 2} ${+oy - 14} ${ox} ${oy}" stroke="#ff9f0a" stroke-width="3" stroke-dasharray="3 6" fill="none" stroke-linecap="round"/>
        <ellipse cx="${ox}" cy="${oy}" rx="4.5" ry="3" fill="#3b5068"/><text x="${ox}" y="${+oy - 10}" font-family="Inter,Arial" font-size="16" font-weight="800" fill="#ff9f0a" text-anchor="middle">?</text>
        ${city(2.35, 48.86, 'Paris', false, 6, -6)}${city(-1.55, 47.22, 'Nantes')}${city(-1.68, 48.11, 'Rennes', false, 6, 14)}${city(5.37, 43.3, 'Marseille', false, -6)}${city(-0.58, 44.84, 'Bordeaux')}${city(1.44, 43.6, 'Toulouse')}${city(7.75, 48.58, 'Strasbourg', false, -6)}
        ${city(4.84, 45.76, 'Lyon', true)}${city(-4.49, 48.39, 'Brest', true, 6, 20)}
        <text x="195" y="520" font-family="Inter,Arial" font-size="11" fill="#5d6f85" text-anchor="middle" letter-spacing="2">MANCHE · ATLANTIQUE · IROISE</text>`);
    },

    mini(kind) { return this[kind](); },
  };
})();
