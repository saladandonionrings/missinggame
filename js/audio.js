/* ==========================================================
   HORS LIGNE — Audio : effets synthétisés (Web Audio) + voix
   Aucun fichier son : tout est généré en direct.
   ========================================================== */
const Sound = (() => {
  let ctx = null, master = null, muted = false;
  let ringNode = null, ambNode = null;
  const layers = {};

  function init() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.9;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  }
  const ok = () => ctx && !muted;
  const now = () => ctx.currentTime;

  function tone(freq, t, len, o = {}) {
    const { type = 'sine', vol = 0.2, attack = 0.005, dest = master, detune = 0, slide = 0 } = o;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t); osc.detune.value = detune;
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + len);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    osc.connect(g); g.connect(dest);
    osc.start(t); osc.stop(t + len + 0.05);
    return osc;
  }
  function bell(f, t, vol = 0.14, len = 0.9, dest = master) {
    tone(f, t, len, { vol, dest });
    tone(f * 2.003, t, len * 0.5, { vol: vol * 0.3, dest });
    tone(f * 3.99, t, len * 0.22, { vol: vol * 0.1, dest });
  }
  function marimba(f, t, vol = 0.16, dest = master) {
    tone(f, t, 0.45, { vol, dest });
    tone(f * 4, t, 0.08, { vol: vol * 0.25, dest });
  }
  let nbuf = null;
  function noiseSrc() {
    if (!nbuf) {
      nbuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const d = nbuf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = w * 0.6 + last * 3; }
    }
    const s = ctx.createBufferSource(); s.buffer = nbuf; s.loop = true; return s;
  }
  function noiseBurst(t, len, { freq = 3000, q = 1, vol = 0.1, type = 'bandpass' } = {}) {
    const s = noiseSrc(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 2); s.stop(t + len + 0.05);
  }
  function vib(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }

  const fx = {
    tap() { if (!ok()) return; noiseBurst(now(), 0.03, { freq: 4000, vol: 0.05 }); },
    key() { if (!ok()) return; const t = now(); tone(900, t, 0.05, { vol: 0.05, type: 'triangle' }); noiseBurst(t, 0.02, { freq: 5000, vol: 0.03 }); },
    notif() { if (!ok()) return; const t = now(); bell(1318.5, t, 0.12, 0.7); bell(1975.5, t + 0.12, 0.11, 1.2); vib(80); },
    message() { if (!ok()) return; const t = now(); marimba(1567.98, t, 0.14); marimba(2093, t + 0.09, 0.12); vib([40, 40, 40]); },
    sent() { if (!ok()) return; const t = now(); const s = noiseSrc(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(5000, t + 0.25); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + 0.35); },
    unlock() { if (!ok()) return; const t = now(); noiseBurst(t, 0.04, { freq: 2500, vol: 0.1 }); bell(880, t + 0.03, 0.08, 0.5); bell(1320, t + 0.1, 0.08, 0.7); },
    lock() { if (!ok()) return; const t = now(); tone(300, t, 0.08, { vol: 0.15, type: 'triangle', slide: 0.5 }); noiseBurst(t, 0.05, { freq: 1200, vol: 0.12 }); },
    error() { if (ok()) { const t = now(); tone(150, t, 0.11, { vol: 0.09, type: 'square' }); tone(150, t + 0.16, 0.11, { vol: 0.09, type: 'square' }); } vib([70, 50, 70]); },
    success() { if (!ok()) return; const t = now(); [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(f, t + i * 0.08, 0.1, 1.0)); },
    clue() { if (!ok()) return; const t = now(); for (let i = 0; i < 3; i++) noiseBurst(t + i * 0.06, 0.05, { freq: 2600 + i * 400, q: 3, vol: 0.06 }); bell(2637, t + 0.22, 0.05, 0.8); bell(3136, t + 0.3, 0.04, 0.8); },
    boot() { if (!ok()) return; const t = now(); [130.8, 196, 261.6, 329.6, 392].forEach((f, i) => tone(f, t + i * 0.12, 3.2, { vol: 0.06, attack: 0.8, type: 'sine' })); },
    glitch() { if (!ok()) return; const t = now(); for (let i = 0; i < 9; i++) tone(80 + Math.random() * 1600, t + i * 0.035, 0.04, { vol: 0.06, type: 'square' }); noiseBurst(t, 0.3, { freq: 800, vol: 0.12, q: 0.5 }); vib([30, 30, 30, 30, 90]); },
    vault() { if (!ok()) return; const t = now(); tone(70, t, 0.6, { vol: 0.3, type: 'sine', slide: 0.6 }); noiseBurst(t, 0.15, { freq: 400, vol: 0.2 }); [392, 523.25, 783.99].forEach((f, i) => bell(f, t + 0.9 + i * 0.12, 0.08, 1.4)); },
    beep() { if (!ok()) return; tone(1000, now(), 0.45, { vol: 0.12, attack: 0.01 }); },
    hangup() { if (!ok()) return; const t = now(); for (let i = 0; i < 3; i++) tone(440, t + i * 0.28, 0.16, { vol: 0.07, type: 'sine', attack: 0.01 }); },
    pop() { if (!ok()) return; tone(600, now(), 0.08, { vol: 0.08, slide: 1.8 }); },
    whoosh() { if (!ok()) return; const t = now(); noiseBurst(t, 0.35, { freq: 900, vol: 0.06, q: 0.7 }); },
    page() { if (!ok()) return; const t = now(); noiseBurst(t, 0.18, { freq: 1800, vol: 0.05, q: 0.6 }); },
    heart() { if (!ok()) return; const t = now(); tone(55, t, 0.18, { vol: 0.35 }); tone(52, t + 0.24, 0.22, { vol: 0.28 }); },
    shutter() { if (!ok()) return; const t = now(); noiseBurst(t, 0.04, { freq: 3000, vol: 0.2 }); noiseBurst(t + 0.07, 0.05, { freq: 2000, vol: 0.18 }); },
    vibrate() { if (ok()) { const t = now(); for (let i = 0; i < 2; i++) { tone(170, t + i * 0.5, 0.35, { vol: 0.05, type: 'sawtooth', attack: 0.02 }); } } vib([300, 200, 300]); },
  };

  /* -------- sonnerie (originale) -------- */
  let stopRingFn = null;
  function startRing(kind = 'normal') {
    stopRing();
    if (!ctx) return;
    let alive = true, id = null;
    const seq = kind === 'masked'
      ? [[220, 0], [233.08, 0.35], [220, 0.7], [207.65, 1.05]]
      : [[659.25, 0], [783.99, 0.16], [987.77, 0.32], [1318.5, 0.48], [1174.66, 0.72], [987.77, 0.88], [783.99, 1.04], [880, 1.2]];
    const loop = () => {
      if (!alive) return;
      if (!muted) {
        const t = now() + 0.02;
        seq.forEach(([f, d]) => kind === 'masked' ? tone(f, t + d, 0.4, { vol: 0.08, type: 'triangle' }) : marimba(f, t + d, 0.15));
      }
      vib([400, 300, 400]);
      id = setTimeout(loop, kind === 'masked' ? 2200 : 2400);
    };
    loop();
    stopRingFn = () => { alive = false; clearTimeout(id); };
  }
  function stopRing() { if (stopRingFn) stopRingFn(); stopRingFn = null; vib(0); }

  /* -------- tonalité d'appel (France : 440 Hz) -------- */
  let dialStop = null;
  function startDial() {
    stopDial(); if (!ctx) return;
    let alive = true;
    const loop = () => {
      if (!alive) return;
      if (!muted) tone(440, now() + 0.02, 1.3, { vol: 0.07, attack: 0.02 });
      setTimeout(loop, 3000);
    };
    loop();
    dialStop = () => { alive = false; };
  }
  function stopDial() { if (dialStop) dialStop(); dialStop = null; }

  /* -------- couches d'ambiance -------- */
  function layer(name, on = true) {
    if (!ctx) return;
    if (!on) { const L = layers[name]; if (L) { L.stop(); delete layers[name]; } return; }
    if (layers[name]) return;
    const out = ctx.createGain(); out.gain.value = 0.0001; out.connect(master);
    const nodes = [];
    const t = now();
    const add = n => { nodes.push(n); return n; };
    let timer = null;
    if (name === 'wind' || name === 'sea') {
      const s = add(noiseSrc()), f = ctx.createBiquadFilter(), lfo = add(ctx.createOscillator()), lg = ctx.createGain();
      f.type = 'lowpass'; f.frequency.value = name === 'sea' ? 500 : 800; f.Q.value = name === 'sea' ? 0.5 : 4;
      lfo.frequency.value = name === 'sea' ? 0.12 : 0.25; lg.gain.value = name === 'sea' ? 350 : 500;
      lfo.connect(lg); lg.connect(f.frequency);
      const amp = ctx.createGain(); amp.gain.value = name === 'sea' ? 0.5 : 0.28;
      if (name === 'sea') { const l2 = add(ctx.createOscillator()), g2 = ctx.createGain(); l2.frequency.value = 0.09; g2.gain.value = 0.3; l2.connect(g2); g2.connect(amp.gain); l2.start(); }
      s.connect(f); f.connect(amp); amp.connect(out); s.start(); lfo.start();
      out.gain.exponentialRampToValueAtTime(name === 'sea' ? 0.5 : 0.35, t + 1.5);
    } else if (name === 'office') {
      const s = add(noiseSrc()), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 300;
      const hum = add(ctx.createOscillator()); hum.frequency.value = 50; const hg = ctx.createGain(); hg.gain.value = 0.02;
      s.connect(f); f.connect(out); hum.connect(hg); hg.connect(out); s.start(); hum.start();
      out.gain.exponentialRampToValueAtTime(0.25, t + 0.8);
      const clicks = () => { if (!layers[name]) return; if (!muted) noiseBurst(now(), 0.02, { freq: 3000 + Math.random() * 2000, vol: 0.02 }); timer = setTimeout(clicks, 200 + Math.random() * 900); };
      timer = setTimeout(clicks, 400);
    } else if (name === 'line') {
      const s = add(noiseSrc()), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8;
      s.connect(f); f.connect(out); s.start();
      out.gain.exponentialRampToValueAtTime(0.03, t + 0.5);
    } else if (name === 'crackle') {
      const s = add(noiseSrc()), f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
      s.connect(f); f.connect(out); s.start();
      out.gain.exponentialRampToValueAtTime(0.04, t + 0.5);
      const pops = () => { if (!layers[name]) return; if (!muted) noiseBurst(now(), 0.01, { freq: 1500, vol: 0.08, q: 0.5 }); timer = setTimeout(pops, 80 + Math.random() * 500); };
      timer = setTimeout(pops, 200);
    } else if (name === 'drone') {
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380; f.connect(out);
      [55, 55.4, 82.4, 110.3].forEach(fr => { const o = add(ctx.createOscillator()); o.type = 'sawtooth'; o.frequency.value = fr; const g = ctx.createGain(); g.gain.value = 0.05; o.connect(g); g.connect(f); o.start(); });
      const lfo = add(ctx.createOscillator()), lg = ctx.createGain(); lfo.frequency.value = 0.05; lg.gain.value = 160; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
      out.gain.exponentialRampToValueAtTime(0.12, t + 6);
    } else if (name === 'hold') {
      const notes = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
      let i = 0;
      out.gain.value = 1;
      const play = () => { if (!layers[name]) return; if (!muted) { const tt = now(); notes[i % 4].forEach((f, k) => bell(f * 2, tt + k * 0.18, 0.04, 1.4, out)); } i++; timer = setTimeout(play, 1500); };
      timer = setTimeout(play, 100);
    }
    layers[name] = {
      stop() {
        clearTimeout(timer);
        try { out.gain.cancelScheduledValues(now()); out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), now()); out.gain.exponentialRampToValueAtTime(0.0001, now() + 0.6); } catch (e) {}
        setTimeout(() => { nodes.forEach(n => { try { n.stop(); } catch (e) {} }); try { out.disconnect(); } catch (e) {} }, 700);
      }
    };
  }
  function stopLayers(except = []) { Object.keys(layers).forEach(k => { if (!except.includes(k)) layer(k, false); }); }

  function foghorn() { if (!ok()) return; const t = now(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; f.connect(master); [98, 147, 196.5].forEach((fr, i) => tone(fr, t, 3.2, { vol: 0.09 / (i + 1), type: 'sawtooth', attack: 0.5, dest: f })); }
  function gull() { if (!ok()) return; const t = now(); for (let i = 0; i < 3; i++) tone(1800, t + i * 0.22, 0.18, { vol: 0.03, type: 'triangle', slide: 0.6 }); }
  function breath() { if (!ok()) return; const t = now(); noiseBurst(t, 1.2, { freq: 700, q: 0.7, vol: 0.05 }); noiseBurst(t + 1.6, 1.4, { freq: 500, q: 0.7, vol: 0.04 }); }
  function click() { if (!ok()) return; noiseBurst(now(), 0.03, { freq: 1500, vol: 0.25 }); }

  function setMuted(m) {
    muted = m;
    if (master) master.gain.value = m ? 0 : 0.9;
    if (m) { try { speechSynthesis.cancel(); } catch (e) {} }
  }

  return { init, fx, startRing, stopRing, startDial, stopDial, layer, stopLayers, foghorn, gull, breath, click, setMuted, get muted() { return muted; }, get ctx() { return ctx; } };
})();

/* ==========================================================
   Voix — synthèse vocale française (si disponible)
   ========================================================== */
const Voice = (() => {
  let voices = [];
  const synth = window.speechSynthesis;
  function load() { try { voices = synth.getVoices().filter(v => /^fr/i.test(v.lang)); } catch (e) { voices = []; } }
  if (synth) { load(); try { synth.onvoiceschanged = load; } catch (e) {} }
  const MALE = /thomas|nicolas|daniel|paul|henri|antoine|male|homme|mathieu|olivier|gilles|jacques|remy|rémy|guillaume/i;
  const FEMALE = /amelie|amélie|audrey|marie|aurelie|aurélie|julie|virginie|celine|céline|female|femme|denise|eloise|éloïse|hortense|google|sylvie|chantal|léa|lea/i;
  const PROFILES = {
    nora:   { g: 'f', pitch: 1.1, rate: 1.0 },
    jade:   { g: 'f', pitch: 1.35, rate: 1.1 },
    maman:  { g: 'f', pitch: 0.95, rate: 0.9 },
    mamie:  { g: 'f', pitch: 0.75, rate: 0.78 },
    claire: { g: 'f', pitch: 1.0, rate: 1.02 },
    morel:  { g: 'm', pitch: 0.55, rate: 0.88 },
    bastien:{ g: 'm', pitch: 0.85, rate: 1.08 },
    theo:   { g: 'm', pitch: 0.95, rate: 1.12 },
    robot:  { g: 'f', pitch: 1.0, rate: 1.0 },
    argos:  { g: 'f', pitch: 1.05, rate: 0.98 },
    homme:  { g: 'm', pitch: 0.8, rate: 1.0 },
  };
  function pick(g) {
    if (!voices.length) return null;
    const re = g === 'm' ? MALE : FEMALE;
    return voices.find(v => re.test(v.name)) || voices[0];
  }
  function estimate(text, rate = 1) { return Math.max(1200, (text.length * 62) / rate + 500); }
  function say(text, who = 'robot', token) {
    return new Promise(res => {
      const p = PROFILES[who] || PROFILES.robot;
      const est = estimate(text, p.rate);
      let done = false;
      const fin = () => { if (!done) { done = true; clearInterval(chk); res(); } };
      const chk = setInterval(() => { if (token && token.cancel) { try { synth.cancel(); } catch (e) {} fin(); } }, 100);
      if (!synth || Sound.muted || !voices.length) { setTimeout(fin, est); return; }
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'fr-FR';
        const v = pick(p.g); if (v) u.voice = v;
        u.pitch = p.pitch; u.rate = p.rate; u.volume = 1;
        u.onend = fin; u.onerror = fin;
        setTimeout(fin, est * 2.2 + 2500);
        synth.speak(u);
      } catch (e) { setTimeout(fin, est); }
    });
  }
  function stop() { try { synth && synth.cancel(); } catch (e) {} }
  return { say, stop, estimate, get available() { return voices.length > 0; } };
})();
