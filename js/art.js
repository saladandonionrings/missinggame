/* ==========================================================
   HORS LIGNE — Illustrations (SVG génératif, aucun fichier image)
   ========================================================== */
const ART = (() => {
  let n = 0;
  const uid = () => 'g' + (++n);
  const svg = (w, h, inner, par = 'xMidYMid slice') => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${par}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const grain = (id, op = .18) => `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 ${op} 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(42);

  function cat(x, y, s = 1, col = '#2b2b33', eye = '#ffd84a') {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-62 70 C-70 10 -40 -20 0 -20 C40 -20 70 10 62 70 Z" fill="${col}"/>
      <path d="M50 60 C95 55 100 10 80 0" stroke="${col}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="0" cy="-45" r="44" fill="${col}"/>
      <path d="M-40 -62 L-34 -108 L-8 -80 Z" fill="${col}"/><path d="M40 -62 L34 -108 L8 -80 Z" fill="${col}"/>
      <path d="M-33 -70 L-30 -96 L-15 -79 Z" fill="#e58a9a" opacity=".6"/><path d="M33 -70 L30 -96 L15 -79 Z" fill="#e58a9a" opacity=".6"/>
      <ellipse cx="-17" cy="-48" rx="9" ry="11" fill="${eye}"/><ellipse cx="17" cy="-48" rx="9" ry="11" fill="${eye}"/>
      <ellipse cx="-17" cy="-47" rx="3" ry="9" fill="#111"/><ellipse cx="17" cy="-47" rx="3" ry="9" fill="#111"/>
      <circle cx="-14" cy="-52" r="2.2" fill="#fff"/><circle cx="20" cy="-52" r="2.2" fill="#fff"/>
      <path d="M-5 -30 L5 -30 L0 -24 Z" fill="#e58a9a"/>
      <path d="M0 -24 Q-6 -16 -12 -19 M0 -24 Q6 -16 12 -19" stroke="#111" stroke-width="2" fill="none"/>
      <path d="M-22 -28 L-58 -34 M-22 -24 L-58 -20 M22 -28 L58 -34 M22 -24 L58 -20" stroke="#ddd" stroke-width="1.2" opacity=".7"/>
      <ellipse cx="0" cy="5" rx="22" ry="30" fill="#fff" opacity=".85"/>
    </g>`;
  }

  return {
    /* Fond d'écran verrouillé : anniversaire de Kafka (le code est sur la guirlande) */
    kafka() {
      const g = uid(), b = uid();
      const P0 = [62, 120], P1 = [150, 168], P2 = [238, 120];
      const chars = ['2', '2', '·', '0', '9'];
      let flags = '';
      chars.forEach((c, i) => {
        const t = 0.12 + i * 0.19;
        const x = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
        const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
        const col = ['#ffd84a', '#ff7aa8', '#8be3ff', '#b6ff8b', '#c9a6ff'][i];
        flags += `<path d="M${x - 12} ${y} L${x + 12} ${y} L${x} ${y + 28} Z" fill="${col}"/><text x="${x}" y="${y + 15}" font-family="Arial Black,Arial" font-weight="900" font-size="13" text-anchor="middle" fill="#3a1830">${c}</text>`;
      });
      let bokeh = '';
      for (let i = 0; i < 18; i++) bokeh += `<circle cx="${rnd() * 300}" cy="${rnd() * 400}" r="${4 + rnd() * 18}" fill="#fff" opacity="${0.04 + rnd() * 0.1}"/>`;
      return svg(300, 400, `<defs><radialGradient id="${g}" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#ff9e6b"/><stop offset=".5" stop-color="#b8456a"/><stop offset="1" stop-color="#1e0f2a"/></radialGradient>${grain(b, .12)}</defs>
        <rect width="300" height="400" fill="url(#${g})"/>${bokeh}
        <path d="M${P0} Q${P1} ${P2}" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8"/>${flags}
        ${cat(150, 265, 0.95)}
        <path d="M118 215 L150 150 L182 215 Z" fill="#ff7aa8"/><path d="M128 195 L172 195 M136 178 L164 178" stroke="#ffd84a" stroke-width="5"/><circle cx="150" cy="150" r="8" fill="#ffd84a"/>
        <rect x="95" y="318" width="110" height="46" rx="6" fill="#fbe3c9"/><rect x="95" y="318" width="110" height="14" rx="6" fill="#ff7aa8"/>
        <path d="M95 332 q9 10 18 0 q9 10 18 0 q9 10 18 0 q9 10 18 0 q9 10 18 0 q9 10 20 0" fill="#ff7aa8"/>
        <text x="150" y="312" font-family="Arial Black,Arial" font-size="26" font-weight="900" text-anchor="middle" fill="#ffd84a" stroke="#7a2a3a" stroke-width="1">3</text>
        <path d="M150 284 q-5 -8 0 -14 q5 6 0 14" fill="#ffcf4a"/>
        <rect width="300" height="400" filter="url(#${b})"/>`);
    },

    /* Fond d'écran accueil */
    homewall() {
      const g = uid(), g2 = uid();
      return svg(390, 844, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1640"/><stop offset=".55" stop-color="#3b1d4a"/><stop offset="1" stop-color="#0d0a18"/></linearGradient>
        <radialGradient id="${g2}" cx="70%" cy="30%" r="60%"><stop offset="0" stop-color="#ff7a9a" stop-opacity=".55"/><stop offset="1" stop-color="#ff7a9a" stop-opacity="0"/></radialGradient></defs>
        <rect width="390" height="844" fill="url(#${g})"/><rect width="390" height="844" fill="url(#${g2})"/>
        <circle cx="80" cy="640" r="220" fill="#6c5bff" opacity=".18"/><circle cx="330" cy="760" r="160" fill="#2ac2ff" opacity=".1"/>`);
    },

    kafkaVacuum() {
      const g = uid();
      return svg(400, 400, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9dcc8"/><stop offset="1" stop-color="#c7b394"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g})"/><rect y="290" width="400" height="110" fill="#8a6a48"/>
        <path d="M0 290 L400 290" stroke="#6a4e33" stroke-width="3"/>
        ${[0, 1, 2, 3, 4].map(i => `<path d="M${i * 90} 290 L${i * 90 - 30} 400" stroke="#6a4e33" stroke-width="2" opacity=".5"/>`).join('')}
        <rect x="250" y="200" width="100" height="100" rx="26" fill="#d6304a"/><rect x="262" y="212" width="76" height="30" rx="12" fill="#2a2a2a" opacity=".6"/>
        <circle cx="268" cy="302" r="14" fill="#222"/><circle cx="335" cy="302" r="14" fill="#222"/>
        <path d="M255 245 C200 230 190 150 230 110" stroke="#333" stroke-width="10" fill="none"/>
        <rect x="222" y="40" width="14" height="80" rx="6" fill="#999"/>
        <g transform="translate(120 250)"><path d="M-70 40 C-75 -30 -20 -55 10 -50 C50 -45 60 0 55 40 Z" fill="#2b2b33"/>
        ${Array.from({ length: 14 }, (_, i) => `<path d="M${-60 + i * 8} ${-35 + Math.abs(i - 7) * 2} l3 -12 l3 12" fill="#2b2b33"/>`).join('')}
        <circle cx="62" cy="-12" r="34" fill="#2b2b33"/><path d="M40 -32 L42 -66 L62 -42Z M80 -36 L92 -66 L94 -30Z" fill="#2b2b33"/>
        <ellipse cx="55" cy="-14" rx="8" ry="9" fill="#ffd84a"/><ellipse cx="80" cy="-14" rx="8" ry="9" fill="#ffd84a"/>
        <ellipse cx="56" cy="-14" rx="6" ry="7" fill="#111"/><ellipse cx="80" cy="-14" rx="6" ry="7" fill="#111"/>
        <path d="M58 6 Q68 0 78 6" stroke="#fff" stroke-width="2" fill="none"/><path d="M62 4 l2 6 l2 -5 M72 4 l2 6 l2 -5" fill="#fff"/>
        <path d="M-68 30 C-110 10 -100 -60 -80 -70" stroke="#2b2b33" stroke-width="14" fill="none" stroke-linecap="round"/></g>
        <text x="200" y="60" font-family="Caveat,cursive" font-size="30" fill="#6a2a2a" text-anchor="middle" transform="rotate(-4 200 60)">grrrr</text>`);
    },

    biscotte() {
      const g = uid(), f = uid();
      return svg(400, 400, `<defs><filter id="${f}"><feColorMatrix type="matrix" values=".5 .5 .2 0 .05  .4 .45 .2 0 .03  .3 .35 .2 0 0  0 0 0 1 0"/></filter><radialGradient id="${g}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#f6e6c8"/><stop offset="1" stop-color="#b89a6a"/></radialGradient></defs>
        <rect width="400" height="400" fill="#efe7d6"/>
        <g transform="rotate(-3 200 200)"><rect x="40" y="26" width="320" height="350" fill="#fbf8f0" stroke="#ddd"/>
        <g filter="url(#${f})"><rect x="60" y="46" width="280" height="250" fill="url(#${g})"/>
        <rect x="60" y="210" width="280" height="86" fill="#9a7a52"/>
        <circle cx="200" cy="140" r="52" fill="#f2c9a5"/><path d="M146 130 C146 70 254 70 254 130 C250 105 230 92 200 92 C170 92 150 105 146 130Z" fill="#5a3a1a"/>
        <path d="M146 130 C140 170 150 200 158 210 L160 150 Z M254 130 C260 170 250 200 242 210 L240 150Z" fill="#5a3a1a"/>
        <circle cx="182" cy="140" r="5" fill="#2a1a0a"/><circle cx="218" cy="140" r="5" fill="#2a1a0a"/>
        <path d="M180 162 Q200 180 220 162" stroke="#a0402a" stroke-width="4" fill="none"/>
        <circle cx="170" cy="158" r="8" fill="#ff9a8a" opacity=".5"/><circle cx="230" cy="158" r="8" fill="#ff9a8a" opacity=".5"/>
        <path d="M120 296 C120 230 280 230 280 296Z" fill="#d6505a"/>
        <ellipse cx="200" cy="250" rx="40" ry="26" fill="#e0a050"/><circle cx="178" cy="236" r="9" fill="#e0a050"/><circle cx="222" cy="236" r="9" fill="#e0a050"/>
        <circle cx="190" cy="246" r="3" fill="#111"/><circle cx="210" cy="246" r="3" fill="#111"/><ellipse cx="200" cy="256" rx="10" ry="6" fill="#f6e0b0"/>
        <ellipse cx="164" cy="262" rx="14" ry="9" fill="#f2c9a5"/><ellipse cx="236" cy="262" rx="14" ry="9" fill="#f2c9a5"/></g>
        <text x="200" y="345" font-family="Caveat,cursive" font-size="34" fill="#2a3a8a" text-anchor="middle">Moi &amp; Biscotte — 2004 ♥</text></g>`);
    },

    bureau() {
      const g = uid();
      return svg(400, 400, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6ee"/><stop offset="1" stop-color="#b8c4d0"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g})"/><rect x="0" y="0" width="400" height="140" fill="#cfd9e3"/>
        <rect x="270" y="20" width="110" height="110" fill="#9fc0e0"/><path d="M325 20 V130 M270 75 H380" stroke="#fff" stroke-width="4"/>
        <rect y="270" width="400" height="130" fill="#c8a57a"/><rect y="270" width="400" height="8" fill="#a88558"/>
        <rect x="80" y="100" width="210" height="140" rx="8" fill="#1a1a22"/><rect x="88" y="108" width="194" height="124" rx="3" fill="#120d2a"/>
        <circle cx="185" cy="160" r="22" fill="#8b7bff" opacity=".35"/><circle cx="185" cy="160" r="12" fill="#c9bfff"/>
        <text x="185" y="208" font-family="Arial" font-weight="800" letter-spacing="5" font-size="14" fill="#efeaff" text-anchor="middle">LUMEN</text>
        <rect x="170" y="240" width="30" height="28" fill="#2a2a32"/><rect x="140" y="264" width="90" height="8" rx="3" fill="#2a2a32"/>
        <rect x="262" y="112" width="44" height="44" fill="#ffe66a" transform="rotate(6 284 134)"/>
        <text x="284" y="132" font-family="Caveat,cursive" font-size="14" fill="#333" text-anchor="middle" transform="rotate(6 284 134)">rentrer</text>
        <text x="284" y="146" font-family="Caveat,cursive" font-size="14" fill="#333" text-anchor="middle" transform="rotate(6 284 134)">seule ? ✗</text>
        <rect x="310" y="215" width="34" height="56" rx="4" fill="#fff"/><path d="M344 228 q14 4 0 22" stroke="#fff" stroke-width="6" fill="none"/>
        <text x="327" y="250" font-family="Arial" font-size="9" fill="#8b7bff" text-anchor="middle" font-weight="800">L</text>
        <path d="M40 270 C35 220 60 200 50 160 M50 270 C60 230 90 230 80 190 M45 270 C20 240 10 220 20 200" stroke="#3a8a4a" stroke-width="6" fill="none"/>
        <rect x="28" y="255" width="40" height="32" rx="4" fill="#d8784a"/>`);
    },

    ouessant() {
      const g = uid(), s = uid(), b = uid();
      return svg(400, 400, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a7a"/><stop offset=".45" stop-color="#e07a6a"/><stop offset=".62" stop-color="#ffcf8a"/></linearGradient>
        <linearGradient id="${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5a8a"/><stop offset="1" stop-color="#0f1e3a"/></linearGradient>
        <linearGradient id="${b}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6c8" stop-opacity=".0"/><stop offset="1" stop-color="#fff6c8" stop-opacity=".55"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g})"/><circle cx="110" cy="240" r="34" fill="#fff1c0" opacity=".9"/>
        <rect y="248" width="400" height="152" fill="url(#${s})"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${40 + i * 50} ${262 + i * 18} h${30 + i * 6}" stroke="#ffd9a0" stroke-width="2" opacity="${0.5 - i * 0.07}"/>`).join('')}
        <path d="M200 400 L210 300 C230 270 260 262 300 258 L400 250 L400 400Z" fill="#1a1a22"/>
        <path d="M150 400 C170 360 190 340 230 330 L260 400Z" fill="#24242c"/>
        <path d="M300 210 L284 98 L298 98 L304 210 Z" fill="none"/>
        <polygon points="285,250 293,120 313,120 321,250" fill="#f4f0e8"/>
        ${[0, 1, 2].map(i => `<polygon points="${287 + i * 2.2},${222 - i * 40} ${289 + i * 2.2},${202 - i * 40} ${317 - i * 2.2},${202 - i * 40} ${319 - i * 2.2},${222 - i * 40}" fill="#1a1a22"/>`).join('')}
        <rect x="290" y="104" width="26" height="18" fill="#ffe9a0"/><path d="M286 104 h34 l-17 -14 z" fill="#1a1a22"/>
        <polygon points="303,112 400,70 400,150" fill="url(#${b})"/>
        <g transform="translate(232 300)"><path d="M0 0 C-4 -20 -2 -36 6 -40 C14 -36 16 -20 12 0Z" fill="#2a1a2a"/><circle cx="6" cy="-46" r="6" fill="#2a1a2a"/><path d="M-2 -38 C-12 -30 -10 -14 -6 -6 L4 -30Z" fill="#5a2a4a"/></g>
        <g transform="translate(218 304)"><path d="M0 0 C-2 -12 0 -20 4 -22 C8 -20 10 -12 8 0Z" fill="#2a1a2a"/><circle cx="4" cy="-26" r="4" fill="#2a1a2a"/></g>
        ${[0, 1, 2].map(i => `<path d="M${60 + i * 30} ${120 + i * 14} q6 -6 12 0 q6 -6 12 0" stroke="#1a1a22" stroke-width="2" fill="none"/>`).join('')}`);
    },

    party() {
      const g = uid();
      let conf = '';
      for (let i = 0; i < 60; i++) conf += `<rect x="${rnd() * 400}" y="${rnd() * 400}" width="${3 + rnd() * 5}" height="${6 + rnd() * 8}" fill="${['#ff6b9a', '#8b7bff', '#ffd84a', '#5ae0ff'][i % 4]}" transform="rotate(${rnd() * 180} ${rnd() * 400} ${rnd() * 400})" opacity=".85"/>`;
      return svg(400, 400, `<defs><radialGradient id="${g}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3a2b8a"/><stop offset="1" stop-color="#07061a"/></radialGradient></defs>
        <rect width="400" height="400" fill="url(#${g})"/>
        <text x="200" y="170" font-family="Arial" font-weight="900" font-size="58" letter-spacing="10" text-anchor="middle" fill="none" stroke="#c9bfff" stroke-width="3" style="filter:drop-shadow(0 0 8px #8b7bff)">LUMEN</text>
        <text x="200" y="230" font-family="Arial" font-weight="800" font-size="30" text-anchor="middle" fill="#ff8ab0">1 000 000 💜</text>
        <text x="200" y="262" font-family="Arial" font-size="14" text-anchor="middle" fill="#c9bfff" letter-spacing="3">UTILISATRICES EN SÉCURITÉ</text>
        ${[60, 330, 110, 290].map((x, i) => `<ellipse cx="${x}" cy="${70 + (i % 2) * 40}" rx="26" ry="32" fill="${['#ff6b9a', '#8b7bff', '#ffd84a', '#5ae0ff'][i]}" opacity=".9"/><path d="M${x} ${102 + (i % 2) * 40} q6 30 -4 60" stroke="#fff" stroke-width="1" fill="none" opacity=".6"/>`).join('')}
        ${conf}
        ${[80, 140, 200, 260, 320].map((x, i) => `<circle cx="${x}" cy="360" r="${22 + (i % 2) * 6}" fill="#0a081e"/><rect x="${x - 26}" y="${370}" width="52" height="40" rx="18" fill="#0a081e"/>`).join('')}`);
    },

    voisine() {
      const g = uid(), f = uid();
      return svg(400, 400, `<defs><radialGradient id="${g}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#c8b898"/><stop offset="1" stop-color="#2a241a"/></radialGradient>${grain(f, .25)}</defs>
        <rect width="400" height="400" fill="url(#${g})"/>
        <rect x="110" y="20" width="180" height="330" fill="#6a4a2a" stroke="#3a2a1a" stroke-width="4"/>
        <rect x="128" y="40" width="144" height="120" fill="#5a3e22" stroke="#3a2a1a" stroke-width="2"/><rect x="128" y="180" width="144" height="150" fill="#5a3e22" stroke="#3a2a1a" stroke-width="2"/>
        <circle cx="262" cy="200" r="7" fill="#d8b84a"/>
        <rect x="170" y="66" width="60" height="22" fill="#e8d8a8"/><text x="200" y="82" font-family="Arial" font-size="11" font-weight="700" text-anchor="middle" fill="#333">BENALI</text>
        <text x="200" y="104" font-family="Arial" font-size="10" text-anchor="middle" fill="#e8d8a8">3e G</text>
        <rect x="188" y="196" width="66" height="66" fill="#ffe66a" transform="rotate(-5 220 230)"/>
        <text x="221" y="216" font-family="Caveat,cursive" font-size="13" text-anchor="middle" fill="#222" transform="rotate(-5 220 230)">Merci Mme B. ♥</text>
        <text x="221" y="232" font-family="Caveat,cursive" font-size="12" text-anchor="middle" fill="#222" transform="rotate(-5 220 230)">croquettes 2x/j</text>
        <text x="221" y="248" font-family="Caveat,cursive" font-size="12" text-anchor="middle" fill="#222" transform="rotate(-5 220 230)">je reviens vite</text>
        <rect x="40" y="290" width="130" height="90" rx="14" fill="#8a8a92"/><rect x="40" y="290" width="130" height="24" rx="10" fill="#6a6a72"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${58 + i * 17}" y="326" width="8" height="44" rx="3" fill="#3a3a42"/>`).join('')}
        <ellipse cx="105" cy="352" rx="8" ry="6" fill="#ffd84a"/><ellipse cx="125" cy="352" rx="8" ry="6" fill="#ffd84a"/>
        <ellipse cx="106" cy="352" rx="2" ry="5" fill="#111"/><ellipse cx="126" cy="352" rx="2" ry="5" fill="#111"/>
        <rect x="290" y="330" width="70" height="40" rx="4" fill="#b89a6a"/><text x="325" y="356" font-family="Arial" font-size="10" text-anchor="middle" fill="#333">CROQUETTES</text>
        <rect width="400" height="400" filter="url(#${f})"/>`);
    },

    voiture() {
      const g = uid(), f = uid(), l = uid();
      return svg(400, 400, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="1" stop-color="#151a22"/></linearGradient>
        <radialGradient id="${l}" cx="62%" cy="20%" r="50%"><stop offset="0" stop-color="#ffb86a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb86a" stop-opacity="0"/></radialGradient>${grain(f, .4)}</defs>
        <rect width="400" height="400" fill="url(#${g})"/><rect width="400" height="400" fill="url(#${l})"/>
        <rect x="244" y="20" width="6" height="300" fill="#222"/><path d="M247 26 q20 0 26 12" stroke="#222" stroke-width="5" fill="none"/><ellipse cx="272" cy="42" rx="12" ry="5" fill="#ffd9a0"/>
        <path d="M0 300 L400 300 L400 400 L0 400Z" fill="#0c0e12"/><path d="M0 300 L400 300" stroke="#2a2a2a" stroke-width="3"/>
        <path d="M110 300 C120 260 150 245 200 242 C250 240 290 255 310 300Z" fill="#1d2128"/>
        <rect x="90" y="285" width="240" height="40" rx="12" fill="#22262e"/>
        <path d="M145 284 C155 262 175 255 200 254 C230 254 260 262 270 284Z" fill="#0a0c10"/>
        <circle cx="200" cy="270" r="11" fill="#111"/><path d="M186 290 C186 278 214 278 214 290Z" fill="#111"/>
        <circle cx="208" cy="274" r="3" fill="#ff7a2a"/><circle cx="208" cy="274" r="9" fill="#ff7a2a" opacity=".2"/>
        <circle cx="130" cy="328" r="18" fill="#0a0a0a"/><circle cx="290" cy="328" r="18" fill="#0a0a0a"/>
        <path d="M0 0 H400 V60 H0Z" fill="#000" opacity=".5"/><path d="M0 0 H30 V400 H0Z M370 0 H400 V400 H370Z" fill="#000" opacity=".6"/>
        <rect width="400" height="400" filter="url(#${f})"/>
        <text x="16" y="388" font-family="monospace" font-size="12" fill="#ff5a5a" opacity=".8">● 22:14  x3 zoom</text>`);
    },

    selfie() {
      const g = uid();
      return svg(400, 400, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ad0ff"/><stop offset=".6" stop-color="#bfe8ff"/><stop offset=".6" stop-color="#f2d9a8"/><stop offset="1" stop-color="#e8c890"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g})"/><circle cx="330" cy="70" r="30" fill="#fff6c0"/>
        <path d="M0 240 q50 -10 100 0 t100 0 t100 0 t100 0 V250 H0Z" fill="#fff" opacity=".6"/>
        <g transform="translate(140 270)"><path d="M-80 140 C-80 60 80 60 80 140Z" fill="#2a6a8a"/><circle cy="-10" r="62" fill="#f0c49a"/>
        <path d="M-66 -10 C-70 -90 70 -90 66 -10 C60 -50 30 -66 0 -66 C-30 -66 -60 -50 -66 -10Z" fill="#3a2414"/><path d="M-66 -10 C-80 40 -70 70 -60 90 L-52 0Z M66 -10 C80 40 70 70 60 90 L52 0Z" fill="#3a2414"/>
        <rect x="-50" y="-26" width="40" height="22" rx="8" fill="#111"/><rect x="10" y="-26" width="40" height="22" rx="8" fill="#111"/><path d="M-10 -16 h20" stroke="#111" stroke-width="4"/>
        <path d="M-22 22 Q0 40 22 22" stroke="#a0402a" stroke-width="5" fill="none"/></g>
        <g transform="translate(272 286)"><path d="M-74 130 C-74 56 74 56 74 130Z" fill="#d8506a"/><circle cy="-10" r="56" fill="#e8b48a"/>
        <path d="M-58 -26 C-50 -80 50 -80 58 -26 C40 -50 -40 -50 -58 -26Z" fill="#c8843a"/><circle cx="0" cy="-78" r="22" fill="#c8843a"/>
        <circle cx="-20" cy="-12" r="5" fill="#2a1a0a"/><circle cx="20" cy="-12" r="5" fill="#2a1a0a"/><path d="M-18 14 Q0 30 18 14" stroke="#a0402a" stroke-width="5" fill="#fff"/>
        <circle cx="-34" cy="6" r="9" fill="#ff8a8a" opacity=".5"/><circle cx="34" cy="6" r="9" fill="#ff8a8a" opacity=".5"/></g>
        <g transform="translate(355 300) rotate(15)"><path d="M-14 0 L0 50 L14 0Z" fill="#d8a060"/><circle cy="-6" r="16" fill="#ffb0c8"/><circle cy="-22" r="13" fill="#fff4d0"/></g>`);
    },

    croixrousse() {
      const g = uid();
      let roofs = '', x = 0;
      while (x < 400) { const w = 30 + rnd() * 50, hh = 60 + rnd() * 90; roofs += `<rect x="${x}" y="${400 - hh}" width="${w}" height="${hh}" fill="#1a1020"/>`; if (rnd() > 0.5) roofs += `<rect x="${x + w / 2}" y="${400 - hh - 16}" width="6" height="16" fill="#1a1020"/>`; for (let k = 0; k < 4; k++) if (rnd() > 0.55) roofs += `<rect x="${x + 6 + rnd() * (w - 14)}" y="${400 - hh + 12 + rnd() * (hh - 30)}" width="6" height="8" fill="#ffcf7a" opacity=".8"/>`; x += w; }
      return svg(400, 400, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".5" stop-color="#e86a8a"/><stop offset="1" stop-color="#ffc07a"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#${g})"/><circle cx="260" cy="250" r="40" fill="#ffe0a0" opacity=".9"/>
        <path d="M240 240 L250 150 L262 150 L270 240" fill="#2a1830"/><rect x="246" y="130" width="20" height="24" fill="#2a1830"/><path d="M256 112 L256 130" stroke="#2a1830" stroke-width="3"/>
        ${roofs}`);
    },

    whiteboard() {
      return svg(400, 400, `<rect width="400" height="400" fill="#d8dde2"/><rect x="20" y="30" width="360" height="300" rx="6" fill="#fbfbfb" stroke="#9aa" stroke-width="6"/>
        <text x="40" y="76" font-family="Caveat,cursive" font-size="30" fill="#1a4a9a">Q4 — OBJECTIFS 🚀</text>
        <text x="44" y="118" font-family="Caveat,cursive" font-size="24" fill="#222">• 3M utilisatrices</text>
        <text x="44" y="152" font-family="Caveat,cursive" font-size="24" fill="#222">• Monétisation « Partenaires » x3</text>
        <text x="44" y="186" font-family="Caveat,cursive" font-size="24" fill="#222">• Rétention : notifs « rassurantes »</text>
        <text x="44" y="220" font-family="Caveat,cursive" font-size="24" fill="#222">• Nouveau segment : particuliers 💰</text>
        <path d="M40 232 L340 232" stroke="#d62a2a" stroke-width="3"/>
        <text x="60" y="280" font-family="Caveat,cursive" font-size="34" fill="#d62a2a" transform="rotate(-5 200 280)">QUI SONT LES « PARTENAIRES » ???</text>
        <rect x="20" y="330" width="360" height="12" fill="#9aa"/>`);
    },

    requete() {
      return svg(400, 400, `<rect width="400" height="400" fill="#0a0c0a"/>
        <rect width="400" height="36" fill="#102010"/><text x="14" y="23" font-family="monospace" font-size="13" fill="#9dff9d">lumen-admin › requetes › #4471</text>
        <g font-family="monospace" font-size="12.5" fill="#9dff9d">
        <text x="16" y="70">REQUÊTE      #4471</text><text x="16" y="92">CLIENT       particulier (via DataNexa)</text>
        <text x="16" y="114">CIBLE        L. M. — 31 ans — Villeurbanne</text><text x="16" y="136">TYPE         suivi quotidien (14 pts/j)</text>
        <text x="16" y="158">TARIF        49 € / mois</text><text x="16" y="180">MOTIF        « retrouver une proche »</text>
        <text x="16" y="202" fill="#ffd36b">VÉRIF.       aucune</text><text x="16" y="224">STATUT       LIVRÉ — 112 jours</text></g>
        <rect x="16" y="250" width="368" height="110" fill="none" stroke="#ff6b6b" stroke-width="2"/>
        <text x="200" y="285" font-family="Caveat,cursive" font-size="28" fill="#ff6b6b" text-anchor="middle">C'est son ex.</text>
        <text x="200" y="318" font-family="Caveat,cursive" font-size="28" fill="#ff6b6b" text-anchor="middle">On lui a VENDU où elle était.</text>
        <text x="200" y="348" font-family="Caveat,cursive" font-size="22" fill="#ff6b6b" text-anchor="middle">→ article Lyon Actu 12/09</text>
        <text x="380" y="392" font-family="monospace" font-size="9" fill="#4f8f4f" text-anchor="end">capture 26/10 23:58</text>`);
    },

    /* carte de Lyon stylisée */
    mapLyon() {
      let streets = '';
      for (let i = 0; i < 16; i++) streets += `<path d="M${-20 + i * 28} 0 L${30 + i * 26} 844" stroke="#2a2a30" stroke-width="${i % 4 === 0 ? 5 : 2}"/>`;
      for (let i = 0; i < 22; i++) streets += `<path d="M0 ${i * 42} L390 ${i * 42 + 30}" stroke="#2a2a30" stroke-width="${i % 5 === 0 ? 5 : 2}"/>`;
      const pin = (x, y, c, label, emo) => `<g transform="translate(${x} ${y})"><circle r="16" fill="${c}" stroke="#fff" stroke-width="3"/><text y="6" text-anchor="middle" font-size="15">${emo}</text><text y="34" text-anchor="middle" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">${label}</text></g>`;
      return svg(390, 844, `<rect width="390" height="844" fill="#1b1b20"/>${streets}
        <path d="M60 0 C40 120 120 200 100 330 C80 460 140 560 120 844" stroke="#1f3a5a" stroke-width="38" fill="none"/>
        <path d="M330 0 C300 160 250 280 260 420 C270 560 220 700 200 844" stroke="#1f3a5a" stroke-width="44" fill="none"/>
        <path d="M120 440 C170 460 220 470 260 430" stroke="#1f3a5a" stroke-width="18" fill="none" opacity=".0"/>
        <rect x="140" y="90" width="80" height="50" rx="8" fill="#22362a"/><rect x="290" y="470" width="60" height="90" rx="8" fill="#22362a"/>
        ${pin(185, 150, '#ff9f0a', 'Domicile', '🏠')}
        ${pin(170, 360, '#8b7bff', 'Lumen', '💼')}
        ${pin(300, 330, '#30d158', 'Part-Dieu', '🚆')}
        ${pin(60, 250, '#8e8e93', 'Loyasse', '🕯️')}
        ${pin(210, 230, '#ff453a', 'DAB', '💶')}`);
    },

    /* carte de France stylisée avec itinéraire */
    mapFrance(showRoute = true) {
      return svg(390, 844, `<rect width="390" height="844" fill="#0f1a26"/>
        <path d="M70 250 L120 215 L175 200 L215 170 L265 180 L300 215 L330 240 L345 300 L330 350 L345 420 L320 470 L330 520 L290 560 L240 590 L200 600 L150 585 L130 530 L120 480 L100 430 L80 380 L40 340 L10 320 L20 300 L55 300 L60 270 Z" fill="#1f2b38" stroke="#3a4a5a" stroke-width="2"/>
        ${showRoute ? `<path d="M290 440 C240 400 160 360 22 312" stroke="#0a84ff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M22 312 C10 306 0 300 -2 296" stroke="#0a84ff" stroke-width="4" stroke-dasharray="4 8" fill="none" opacity=".8"/>` : ''}
        <circle cx="290" cy="440" r="8" fill="#30d158" stroke="#fff" stroke-width="2"/><text x="302" y="445" font-family="Inter,Arial" font-weight="700" font-size="13" fill="#fff">Lyon</text>
        <circle cx="22" cy="312" r="8" fill="#ff453a" stroke="#fff" stroke-width="2"/><text x="30" y="300" font-family="Inter,Arial" font-weight="700" font-size="13" fill="#fff">Brest</text>
        <text x="8" y="290" font-family="Inter,Arial" font-size="18" fill="#fff" opacity=".9">?</text>
        <text x="196" y="250" font-family="Inter,Arial" font-size="12" fill="#5a6a7a">Paris</text><circle cx="210" cy="260" r="3" fill="#5a6a7a"/>
        <text x="96" y="378" font-family="Inter,Arial" font-size="12" fill="#5a6a7a">Nantes</text><circle cx="110" cy="388" r="3" fill="#5a6a7a"/>`);
    },

    mini(kind) { return this[kind](); },
  };
})();
