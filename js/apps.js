/* ==========================================================
   HORS LIGNE — Applications
   ========================================================== */
const APPS = {};
const live = (el, evt, fn) => { const w = d => { if (!el.isConnected) { Bus.off(evt, w); return; } fn(d); }; Bus.on(evt, w); };
const avatar = (ini, col, cls = '') => `<div class="av ${cls}" style="background:${col || '#636366'}">${esc(ini)}</div>`;
const fmtNum = s => s.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim();

/* =================== MESSAGES =================== */
APPS.messages = {
  open(el, opts) {
    const nav = new Nav(el);
    const list = makeView(nav, { title: 'Messages', large: true, right: '<span>✎</span>', body: '<div class="search">🔍 Rechercher</div><div class="tl"></div><div class="group" style="margin-top:22px"><div class="row deleted-row"><div class="ricon" style="background:#3a3a3c">🗑</div><div class="rmain"><b>Supprimés récemment</b><small>1 conversation · effacée le 30 oct.</small></div><span class="chev"></span></div></div>' });
    nav.push(list);
    const render = () => {
      const tl = $('.tl', list);
      tl.innerHTML = STORY.threadOrder.filter(id => STORY.threads[id]).map(id => {
        const T = STORY.threads[id], ms = threadMsgs(id).filter(m => !m.day);
        const last = ms[ms.length - 1] || { t: '' };
        const days = threadMsgs(id).filter(m => m.day); const lastDay = days.length ? days[days.length - 1].day : '';
        const when = last.at || lastDay.replace(/^\w+\.\s/, '');
        const prev = last.img ? '📷 Photo' : (last.f === 'me' ? 'Vous : ' : (T.group && last.f !== 'them' ? last.f + ' : ' : '')) + (last.t || '');
        return `<div class="th-row" data-t="${id}">${S.unread[id] ? '<div class="dotu"></div>' : ''}${avatar(T.ini, T.col)}<div class="th-main"><div class="th-top"><b>${esc(T.name)}</b><span>${esc(when)} ›</span></div><p>${esc(prev)}</p></div></div>`;
      }).join('');
    };
    render();
    list.addEventListener('reshow', render);
    live(list, 'msg', render);
    $('.tl', list).onclick = e => { const r = e.target.closest('.th-row'); if (r) { Sound.fx.tap(); this.thread(nav, r.dataset.t); } };
    $('.deleted-row', list).onclick = () => {
      Sound.fx.tap();
      const d = makeView(nav, { title: 'Supprimés récemment', back: 'Messages', body: `<p style="padding:0 16px 10px;color:var(--text2);font-size:13px">Les conversations sont définitivement effacées après 30 jours.</p>${Object.keys(STORY.deletedThreads).map(id => { const T = STORY.deletedThreads[id]; const last = T.msgs[T.msgs.length - 1]; return `<div class="th-row" data-t="${id}">${avatar(T.ini, T.col)}<div class="th-main"><div class="th-top"><b>${esc(T.name)}</b><span>mer. ›</span></div><p>${esc(last.t)}</p></div></div>`; }).join('')}` });
      nav.push(d);
      $('.vbody', d).onclick = e => { const r = e.target.closest('.th-row'); if (r) { Sound.fx.tap(); this.thread(nav, r.dataset.t); } };
    };
    if (opts.thread) this.thread(nav, opts.thread);
    Bus.on('appclose', function f(id) { if (id === 'messages') { Msg.openThread = null; Bus.off('appclose', f); } });
  },
  thread(nav, tid) {
    const T = STORY.threads[tid] || STORY.deletedThreads[tid];
    Msg.openThread = tid;
    S.unread[tid] = 0; save(); OS.badges();
    const v = h(`<div class="view"><div class="chat-head"><button class="back">Messages</button>${avatar(T.ini, T.col)}<small>${esc(T.name)} ›</small>${T.num && !T.group && !T.sms ? '<button class="callbtn">📞</button>' : ''}</div>
      <div class="chat"></div><div class="composer"></div></div>`);
    $('.back', v).onclick = () => { Msg.openThread = null; nav.pop(); };
    const cb = $('.callbtn', v); if (cb) cb.onclick = () => Call.outgoing(T.num, T.name);
    const chat = $('.chat', v);
    const bubble = (m, prevF) => {
      if (m.day) return `<div class="day"><b>${esc(m.day)}</b></div>`;
      const who = m.f === 'me' ? 'me' : 'them';
      const gap = prevF !== m.f ? ' gap' : '';
      if (m.img) return `<div class="bub ${who} img${gap}">${ART[m.img]()}</div>`;
      const sender = T.group && m.f !== 'me' && m.f !== 'them' && prevF !== m.f ? `<span class="sender">${esc(m.f)}</span>` : '';
      return `<div class="bub ${who}${T.sms && who === 'me' ? ' sms' : ''}${gap}">${sender}${esc(m.t)}</div>`;
    };
    let prevF = null;
    chat.innerHTML = threadMsgs(tid).map(m => { const s = bubble(m, prevF); prevF = m.day ? null : m.f; return s; }).join('');
    const scroll = () => { chat.scrollTop = chat.scrollHeight; };
    nav.push(v); setTimeout(scroll, 30);
    live(v, 'msg', d => {
      if (d.tid !== tid) return;
      $('.typing', chat)?.remove();
      chat.insertAdjacentHTML('beforeend', bubble(d.m, prevF)); prevF = d.m.f; scroll();
      S.unread[tid] = 0; save();
    });
    live(v, 'typing', d => {
      if (d.tid !== tid) return;
      $('.typing', chat)?.remove();
      if (d.on) { chat.insertAdjacentHTML('beforeend', '<div class="typing"><i></i><i></i><i></i></div>'); scroll(); }
    });
    const comp = $('.composer', v);
    const renderComp = () => {
      const set = CHOICES[S.choices[tid]];
      if (set) {
        comp.innerHTML = `<div class="chs"><div class="lbl">Répondre</div>${set.map((o, i) => `<button data-i="${i}">${esc(o.label)}</button>`).join('')}</div>`;
        comp.onclick = e => { const b = e.target.closest('button'); if (b) Msg.choose(tid, +b.dataset.i); };
      } else if (!T.sms && !T.deleted && Topics.list(tid).length) {
        const ts = Topics.list(tid);
        comp.innerHTML = `<div class="chs"><div class="lbl">Écrire à ${esc(T.group ? 'tout le groupe' : (T.name || '').replace(/ \(.*\)/, ''))}</div>${ts.map(t => `<button data-d="${t.id}">${esc(t.label)}</button>`).join('')}</div>`;
        comp.onclick = e => { const b = e.target.closest('button'); if (b) Topics.say(tid, b.dataset.d); };
      } else {
        comp.innerHTML = `<div class="fake">${T.sms ? 'Réponse impossible à ce numéro' : 'Message'}</div>`;
        comp.onclick = () => { Sound.fx.error(); OS.toastInfo('✋', "Rien à lui dire pour l'instant", T.sms ? "On ne peut pas répondre à ce numéro." : "Continue l'enquête : chaque découverte te donnera de quoi lui écrire."); };
      }
      setTimeout(scroll, 30);
    };
    renderComp();
    live(v, 'choices', d => { if (d === tid) renderComp(); });
    live(v, 'clue', () => renderComp());
    if (tid === 'theo') flag('readTheo');
    if (T.deleted) { comp.onclick = null; comp.innerHTML = '<div class="fake" style="justify-content:center;color:var(--red);border-color:#3a1a1a">Conversation supprimée par Nora le 30 oct.</div>'; flag('readBastienDel'); if (T.clue) setTimeout(() => clue(T.clue), 1200); }
  },
};

/* =================== TÉLÉPHONE =================== */
STORY.baseRecents = [
  { name: 'Jade 💛', type: 'miss', when: 'dim.', n: 7 },
  { name: 'Maman', type: 'miss', when: 'dim.', n: 3 },
  { name: 'Théo (Lumen)', type: 'miss', when: 'sam.' },
  { name: 'Numéro masqué', type: 'miss', when: 'ven.', sub: 'ven. 30 oct., 03:12' },
  { name: 'Mamie 🏠', type: 'out', when: 'jeu.', sub: 'jeu. 29 oct., 22:47 · 2 min', num: '02 61 91 48 06' },
  { name: 'NE PAS RÉPONDRE', type: 'miss', when: 'mer.', n: 4 },
  { name: 'Mme Benali (3e G)', type: 'out', when: 'mer.', sub: 'mer. 28 oct., 19:30 · 6 min' },
  { name: 'Jade 💛', type: 'in', when: 'mar.', sub: 'mar. 27 oct. · 24 min' },
];
STORY.baseVoicemails = [
  { id: 'vm_jade', who: 'Jade 💛', date: 'dim. 1 nov.', steps: [{ who: 'jade', n: 'Jade', t: "Nora, c'est moi. Je suis devant ta porte. Kafka n'est pas là, ton téléphone est sur la table. Ça veut dire quoi ? Rappelle-moi. S'il te plaît. Je flippe." }] },
  { id: 'vm_maman', who: 'Maman', date: 'dim. 1 nov.', steps: [{ who: 'maman', n: 'Maman', t: "Ma chérie, c'est maman. Je suis allée sur la tombe de mamie ce matin. Toute seule. Tu m'as manqué. Rappelle-moi, même juste un message. Je t'aime." }] },
  { id: 'vm_theo', who: 'Théo (Lumen)', date: 'sam. 31 oct.', steps: [{ sfx: 'line' }, { who: 'theo', n: 'Théo', t: "C'est Théo. Ne me rappelle pas sur ce numéro. Ni sur aucun autre. Je voulais juste te dire… t'avais raison. Sur tout. Fais attention à toi." }] },
];
APPS.phone = {
  open(el, opts) {
    S.missed = 0; save(); OS.badges();
    const root = h(`<div class="view"><div class="ph-body" style="flex:1;position:relative;overflow:hidden"></div>
      <div class="tabbar"><button data-t="fav"><i>⭐</i>Favoris</button><button data-t="rec"><i>🕘</i>Récents</button><button data-t="con"><i>👤</i>Contacts</button><button data-t="dial"><i>⌨️</i>Clavier</button><button data-t="vm"><i>📼</i>Messagerie</button></div></div>`);
    el.appendChild(root);
    const body = $('.ph-body', root);
    const tabs = $('.tabbar', root);
    const vmBadge = () => { const n = this.vms().filter(v => !v.heard).length; const b = $('[data-t=vm]', tabs); b.querySelector('.tb')?.remove(); if (n) b.insertAdjacentHTML('beforeend', `<span class="tb">${n}</span>`); };
    const show = t => {
      $$('button', tabs).forEach(b => b.classList.toggle('on', b.dataset.t === t));
      body.innerHTML = ''; const nav = new Nav(body);
      this[t](nav);
      vmBadge();
    };
    tabs.onclick = e => { const b = e.target.closest('button'); if (b) { Sound.fx.tap(); show(b.dataset.t); } };
    show(opts.tab || 'rec');
  },
  vms() { return STORY.baseVoicemails.map(v => Object.assign({}, v, { heard: !!S.flags['vm_' + v.id] })).concat(S.voicemails.map(v => Object.assign({}, VOICEMAILS[v.id], v))); },
  fav(nav) {
    const favs = STORY.contacts.filter(c => c.fav);
    const v = makeView(nav, { title: 'Favoris', large: true, body: `<div class="group" style="--sepl:70px">${favs.map(c => `<div class="row" data-n="${c.num}">${avatar(c.ini, c.col)}<div class="rmain"><b>${esc(c.name)}</b><small>mobile</small></div><span class="rval">ⓘ</span></div>`).join('')}</div>` });
    nav.push(v);
    $('.group', v).onclick = e => { const r = e.target.closest('.row'); if (r) Call.outgoing(r.dataset.n); };
    $$('.av', v).forEach(a => { a.style.width = '40px'; a.style.height = '40px'; a.style.fontSize = '15px'; a.style.margin = '6px 0'; });
  },
  rec(nav) {
    flag('sawRecents');
    const all = S.recents.map(r => ({ name: r.name, type: r.type, when: r.when, sub: r.type === 'miss' ? 'appel manqué' : r.type === 'out' ? 'sortant' : 'entrant', num: r.num })).concat(STORY.baseRecents);
    const v = makeView(nav, { title: 'Récents', large: true, body: `<div class="seg"><button class="on">Tous</button><button>Manqués</button></div><div class="recs"></div>` });
    nav.push(v);
    const render = (missOnly) => {
      $('.recs', v).innerHTML = all.filter(r => !missOnly || r.type === 'miss').map(r => {
        const c = STORY.contacts.find(c => c.name === r.name);
        const num = r.num || (c ? c.num : (r.name.startsWith('+33') ? r.name : ''));
        return `<div class="rec-row" data-n="${num}" data-name="${esc(r.name)}"><div class="rico">${r.type === 'out' ? '↗' : ''}</div><div class="rmain"><b class="${r.type === 'miss' ? 'miss' : ''}">${esc(r.name)}${r.n ? ` (${r.n})` : ''}</b><small>${esc(r.sub || (r.type === 'miss' ? 'appel manqué' : 'mobile'))}</small></div><span class="rdate">${esc(r.when)}</span></div>`;
      }).join('');
    };
    render(false);
    $('.seg', v).onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('.seg button', v).forEach(x => x.classList.toggle('on', x === b)); render(b.textContent === 'Manqués'); };
    $('.recs', v).onclick = e => {
      const r = e.target.closest('.rec-row'); if (!r) return;
      if (!r.dataset.n) { Sound.fx.error(); OS.toastInfo('🚫', 'Numéro masqué', 'Impossible de rappeler ce correspondant.'); return; }
      if (r.dataset.name.startsWith('Mamie')) flag('sawMamieCall');
      Call.outgoing(r.dataset.n, r.dataset.name);
    };
  },
  con(nav) {
    const cs = STORY.contacts.slice().sort((a, b) => norm(a.name).localeCompare(norm(b.name)));
    const v = makeView(nav, { title: 'Contacts', large: true, body: `<div class="search">🔍 Rechercher</div><div class="prof" style="padding-top:0">${avatar('NV', '#c56b9b')}<div><b style="font-size:20px">Nora Valette</b><br><small style="color:var(--text2)">Ma fiche · 06 39 98 90 27</small></div></div><div class="group">${cs.map(c => `<div class="row" data-id="${c.id}"><div class="rmain"><b>${esc(c.name)}</b></div></div>`).join('')}</div>` });
    nav.push(v);
    $$('.prof .av', v).forEach(a => { a.style.width = '60px'; a.style.height = '60px'; a.style.margin = '0'; });
    $('.group', v).onclick = e => {
      const r = e.target.closest('.row'); if (!r) return;
      const c = STORY.contacts.find(x => x.id === r.dataset.id);
      const card = makeView(nav, { title: '', back: 'Contacts', body: `<div style="text-align:center;padding:10px 0 20px">${avatar(c.ini, c.col)}<h2 style="font-size:28px;font-weight:500">${esc(c.name)}</h2></div>
        <div style="display:flex;gap:8px;padding:0 16px 20px"><button class="btn sec cmsg" style="margin:0">💬<br><small>message</small></button><button class="btn sec ccall" style="margin:0">📞<br><small>appeler</small></button></div>
        <div class="group"><div class="row"><div class="rmain"><small style="color:var(--text)">mobile</small><b style="color:var(--blue)">${esc(c.num)}</b></div></div>
        ${c.id === 'mamie' ? '<div class="row"><div class="rmain"><small style="color:var(--text)">adresse</small><b>Ty Odette — 29242</b></div></div><div class="row"><div class="rmain"><small style="color:var(--text)">notes</small><b style="font-size:15px">fixe de la maison. ne pas résilier. jamais.</b></div></div>' : ''}
        ${c.id === 'nepas' ? '<div class="row"><div class="rmain"><small style="color:var(--text)">notes</small><b style="font-size:15px">perso de B.</b></div></div>' : ''}
        ${c.id === 'benali' ? '<div class="row"><div class="rmain"><small style="color:var(--text)">notes</small><b style="font-size:15px">voisine adorée. garde Kafka si besoin 🐱</b></div></div>' : ''}</div>` });
      const av = $('.av', card); av.style.cssText += ';width:100px;height:100px;font-size:40px;margin:0 auto 10px;background:' + c.col;
      nav.push(card);
      $('.ccall', card).onclick = () => Call.outgoing(c.num);
      $('.cmsg', card).onclick = () => { const t = Object.keys(STORY.threads).find(k => STORY.threads[k].num === c.num); if (t) OS.open('messages', null, { thread: t }); else OS.toastInfo('💬', 'Aucune conversation', "Nora n'a jamais écrit à ce contact."); };
    };
  },
  dial(nav) {
    let num = '';
    const v = makeView(nav, { title: '', noNav: true, body: `<div class="dial" style="padding-top:90px"><div class="num"></div><div class="who"></div>
      <div class="keypad">${[['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']].map(([k, s]) => `<button data-k="${k}">${k}<small>${s}</small></button>`).join('')}</div>
      <div style="display:flex;align-items:center;gap:40px;margin-left:118px"><button class="callgo"><svg viewBox="0 0 60 60"><path d="M22.6 15.5c-1-1.3-2.9-1.4-4-.2l-3.2 3.2c-2 2-2.4 5.1-.9 7.5 5 8.4 11.9 15.3 20.3 20.3 2.4 1.5 5.5 1.1 7.5-.9l3.2-3.2c1.2-1.1 1.1-3-.2-4l-5.3-4c-1.1-.8-2.6-.7-3.6.2l-2 2c-4.1-2.1-7.9-5.9-10-10l2-2c.9-1 1-2.5.2-3.6z"/></svg></button><button class="dl" style="font-size:24px;color:var(--text2);margin-top:18px;visibility:hidden">⌫</button></div></div>` });
    nav.push(v);
    const upd = () => {
      $('.num', v).textContent = num.length > 3 ? fmtNum(num) : num;
      const c = Call.contactFor(num);
      $('.who', v).textContent = c ? c.name : '';
      $('.dl', v).style.visibility = num ? 'visible' : 'hidden';
    };
    $('.keypad', v).onclick = e => { const b = e.target.closest('button'); if (!b || num.length > 14) return; Sound.fx.dtmf(b.dataset.k); num += b.dataset.k; upd(); };
    $('.dl', v).onclick = () => { num = num.slice(0, -1); upd(); };
    $('.callgo', v).onclick = () => { if (!num) { const last = S.lastDial; if (last) { num = last; upd(); } return; } S.lastDial = num; save(); Call.outgoing(num); };
  },
  vm(nav) {
    const list = this.vms();
    const v = makeView(nav, { title: 'Messagerie', large: true, body: list.length ? `<div class="group">${list.map((m, i) => `<div class="row" data-i="${i}"><div class="rmain"><b style="${m.heard ? '' : 'font-weight:600'}">${m.heard ? '' : '<span style="color:var(--blue)">● </span>'}${esc(m.who)}</b><small>${esc(m.date)}</small></div><span class="rval" style="font-size:14px;font-feature-settings:'tnum'">${(t => Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'))(Math.round(stepsDuration(m.steps) / 1000))} ▶︎</span></div>`).join('')}</div>` : '<div class="empty">Aucun message</div>' });
    nav.push(v);
    $('.group', v)?.addEventListener('click', e => {
      const r = e.target.closest('.row'); if (!r) return;
      const m = list[+r.dataset.i];
      if (STORY.baseVoicemails.includes(STORY.baseVoicemails.find(x => x.id === m.id))) flag('vm_' + m.id);
      else { const sv = S.voicemails.find(x => x.id === m.id); if (sv) { sv.heard = true; save(); } }
      Sound.fx.beep();
      Overlay.play({ title: 'Message de ' + m.who, date: m.date, steps: [{ wait: 600 }].concat(m.steps), cls: 'cold', onEnd: () => m.onEnd && m.onEnd() });
      if (m.clue) clue(m.clue);
      setTimeout(() => { nav.stack.length = 0; nav.root.innerHTML = ''; this.vm(nav); }, 400);
    });
  },
};

/* =================== PHOTOS =================== */
APPS.photos = {
  open(el, opts) {
    const nav = new Nav(el);
    const lib = STORY.photos.filter(p => p.album !== 'deleted');
    const v = makeView(nav, { title: 'Photos', large: true, body: `<div class="seg"><button class="on" data-s="lib">Bibliothèque</button><button data-s="alb">Albums</button></div><div class="pc"></div>` });
    nav.push(v);
    const grid = (arr) => `<div class="ph-grid">${arr.map(p => `<div class="ph" data-p="${p.id}">${ART[p.art]()}${p.fav ? '<span class="tag">♥</span>' : ''}</div>`).join('')}</div>`;
    const showLib = () => { $('.pc', v).innerHTML = `<p style="padding:0 16px 8px;color:var(--text2);font-size:14px">${lib.length} photos</p>` + grid(lib); };
    const showAlb = () => {
      $('.pc', v).innerHTML = `<div class="alb">
        <div class="a" data-a="recent"><div class="cv">${ART.voisine()}</div><b>Récents</b><small>${lib.length}</small></div>
        <div class="a" data-a="fav"><div class="cv">${ART.kafka()}</div><b>Favoris</b><small>${lib.filter(p => p.fav).length}</small></div>
        <div class="a" data-a="deleted"><div class="cv" style="display:flex;align-items:center;justify-content:center;font-size:40px">🗑️</div><b>Supprimés récemment</b><small>🔒 2</small></div></div>`;
    };
    showLib();
    $('.seg', v).onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('.seg button', v).forEach(x => x.classList.toggle('on', x === b)); b.dataset.s === 'lib' ? showLib() : showAlb(); };
    $('.pc', v).onclick = e => {
      const p = e.target.closest('.ph'); if (p) { this.view(p.dataset.p); return; }
      const a = e.target.closest('.a'); if (!a) return;
      const al = a.dataset.a;
      if (al === 'deleted' && !has('deletedOpen')) { this.unlockDeleted(nav, () => this.album(nav, 'deleted', grid)); return; }
      this.album(nav, al, grid);
    };
    if (opts.photo) setTimeout(() => this.view(opts.photo), 450);
  },
  album(nav, al, grid) {
    const arr = STORY.photos.filter(p => al === 'deleted' ? p.album === 'deleted' : al === 'fav' ? p.fav : p.album !== 'deleted');
    const name = { recent: 'Récents', fav: 'Favoris', deleted: 'Supprimés récemment' }[al];
    const v = makeView(nav, { title: name, back: 'Albums', body: (al === 'deleted' ? '<p style="padding:0 16px 10px;color:var(--text2);font-size:13px">Ces photos seront définitivement supprimées dans 26 jours.</p>' : '') + grid(arr) });
    nav.push(v);
    $('.ph-grid', v).onclick = e => { const p = e.target.closest('.ph'); if (p) this.view(p.dataset.p); };
  },
  unlockDeleted(nav, then) {
    const v = makeView(nav, { title: '', back: 'Albums', body: `<div class="applock" style="position:relative;padding-top:40px"><div style="font-size:54px;margin-bottom:12px">🔒</div><h2>Album verrouillé</h2><p>Saisissez le code de l'iPhone pour afficher « Supprimés récemment ».</p><input class="field" inputmode="numeric" maxlength="4" placeholder="Code" type="password"><div class="errtxt"></div><button class="btn">Déverrouiller</button></div>` });
    nav.push(v);
    const f = $('.field', v);
    const go = () => { if (f.value === '2209') { Sound.fx.unlock(); flag('deletedOpen'); nav.pop(); setTimeout(then, 380); } else { Sound.fx.error(); f.classList.add('err'); setTimeout(() => f.classList.remove('err'), 450); $('.errtxt', v).textContent = 'Code incorrect'; } };
    $('.btn', v).onclick = go; f.onkeydown = e => { if (e.key === 'Enter') go(); };
    setTimeout(() => f.focus(), 400);
  },
  view(id) {
    const p = STORY.photos.find(x => x.id === id);
    const node = h(`<div class="ov"><div class="ov-top"><button class="cl">‹ Retour</button><div class="t"><b>${esc(p.title)}</b>${esc(p.time)}</div><button class="inf">ⓘ</button></div>
      <div class="ov-img">${ART[p.art]().replace('xMidYMid slice', 'xMidYMid meet')}</div><div class="ov-bar"><span>⇪</span><span>♡</span><span class="inf2">ⓘ</span><span>🗑</span></div></div>`);
    Overlay.open(node);
    Sound.fx.page();
    $('.cl', node).onclick = () => Overlay.close();
    const info = () => {
      if ($('.ov-info', node)) { $('.ov-info', node).remove(); return; }
      node.appendChild(h(`<div class="ov-info">${p.cap ? `<div class="cap">${esc(p.cap)}</div>` : ''}<b>${esc(p.title)}${p.time ? ' · ' + esc(p.time) : ''}</b>📍 ${esc(p.place)}<br>🧭 ${esc(p.coords)}<br>📱 Appareil de Nora — objectif arrière 26 mm${p.id === 'biscotte' ? '<br>🖨️ Numérisé le 2 mai 2021' : ''}</div>`));
      if (p.id === 'ouessant') clue('L4');
    };
    $('.inf', node).onclick = info; $('.inf2', node).onclick = info;
    if (p.clue && p.id !== 'ouessant') clue(p.clue);
    if (p.id === 'ouessant') setTimeout(info, 700);
    if (p.id === 'biscotte' || p.id === 'vacuum') setTimeout(info, 700);
  },
};

/* =================== MAIL =================== */
APPS.mail = {
  open(el) {
    const nav = new Nav(el);
    if (!has('mailOpen')) return this.lock(nav);
    this.boxes(nav); this.inbox(nav);
  },
  lock(nav) {
    const v = makeView(nav, { title: '', noNav: true, body: `<div class="applock"><div class="bigicon">${iconHTML('mail')}</div><h2>Ondes Mail</h2><p>Connectez-vous pour accéder à votre messagerie.</p>
      <input class="field" value="nora.valette@ondes.fr" disabled style="opacity:.7;margin-bottom:10px"><input class="field pw" type="password" placeholder="Mot de passe"><div class="errtxt"></div>
      <button class="btn go">Connexion</button><button class="btn ghost forgot">Mot de passe oublié ?</button></div>` });
    nav.push(v);
    const pw = $('.pw', v);
    const tryPw = () => {
      if (norm(pw.value) === 'luna') return this.ok(nav);
      Sound.fx.error(); pw.classList.add('err'); setTimeout(() => pw.classList.remove('err'), 450);
      S.mailFails = (S.mailFails || 0) + 1; save();
      $('.errtxt', v).textContent = S.mailFails >= 2 ? 'Mot de passe incorrect. Essayez « Mot de passe oublié ? »' : 'Mot de passe incorrect';
    };
    $('.go', v).onclick = tryPw; pw.onkeydown = e => { if (e.key === 'Enter') tryPw(); };
    $('.forgot', v).onclick = () => {
      const q = makeView(nav, { title: 'Récupération', back: 'Connexion', body: `<div class="applock" style="position:relative;padding-top:30px"><div style="font-size:50px;margin-bottom:12px">🔐</div><h2>Question secrète</h2><p>« Quel était le nom de votre tout premier animal de compagnie ? »</p>
        <input class="field ans" placeholder="Réponse"><div class="errtxt"></div><button class="btn">Valider</button></div>` });
      nav.push(q);
      const a = $('.ans', q);
      const go = () => {
        if (norm(a.value) === 'luna') return this.ok(nav);
        Sound.fx.error(); a.classList.add('err'); setTimeout(() => a.classList.remove('err'), 450);
        $('.errtxt', q).textContent = norm(a.value) === 'kafka' ? "Kafka n'était pas son premier animal…" : 'Réponse incorrecte';
      };
      $('.btn', q).onclick = go; a.onkeydown = e => { if (e.key === 'Enter') go(); };
      setTimeout(() => a.focus(), 400);
    };
  },
  ok(nav) {
    Sound.fx.success(); flag('mailOpen'); OS.badges();
    nav.root.innerHTML = ''; nav.stack = [];
    this.boxes(nav); this.inbox(nav);
  },
  boxes(nav) {
    const cnt = b => STORY.boxMails.filter(m => m.box === b).length;
    const v = makeView(nav, { title: 'Boîtes', large: true, body: `<div class="group mb">${[['inbox', '📥', 'Réception', ''], ['drafts', '📝', 'Brouillons', cnt('drafts')], ['sent', '📤', 'Envoyés', cnt('sent')], ['trash', '🗑', 'Corbeille', cnt('trash')]].map(([k, i, n, c]) => `<div class="row" data-b="${k}"><div class="ricon" style="background:#0a84ff22;color:var(--blue)">${i}</div><div class="rmain"><b>${n}</b></div><span class="rval mbc" data-c="${k}">${c}</span><span class="chev"></span></div>`).join('')}</div><div class="gfoot" style="margin-top:-12px">nora.valette@ondes.fr</div>` });
    nav.push(v);
    const upd = () => { const n = this.all().filter(m => !S.readMail[m.id]).length; $('.mbc[data-c=inbox]', v).textContent = n || ''; };
    upd(); v.addEventListener('reshow', upd);
    $('.mb', v).onclick = e => { const r = e.target.closest('.row'); if (!r) return; Sound.fx.tap(); r.dataset.b === 'inbox' ? this.inbox(nav) : this.box(nav, r.dataset.b); };
  },
  box(nav, b) {
    const name = { drafts: 'Brouillons', sent: 'Envoyés', trash: 'Corbeille' }[b];
    const ms = STORY.boxMails.filter(m => m.box === b);
    const v = makeView(nav, { title: name, back: 'Boîtes', large: true, body: (b === 'trash' ? '<p style="padding:0 16px 10px;color:var(--text2);font-size:13px">Les messages de la corbeille sont effacés après 30 jours.</p>' : '') + `<div class="ml">${ms.map(m => `<div class="mail-row" data-m="${m.id}"><div class="mu"></div><div class="mm"><div class="mt"><b>${esc(m.from)}</b><span>${esc(m.date)} ›</span></div><div class="ms">${b === 'drafts' ? '<span style="color:var(--red)">Brouillon</span> ' : ''}${esc(m.subj)}</div><p>${esc(m.body.replace(/<[^>]+>/g, ' ').slice(0, 140))}</p></div></div>`).join('')}</div>` });
    nav.push(v);
    $('.ml', v).onclick = e => { const r = e.target.closest('.mail-row'); if (r) this.read(nav, r.dataset.m); };
  },
  inbox(nav) {
    const v = makeView(nav, { title: 'Réception', back: 'Boîtes', large: true, right: '<span>✎</span>', body: `<div class="search">🔍 Rechercher</div><div class="ml"></div>` });
    nav.push(v);
    const render = () => {
      $('.ml', v).innerHTML = APPS.mail.all().map(m => `<div class="mail-row" data-m="${m.id}"><div class="mu">${S.readMail[m.id] ? '' : '<i></i>'}</div><div class="mm"><div class="mt"><b>${esc(m.from)}</b><span>${esc(m.date)} ›</span></div><div class="ms">${esc(m.subj)}</div><p>${esc(m.body.replace(/<[^>]+>/g, ' ').slice(0, 140))}</p></div></div>`).join('');
    };
    render();
    v.addEventListener('reshow', render);
    live(v, 'mail', render);
    $('.ml', v).onclick = e => { const r = e.target.closest('.mail-row'); if (r) this.read(nav, r.dataset.m); };
  },
  all() { return (S.lateMails || []).map(k => STORY.lateMails[k]).concat(STORY.mails); },
  read(nav, id) {
    const m = this.all().concat(STORY.boxMails).find(x => x.id === id);
    S.readMail[id] = 1; save(); OS.badges();
    const v = makeView(nav, { title: '', back: m.box ? { drafts: 'Brouillons', sent: 'Envoyés', trash: 'Corbeille' }[m.box] : 'Réception', right: '<span>⤺</span><span>🗑</span>', body: `<div class="mail-full"><h2>${esc(m.subj)}</h2><div class="from">${avatar(m.ini, m.col)}<div><b>${esc(m.from)}</b><small>${esc(m.addr)}</small><small>${m.box === 'sent' || m.box === 'drafts' ? 'De : Nora Valette' : 'À : Nora Valette'} · ${esc(m.date)}${m.time ? ' à ' + esc(m.time) : ''}</small></div></div><div class="body">${m.body}${m.quote || ''}</div>
      ${m.id === 'datanexa' ? '<div class="attach">📎 releve_T3_datanexa.pdf · 214 Ko</div>' : ''}</div>` });
    nav.push(v);
    if (m.clue) setTimeout(() => clue(m.clue), 900);
    if (id === 'datanexa') flag('readDatanexa');
    if (id === 'fwd') flag('readArgos');
  },
};

/* =================== NOTES =================== */
APPS.notes = {
  light: false,
  open(el) {
    const nav = new Nav(el);
    const v = makeView(nav, { title: 'Notes', large: true, body: `<div class="search">🔍 Rechercher</div><div class="ghead">Sur mon iPhone</div><div class="group nl"></div>` });
    nav.push(v);
    const render = () => {
      $('.nl', v).innerHTML = STORY.notes.map(n => `<div class="row" data-n="${n.id}"><div class="rmain"><b style="font-weight:600">${n.locked && !has('noteOpen') ? '🔒 ' : ''}${esc(n.title)}</b><small>${esc(n.date)}  ${n.locked && !has('noteOpen') ? 'Verrouillée' : esc(n.body.replace(/<[^>]+>/g, '').split('\n').filter(Boolean)[1] || '')}</small></div></div>`).join('');
    };
    render(); v.addEventListener('reshow', render);
    $('.nl', v).onclick = e => { const r = e.target.closest('.row'); if (r) this.note(nav, r.dataset.n); };
  },
  note(nav, id) {
    const n = STORY.notes.find(x => x.id === id);
    if (n.locked && !has('noteOpen')) {
      const v = makeView(nav, { title: '', back: 'Notes', body: `<div class="applock" style="position:relative;padding-top:40px"><div style="font-size:54px;margin-bottom:12px">🔒</div><h2>Note verrouillée</h2><p>Saisissez le mot de passe des Notes pour afficher « ${esc(n.title)} ».</p>
        <input class="field" type="password" placeholder="Mot de passe"><div class="errtxt"></div><button class="btn">OK</button><div class="hintbox">💡 ${esc(n.hint)}</div></div>` });
      nav.push(v);
      const f = $('.field', v);
      const go = () => {
        if (norm(f.value) === n.pass) { Sound.fx.unlock(); flag('noteOpen'); nav.pop(); setTimeout(() => this.note(nav, id), 380); }
        else { Sound.fx.error(); f.classList.add('err'); setTimeout(() => f.classList.remove('err'), 450); $('.errtxt', v).textContent = 'Mot de passe incorrect'; }
      };
      $('.btn', v).onclick = go; f.onkeydown = e => { if (e.key === 'Enter') go(); };
      setTimeout(() => f.focus(), 400);
      return;
    }
    const v = makeView(nav, { title: '', back: 'Notes', right: '<span>⇪</span><span>···</span>', body: `<div class="note-view"><div class="nd">${esc(n.date)}</div><h2>${esc(n.title)}</h2>${n.body}</div>` });
    nav.push(v);
    if (n.clue) setTimeout(() => clue(n.clue), 900);
    if (id === 'prive') flag('readPrive');
  },
};

/* =================== PLANS =================== */
APPS.maps = {
  open(el) {
    const v = h(`<div class="view"><div class="map-full"></div><div class="map-ctrl"><button class="mc-loc" title="Ma position">➤</button><button class="mc-3d">3D</button></div><div class="map-sheet"><button class="grab" aria-label="Agrandir ou réduire"></button><div class="sheet-in"></div></div></div>`);
    el.appendChild(v);
    const map = $('.map-full', v), sheet = $('.map-sheet', v), inner = $('.sheet-in', v);
    const setMap = svgStr => { map.style.opacity = 0; setTimeout(() => { map.innerHTML = svgStr; map.style.opacity = 1; }, 160); };
    const PLACES = {
      home: ['🏠', '#0a84ff', 'Domicile', "Rue d'Austerlitz, Lyon 4e", "Le téléphone n'a pas bougé d'ici depuis 4 jours."],
      work: ['💼', '#8b7bff', 'Travail', 'Lumen SAS, Lyon 2e', 'Dernière visite : jeu. 29 oct., 10:41. Accès badge révoqué.'],
      dab: ['💶', '#ff453a', 'DAB — Gros Caillou', 'Lyon 4e · ven. 30 oct., 13:52', '400 € en liquide. Pour ne laisser aucune trace de paiement.'],
      loyasse: ['🕯️', '#8e8e93', 'Cimetière de Loyasse', 'Lyon 5e · sam. 24 oct.', "Là où mamie est enterrée. 4 visites en octobre."],
      gare: ['🚆', '#30d158', 'Gare Part-Dieu', 'Lyon 3e · ven. 30 oct., 15:10', 'Repérage la veille du départ ?'],
    };
    const row = (k, ico, col, t, sub, chev = false) => `<div class="row" data-k="${k}"><div class="ricon" style="background:${col}">${ico}</div><div class="rmain"><b>${t}</b><small>${sub}</small></div>${chev ? '<span class="chev"></span>' : ''}</div>`;
    const list = () => {
      sheet.classList.remove('route');
      inner.innerHTML = `<div class="search">🔍 Rechercher dans Plans</div>
        <div class="ghead">Favoris</div><div class="favs">
          <button data-k="home"><i style="background:#0a84ff">🏠</i>Domicile</button><button data-k="work"><i style="background:#8b7bff">💼</i>Travail</button><button data-k="deleted"><i style="background:#48484a">❔</i><span style="color:var(--text2)">Supprimé</span></button></div>
        <div class="ghead">Itinéraire enregistré</div><div class="group">${row('route', '🚆', '#30d158', 'Lyon Part-Dieu → Brest', 'Sam. 31 oct. · départ 06:34 · 6 h 12', true)}</div>
        <div class="ghead">Récents</div><div class="group">${['dab', 'gare', 'loyasse'].map(k => row(k, PLACES[k][0], PLACES[k][1], PLACES[k][2], PLACES[k][3])).join('')}${row('press', '📰', '#ff9f0a', 'Le Contrepoint — rédaction', 'Paris 11e · recherché le 24 oct.')}</div>
        <div class="gfoot" style="margin-top:-12px">Historique des lieux : activé. Partagé avec Lumen.</div>`;
    };
    const place = k => {
      const p = PLACES[k];
      setMap(ART.mapLyon(k));
      sheet.classList.add('peek');
      inner.innerHTML = `<div class="place"><div class="pl-top"><div class="ricon" style="background:${p[1]};width:44px;height:44px;border-radius:12px;font-size:22px">${p[0]}</div><div><b>${p[2]}</b><small>${p[3]}</small></div><button class="pl-x">✕</button></div><p>${p[4]}</p></div>`;
      $('.pl-x', inner).onclick = () => { setMap(ART.mapLyon()); sheet.classList.remove('peek'); list(); };
    };
    const route = () => {
      setMap(ART.mapFrance());
      sheet.classList.add('route'); sheet.classList.remove('peek');
      inner.innerHTML = `<div class="place"><div class="pl-top"><div class="ricon" style="background:#30d158;width:44px;height:44px;border-radius:12px;font-size:22px">🚆</div><div><b>Lyon Part-Dieu → Brest</b><small>Sam. 31 oct. · 6 h 12 · 1 correspondance</small></div><button class="pl-x">✕</button></div>
        <div class="steps"><div><i style="background:#30d158"></i><b>06:34</b> Lyon Part-Dieu</div><div><i></i><b>08:41</b> Massy TGV — correspondance</div><div><i></i><b>10:02</b> Rennes</div><div><i style="background:#ff453a"></i><b>12:46</b> Brest</div>
        <div class="off"><i style="background:#ff9f0a"></i><b>?</b> L'itinéraire continue vers l'ouest… hors réseau. Aucune destination enregistrée.</div></div></div>`;
      $('.pl-x', inner).onclick = () => { setMap(ART.mapLyon()); sheet.classList.remove('route'); list(); };
      clue('L2');
    };
    map.innerHTML = ART.mapLyon();
    list();
    $('.grab', v).onclick = () => { Sound.fx.tap(); sheet.classList.toggle('peek'); };
    $('.mc-loc', v).onclick = () => { Sound.fx.tap(); place('home'); };
    $('.mc-3d', v).onclick = () => { Sound.fx.tap(); map.classList.toggle('tilt'); };
    inner.onclick = e => {
      const r = e.target.closest('[data-k]'); if (!r) return;
      Sound.fx.tap();
      const k = r.dataset.k;
      if (k === 'route') return route();
      if (k === 'deleted') { OS.toastInfo('❔', 'Favori supprimé', 'Nora a effacé ce lieu le 30 oct. à 23:58, la veille de son départ.'); return; }
      if (k === 'press') { OS.toastInfo('📰', 'Le Contrepoint', 'Un journal d\'investigation parisien. Pourquoi Nora cherchait-elle son adresse ?'); return; }
      if (PLACES[k]) place(k);
    };
  },
};

/* =================== CALENDRIER =================== */
APPS.calendar = {
  open(el) {
    const nav = new Nav(el);
    const month = (m) => {
      const first = m === 10 ? 3 : 6, days = m === 10 ? 31 : 30; // 1/10/2026 jeudi, 1/11/2026 dimanche
      let cells = '';
      for (let i = 0; i < first; i++) cells += '<div class="dim"></div>';
      for (let d = 1; d <= days; d++) {
        const ev = STORY.events.some(e => e.d === d && e.m === m);
        cells += `<div class="${m === 11 && d === 4 ? 'today' : ''}"><span>${d}</span>${ev ? '<i></i>' : ''}</div>`;
      }
      return `<div class="cal-month"><div class="wd"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="days">${cells}</div></div>`;
    };
    const evs = m => STORY.events.filter(e => e.m === m).map(e => `<div class="ev"><div class="bar" style="background:${e.col}"></div><div class="et">${e.d} ${m === 10 ? 'oct.' : 'nov.'}<br>${esc(e.t)}</div><div><b>${esc(e.title)}</b><small>${esc(e.loc)}</small></div></div>`).join('');
    const v = makeView(nav, { title: 'Calendrier', large: true, body: `<div class="seg"><button data-m="10">Octobre</button><button data-m="11" class="on">Novembre</button></div><div class="cc"></div>` });
    nav.push(v);
    const show = m => { $('.cc', v).innerHTML = month(m) + evs(m); };
    show(11);
    $('.seg', v).onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('.seg button', v).forEach(x => x.classList.toggle('on', x === b)); show(+b.dataset.m); };
  },
};

/* =================== NAVIGATEUR =================== */
APPS.browser = {
  open(el) {
    const nav = new Nav(el);
    const v = makeView(nav, { title: 'Historique', large: true, body: `<div class="search">🔍 Rechercher ou saisir un site</div><div class="ghead">Récemment consulté</div><div class="group hl">${STORY.web.map(w => `<div class="row hist-row" data-w="${w.id}"><div class="ricon" style="background:#2c2c2e">🌐</div><div class="rmain"><b style="font-size:15px">${esc(w.title)}</b><small>${esc(w.url)} · ${esc(w.when)}</small></div></div>`).join('')}</div>
      <div class="gfoot" style="margin-top:0">Navigation privée désactivée. Historique synchronisé.</div>` });
    nav.push(v);
    $('.search', v).onclick = () => OS.toastInfo('📵', 'Pas de connexion', "Le téléphone est en données limitées. Seul l'historique est consultable.");
    $('.hl', v).onclick = e => {
      const r = e.target.closest('.row'); if (!r) return;
      const w = STORY.web.find(x => x.id === r.dataset.w);
      const p = h(`<div class="view"><div class="vbody" style="padding:0"><div class="web-page ${w.cls}">${w.html}</div></div><div class="web-bar"><div class="web-url">🔒 ${esc(w.url.split('/')[0])}</div><div style="display:flex;justify-content:space-around;padding-top:10px;color:var(--blue);font-size:20px"><button class="bk" style="color:var(--blue)">‹</button><span style="opacity:.4">›</span><span>⇪</span><span>📖</span><span>⧉</span></div></div></div>`);
      $('.bk', p).onclick = () => nav.pop();
      nav.push(p);
      if (w.clue) setTimeout(() => clue(w.clue), 1200);
    };
  },
};

/* =================== RÉGLAGES =================== */
APPS.settings = {
  open(el) {
    const nav = new Nav(el);
    const row = (ico, col, label, val = '', k = '', chev = true) => `<div class="row" data-k="${k}" style="--sepl:58px"><div class="ricon" style="background:${col}">${ico}</div><div class="rmain"><b>${label}</b></div>${val ? `<span class="rval">${val}</span>` : ''}${chev ? '<span class="chev"></span>' : ''}</div>`;
    const v = makeView(nav, { title: 'Réglages', large: true, body: `<div class="search">🔍 Rechercher</div>
      <div class="group"><div class="prof">${avatar('NV', '')}<div><b style="font-size:20px;font-weight:500">Nora Valette</b><br><small style="color:var(--text2);font-size:13px">Compte Ondes, cloud, achats</small></div></div></div>
      <div class="group">${row('✈️', '#ff9f0a', 'Mode Avion', '', 'avion', false).replace('</div><span class="chev">', '')}${row('📶', '#0a84ff', 'Wi-Fi', 'Livebox-8F2A', 'wifi')}${row('ᛒ', '#0a84ff', 'Bluetooth', 'Oui', 'bt')}${row('📡', '#30d158', 'Données cellulaires', '', 'data')}${row('🔋', '#30d158', 'Batterie', S.battery + ' %', 'batt')}</div>
      <div class="group">${row('🔔', '#ff453a', 'Notifications', '', 'notif')}${row('⏳', '#5e5ce6', 'Temps d\'écran', '', 'screen')}${row('✋', '#0a84ff', 'Confidentialité et sécurité', '', 'priv')}</div>
      <div class="group">${row('⚙️', '#8e8e93', 'Général', '', 'gen')}${row('🖼️', '#30b0c7', 'Fond d\'écran', '', 'wall')}</div>
      <div class="ghead">Jeu — Hors Ligne</div>
      <div class="group"><div class="row" data-k="sound" style="--sepl:58px"><div class="ricon" style="background:#ff2d55">🔊</div><div class="rmain"><b>Son</b><small>Sonneries, notifications et ambiances</small></div><div class="toggle ${Sound.muted ? '' : 'on'}"></div></div>
      <div class="row" data-k="reset" style="--sepl:58px"><div class="ricon" style="background:#3a3a3c">↺</div><div class="rmain"><b style="color:var(--red)">Recommencer l'enquête</b></div></div></div>` });
    nav.push(v);
    const av = $('.prof .av', v); av.style.background = 'linear-gradient(135deg,#c56b9b,#6b4fc5)';
    const tg = $('.row[data-k=avion]', v); tg.insertAdjacentHTML('beforeend', '<div class="toggle"></div>');
    $('.vbody', v).onclick = e => {
      const r = e.target.closest('.row'); if (!r) return;
      Sound.fx.tap();
      const k = r.dataset.k;
      if (k === 'avion') { OS.toastInfo('✈️', 'Mode Avion', "Couper le réseau ? Nora l'a fait. Toi, tu as encore besoin d'écouter."); return; }
      if (k === 'sound') { const m = !Sound.muted; Sound.setMuted(m); S.muted = m; save(); $('.toggle', r).classList.toggle('on', !m); Main.syncMute(); return; }
      if (k === 'reset') { twice(r.querySelector('b'), 'Touchez encore pour tout effacer', () => Main.reset()); return; }
      if (k === 'wifi') return this.wifi(nav);
      if (k === 'priv') return this.priv(nav);
      if (k === 'screen') return this.screenTime(nav);
      if (k === 'gen') return this.gen(nav);
      if (k === 'batt') return this.sub(nav, 'Batterie', `<div class="ghead">Utilisation (24 h)</div><div class="group">${[['Lumen', '41 %'], ['Flux', '22 %'], ['Messages', '9 %'], ['Plans', '8 %'], ['Écran verrouillé', '7 %']].map(([a, p]) => `<div class="row"><div class="rmain"><b>${a}</b><small>${a === 'Lumen' ? 'Activité en arrière-plan : 23 h 51' : ''}</small></div><span class="rval">${p}</span></div>`).join('')}</div><div class="gfoot" style="margin-top:-14px">Lumen a utilisé la localisation en arrière-plan pendant que le téléphone était posé sur la table.</div>`);
      if (k === 'notif') return this.sub(nav, 'Notifications', `<div class="group">${['Lumen — Autorisées, critiques', 'Flux — Autorisées', 'Messages — Autorisées', 'Mail — Autorisées', 'Ombre — Désactivées (aucun aperçu)'].map(x => `<div class="row"><div class="rmain"><b>${x.split(' — ')[0]}</b><small>${x.split(' — ')[1]}</small></div></div>`).join('')}</div>`);
      if (k === 'wall') return this.sub(nav, "Fond d'écran", `<div style="display:flex;gap:12px;padding:0 16px"><div style="flex:1;border-radius:14px;overflow:hidden;aspect-ratio:.5">${ART.kafka()}</div><div style="flex:1;border-radius:14px;overflow:hidden;aspect-ratio:.5">${ART.homewall()}</div></div><div class="gfoot" style="margin-top:12px">Écran verrouillé : « Kafka 3 ans », photo du 22 sept.</div>`);
      this.sub(nav, r.querySelector('b').textContent, `<div class="empty">Rien d'intéressant ici.</div>`);
    };
  },
  sub(nav, title, body) { nav.push(makeView(nav, { title, back: 'Réglages', body })); },
  wifi(nav) {
    this.sub(nav, 'Wi-Fi', `<div class="group"><div class="row"><div class="rmain"><b>Wi-Fi</b></div><div class="toggle on"></div></div><div class="row"><div class="rmain"><b style="color:var(--blue)">✓ Livebox-8F2A</b><small>Domicile</small></div><span class="rval">🔒 📶</span></div></div>
      <div class="ghead">Réseaux connus</div><div class="group">${[['Livebox-8F2A', 'Domicile, Lyon 4e'], ['LUMEN-STAFF', 'Accès révoqué le 29 oct.'], ['Ty_Odette', 'Dernière connexion : août 2024 · Lampaul (29)'], ['Freebox-Jade', 'Nantes'], ['TGV-WIFI', ''], ['Bar_LeFantome_Guest', '']].map(([n, s]) => `<div class="row" data-n="${n}"><div class="rmain"><b>${n}</b><small>${s}</small></div><span class="rval">ⓘ</span></div>`).join('')}</div>`);
    setTimeout(() => clue('L5'), 1000);
  },
  priv(nav) {
    const apps = [['Lumen', 'Toujours'], ['Flux', 'Toujours'], ['Météo', 'Toujours'], ['Azur', 'Toujours'], ['Plans', 'Toujours'], ['Photos', 'Toujours'], ['CalmIA', 'Toujours'], ['Colix', 'Toujours'], ['Courses+', 'Toujours'], ['RunTrack', 'Toujours'], ['Horoscope du jour', 'Toujours'], ['Lampe Torche Pro', 'Toujours'], ['ScanDoc', 'Toujours'], ['Jeu Bubble Pop', 'Toujours'], ['Ombre', 'Jamais'], ['Calculatrice', 'Jamais']];
    this.sub(nav, 'Localisation', `<div class="group"><div class="row"><div class="rmain"><b>Service de localisation</b></div><div class="toggle on"></div></div></div>
      <div class="group">${apps.map(([a, s]) => `<div class="row"><div class="rmain"><b>${a}</b></div><span class="rval" style="${s === 'Toujours' ? 'color:var(--orange)' : ''}">${s === 'Toujours' ? '➤ ' : ''}${s}</span></div>`).join('')}</div>
      <div class="gfoot" style="margin-top:-14px">14 apps ont accès à votre position « Toujours », même quand vous ne les utilisez pas. Pourquoi une lampe torche a-t-elle besoin de savoir où vous êtes ?</div>`);
    setTimeout(() => clue('D4'), 1100);
  },
  screenTime(nav) {
    this.sub(nav, "Temps d'écran", `<div style="padding:0 16px 16px"><div style="color:var(--text2);font-size:13px">MOYENNE QUOTIDIENNE</div><div style="font-size:34px;font-weight:700">6 h 42 min</div>
      <div style="display:flex;align-items:flex-end;gap:10px;height:110px;margin-top:10px">${[60, 72, 55, 80, 90, 98, 14].map((x, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px"><div style="width:100%;height:${x}px;border-radius:4px;background:${i === 6 ? '#636366' : 'var(--blue)'}"></div><small style="font-size:11px;color:var(--text2)">${'LMMJVSD'[i]}</small></div>`).join('')}</div></div>
      <div class="group">${[['Prises en main', '142 / jour'], ['Notifications', '318 / jour'], ['Première prise en main', '06:58'], ['Dernière utilisation', 'sam. 31 oct., 05:52']].map(([a, b]) => `<div class="row"><div class="rmain"><b>${a}</b></div><span class="rval">${b}</span></div>`).join('')}</div>
      <div class="gfoot" style="margin-top:-14px">Depuis le 31 oct. à 05:52 : 0 min. La première fois en quatre ans.</div>`);
  },
  gen(nav) {
    this.sub(nav, 'Informations', `<div class="group">${[['Nom', 'iPhone de Nora'], ['Version', 'NoraOS 26.1'], ['Modèle', 'Téléphone · 128 Go'], ['Photos', '12'], ['Applications', '31'], ['Opérateur', 'Ondes Mobile']].map(([a, b]) => `<div class="row"><div class="rmain"><b>${a}</b></div><span class="rval">${b}</span></div>`).join('')}</div>`);
  },
};

/* =================== MÉTÉO =================== */
APPS.weather = {
  open(el) {
    const nav = new Nav(el);
    const cities = [
      { n: 'Lyon', s: 'Domicile', t: 9, c: 'Pluie', hl: 'H:11° B:6°', bg: 'linear-gradient(160deg,#4a5a72,#2a3346)', ico: '🌧️' },
      { n: 'Nantes', s: '', t: 12, c: 'Nuageux', hl: 'H:13° B:8°', bg: 'linear-gradient(160deg,#5a7aa0,#36507a)', ico: '☁️' },
      { n: 'Ouessant', s: '', t: 12, c: 'Vent violent', hl: 'H:13° B:10°', bg: 'linear-gradient(160deg,#2a4a6a,#0f2236)', ico: '💨' },
    ];
    const v = makeView(nav, { title: 'Météo', large: true, body: `<div class="search">🔍 Rechercher une ville</div>${cities.map((c, i) => `<div class="wx-card" data-i="${i}" style="background:${c.bg}"><div class="wc"><div><b>${c.n}</b><small>${c.s || nowHM()}</small></div><div class="tmp">${c.t}°</div></div><div class="cond">${c.ico} ${c.c}</div><div class="hl">${c.hl}</div></div>`).join('')}` });
    nav.push(v);
    setTimeout(() => clue('L3'), 1300);
    $('.vbody', v).onclick = e => {
      const r = e.target.closest('.wx-card'); if (!r) return;
      const c = cities[+r.dataset.i];
      const d = h(`<div class="view" style="background:${c.bg}"><div class="navbar" style="background:transparent"><button class="back">Météo</button><div></div><div></div></div><div class="vbody"><div class="wx-big"><h2>${c.n}</h2><div class="t">${c.t}°</div><div>${c.c}</div><div style="opacity:.8">${c.hl}</div></div>
        ${c.n === 'Ouessant' ? `<div class="wx-alert">⚠️ <b>Vigilance orange — vent.</b> Rafales jusqu'à 110 km/h. Traversées maritimes susceptibles d'être annulées. L'île pourrait rester isolée plusieurs jours.</div>` : ''}
        <div class="wx-hours">${['Maint.', '15h', '16h', '17h', '18h', '19h', '20h', '21h'].map((x, i) => `<div><span>${x}</span><span>${c.ico}</span><b>${c.t - Math.floor(i / 3)}°</b></div>`).join('')}</div>
        ${c.n === 'Ouessant' ? `<div class="wx-alert">🌊 Houle 5 m · 💨 Vent O 75 km/h · 🔦 Coucher du soleil 17:41</div>` : ''}</div></div>`);
      $('.back', d).onclick = () => nav.pop();
      nav.push(d);
    };
  },
};

/* =================== DICTAPHONE =================== */
APPS.memos = {
  open(el) {
    const nav = new Nav(el);
    const v = makeView(nav, { title: 'Dictaphone', large: true, body: `<div class="search">🔍 Rechercher</div><div class="ml">${STORY.memos.map(m => `<div class="memo" data-m="${m.id}"><div><b>${esc(m.title)}</b><small>${esc(m.date)} · ${m.dur}</small></div><div class="play">▶</div></div>`).join('')}</div>
      <div class="ghead" style="margin-top:26px">🗑 Supprimés récemment</div><div class="ml2">${STORY.deletedMemos.map(m => `<div class="memo" data-m="${m.id}"><div><b style="color:#c8c8cc">${esc(m.title)}</b><small>${esc(m.date)} · ${m.dur} · effacé le 30 oct.</small></div><div class="play" style="color:var(--red)">▶</div></div>`).join('')}</div>
      <div style="display:flex;justify-content:center;padding:40px 0"><div style="width:66px;height:66px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center"><div style="width:52px;height:52px;border-radius:50%;background:var(--red)"></div></div></div>` });
    nav.push(v);
    $('.ml', v).onclick = e => {
      const r = e.target.closest('.memo'); if (!r) return;
      const m = STORY.memos.find(x => x.id === r.dataset.m);
      if (m.clue) setTimeout(() => clue(m.clue), 4000);
      Overlay.play({ title: m.title, date: m.date, steps: m.steps, cls: m.cls });
    };
    $('.ml2', v).onclick = e => {
      const r = e.target.closest('.memo'); if (!r) return;
      const m = STORY.deletedMemos.find(x => x.id === r.dataset.m);
      setTimeout(() => clue(m.clue), 4000); flag('heardDeletedMemo');
      Overlay.play({ title: m.title + ' (supprimé)', date: m.date, steps: m.steps, cls: m.cls });
    };
  },
};

/* =================== CALCULETTE + COFFRE =================== */
APPS.calc = {
  open(el) {
    const v = h(`<div class="calc"><div class="disp">0</div><div class="keys">
      <button class="fn" data-k="C">AC</button><button class="fn" data-k="±">±</button><button class="fn" data-k="%">%</button><button class="op" data-k="/">÷</button>
      <button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button class="op" data-k="*">×</button>
      <button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button class="op" data-k="-">−</button>
      <button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button class="op" data-k="+">+</button>
      <button class="zero" data-k="0">0</button><button data-k=".">,</button><button class="op" data-k="=">=</button></div></div>`);
    el.appendChild(v);
    let cur = '0', prev = null, op = null, fresh = false;
    const disp = $('.disp', v);
    const show = () => {
      let [i, d] = cur.split('.');
      const neg = i.startsWith('-'); if (neg) i = i.slice(1);
      const s = (neg ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d !== undefined ? ',' + d : '');
      disp.textContent = s;
      disp.style.fontSize = s.length > 9 ? '54px' : s.length > 7 ? '68px' : '84px';
    };
    const calc = (a, b, o) => { a = +a; b = +b; const r = o === '+' ? a + b : o === '-' ? a - b : o === '*' ? a * b : b === 0 ? NaN : a / b; return isFinite(r) ? String(+r.toPrecision(12)) : 'Erreur'; };
    $('.keys', v).onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      const k = b.dataset.k; Sound.fx.key();
      $$('.op', v).forEach(x => x.classList.remove('sel'));
      if (/\d/.test(k)) { if (fresh || cur === '0' || cur === 'Erreur') { cur = k; fresh = false; } else if (cur.replace(/\D/g, '').length < 12) cur += k; }
      else if (k === '.') { if (fresh) { cur = '0'; fresh = false; } if (!cur.includes('.')) cur += '.'; }
      else if (k === 'C') { cur = '0'; prev = null; op = null; }
      else if (k === '±') { cur = cur.startsWith('-') ? cur.slice(1) : (cur === '0' ? cur : '-' + cur); }
      else if (k === '%') { cur = String(+cur / 100); }
      else if (k === '=') {
        if (!op && cur === '2847113') { this.vault(el); return; }
        if (op && prev !== null) { cur = calc(prev, cur, op); prev = null; op = null; fresh = true; }
        if (cur === '2847113') { this.vault(el); return; }
      } else { if (op && prev !== null && !fresh) cur = calc(prev, cur, op); prev = cur; op = k; fresh = true; b.classList.add('sel'); }
      show();
    };
  },
  vault(el) {
    Sound.fx.vault();
    const first = !has('vaultOpen');
    flag('vaultOpen');
    const nav = new Nav(h('<div></div>'));
    const V = h(`<div class="vault"><div class="vault-anim"><div class="ring"></div><div style="font-size:13px;letter-spacing:.3em;color:#888">COFFRE</div></div></div>`);
    el.appendChild(V);
    const inner = h('<div style="position:absolute;inset:0"></div>'); V.appendChild(inner);
    nav.root = inner;
    const v = makeView(nav, { title: 'Coffre', large: true, cls: '', body: `<p style="padding:0 16px 12px;color:var(--text2);font-size:14px">Chiffré localement · 4 éléments · créé le 27 oct.</p><div class="fl">${STORY.vault.map(f => `<div class="file" data-f="${f.id}"><div class="fi" style="background:${{ audio: '#ff9f0a', txt: '#8e8e93', csv: '#30d158', png: '#0a84ff' }[f.kind]}">${f.kind.toUpperCase()}</div><div><b>${esc(f.name)}</b><small>${esc(f.size)}</small></div></div>`).join('')}</div>` });
    v.style.background = 'transparent';
    nav.push(v);
    const back = h('<button style="position:absolute;top:60px;left:14px;color:var(--orange);font-size:16px;z-index:5">‹ Calculatrice</button>');
    v.appendChild(back); back.onclick = () => V.remove();
    $('.fl', v).onclick = e => {
      const r = e.target.closest('.file'); if (!r) return;
      const f = STORY.vault.find(x => x.id === r.dataset.f);
      if (f.kind === 'audio') { clue('D2'); Overlay.play({ title: f.name, date: '31 oct. 2026 · 04:30', steps: STORY.pourJade, cls: '' }); return; }
      if (f.kind === 'png') { APPS.photos.view(f.photo); return; }
      const d = makeView(nav, { title: f.name, back: 'Coffre', body: `<div class="doc"><h3>${esc(f.title)}</h3>${f.body}</div>` });
      d.style.background = '#0b0b0f';
      nav.push(d);
      if (f.clue) setTimeout(() => clue(f.clue), 900);
      if (f.id === 'ombrenote') flag('readOmbreNote');
    };
  },
};

/* =================== FLUX (réseau social) =================== */
APPS.flux = {
  posts: [
    { art: null, date: '27 oct.', cap: "Il y a des choses qu'on ne peut plus ignorer.", likes: 212, com: [['ines.lb', 'tu m\'inquiètes là ❤️'], ['paulo_', '???'], ['jade.vlt', 'appelle-moi. maintenant.']], clue: 'P8' },
    { art: 'kafka', date: '22 sept.', cap: '3 ans de mépris absolu 🐱🎂 #kafka', likes: 540, com: [['jade.vlt', 'le roi 👑']] },
    { art: 'party', date: '8 juin', cap: "Lumen a 3 ans aujourd'hui 💜 Lancée le 08/06/2023 avec une idée simple : plus aucune femme ne rentrera seule. Fière de cette équipe.", likes: 1290, com: [['bastien.leroy', 'La meilleure data scientist de France 🚀'], ['theo.mrch', '🥂']] },
    { art: 'selfie', date: '9 août 2025', cap: 'Ma sœur, mon soleil ☀️', likes: 302, com: [['jade.vlt', 'arrête je vais pleurer']] },
    { art: 'biscotte', date: '2 mai 2021', cap: '#tbt Luna 🐾 minuscule chaton tigré, les yeux couleur lagon. Mon tout premier amour.', likes: 98, com: [['jade.vlt', 'LUNA 😭😭 elle tenait dans une main'], ['maman_sylvie', 'Elle dormait dans ton cartable ❤️']] },
    { art: 'ouessant', date: '14 août 2019', cap: 'Le bout du monde, avec la meilleure des mamies 🌊💙', likes: 87, com: [['maman_sylvie', 'Mes deux amours ❤️']] },
  ],
  open(el) {
    flag('fluxOpen'); OS.badges();
    const root = h(`<div class="view"><div class="fbody" style="flex:1;position:relative;overflow:hidden"></div><div class="tabbar"><button data-t="feed"><i>🏠</i>Fil</button><button data-t="me" class="on"><i>👤</i>Profil</button></div></div>`);
    el.appendChild(root);
    const body = $('.fbody', root);
    const show = t => { $$('.tabbar button', root).forEach(b => b.classList.toggle('on', b.dataset.t === t)); body.innerHTML = ''; const nav = new Nav(body); this[t](nav); };
    $('.tabbar', root).onclick = e => { const b = e.target.closest('button'); if (b) { Sound.fx.tap(); show(b.dataset.t); } };
    show('me');
  },
  postHTML(p) {
    return `<div class="fx-post"><div class="ph-h">${avatar('N', '')}<div>nora.vlt<small>${esc(p.date)}</small></div></div>
      <div class="img">${p.art ? ART[p.art]() : '<div class="blacksq"></div>'}</div>
      <div class="acts">♡ 💬 ↗</div><div class="likes">${p.likes} J'aime</div>
      <div class="cap"><b>nora.vlt</b> ${esc(p.cap)}</div>${p.com.map(([u, t]) => `<div class="com"><b>${esc(u)}</b> ${esc(t)}</div>`).join('')}</div>`;
  },
  me(nav) {
    const v = makeView(nav, { title: 'nora.vlt', body: `<div class="fx-head">${avatar('N', '')}<div class="fx-stats"><div><b>${this.posts.length}</b><small>posts</small></div><div><b>1 204</b><small>abonnés</small></div><div><b>388</b><small>abonnements</small></div></div></div>
      <div class="fx-bio"><b>Nora</b>data · Lyon · 🐱 Kafka · fondatrice tech @lumen 💜<br>« coder pour protéger »</div>
      <div class="ph-grid">${this.posts.map((p, i) => `<div class="ph" data-i="${i}">${p.art ? ART[p.art]() : '<div class="blacksq" style="height:100%"></div>'}</div>`).join('')}</div>` });
    nav.push(v);
    $('.ph-grid', v).onclick = e => {
      const c = e.target.closest('.ph'); if (!c) return;
      const p = this.posts[+c.dataset.i];
      const d = makeView(nav, { title: 'Publications', back: 'nora.vlt', body: this.postHTML(p) });
      nav.push(d);
      if (p.clue) setTimeout(() => clue(p.clue), 900);
    };
  },
  feed(nav) {
    const ads = [
      { b: 'Assurvie Auto 🌙', t: 'Vous conduisez souvent la nuit ? Votre tarif a été ajusté à votre profil de trajets.', why: 'Vous voyez cette publicité car : vous rentrez fréquemment après minuit · femme 25-34 ans · Lyon 4e · données partenaires.' },
      { b: 'CalmIA — méditation guidée', t: 'Vous semblez stressée ces derniers temps. 7 jours offerts.', why: 'Vous voyez cette publicité car : activité nocturne inhabituelle · recherches récentes « lanceur d\'alerte », « téléphone suivi » · rythme de frappe agité.' },
      { b: 'Ouigo-like · Brest dès 29 € 🚆', t: 'Le grand air vous appelle ? Partez au bout du monde.', why: 'Vous voyez cette publicité car : vous avez recherché « Le Conquet Ouessant » · itinéraire planifié vers Brest.' },
    ];
    const others = [
      { u: 'ines.lb', ini: 'I', col: '#bf5af2', cap: 'raclette sans Nora c\'est pas une raclette 🧀💔', art: null, txt: '🧀' },
      { u: 'jade.vlt', ini: 'J', col: '#ff9f0a', cap: 'Si quelqu\'un a vu ma sœur Nora depuis samedi, écrivez-moi. Partagez svp. 🙏', art: 'selfie' },
      { u: 'paulo_', ini: 'P', col: '#64d2ff', cap: 'lundi.', art: null, txt: '😐' },
    ];
    let html = '';
    others.forEach((o, i) => {
      html += `<div class="fx-post"><div class="ph-h"><div class="av" style="background:${o.col}">${o.ini}</div><div>${o.u}<small>il y a ${i + 1} j</small></div></div><div class="img">${o.art ? ART[o.art]() : `<div class="blacksq" style="background:#1a1a1a;font-size:80px">${o.txt}</div>`}</div><div class="acts">♡ 💬 ↗</div><div class="cap"><b>${o.u}</b> ${esc(o.cap)}</div></div>`;
      const a = ads[i];
      html += `<div class="fx-ad"><div class="spons">Sponsorisé</div><b>${esc(a.b)}</b><br>${esc(a.t)}<div class="why">Pourquoi cette publicité ?</div><div class="whyt">${esc(a.why)}</div></div>`;
    });
    const v = makeView(nav, { title: 'Flux', body: html });
    nav.push(v);
    $('.vbody', v).onclick = e => { const w = e.target.closest('.why'); if (w) { w.parentElement.classList.toggle('open'); Sound.fx.tap(); if (/stress/.test(w.parentElement.textContent)) flag('sawCalmAd'); } };
  },
};

/* =================== LUMEN =================== */
APPS.lumen = {
  open(el) {
    flag('lumenOpen');
    const root = h(`<div class="lumen"><div class="lbody" style="flex:1;overflow-y:auto;scrollbar-width:none"></div><div class="lu-tabs"><button data-t="home" class="on"><i>◉</i>Accueil</button><button data-t="proches"><i>👥</i>Proches</button><button data-t="trajets"><i>🧭</i>Trajets</button><button data-t="reglages"><i>⚙</i>Réglages</button></div></div>`);
    el.appendChild(root);
    const body = $('.lbody', root);
    const show = t => { $$('.lu-tabs button', root).forEach(b => b.classList.toggle('on', b.dataset.t === t)); this[t](body, el); body.scrollTop = 0; };
    $('.lu-tabs', root).onclick = e => { const b = e.target.closest('button'); if (b) { Sound.fx.tap(); show(b.dataset.t); } };
    show('home');
  },
  top: () => `<div class="lu-top"><div class="lu-logo"><i></i>LUMEN</div><span style="font-size:20px">🔔</span></div>`,
  home(b) {
    b.innerHTML = `${this.top()}<div class="lu-hero"><h2>Bonsoir Nora 💜</h2><p>Ne rentrez plus jamais seule.</p></div>
      <button class="lu-btn">Partager<br>mon trajet</button>
      <div class="lu-card"><h4>Votre position est visible par</h4><div class="lu-person"><div class="av" style="background:#ff9f0a">J</div><div><b>Jade</b><small>Proche de confiance</small></div></div><div class="lu-person"><div class="av" style="background:#ff6b9a">M</div><div><b>Maman</b><small>Proche de confiance</small></div></div><div class="lu-person"><div class="av" style="background:#3a3a5a">+</div><div><b>Partenaires de confiance</b><small>Pour améliorer votre sécurité · <u>en savoir plus</u></small></div></div></div>
      <div class="lu-card"><h4>Ce mois-ci</h4><div style="font-size:14px;line-height:1.6">🏠 Rentrée avant minuit : 27 fois<br>🚶 168 km parcourus en sécurité<br>🛡️ 0 alerte</div></div>`;
    $('.lu-btn', b).onclick = () => { Sound.fx.error(); OS.toastInfo('💜', 'Trajet partagé… avec qui ?', 'Position transmise à 2 proches et 6 partenaires.'); };
  },
  proches(b) {
    b.innerHTML = `${this.top()}<div class="lu-hero"><h2>Mes proches</h2><p>Ils voient où vous êtes. Vous voyez où ils sont.</p></div>
      <div class="lu-card">${STORY.lumen.proches.map(p => { const gone = p.name === 'Jade' && has('jadeDeletedLumen'); return `<div class="lu-person"><div class="av" style="background:${p.col}">${p.ini}</div><div><b>${p.name}</b><small>${gone ? '⚠️ Application supprimée · signal perdu' : '📍 ' + esc(p.where) + ' · ' + esc(p.ago)}</small></div>${p.live && !gone ? '<span class="live">● EN DIRECT</span>' : ''}</div>`; }).join('')}</div>
      <div class="lu-card" style="font-size:13px;color:#b8b0e8;line-height:1.5">Jade partage sa position avec vous en continu depuis le 3 mars 2025. Merci de prendre soin les uns des autres 💜</div>`;
    clue('D1');
  },
  trajets(b) {
    b.innerHTML = `${this.top()}<div class="lu-hero"><h2>Mes trajets</h2><p>Tout est enregistré. Pour votre sécurité.</p></div>
      <div class="lu-card">${STORY.lumen.trajets.map(([d, t]) => `<div class="lu-trip">${esc(t)}<span>${esc(d)}</span></div>`).join('')}</div>
      <div class="lu-card" style="font-size:13px;color:#b8b0e8">Dernier signal : <b style="color:#fff">aujourd'hui, ${nowHM()}</b> — Domicile (appareil immobile depuis 4 j).</div>`;
  },
  reglages(b, el) {
    let taps = 0;
    b.innerHTML = `${this.top()}<div class="lu-hero"><h2>Réglages</h2></div>
      <div class="lu-card"><div class="lu-trip">Compte<span>nora.valette@lumen.app</span></div><div class="lu-trip">Abonnement<span>Lumen+ (offert employée)</span></div><div class="lu-trip">Partage aux partenaires<span>Activé 🔒</span></div><div class="lu-trip">Supprimer mes données<span style="opacity:.5">Indisponible</span></div></div>
      <div class="lu-card"><div class="lu-trip">CGU<span>34 pages</span></div><div class="lu-trip">Charte éthique<span>« Votre sécurité avant tout »</span></div></div>
      <div class="ver" style="text-align:center;color:#6a60a8;font-size:12px;padding:20px;cursor:default;user-select:none">Lumen v4.2.1 (build 1187)</div>`;
    $('.ver', b).onclick = () => {
      if (has('lumenDev')) { this.dev(el); return; }
      taps++;
      Sound.fx.tap();
      if (taps >= 3 && taps < 7) OS.toastInfo('🛠️', 'Mode développeur', `Encore ${7 - taps} appui${7 - taps > 1 ? 's' : ''}…`);
      if (taps >= 7) { taps = 0; this.pin(el); }
    };
  },
  pin(el) {
    const D = h(`<div class="dev"><div class="dhead"><b>lumen-admin // accès restreint</b><button class="x" style="color:#9dff9d;font-family:inherit">[x]</button></div><div class="dbody" style="text-align:center">
      <div style="margin-top:40px">&gt; AUTHENTIFICATION DÉVELOPPEUR<br><span class="dim">PIN à 4 chiffres requis</span></div><div class="pinrow"><i></i><i></i><i></i><i></i></div><div class="perr warn" style="height:18px"></div>
      <div class="dkeys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map(k => k === '' ? '<span></span>' : `<button data-k="${k}">${k}</button>`).join('')}</div></div></div>`);
    el.appendChild(D);
    $('.x', D).onclick = () => D.remove();
    let pin = '';
    const upd = () => $$('.pinrow i', D).forEach((x, i) => x.classList.toggle('on', i < pin.length));
    $('.dkeys', D).onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      Sound.fx.key();
      if (b.dataset.k === '⌫') { pin = pin.slice(0, -1); upd(); return; }
      if (pin.length >= 4) return;
      pin += b.dataset.k; upd();
      if (pin.length === 4) setTimeout(() => {
        if (pin === '0806') { Sound.fx.success(); flag('lumenDev'); D.remove(); this.dev(el); }
        else { Sound.fx.error(); $('.perr', D).textContent = 'ACCÈS REFUSÉ'; pin = ''; upd(); }
      }, 200);
    };
  },
  dev(el) {
    const D = h(`<div class="dev"><div class="dhead"><b>lumen-admin v4.2.1 <span class="blink">▮</span></b><button class="x" style="color:#9dff9d;font-family:inherit">[x]</button></div>
      <div class="dtabs"><button data-t="dash" class="on">dashboard</button><button data-t="part">partenaires</button><button data-t="req">requêtes</button><button data-t="log">logs</button></div><div class="dbody"></div></div>`);
    el.appendChild(D);
    $('.x', D).onclick = () => D.remove();
    const body = $('.dbody', D);
    let logTimer = null;
    const tabs = {
      dash: () => `<span class="dim">// tableau de bord — temps réel</span>

appareils actifs ......... <b>2 847 113</b>
points / jour ............ 46 102 880
revenus T3 ............... 3 914 220 €
dont « particuliers » .... 94 570 €

<span class="warn">⚠ requêtes prioritaires en cours : 2</span>
<span class="dim">→ onglet « requêtes »</span>`,
      part: () => { setTimeout(() => clue('P4'), 900); return `<span class="dim">// partenaires actifs</span>
<table>${[['DataNexa', 'courtier', 'flux complet'], ['Assurvie', 'assurance', 'trajets nocturnes'], ["Recrut'IQ", 'RH', 'lieux fréquentés'], ['ADN Pub', 'publicité', 'visites santé'], ['Habitat+', 'bailleurs', 'heures de retour'], ['API Retrouver', '<span class="crit">PARTICULIERS</span>', 'position temps réel']].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>
<span class="warn">vérification d'identité des particuliers : désactivée (« friction »)</span>`; },
      req: () => { setTimeout(() => { clue('P5'); }, 700); setTimeout(() => clue('M6'), 1700); setTimeout(() => clue('D5'), 2700); return `<span class="dim">// requêtes — tri : priorité</span>
<div class="req">#4471 · client : particulier (via DataNexa)
cible : L. M. · Villeurbanne
type : suivi quotidien · 49 €/mois
statut : LIVRÉ (112 j)</div>
<div class="req hot"><span class="crit">#5102 · PRIORITÉ ABSOLUE</span>
client : Argos Conseil (mandat direction)
cible : <b>Nora VALETTE</b> — appareil NV-01
type : suivi temps réel + journal d'activité appli
statut : <span class="crit">ACTIF</span>
dernière position : 45.7745, 4.8320 (Lyon 4e)
<span class="warn">appareil immobile depuis 4 j. activité utilisateur détectée AUJOURD'HUI.</span></div>
<div class="req hot"><span class="crit">#5103 · PRIORITÉ HAUTE</span>
client : Argos Conseil
cible : <b>Jade VALETTE</b> (proche, partage actif)
type : suivi temps réel
statut : ${has('jadeDeletedLumen') ? '<span class="dim">ÉCHEC — application désinstallée par la cible</span>' : '<span class="warn">EN ATTENTE — déclenchement si contact avec cible #5102</span>'}</div>`; },
      log: () => {
        const lines = [`[${nowHM()}:02] NV-01 : déverrouillage (code)`, `[${nowHM()}:04] NV-01 : ouverture app Lumen`, `[${nowHM()}:05] NV-01 : <span class="crit">accès mode dev</span>`, `[${nowHM()}:05] → transfert journal vers argos-conseil.fr … OK`, `[${nowHM()}:06] NV-01 : lecture onglet « requêtes »`, `[${nowHM()}:06] → transfert journal vers argos-conseil.fr … OK`];
        let i = 0; clearInterval(logTimer);
        logTimer = setInterval(() => { if (!D.isConnected || i >= lines.length) { clearInterval(logTimer); if (D.isConnected && i >= lines.length) { flag('sawLogs'); } return; } body.insertAdjacentHTML('beforeend', lines[i++] + '\n'); Sound.fx.key(); }, 700);
        return `<span class="dim">// journal en direct — appareil NV-01 (celui que tu tiens)</span>\n\n`;
      },
    };
    const show = t => { $$('.dtabs button', D).forEach(b => b.classList.toggle('on', b.dataset.t === t)); body.innerHTML = tabs[t](); };
    $('.dtabs', D).onclick = e => { const b = e.target.closest('button'); if (b) { Sound.fx.tap(); show(b.dataset.t); } };
    show('dash');
  },
};

/* =================== AZUR (banque) =================== */
APPS.bank = {
  light: true,
  open(el) {
    if (!has('bankOpen')) return this.lock(el);
    this.account(el);
  },
  lock(el) {
    const L = h(`<div class="bank-lock"><div class="bigicon" style="width:70px;height:70px;border-radius:18px;overflow:hidden;margin-bottom:16px">${iconHTML('bank')}</div><h2>Banque Azur</h2><p>Code d'accès (4 chiffres)</p><div class="dots"><i></i><i></i><i></i><i></i></div><div class="pass-msg" style="margin-top:-44px"></div>
      <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button data-k="${k}">${k}</button>`).join('')}<span></span><button data-k="0">0</button><button class="ghost" data-k="x">⌫</button></div></div>`);
    el.appendChild(L);
    OS.setStatus('dark');
    let code = '';
    const upd = () => $$('.dots i', L).forEach((d, i) => d.classList.toggle('on', i < code.length));
    $('.keypad', L).onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      Sound.fx.key();
      if (b.dataset.k === 'x') { code = code.slice(0, -1); upd(); return; }
      if (code.length >= 4) return;
      code += b.dataset.k; upd();
      if (code.length === 4) setTimeout(() => {
        if (code === '4719') { Sound.fx.unlock(); flag('bankOpen'); L.remove(); OS.setStatus('light'); this.account(el); OS.badges(); }
        else { Sound.fx.error(); $('.dots', L).classList.add('shake'); $('.pass-msg', L).textContent = 'Code incorrect'; setTimeout(() => { $('.dots', L).classList.remove('shake'); code = ''; upd(); }, 450); }
      }, 120);
    };
  },
  account(el) {
    const tx = [
      ['30 oct.', '💶', 'Retrait DAB — Gros Caillou', 'Lyon 4e', '-400,00'],
      ['30 oct.', '🎁', 'Virement à Jade Valette', '« pour ton anniv en avance 🎂 »', '-50,00'],
      ['30 oct.', '🎒', 'Décathlon Lyon', 'Sac à dos, lampe frontale', '-64,90'],
      ['29 oct.', '💊', 'Pharmacie de la Croix-Rousse', '', '-12,40'],
      ['28 oct.', '💼', 'LUMEN SAS — Salaire', '', '+2 650,00'],
      ['26 oct.', '🍸', 'Bar Le Fantôme', '', '-18,00'],
      ['24 oct.', '💐', 'Fleurs — Loyasse', '', '-25,00'],
      ['20 oct.', '📱', 'Ondes Mobile', 'Forfait', '-19,99'],
      ['16 oct.', '💜', 'Lumen+', 'Abonnement (remboursé employée)', '-4,99'],
    ];
    const v = h(`<div class="bank"><div class="bhead"><small>Compte courant</small><div class="sol">1 243,18 €</div><div class="acc">Nora Valette · FR76 •••• 4719</div></div><div class="bbody">
      <div class="bsec">Opérations récentes</div>${tx.map(([d, i, n, s, a]) => `<div class="tx"><div class="ti">${i}</div><div><b>${esc(n)}</b><small>${esc(d)}${s ? ' · ' + esc(s) : ''}</small></div><div class="am ${a.startsWith('+') ? 'pos' : ''}">${a} €</div></div>`).join('')}
      <div class="bnote">🔒 <b>Vos données, notre engagement.</b><br>Pour améliorer votre expérience, vos données de paiement (montants, lieux, commerçants) sont partagées avec nos 14 partenaires commerciaux. <u>Gérer mes préférences</u></div>
      <div class="bnote" style="border-color:#f0c8a0;background:#fff8f0">⚠️ <b>Opération inhabituelle</b> — Retrait de 400 € le 30/10. Montant supérieur à vos habitudes (moyenne : 40 €).</div></div></div>`);
    el.appendChild(v);
    setTimeout(() => clue('L9'), 1200);
  },
};

/* =================== OMBRE =================== */
APPS.ombre = {
  open(el) {
    if (!has('ombreOpen')) return this.lock(el);
    this.chat(el);
  },
  lock(el) {
    const L = h(`<div class="ombre-lock"><div class="moon"></div><h2>OMBRE</h2><p>Messagerie chiffrée. Aucune sauvegarde. Aucun serveur.<br>Saisissez votre phrase de passe.</p><input class="field" placeholder="phrase de passe" autocomplete="off"><div class="errtxt"></div><button class="btn">Déchiffrer</button>
      <p style="margin-top:22px;font-size:12px;color:#555">3 tentatives restantes avant effacement… (c'est ce qu'elle voudrait vous faire croire)</p></div>`);
    el.appendChild(L);
    const f = $('.field', L);
    const go = () => {
      const a = norm(f.value).replace(/^le/, '');
      if (a === 'boutdumonde') { Sound.fx.vault(); flag('ombreOpen'); OS.badges(); L.remove(); this.chat(el); }
      else { Sound.fx.error(); f.classList.add('err'); setTimeout(() => f.classList.remove('err'), 450); $('.errtxt', L).textContent = /phare|ouessant|mamie|odette/.test(norm(f.value)) ? "Pas loin… mais pas ça." : 'Phrase incorrecte'; }
    };
    $('.btn', L).onclick = go; f.onkeydown = e => { if (e.key === 'Enter') go(); };
    setTimeout(() => f.focus(), 400);
  },
  chat(el) {
    const v = h(`<div class="ombre"><div class="chat-head" style="background:#0a0a0a;border-color:#222"><div class="av" style="background:#222;border:1px solid #444">C.</div><small>C. · vérifiée 🔒</small></div><div class="chat om-chat"></div><div class="composer" style="background:#0a0a0a;border-color:#222"><div class="fake" style="border-color:#222">Les messages s'autodétruisent après 24 h</div></div></div>`);
    el.appendChild(v);
    const chat = $('.chat', v);
    let i = 0, prevF = null;
    const step = () => {
      if (!v.isConnected || i >= STORY.ombre.length) { if (i >= STORY.ombre.length) { flag('ombreRead'); } return; }
      const m = STORY.ombre[i++];
      if (m.day) chat.insertAdjacentHTML('beforeend', `<div class="timer">⏱ ${esc(m.day)}</div>`);
      else if (m.burned) chat.insertAdjacentHTML('beforeend', `<div class="bub them burned gap">🔥 3 messages détruits</div>`);
      else { chat.insertAdjacentHTML('beforeend', `<div class="bub ${m.f}${prevF !== m.f ? ' gap' : ''}">${esc(m.t)}</div>`); prevF = m.f; if (/lumière tourne/.test(m.t)) clue('L7'); }
      chat.scrollTop = chat.scrollHeight;
      Sound.fx.pop();
      setTimeout(step, has('ombreRead') ? 60 : (m.t ? 500 + Math.min(1500, m.t.length * 14) : 500));
    };
    step();
  },
};

/* =================== CAMÉRA =================== */
APPS.camera = {
  open(el) {
    const v = h(`<div class="view" style="background:#000;align-items:center;justify-content:center"><div style="position:absolute;inset:100px 0 180px;background:radial-gradient(circle at 50% 60%,#1a1612,#000 70%);display:flex;align-items:center;justify-content:center;color:#555;font-size:14px;text-align:center;padding:30px;line-height:1.5">Objectif obstrué.<br><small>Le téléphone était posé face contre la table de la cuisine.</small></div>
      <div style="position:absolute;bottom:60px;width:74px;height:74px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center"><button class="sh" style="width:60px;height:60px;border-radius:50%;background:#fff"></button></div></div>`);
    el.appendChild(v);
    $('.sh', v).onclick = () => { Sound.fx.shutter(); v.style.filter = 'brightness(3)'; setTimeout(() => v.style.filter = '', 120); };
  },
};

/* =================== CARNET (joueur) =================== */
APPS.carnet = {
  open(el) {
    const root = h(`<div class="carnet"><div class="cn-top"><h1>Mon carnet</h1><button class="cn-x">fermer ✕</button></div><div class="vbody"></div></div>`);
    el.appendChild(root);
    OS.setStatus('light');
    $('.cn-x', root).onclick = () => OS.home();
    this.main($('.vbody', root));
  },
  main(b) {
    const tot = Object.keys(STORY.clues).length, got = Object.keys(S.clues).length;
    const newOnes = S.newClues || {};
    b.innerHTML = `<div class="cn-small">${got} indice${got > 1 ? 's' : ''} sur ${tot}</div><div class="cn-prog"><div style="width:${got / tot * 100}%"></div></div>
      ${STORY.cats.map(c => { const ids = Object.keys(STORY.clues).filter(k => STORY.clues[k].c === c.id); const f = ids.filter(k => S.clues[k]); return `<div class="cn-cat"><h3>${c.name}<span>${f.length}/${ids.length}</span></h3>${f.sort((a, z) => S.clues[a] - S.clues[z]).map(k => `<div class="cn-clue ${newOnes[k] ? 'new' : ''}">— ${esc(STORY.clues[k].t)}</div>`).join('')}${ids.length - f.length ? `<div class="cn-clue unk">${'· '.repeat(Math.min(6, ids.length - f.length))}</div>` : ''}</div>`; }).join('')}
      <div class="cn-hintzone"></div>
      <button class="cn-btn sec hint">💡 Je suis bloqué·e</button>
      <button class="cn-btn conc">Conclure l'enquête →</button>
      <div style="height:30px"></div>`;
    S.newClues = {}; save(); OS.badges();
    $('.hint', b).onclick = () => { const hz = $('.cn-hintzone', b); hz.innerHTML = `<div class="cn-hint">${esc(Hints.next())}</div>`; Sound.fx.page(); };
    $('.conc', b).onclick = () => this.conclude(b);
  },
  conclude(b) {
    Sound.fx.page();
    if (!has('ombreOpen') && !this._warned) {
      this._warned = true;
      b.insertAdjacentHTML('beforeend', '');
      $('.cn-hintzone', b).innerHTML = `<div class="cn-hint">Tu es sûr·e ? Il reste des applis verrouillées sur ce téléphone… Appuie encore une fois pour conclure quand même.</div>`;
      return;
    }
    const opts2 = ["Elle a fait une dépression et a fui sa vie", "Elle a des dettes et se cache de ses créanciers", "Elle protège des preuves contre Lumen et doit les remettre à une journaliste", "Elle a rejoint quelqu'un dont elle est tombée amoureuse"];
    const opts3 = ["Un vrai policier de la PJ de Lyon", "Un détective privé payé par le patron de Lumen", "L'ex-compagnon de Nora", "Un journaliste concurrent"];
    b.innerHTML = `<div class="cn-small">Conclusion</div>
      <div class="cn-q"><label>1. Où est Nora ?</label><input type="text" class="q1" placeholder="un lieu…" autocomplete="off"></div>
      <div class="cn-q"><label>2. Pourquoi est-elle partie ?</label>${opts2.map((o, i) => `<div class="cn-opt" data-q="2" data-i="${i}"><i></i>${esc(o)}</div>`).join('')}</div>
      <div class="cn-q"><label>3. ${knows.morel() ? "Qui est « l'inspecteur Morel » ?" : 'Qui d\'autre la cherche ?'}</label>${opts3.map((o, i) => `<div class="cn-opt" data-q="3" data-i="${i}"><i></i>${esc(o)}</div>`).join('')}</div>
      <div class="cn-res"></div>
      <button class="cn-btn val">Valider mes conclusions</button><button class="cn-btn sec back">← revenir au carnet</button><div style="height:30px"></div>`;
    const ans = { 2: null, 3: null };
    b.onclick = e => { const o = e.target.closest('.cn-opt'); if (!o) return; Sound.fx.tap(); $$(`.cn-opt[data-q="${o.dataset.q}"]`, b).forEach(x => x.classList.toggle('on', x === o)); ans[o.dataset.q] = +o.dataset.i; };
    $('.back', b).onclick = () => { b.onclick = null; this.main(b); };
    $('.val', b).onclick = () => {
      const q1 = norm($('.q1', b).value);
      const ok1 = /ouessant|lampaul|ushant|eussa|tyodette|creach/.test(q1);
      const ok2 = ans[2] === 2, ok3 = ans[3] === 1;
      const n = ok1 + ok2 + ok3;
      if (n === 3) { Sound.fx.success(); b.onclick = null; Main.decision(); return; }
      Sound.fx.error();
      const near = /brest|conquet|bretagne|finistere|phare|maisondemamie|boutdumonde/.test(q1) && !ok1;
      $('.cn-res', b).textContent = `${n} réponse${n > 1 ? 's' : ''} sur 3 tien${n > 1 ? 'nent' : 't'} la route.` + (near ? ' Pour le lieu, sois plus précis·e : où, exactement ?' : ' Continue de chercher.');
    };
  },
};


/* =================== SANTÉ =================== */
APPS.health = {
  open(el) {
    const nav = new Nav(el);
    const days = ['28', '29', '30', '31', '1', '2', '3'];
    const steps = [9120, 4380, 11240, 412, 0, 0, 0];
    const sleepH = [5.2, 2.9, 3.4, 0, 0, 0, 0];
    const bars = (vals, max, col, hl) => `<svg viewBox="0 0 300 92">${vals.map((v, i) => { const hh = v ? Math.max(3, v / max * 66) : 2; return `<rect x="${8 + i * 42}" y="${70 - hh}" width="26" height="${hh}" rx="4" fill="${i === hl ? col : v ? col : '#3a3a3c'}" opacity="${i === hl || !v ? 1 : .45}"/><text x="${21 + i * 42}" y="86" font-size="10" fill="#8e8e93" text-anchor="middle" font-family="Inter,Arial">${days[i]}</text>`; }).join('')}</svg>`;
    const v = makeView(nav, { title: 'Résumé', large: true, cls: 'health', body: `
      <div class="ghead">Montre de Nora</div>
      <div class="hcard" style="cursor:default"><div class="hh">⌚ Connectée en Bluetooth <span>batterie 0 %</span></div><div class="hnote">À proximité de ce téléphone depuis le 31 oct., 05:58. Elle ne l'a pas emportée.</div></div>
      <div class="ghead">Épinglés</div>
      <div class="hcard" data-k="steps"><div class="hh"><span style="color:#ff9f0a;font-weight:600">🔥 Pas</span><span>sam. 31 oct.</span></div><div class="hv">412<small>pas</small></div><div class="hnote">Dernière activité à 05:52. Puis plus aucun pas enregistré.</div>${bars(steps, 12000, '#ff9f0a', 3)}</div>
      <div class="hcard" data-k="heart"><div class="hh"><span style="color:#ff2d55;font-weight:600">❤️ Rythme cardiaque</span><span>jeu. 29 oct. ›</span></div><div class="hv">131<small>BPM · max</small></div><div class="hnote">Pic inhabituel au repos. Touchez pour voir le détail.</div></div>
      <div class="hcard" data-k="sleep"><div class="hh"><span style="color:#5ac8fa;font-weight:600">🛏 Sommeil</span><span>moyenne 3 h 50</span></div><div class="hv">2 h 54<small>nuit du 29 au 30</small></div>${bars(sleepH, 8, '#5ac8fa', 1)}</div>
      <div class="hcard" data-k="cycle"><div class="hh"><span style="color:#ff6b9a;font-weight:600">🌸 Suivi du cycle</span><span>J18</span></div><div class="hnote">Prochaines règles estimées : 13 nov.</div></div>
      <div class="ghead">Partage</div>
      <div class="hshare"><div class="row" data-k="share"><div class="ricon" style="background:#8b7bff">◉</div><div class="rmain"><b>Lumen+</b><small>Accès : sommeil, rythme cardiaque, cycle, activité</small></div><span class="chev"></span></div>
      <div class="row" data-k="share2"><div class="ricon" style="background:#ff6b9a">≋</div><div class="rmain"><b>Flux</b><small>Accès : activité, pas</small></div><span class="chev"></span></div></div>
      <div class="gfoot" style="margin-top:-2px">Vos données de santé sont chiffrées sur l'appareil. Les apps que vous autorisez en reçoivent une copie.</div>` });
    nav.push(v);
    setTimeout(() => clue('L12'), 1500);
    $('.vbody', v).onclick = e => {
      const c = e.target.closest('[data-k]'); if (!c) return;
      Sound.fx.tap();
      const k = c.dataset.k;
      if (k === 'heart') {
        const pts = [62, 60, 64, 61, 66, 63, 62, 70, 88, 131, 118, 104, 96, 90, 84, 79, 76, 74];
        const path = pts.map((p, i) => `${i ? 'L' : 'M'}${10 + i * 16.5} ${120 - (p - 50) * 0.95}`).join(' ');
        nav.push(makeView(nav, { title: 'Rythme cardiaque', back: 'Résumé', cls: 'health', body: `<div class="hcard" style="cursor:default"><div class="hh"><span>jeu. 29 oct. · 20:00 – 23:59</span></div><div class="hv">131<small>BPM à 22:14</small></div>
          <svg viewBox="0 0 300 140">${[60, 90, 120].map(y => `<path d="M0 ${y} H300" stroke="#2c2c2e"/>`).join('')}<path d="${path}" stroke="#ff2d55" stroke-width="2.5" fill="none" stroke-linejoin="round"/><circle cx="${10 + 9 * 16.5}" cy="${120 - 81 * 0.95}" r="5" fill="#ff2d55" stroke="#fff" stroke-width="2"/>
          <text x="${10 + 9 * 16.5 + 9}" y="${120 - 81 * 0.95 + 4}" font-size="11" fill="#fff" font-family="Inter,Arial">22:14</text><text x="4" y="136" font-size="10" fill="#8e8e93" font-family="Inter,Arial">20:00</text><text x="296" y="136" font-size="10" fill="#8e8e93" text-anchor="end" font-family="Inter,Arial">00:00</text></svg>
          <div class="hnote">Fréquence au repos : 62 BPM. Aucune activité physique détectée pendant le pic. La montre a noté : « Rythme élevé — êtes-vous stressée ? »</div></div>
          <div class="gfoot" style="margin-top:0">${knows.carPhoto() ? '22:14. La même minute que la photo supprimée de la voiture en bas de chez elle.' : "Qu'est-ce qui a fait monter son cœur à 131, assise chez elle, à 22:14 ?"}</div>` }));
        setTimeout(() => clue('M8'), 1100);
        return;
      }
      if (k === 'share' || k === 'cycle') {
        nav.push(makeView(nav, { title: 'Lumen+', back: 'Résumé', cls: 'health', body: `<div class="group">${[['Sommeil', 'Lecture'], ['Rythme cardiaque', 'Lecture'], ['Cycle menstruel', 'Lecture'], ['Activité et pas', 'Lecture'], ['Position des entraînements', 'Lecture']].map(([a, b]) => `<div class="row"><div class="rmain"><b>${a}</b></div><span class="rval">${b} ✓</span></div>`).join('')}</div>
          <div class="gfoot" style="margin-top:-14px">Autorisé le 3 juillet 2023 (« Améliorer la détection des situations à risque »). Dernier accès : aujourd'hui, ${nowHM()}.<br><br>Pourquoi une appli qui vous raccompagne chez vous a-t-elle besoin de connaître votre cycle ?</div>` }));
        setTimeout(() => clue('D6'), 1100);
        return;
      }
      if (k === 'share2') { OS.toastInfo('≋', 'Flux', "« Nous utilisons votre activité pour vous proposer des contenus adaptés à votre énergie du jour. »"); return; }
      if (k === 'steps') { OS.toastInfo('🔥', 'Sam. 31 oct.', '05:31 réveil · 05:40 palier (3e étage) · 05:52 cuisine · puis 0 pas.'); return; }
      if (k === 'sleep') { OS.toastInfo('🛏', 'Sommeil fragmenté', "Réveillée 7 fois dans la nuit du 29 au 30. Dernier réveil : 03:12" + (knows.maskedCall() ? ", l'heure de l'appel masqué." : '.')); }
    };
  },
};

/* ---------------- Aide progressive ---------------- */
const Hints = {
  steps() {
    return [
      [!has('mailOpen'), [
        "Ses mails pourraient tout expliquer. Le mot de passe… il y a souvent une question secrète.",
        "La question secrète porte sur son tout premier animal. Ce n'est pas Kafka. Regarde ses vieilles photos.",
        "Dans Photos, il y a un scan de 2004 : « Moi & Luna ». Dans Mail, « Mot de passe oublié ? » → Luna.",
      ]],
      [!has('lumenDev'), [
        "Lumen, l'appli de Nora, cache quelque chose. Théo en parlait dans leurs messages.",
        "Théo : « 7 taps sur le numéro de version dans les réglages ». Le PIN : la date de lancement de Lumen.",
        "Lumen → Réglages → touche 7 fois « v4.2.1 ». La date de lancement est sur son Flux : 08/06/2023 → 0806.",
      ]],
      [!has('noteOpen'), [
        "Une note est verrouillée dans Notes. L'indice parle de Kafka.",
        "« L'ennemi juré de Kafka »… une photo de lui en colère, peut-être ?",
        "La photo du 6 septembre : « Kafka vs son ennemi juré : l'aspirateur ». Mot de passe : aspirateur.",
      ]],
      [!has('vaultOpen'), [
        "La note parle d'un coffre caché dans la calculatrice.",
        "Le code est un nombre : les appareils vendus à DataNexa. Cherche dans ses mails.",
        "Calculatrice : tape 2847113, puis « = ».",
      ]],
      [!has('ombreOpen'), [
        "Ombre est sa messagerie secrète. La phrase de passe a un sens pour elle seule.",
        "Le coffre contient un indice : ce que mamie appelait sa maison. Écoute les mémos vocaux.",
        "Dans le mémo « Mamie — Noël », elle dit que la maison, c'est « le bout du monde ». Phrase : bout du monde.",
      ]],
      [!has('bankOpen'), [
        "Tu as l'essentiel. L'appli bancaire peut encore parler : Théo et Nora évoquaient un digicode…",
        "Nora : « 4719. Oui c'est aussi le code de ma carte bleue ».",
      ]],
      [true, [
        "Tu en sais assez. Où est-elle ? Pourquoi ? Qui la cherche ? Appuie sur « Conclure l'enquête ».",
        "Pour gratter plus d'indices : appelle les numéros que tu croises (la voisine, « NE PAS RÉPONDRE », le fixe de mamie…), fouille tout ce qui a été supprimé (photos, messages, mémos vocaux, brouillons et corbeille du Mail), le Wi-Fi, la météo, l'appli Santé…",
      ]],
    ];
  },
  next() {
    const st = this.steps().find(s => s[0]);
    const key = this.steps().indexOf(st);
    S.hintLv = S.hintLv || {};
    const lv = S.hintLv[key] || 0;
    S.hintLv[key] = Math.min(lv + 1, st[1].length - 1); save();
    return st[1][Math.min(lv, st[1].length - 1)];
  },
  jadeLine() {
    if (!has('mailOpen')) return "Ses mails, c'est là qu'il y a tout son boulot. Pour le mot de passe, il y a une question secrète, non ? Notre tout premier animal… un chaton tout gris, minuscule. Regarde ses vieilles photos.";
    if (!has('lumenDev')) return "Théo, son collègue, lui parlait d'un menu caché dans l'appli Lumen. Relis leurs messages.";
    if (!has('noteOpen')) return "Elle avait une note verrouillée. L'indice parlait de Kafka et de ce qu'il déteste. Il déteste tout, ce chat… mais surtout un truc qui fait du bruit.";
    if (!has('vaultOpen')) return "Un coffre dans la calculatrice ?! Elle a toujours été tordue. Il te faut un nombre. Il doit être dans ses mails.";
    if (!has('ombreOpen')) return "Ombre… c'est une appli de messages secrets je crois. Elle parlait tout le temps de mamie, de sa maison. Écoute ses mémos vocaux.";
    return "Tu as tout ouvert, c'est ça ? Alors ouvre ton carnet. Dis-moi ce que tu as compris. Je suis prête.";
  },
};
