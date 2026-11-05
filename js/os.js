/* ==========================================================
   HORS LIGNE — "NoraOS" : le système du téléphone
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
function twice(el, label, fn) {
  if (el.dataset.armed) { fn(); return; }
  const old = el.innerHTML; el.dataset.armed = '1'; el.innerHTML = label;
  setTimeout(() => { if (el.isConnected) { delete el.dataset.armed; el.innerHTML = old; } }, 4000);
}
const nowHM = () => { const d = new Date(); return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); };

/* ---------------- état & sauvegarde ---------------- */
const SAVE_KEY = 'horsligne_v1';
function freshState() {
  return { started: false, playMs: 0, flags: {}, clues: {}, msgs: {}, unread: { jade: 3, maman: 2, quiches: 3, theo: 0, lumensms: 1, banque: 1 },
    choices: {}, voicemails: [], recents: [], readMail: {}, readNotes: {}, battery: 23, endings: [], muted: false, fails: 0, hint: 0,
    calledMamie: 0, lastEnding: null, newClues: {} };
}
let S;
try { S = Object.assign(freshState(), JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch (e) { S = freshState(); }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
function flag(k) { if (!S.flags[k]) { S.flags[k] = Date.now(); save(); Bus.emit('flag', k); } }
const has = k => !!S.flags[k];
// Ce que le joueur sait déjà : sert à ne jamais dévoiler un élément avant son indice.
const knows = {
  morel: () => !!(S.clues.M1 || S.clues.M4),        // il a entendu parler de « Morel »
  carPhoto: () => !!S.clues.M5,                      // il a vu la photo supprimée de la voiture
  maskedCall: () => has('sawRecents'),               // il a vu l'appel masqué de 03:12
};

const Bus = { ev: {}, on(n, f) { (this.ev[n] = this.ev[n] || []).push(f); }, off(n, f) { this.ev[n] = (this.ev[n] || []).filter(x => x !== f); }, emit(n, d) { (this.ev[n] || []).slice().forEach(f => { try { f(d); } catch (e) { console.error(e); } }); } };

/* ---------------- icônes ---------------- */
const W = '#fff';
const ICONS = {
  messages: { bg: 'linear-gradient(180deg,#5ef27a,#1fc23e)', svg: `<svg viewBox="0 0 60 60"><path d="M30 14c-10.5 0-19 6.9-19 15.4 0 4.9 2.8 9.2 7.2 12-.4 2.6-1.8 5.1-4 6.8 4 .3 7.6-1 10-3.2 1.8.5 3.8.8 5.8.8 10.5 0 19-6.9 19-15.4S40.5 14 30 14z" fill="${W}"/></svg>` },
  phone: { bg: 'linear-gradient(180deg,#5ef27a,#1fc23e)', svg: `<svg viewBox="0 0 60 60"><path d="M22.6 15.5c-1-1.3-2.9-1.4-4-.2l-3.2 3.2c-2 2-2.4 5.1-.9 7.5 5 8.4 11.9 15.3 20.3 20.3 2.4 1.5 5.5 1.1 7.5-.9l3.2-3.2c1.2-1.1 1.1-3-.2-4l-5.3-4c-1.1-.8-2.6-.7-3.6.2l-2 2c-4.1-2.1-7.9-5.9-10-10l2-2c.9-1 1-2.5.2-3.6z" fill="${W}"/></svg>` },
  photos: { bg: 'linear-gradient(160deg,#ffd36b,#ff7a59 55%,#c2457a)', svg: `<svg viewBox="0 0 60 60"><circle cx="40" cy="20" r="6" fill="#fff8d0"/><path d="M8 46 L22 28 L31 38 L38 31 L52 46Z" fill="${W}" opacity=".95"/></svg>` },
  mail: { bg: 'linear-gradient(180deg,#4fb3ff,#0a6cff)', svg: `<svg viewBox="0 0 60 60"><rect x="11" y="17" width="38" height="27" rx="4" fill="${W}"/><path d="M12 19 L30 33 L48 19" stroke="#2a86ff" stroke-width="2.5" fill="none"/></svg>` },
  notes: { bg: 'linear-gradient(180deg,#fff 0 30%,#fffbea 30%)', svg: `<svg viewBox="0 0 60 60"><rect x="0" y="0" width="60" height="17" fill="#ffd23f"/>${[26, 34, 42, 50].map(y => `<path d="M10 ${y} H50" stroke="#d8d4c4" stroke-width="1.5"/>`).join('')}</svg>` },
  maps: { bg: 'linear-gradient(160deg,#9be38a,#5ec2ff)', svg: `<svg viewBox="0 0 60 60"><path d="M0 40 L60 22" stroke="#fff" stroke-width="7" opacity=".9"/><path d="M22 0 L34 60" stroke="#ffd36b" stroke-width="5"/><path d="M40 14c-5 0-9 4-9 9 0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9z" fill="#ff453a"/><circle cx="40" cy="23" r="3.5" fill="#fff"/></svg>` },
  calendar: { bg: '#fff', svg: `<svg viewBox="0 0 60 60"><text x="30" y="19" font-family="Inter,Arial" font-size="10" font-weight="700" fill="#ff3b30" text-anchor="middle">MER.</text><text x="30" y="47" font-family="Inter,Arial" font-size="30" font-weight="400" fill="#111" text-anchor="middle">4</text></svg>` },
  browser: { bg: 'linear-gradient(180deg,#fff,#e8eef5)', svg: `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="20" fill="url(#bcg)"/><defs><linearGradient id="bcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ac8ff"/><stop offset="1" stop-color="#1a6cff"/></linearGradient></defs>${Array.from({ length: 24 }, (_, i) => `<path d="M30 11.5 V14" stroke="#fff" stroke-width="1" transform="rotate(${i * 15} 30 30)"/>`).join('')}<path d="M38 22 L32 32 L22 38 L28 28Z" fill="#ff453a"/><path d="M32 32 L22 38 L28 28Z" fill="#fff"/></svg>` },
  settings: { bg: 'linear-gradient(180deg,#a2a2aa,#6a6a72)', svg: `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="14" fill="none" stroke="#e8e8ee" stroke-width="7" stroke-dasharray="4.4 3"/><circle cx="30" cy="30" r="11" fill="#5a5a62"/><circle cx="30" cy="30" r="6" fill="none" stroke="#e8e8ee" stroke-width="3"/></svg>` },
  memos: { bg: 'linear-gradient(180deg,#2c2c30,#111)', svg: `<svg viewBox="0 0 60 60">${[6, 14, 22, 12, 26, 18, 10, 20, 8].map((hh, i) => `<rect x="${12 + i * 4.2}" y="${30 - hh / 2}" width="2.4" height="${hh}" rx="1.2" fill="${i === 4 ? '#ff453a' : '#fff'}"/>`).join('')}</svg>` },
  calc: { bg: '#1c1c1e', svg: `<svg viewBox="0 0 60 60"><circle cx="21" cy="21" r="8" fill="#a5a5a5"/><circle cx="39" cy="21" r="8" fill="#ff9f0a"/><circle cx="21" cy="39" r="8" fill="#505055"/><circle cx="39" cy="39" r="8" fill="#ff9f0a"/><path d="M35.5 21h7M39 17.5v7M35.5 37.5h7M35.5 40.5h7M18 21h6" stroke="#fff" stroke-width="2"/></svg>` },
  weather: { bg: 'linear-gradient(180deg,#3a8cff,#7cc4ff)', svg: `<svg viewBox="0 0 60 60"><circle cx="24" cy="24" r="9" fill="#ffd60a"/><path d="M22 44 h20 a7 7 0 0 0 0-14 a10 10 0 0 0-19 2 a6 6 0 0 0-1 12z" fill="${W}"/></svg>` },
  flux: { bg: 'linear-gradient(135deg,#ffb36b,#ff4f8b 50%,#8b5bff)', svg: `<svg viewBox="0 0 60 60">${[20, 30, 40].map(y => `<path d="M14 ${y} q4 -5 8 0 t8 0 t8 0 t8 0" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('')}</svg>` },
  lumen: { bg: 'radial-gradient(circle at 50% 40%,#3a2b8a,#0e0a26)', svg: `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="17" fill="none" stroke="#8b7bff" stroke-width="1" opacity=".5"/><circle cx="30" cy="30" r="11" fill="none" stroke="#8b7bff" stroke-width="1.2" opacity=".8"/><circle cx="30" cy="30" r="6" fill="#d9d2ff"/><circle cx="30" cy="30" r="9" fill="#8b7bff" opacity=".35"/></svg>` },
  bank: { bg: 'linear-gradient(160deg,#14a080,#07463a)', svg: `<svg viewBox="0 0 60 60"><text x="30" y="40" font-family="Inter,Arial" font-weight="800" font-size="28" fill="#fff" text-anchor="middle">€</text><path d="M14 46 H46" stroke="#7fffd8" stroke-width="2.5"/></svg>` },
  ombre: { bg: '#000', svg: `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="15" fill="#e8e8e8"/><path d="M30 15 A15 15 0 0 0 30 45Z" fill="#000"/><circle cx="30" cy="30" r="15" fill="none" stroke="#555" stroke-width="1"/></svg>` },
  carnet: { bg: 'linear-gradient(160deg,#a8743a,#5a3416)', svg: `<svg viewBox="0 0 60 60"><rect x="15" y="10" width="30" height="40" rx="3" fill="#f3ead7"/><rect x="15" y="10" width="6" height="40" fill="#d8c8a8"/>${[20, 26, 32, 38].map(y => `<path d="M25 ${y} H40" stroke="#b8a888" stroke-width="1.4"/>`).join('')}<rect x="38" y="10" width="3" height="40" fill="#7a2a1a"/><text x="33" y="47" font-family="Caveat,cursive" font-size="9" fill="#7a2a1a" text-anchor="middle">?</text></svg>` },
  health: { bg: '#fff', svg: `<svg viewBox="0 0 60 60"><path d="M30 47 C14 36 9 28 9 21 a10 10 0 0 1 21 -3 a10 10 0 0 1 21 3 c0 7 -5 15 -21 26z" fill="#ff2d55"/><path d="M13 30 h9 l3 -6 l5 12 l3 -6 h14" stroke="#fff" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>` },
  camera: { bg: 'linear-gradient(180deg,#c8c8cc,#8a8a90)', svg: `<svg viewBox="0 0 60 60"><rect x="12" y="20" width="36" height="24" rx="5" fill="#2a2a2e"/><rect x="22" y="16" width="14" height="6" rx="2" fill="#2a2a2e"/><circle cx="30" cy="32" r="8" fill="#4a4a50" stroke="#c8c8cc" stroke-width="2"/></svg>` },
};
function iconHTML(id) { const i = ICONS[id]; return `<div class="icon" style="background:${i.bg}">${i.svg}</div>`; }

/* ---------------- OS ---------------- */
const OS = {
  screen: null, locked: true, app: null, appEl: null, inCall: false, overlayOn: false, ended: false,

  init() {
    this.screen = $('#screen');
    $('#wall').innerHTML = ART.kafka();
    this.clock(); setInterval(() => this.clock(), 5000);
    this.battery();
    $('#homebar').addEventListener('click', () => this.home());
    let sy = null;
    $('#homebar').addEventListener('pointerdown', e => { sy = e.clientY; });
    $('#homebar').addEventListener('pointerup', e => { if (sy !== null && sy - e.clientY > 20) this.home(); sy = null; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.home(); });
    Bus.on('clue', () => this.sideUpdate());
    this.sideUpdate();
  },

  clock() {
    const t = nowHM();
    $('#sbTime').textContent = t;
    const lt = $('.lk-time'); if (lt) lt.textContent = t;
  },
  battery() {
    const b = S.battery;
    $('#sbBattFill').style.width = b + '%';
    $('.sb-batt').classList.toggle('low', b <= 15);
  },
  setStatus(mode) { this.screen.classList.toggle('light-status', mode === 'light'); },

  /* ---- île dynamique ---- */
  island(html, cls = '') {
    const isl = $('#island');
    if (!html) { isl.classList.remove('active'); return; }
    isl.querySelector('.isl-content').innerHTML = html;
    isl.classList.add('active');
  },

  /* ---- panneau latéral ---- */
  sideUpdate() {
    const tot = Object.keys(STORY.clues).length, got = Object.keys(S.clues).length;
    const bar = $('#sideBar'); if (bar) bar.style.width = (got / tot * 100) + '%';
    const c = $('#sideCount'); if (c) c.textContent = `${got} / ${tot} indices`;
    this.badges();
  },

  /* ============ écran verrouillé ============ */
  showLock() {
    const L = $('#lock');
    L.classList.remove('gone', 'hidden');
    $('#wall').innerHTML = ART.kafka();
    $('#wall').className = '';
    const d = new Date();
    L.innerHTML = `
      <div class="lk-top"><div class="lk-padlock">🔒</div><div class="lk-date">mercredi 4 novembre</div><div class="lk-time">${nowHM()}</div></div>
      <div class="lk-notifs"></div>
      <div class="lk-quick l">🔦</div><div class="lk-quick r">📷</div>
      <div class="lk-hint">Touchez pour déverrouiller</div>`;
    L.onclick = e => { if (e.target.closest('.lk-quick')) { Sound.fx.tap(); return; } this.passcode(); };
  },
  lockNotif(n) {
    const box = $('.lk-notifs'); if (!box) return;
    const el = h(`<div class="notif"><div class="nicon">${iconHTML(n.app)}</div><div class="nbody"><div class="nhead"><b>${esc(n.title)}</b><span>${esc(n.when || 'maintenant')}</span></div><p>${esc(n.body)}</p></div></div>`);
    box.prepend(el);
    while (box.children.length > 4) box.lastElementChild.remove();
  },
  passcode() {
    if ($('.pass')) return;
    Sound.fx.tap();
    $('#wall').classList.add('blur');
    const P = h(`<div class="pass"><h3>Saisissez le code</h3><div class="dots"><i></i><i></i><i></i><i></i></div><div class="pass-msg"></div>
      <div class="keypad">${[['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']].map(([k, s]) => `<button data-k="${k}">${k}<small>${s}</small></button>`).join('')}<span></span><button data-k="0">0</button><span></span></div>
      <div class="pass-foot"><button class="pc-sos">Urgence</button><button class="pc-cancel">Annuler</button></div></div>`);
    $('#lock').appendChild(P);
    let code = '';
    const dots = $$('.dots i', P);
    const upd = () => dots.forEach((d, i) => d.classList.toggle('on', i < code.length));
    P.onclick = e => {
      e.stopPropagation();
      const b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('pc-cancel')) { if (code) { code = code.slice(0, -1); upd(); } else { P.remove(); $('#wall').classList.remove('blur'); } return; }
      if (b.classList.contains('pc-sos')) { $('.pass-msg', P).textContent = "En vrai danger : appelle le 17 ou le 112."; return; }
      if (code.length >= 4) return;
      Sound.fx.key(); code += b.dataset.k; upd();
      $('.pc-cancel', P).textContent = 'Supprimer';
      if (code.length === 4) setTimeout(() => {
        if (code === '2209') { this.unlock(); }
        else {
          Sound.fx.error(); $('.dots', P).classList.add('shake');
          S.fails++; save();
          setTimeout(() => { $('.dots', P).classList.remove('shake'); code = ''; upd(); }, 450);
          $('.pass-msg', P).textContent = S.fails >= 2 ? "Code incorrect" : '';
          if (S.fails === 3) setTimeout(() => { P.remove(); $('#wall').classList.remove('blur'); this.lockNotif({ app: 'messages', title: 'Jade 💛', body: "Son chat s'appelle Kafka. Regarde bien le fond d'écran : c'est la photo de son anniv 🎂" }); Sound.fx.message(); }, 700);
        }
      }, 120);
    };
  },
  unlock() {
    Sound.fx.unlock();
    flag('unlocked');
    this.locked = false;
    const L = $('#lock');
    L.classList.add('gone');
    setTimeout(() => { L.classList.add('hidden'); L.innerHTML = ''; }, 600);
    $('#wall').className = '';
    $('#wall').innerHTML = ART.homewall();
    this.renderHome();
    setTimeout(() => $('#home').classList.add('on'), 60);
    if (!has('tipHome')) setTimeout(() => { flag('tipHome'); this.toastInfo('💡', 'Astuce', document.body.classList.contains('mobile') ? "Pour revenir à l'accueil : touche ou glisse la barre en bas de l'écran." : "Pour revenir à l'accueil : la barre en bas de l'écran (ou Échap)."); }, 2500);
  },

  /* ============ accueil ============ */
  homeApps: [
    ['calendar', 'Calendrier'], ['photos', 'Photos'], ['weather', 'Météo'], ['maps', 'Plans'],
    ['notes', 'Notes'], ['mail', 'Mail'], ['memos', 'Dictaphone'], ['settings', 'Réglages'],
    ['flux', 'Flux'], ['lumen', 'Lumen'], ['bank', 'Azur'], ['calc', 'Calculatrice'],
    ['ombre', 'Ombre'], ['health', 'Santé'], ['camera', 'Caméra'],
  ],
  dockApps: [['phone', 'Téléphone'], ['messages', 'Messages'], ['browser', 'Navigateur'], ['carnet', 'Carnet']],
  renderHome() {
    const H = $('#home');
    const ico = ([id, name]) => `<div class="app-ico" data-app="${id}">${iconHTML(id)}<span class="lbl">${name}</span></div>`;
    H.innerHTML = `
      <div class="widget" data-photo="ouessant">${ART.ouessant()}<div class="wtext"><small>Souvenirs · il y a 7 ans</small><b>Le bout du monde</b></div></div>
      <div class="grid">${this.homeApps.map(ico).join('')}</div>
      <div class="page-dots"><i></i></div>
      <div class="dock">${this.dockApps.map(ico).join('')}</div>`;
    H.onclick = e => {
      const w = e.target.closest('.widget');
      if (w) { Sound.fx.tap(); this.open('photos', w, { photo: 'ouessant' }); return; }
      const a = e.target.closest('.app-ico'); if (!a) return;
      Sound.fx.tap();
      this.open(a.dataset.app, a);
    };
    this.badges();
  },
  badges() {
    const H = $('#home'); if (!H || !H.innerHTML) return;
    const counts = {
      messages: Object.values(S.unread).reduce((a, b) => a + (b || 0), 0),
      phone: S.voicemails.filter(v => !v.heard).length + (S.missed || 0),
      mail: has('mailOpen') ? APPS.mail.all().filter(m => !S.readMail[m.id]).length : 0,
      carnet: Object.keys(S.newClues || {}).length,
      flux: has('fluxOpen') ? 0 : 37,
    };
    $$('.app-ico', H).forEach(a => {
      const id = a.dataset.app;
      a.querySelector('.badge')?.remove(); a.querySelector('.lockb')?.remove();
      const c = counts[id];
      if (c) a.appendChild(h(`<div class="badge">${c > 99 ? '99+' : c}</div>`));
      const lockFlag = { mail: 'mailOpen', bank: 'bankOpen', ombre: 'ombreOpen' }[id];
      if (lockFlag && !has(lockFlag)) a.appendChild(h(`<div class="lockb">🔒</div>`));
    });
  },

  /* ============ applis ============ */
  open(id, fromEl, opts = {}) {
    if (this.inCall) return;
    const A = APPS[id]; if (!A) return;
    Overlay.close();
    this.closeApp(true);
    const win = $('#appwin');
    const el = h(`<div class="app app-${id}"></div>`);
    if (fromEl) {
      const r = fromEl.getBoundingClientRect(), sr = this.screen.getBoundingClientRect();
      const sc = sr.width / this.screen.offsetWidth;
      el.style.setProperty('--ox', ((r.left + r.width / 2 - sr.left) / sc) + 'px');
      el.style.setProperty('--oy', ((r.top + r.height / 2 - sr.top) / sc) + 'px');
    }
    win.appendChild(el);
    this.app = id; this.appEl = el;
    $('#home').classList.add('behind');
    this.setStatus(A.light ? 'light' : 'dark');
    try { A.open(el, opts); } catch (e) { console.error(e); }
    Bus.emit('appopen', id);
  },
  closeApp(instant = false) {
    const el = this.appEl; if (!el) return;
    const id = this.app;
    this.app = null; this.appEl = null;
    Bus.emit('appclose', id);
    if (instant) el.remove();
    else { el.classList.add('closing'); setTimeout(() => el.remove(), 330); }
    this.setStatus('dark');
  },
  home() {
    if (this.inCall || this.locked || this.ended) return;
    if (this.overlayOn) { Overlay.close(); return; }
    if (!this.appEl) return;
    Sound.fx.whoosh();
    this.closeApp();
    $('#home').classList.remove('behind');
    this.badges();
  },

  /* ============ notifications ============ */
  notify({ app, title, body, sound = 'notif', onTap = null }) {
    if (sound && Sound.fx[sound]) Sound.fx[sound]();
    if (this.locked) { this.lockNotif({ app, title, body }); return; }
    const box = $('#banners');
    const el = h(`<div class="notif"><div class="nicon">${iconHTML(app)}</div><div class="nbody"><div class="nhead"><b>${esc(title)}</b><span>maintenant</span></div><p>${esc(body)}</p></div></div>`);
    box.appendChild(el);
    const kill = () => { el.classList.add('out'); setTimeout(() => el.remove(), 350); };
    el.onclick = () => { kill(); if (onTap) onTap(); };
    setTimeout(kill, 5200);
    while (box.children.length > 2) box.firstElementChild.remove();
    this.badges();
  },
  toastInfo(ico, title, sub) {
    const t = $('#cluetoast');
    t.innerHTML = `<span class="ct-ico">${ico}</span><div>${esc(title)}<small>${esc(sub)}</small></div>`;
    t.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 4200);
  },
};

/* ---------------- indices ---------------- */
function clue(id) {
  if (!STORY.clues[id] || S.clues[id]) return false;
  S.clues[id] = Date.now();
  S.newClues = S.newClues || {}; S.newClues[id] = 1;
  save();
  setTimeout(() => { Sound.fx.clue(); OS.toastInfo('🔎', 'Indice noté dans le carnet', STORY.clues[id].t); }, 300);
  Bus.emit('clue', id);
  return true;
}

/* ---------------- navigation interne ---------------- */
class Nav {
  constructor(root) { this.root = root; this.stack = []; }
  push(v) {
    const prev = this.stack[this.stack.length - 1];
    this.stack.push(v); this.root.appendChild(v);
    if (prev) { v.classList.add('enter'); v.offsetWidth; requestAnimationFrame(() => { v.classList.remove('enter'); prev.classList.add('behind'); }); Sound.fx.page(); }
    return v;
  }
  pop() {
    if (this.stack.length < 2) return;
    const v = this.stack.pop(), prev = this.stack[this.stack.length - 1];
    prev.classList.remove('behind'); v.classList.add('enter');
    setTimeout(() => v.remove(), 400);
    prev.dispatchEvent(new Event('reshow'));
  }
  replace(v) { const old = this.stack.pop(); if (old) old.remove(); this.stack.push(v); this.root.appendChild(v); return v; }
}
function makeView(nav, { title = '', back = null, large = false, right = '', cls = '', body = '', sep = false, noNav = false }) {
  const canBack = nav.stack.length > 0;
  const v = h(`<div class="view ${cls}">
    ${noNav ? '' : `<div class="navbar ${sep ? 'sep' : ''}">${canBack ? `<button class="back">${esc(back || 'Retour')}</button>` : '<span></span>'}<div class="ntitle">${large ? '' : esc(title)}</div><div class="nright">${right}</div></div>`}
    <div class="vbody">${large ? `<h1 class="ltitle">${esc(title)}</h1>` : ''}${body}</div></div>`);
  const b = v.querySelector('.back'); if (b) b.onclick = () => nav.pop();
  return v;
}

/* ---------------- messages ---------------- */
function threadMsgs(tid) { const T = STORY.threads[tid] || STORY.deletedThreads[tid]; return (T?.msgs || []).concat(S.msgs[tid] || []); }
function ensureThread(tid) {
  if (!STORY.threads[tid] && tid === 'morel') {
    STORY.threads.morel = { name: '+33 6 39 98 71 44', ini: '?', col: '#636366', num: STORY.morelNum, msgs: [] };
  }
  if (!STORY.threads[tid] && tid === 'inconnu') {
    STORY.threads.inconnu = { name: 'Numéro inconnu', ini: '?', col: '#3a3a3c', num: 'inconnu', msgs: [] };
  }
  if (!STORY.threadOrder.includes(tid)) STORY.threadOrder.unshift(tid);
}
function pushMsg(tid, m) {
  ensureThread(tid);
  S.msgs[tid] = S.msgs[tid] || [];
  if (!S.msgs[tid].length || S.msgs[tid][0].day !== "Aujourd'hui") { if (!(S.msgs[tid] || []).some(x => x.day)) S.msgs[tid].push({ day: "Aujourd'hui" }); }
  m.at = nowHM();
  S.msgs[tid].push(m);
  S.lastActivity = S.lastActivity || {}; S.lastActivity[tid] = Date.now();
  STORY.threadOrder = [tid].concat(STORY.threadOrder.filter(x => x !== tid));
  S.threadOrder = STORY.threadOrder;
  const open = Msg.openThread === tid && OS.app === 'messages';
  if (m.f !== 'me' && !open) S.unread[tid] = (S.unread[tid] || 0) + 1;
  save();
  Bus.emit('msg', { tid, m });
  OS.badges();
}
const Msg = {
  openThread: null,
  async receive(tid, lines, { gap = 1100, notifyTitle = null } = {}) {
    ensureThread(tid);
    for (const line of lines) {
      Bus.emit('typing', { tid, on: true });
      await sleep(Math.min(3200, gap + line.length * 22));
      Bus.emit('typing', { tid, on: false });
      pushMsg(tid, { f: 'them', t: line });
      const open = Msg.openThread === tid && OS.app === 'messages';
      if (open) Sound.fx.message();
      else OS.notify({ app: 'messages', title: notifyTitle || STORY.threads[tid].name, body: line, sound: 'message', onTap: () => OS.open('messages', null, { thread: tid }) });
      await sleep(300);
    }
  },
  setChoices(tid, setId) { S.choices[tid] = setId; save(); Bus.emit('choices', tid); },
  choose(tid, idx) {
    const set = CHOICES[S.choices[tid]]; if (!set) return;
    const opt = set[idx];
    delete S.choices[tid]; save();
    Sound.fx.sent();
    pushMsg(tid, { f: 'me', t: opt.label });
    Bus.emit('choices', tid);
    if (opt.then) setTimeout(() => opt.then(), 600);
  },
};

/* ---------------- lecteur d'étapes (appels, mémos) ---------------- */
function stepsDuration(steps) {
  let ms = 0;
  for (const s of steps) {
    if (s.t) ms += Voice.estimate(s.t, (Voice.PROFILES[s.who] || Voice.PROFILES.robot).rate) + 250;
    else if (s.wait) ms += s.wait; else if (s.fx) ms += 1300; else if (s.foghorn) ms += 1500; else if (s.gull) ms += 700; else if (s.breath) ms += 2600; else if (s.rec) ms += s.rec * 1000;
    else if (s.me) ms += Math.min(2600, 900 + s.me.length * 25);
  }
  return ms;
}
async function runSteps(steps, ui, token) {
  for (const s of steps) {
    if (token.cancel) return;
    if (s.rec) { for (let i = 0; i < s.rec * 10 && !token.cancel; i++) { if (i % 10 === 0) ui.rec && ui.rec(i / 10); await sleep(100); } ui.rec && ui.rec(false); continue; }
    if (s.sfx) { Sound.layer(s.sfx, true); continue; }
    if (s.stopsfx) { Sound.layer(s.stopsfx, false); continue; }
    if (s.foghorn) { Sound.foghorn(); ui.fx && ui.fx('(une corne de brume, au loin)'); await sleep(1500); continue; }
    if (s.gull) { Sound.gull(); ui.fx && ui.fx('(des mouettes)'); await sleep(700); continue; }
    if (s.breath) { Sound.breath(); ui.fx && ui.fx('(une respiration)'); await sleep(2600); continue; }
    if (s.wait) { await sleep(s.wait); continue; }
    if (s.fx) { ui.fx && ui.fx(s.fx); await sleep(1300); continue; }
    if (s.fn) { s.fn(); continue; }
    if (s.me) { ui.me && ui.me(s.me); await sleep(Math.min(2600, 900 + s.me.length * 25)); continue; }
    if (s.choice) {
      const idx = await ui.choice(s.choice.map(c => c.label), token);
      if (token.cancel) return;
      const c = s.choice[idx];
      ui.me && ui.me(c.label);
      await sleep(700);
      if (c.steps) await runSteps(c.steps, ui, token);
      continue;
    }
    if (s.t) {
      ui.line(s.n || '', s.t, s.who);
      ui.speaking && ui.speaking(true);
      await Voice.say(s.t, s.who, token);
      ui.speaking && ui.speaking(false);
      await sleep(250);
    }
  }
}

/* ---------------- appels ---------------- */
const Call = {
  token: null, timer: null, t0: 0,
  el() { return $('#call'); },
  contactFor(num) { return STORY.contacts.find(c => norm(c.num) === norm(num)); },
  ui(el) {
    const sub = $('.c-sub', el), ch = $('.c-choices', el);
    const add = (cls, html) => { const l = h(`<div class="line ${cls}">${html}</div>`); sub.appendChild(l); while (sub.children.length > 3) sub.firstElementChild.remove(); };
    return {
      line: (n, t) => add('', `${n ? `<div class="who">${esc(n)}</div>` : ''}${esc(t)}`),
      me: t => add('me', '« ' + esc(t) + ' »'),
      fx: t => add('fx', esc(t)),
      choice: (labels, token) => new Promise(res => {
        ch.innerHTML = labels.map((l, i) => `<button class="choice" data-i="${i}">${esc(l)}</button>`).join('');
        el.style.setProperty('--subBottom', (ch.offsetHeight + 196) + 'px');
        ch.onclick = e => { const b = e.target.closest('.choice'); if (!b) return; ch.innerHTML = ''; el.style.removeProperty('--subBottom'); Sound.fx.tap(); res(+b.dataset.i); };
        const chk = setInterval(() => { if (token.cancel) { clearInterval(chk); ch.innerHTML = ''; res(0); } }, 200);
      }),
      rec: v => { const st = $('.c-state', el); if (!st) return; if (v === false) { st.textContent = 'Message enregistré'; return; } st.innerHTML = '<span style="color:var(--red)">● Enregistrement · 0:0' + v + '</span>'; },
      speaking: on => OS.island(on ? `<span>📞</span><div class="isl-wave green"><i></i><i></i><i></i><i></i></div>` : `<span>📞</span><span style="color:var(--green)">${Call.elapsed()}</span>`),
    };
  },
  elapsed() { const s = Math.floor((Date.now() - this.t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); },
  frame({ name, state, ini = '', col, masked = false }) {
    const el = this.el();
    el.className = 'on' + (masked ? ' masked' : '');
    el.innerHTML = `<div class="c-avatar" style="${col ? `background:${col}` : ''}">${esc(ini || '👤')}</div>
      <div class="c-name">${esc(name)}</div><div class="c-state">${esc(state)}</div>
      <div class="c-sub"></div><div class="c-choices"></div>`;
    OS.inCall = true;
    return el;
  },
  activeButtons(el) {
    el.insertAdjacentHTML('beforeend', `<div class="c-btns"><button class="c-btn red hang"><svg viewBox="0 0 60 60"><path d="M22.6 15.5c-1-1.3-2.9-1.4-4-.2l-3.2 3.2c-2 2-2.4 5.1-.9 7.5 5 8.4 11.9 15.3 20.3 20.3 2.4 1.5 5.5 1.1 7.5-.9l3.2-3.2c1.2-1.1 1.1-3-.2-4l-5.3-4c-1.1-.8-2.6-.7-3.6.2l-2 2c-4.1-2.1-7.9-5.9-10-10l2-2c.9-1 1-2.5.2-3.6z"/></svg></button></div>`);
    $('.c-btns', el).style.gap = '0';
    $('.hang', el).onclick = () => this.end(true);
  },
  startTimer(el) {
    this.t0 = Date.now();
    clearInterval(this.timer);
    this.timer = setInterval(() => { const st = $('.c-state', el); if (st) st.textContent = this.elapsed(); }, 500);
  },
  /* appel entrant */
  incoming({ name, ini, col, masked = false, script, onMiss, onDone }) {
    if (OS.inCall) return false;
    Overlay.close();
    const el = this.frame({ name, state: masked ? 'appel…' : 'mobile', ini, col, masked });
    el.insertAdjacentHTML('beforeend', `<div class="c-btns"><button class="c-btn red dec"><svg viewBox="0 0 60 60"><path d="M22.6 15.5c-1-1.3-2.9-1.4-4-.2l-3.2 3.2c-2 2-2.4 5.1-.9 7.5 5 8.4 11.9 15.3 20.3 20.3 2.4 1.5 5.5 1.1 7.5-.9l3.2-3.2c1.2-1.1 1.1-3-.2-4l-5.3-4c-1.1-.8-2.6-.7-3.6.2l-2 2c-4.1-2.1-7.9-5.9-10-10l2-2c.9-1 1-2.5.2-3.6z"/></svg><span>Refuser</span></button>
      <button class="c-btn green acc"><svg viewBox="0 0 60 60"><path d="M22.6 15.5c-1-1.3-2.9-1.4-4-.2l-3.2 3.2c-2 2-2.4 5.1-.9 7.5 5 8.4 11.9 15.3 20.3 20.3 2.4 1.5 5.5 1.1 7.5-.9l3.2-3.2c1.2-1.1 1.1-3-.2-4l-5.3-4c-1.1-.8-2.6-.7-3.6.2l-2 2c-4.1-2.1-7.9-5.9-10-10l2-2c.9-1 1-2.5.2-3.6z"/></svg><span>Accepter</span></button></div>`);
    Sound.startRing(masked ? 'masked' : 'normal');
    OS.island(`<span>📞</span><span>${esc(name)}</span>`);
    let answered = false;
    const missT = setTimeout(() => { if (!answered) decline(); }, 26000);
    const decline = () => {
      clearTimeout(missT); Sound.stopRing(); this.close();
      S.recents.unshift({ name, num: '', type: 'miss', when: nowHM() }); S.missed = (S.missed || 0) + 1; save(); OS.badges();
      onMiss && onMiss();
    };
    $('.dec', el).onclick = decline;
    $('.acc', el).onclick = async () => {
      answered = true; clearTimeout(missT); Sound.stopRing(); Sound.click();
      $('.c-btns', el).remove();
      this.activeButtons(el); this.startTimer(el);
      S.recents.unshift({ name, num: '', type: 'in', when: nowHM() }); save();
      const tok = this.token = { cancel: false };
      Sound.layer('line', true);
      await runSteps(script, this.ui(el), tok);
      if (!tok.cancel) { Sound.fx.hangup(); this.fxEnd(el); await sleep(1100); this.close(); onDone && onDone(); }
      else onDone && onDone();
    };
    return true;
  },
  /* appel sortant */
  async outgoing(num, displayName) {
    if (OS.inCall) return;
    const c = this.contactFor(num);
    const name = displayName || (c ? c.name : num);
    const el = this.frame({ name, state: 'appel…', ini: c ? c.ini : '', col: c ? c.col : null });
    this.activeButtons(el);
    OS.island(`<span>📞</span><span>appel…</span>`);
    S.recents.unshift({ name, num, type: 'out', when: nowHM() }); save();
    const tok = this.token = { cancel: false };
    const handler = CALLS.resolve(num);
    Sound.startDial();
    await sleep(handler.rings * 3000 + 300);
    Sound.stopDial();
    if (tok.cancel) return;
    this.startTimer(el);
    Sound.click();
    if (handler.kind !== 'voicemail-silent') Sound.layer('line', true);
    await runSteps(handler.steps, this.ui(el), tok);
    if (!tok.cancel) { Sound.fx.hangup(); this.fxEnd(el); await sleep(1100); this.close(); }
  },
  fxEnd(el) { const st = $('.c-state', el); if (st) st.textContent = 'Appel terminé'; },
  end(user) {
    if (this.token) this.token.cancel = true;
    Voice.stop(); Sound.stopRing(); Sound.stopDial();
    Sound.fx.hangup();
    this.close();
  },
  close() {
    clearInterval(this.timer);
    Voice.stop(); Sound.stopRing(); Sound.stopDial();
    Sound.stopLayers(['drone']);
    const el = this.el(); el.className = ''; el.innerHTML = '';
    OS.inCall = false; OS.island(null); OS.badges();
    Bus.emit('callend');
  },
};

/* ---------------- surcouche (visionneuse, lecteur audio) ---------------- */
const Overlay = {
  token: null,
  open(node) {
    const o = $('#overlay'); o.innerHTML = ''; o.appendChild(node); o.classList.add('on'); OS.overlayOn = true;
  },
  close() {
    if (!OS.overlayOn) return;
    if (this.token) this.token.cancel = true;
    Voice.stop(); Sound.stopLayers(['drone']);
    const o = $('#overlay'); o.classList.remove('on'); o.innerHTML = ''; OS.overlayOn = false; OS.island(null);
    Bus.emit('overlayclose');
  },
  async play({ title, date, steps, cls = '', onEnd }) {
    const total = stepsDuration(steps);
    const fmt = ms => { const t = Math.max(0, Math.round(ms / 1000)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
    const node = h(`<div class="player ${cls}"><h2>${esc(title)}</h2><div class="pdate">${esc(date || '')}</div>
      <div class="pwave">${Array.from({ length: 34 }, () => '<i></i>').join('')}</div>
      <div class="pprog"><div class="pb"><div></div></div><div class="pt"><span class="pe">0:00</span><span class="pr">-${fmt(total)}</span></div></div>
      <div class="psub"></div><button class="preplay">↺ Réécouter</button>
      <button class="pclose">✕</button></div>`);
    this.open(node);
    $('.pclose', node).onclick = () => this.close();
    const bars = $$('.pwave i', node), sub = $('.psub', node), fill = $('.pb div', node);
    let speaking = false, finished = false;
    const t0 = Date.now();
    const anim = setInterval(() => {
      if (!node.isConnected) { clearInterval(anim); return; }
      bars.forEach(b => b.style.height = (speaking ? 6 + Math.random() * 70 : finished ? 4 : 4 + Math.random() * 8) + 'px');
      const el = finished ? total : Math.min(Date.now() - t0, total);
      fill.style.width = (el / total * 100) + '%';
      $('.pe', node).textContent = fmt(el); $('.pr', node).textContent = '-' + fmt(total - el);
    }, 110);
    const add = (c, html) => { const l = h(`<div class="line ${c}">${html}</div>`); sub.appendChild(l); while (sub.children.length > 3) sub.firstElementChild.remove(); };
    const ui = {
      line: (n, t) => add('', `${n ? `<div class="who">${esc(n)}</div>` : ''}${esc(t)}`),
      fx: t => add('fx', esc(t)), me: t => add('fx', esc(t)),
      choice: () => Promise.resolve(0),
      speaking: on => { speaking = on; },
    };
    OS.island(`<span>🎙️</span><div class="isl-wave"><i></i><i></i><i></i><i></i></div>`);
    const tok = this.token = { cancel: false };
    await runSteps(steps, ui, tok);
    Sound.stopLayers(['drone']);
    if (tok.cancel) { clearInterval(anim); return; }
    finished = true; speaking = false;
    add('fx', '— fin du message —'); OS.island(null);
    const rp = $('.preplay', node); rp.classList.add('on');
    rp.onclick = () => { this.close(); setTimeout(() => this.play({ title, date, steps, cls }), 50); };
    onEnd && onEnd();
  },
};
