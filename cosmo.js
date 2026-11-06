/* ============================================================
   COSMO — cosmo.js
   Sterrenveld, logo-animatie "From chaos to cosmos", acroniem,
   sterrenkaart (hoe het werkt) en de zonder/met-schakelaar.
   ============================================================ */

(function () {
  'use strict';
  const beperkt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const OKER = '#C9A24B', MARMER = '#F3EFE6', TERRA = '#B9492C';
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  /* ---------- Sterrenveld (vast op de achtergrond; zelfde als de COSMO frontend) ---------- */
  const veld = $('#sterrenveld');
  if (veld) {
    const ctx = veld.getContext('2d');
    const COL = ['#F3EFE6', '#F3EFE6', '#F3EFE6', '#F3EFE6', '#C9A24B', '#8FA0FF', '#E8846A'];
    let W, H, S = [], last = 0;
    function init() {
      W = innerWidth; H = innerHeight; veld.width = W * dpr; veld.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(520, Math.floor(W * H / 4200)); S = [];
      for (let i = 0; i < n; i++) S.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() < .08 ? 1.3 + Math.random() : .35 + Math.random() * .9, a: .25 + Math.random() * .6, ph: Math.random() * 6.3, sp: .4 + Math.random() * 1.4, c: COL[Math.floor(Math.random() * COL.length)] });
    }
    function frame(t) {
      if (document.hidden || t - last < 33) { requestAnimationFrame(frame); return; } last = t;
      ctx.clearRect(0, 0, W, H);
      const g1 = ctx.createRadialGradient(W * .78, H * .18, 0, W * .78, H * .18, W * .45); g1.addColorStop(0, 'rgba(201,162,75,.07)'); g1.addColorStop(1, 'rgba(201,162,75,0)'); ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      const g2 = ctx.createRadialGradient(W * .15, H * .75, 0, W * .15, H * .75, W * .4); g2.addColorStop(0, 'rgba(59,108,255,.07)'); g2.addColorStop(1, 'rgba(59,108,255,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
      const sy = window.scrollY * .06;
      for (const s of S) { const a = beperkt ? s.a : s.a * (.55 + .45 * Math.sin(t / 1000 * s.sp + s.ph)); ctx.globalAlpha = a; ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x, ((s.y - sy) % H + H) % H, s.r, 0, 6.3); ctx.fill(); }
      ctx.globalAlpha = 1; requestAnimationFrame(frame);
    }
    init(); addEventListener('resize', init); requestAnimationFrame(frame);
  }

  /* ---------- Logo-animatie: from chaos to cosmos (port van de COSMO frontend) ---------- */
  const logo = $('#logo-canvas');
  if (logo) {
    const WM = {"tx":211.98,"ty":58,"paths":["M47.2 76.4Q34.2 76.4 24.4 71.55Q14.6 66.7 9.15 57.9Q3.7 49.1 3.7 37.4Q3.7 25.6 9.15 16.9Q14.6 8.2 24.6 3.4Q34.6 -1.4 48.3 -1.4Q51.6 -1.4 53.8 -1.15Q56 -0.9 57.9 -0.6Q59.8 -0.3 62.25 -0.05Q64.7 0.2 68.4 0.2L71.4 20.2H70.4Q69.3 14.3 66.05 9.75Q62.8 5.2 57.95 2.55Q53.1 -0.1 47.2 -0.1Q41.4 -0.1 36.5 2.7Q31.6 5.5 28.1 10.5Q24.6 15.6 22.65 22.65Q20.7 29.7 20.7 38.1Q20.7 49.2 24.1 57.45Q27.5 65.7 33.7 70.25Q39.9 74.8 48.3 74.8Q57.9 74.8 64.15 69.05Q70.4 63.3 71.9 53H72.9L70 74.6Q65.3 74.6 61.7 75.05Q58.1 75.5 54.75 75.95Q51.4 76.4 47.2 76.4Z","M138.1 76.4Q126.1 76.4 117.05 71.55Q108 66.7 102.95 57.95Q97.9 49.2 97.9 37.5Q97.9 25.8 102.95 17.05Q108 8.3 117.05 3.45Q126.1 -1.4 138.1 -1.4Q150.1 -1.4 159.15 3.45Q168.2 8.3 173.25 17.05Q178.3 25.8 178.3 37.5Q178.3 49.2 173.25 57.95Q168.2 66.7 159.15 71.55Q150.1 76.4 138.1 76.4ZM138.1 74.8Q143.3 74.8 147.6 72.1Q151.9 69.4 155 64.5Q158 59.6 159.65 52.7Q161.3 45.8 161.3 37.4Q161.3 29 159.65 22.05Q158 15.1 155 10.2Q151.9 5.3 147.6 2.6Q143.3 -0.1 138.1 -0.1Q132.9 -0.1 128.6 2.6Q124.3 5.3 121.3 10.2Q118.2 15.1 116.55 22.05Q114.9 29 114.9 37.4Q114.9 45.8 116.55 52.7Q118.2 59.6 121.3 64.5Q124.3 69.4 128.6 72.1Q132.9 74.8 138.1 74.8Z","M225.5 76.4Q222.9 76.4 221.25 76.2Q219.6 76 218 75.7Q216.4 75.4 214.1 75.2Q211.8 75 207.8 75L204.3 49H205.5Q207 61.3 212.35 67.95Q217.7 74.6 226.1 74.6Q232.3 74.6 236.2 71.1Q240.1 67.6 240.1 62Q240.1 59.6 239.25 57.4Q238.4 55.2 236.4 52.7Q234.4 50.2 231.1 47.25Q227.8 44.3 222.9 40.6L218.8 37.5Q211.3 31.8 208.4 27.3Q205.5 22.8 205.5 17.5Q205.5 8.7 211.95 3.65Q218.4 -1.4 229 -1.4Q231.6 -1.4 233.25 -1.2Q234.9 -1 236.45 -0.7Q238 -0.4 240.1 -0.2Q242.2 0 245.5 0L246.5 20.2H245.5Q244.1 10.9 239.5 5.5Q234.9 0.1 228.4 0.1Q223.8 0.1 221.05 2.8Q218.3 5.5 218.3 10Q218.3 13.9 220.85 17.45Q223.4 21 229.7 25.7L234 28.9Q240.6 33.7 244.45 37.75Q248.3 41.8 250 45.6Q251.7 49.4 251.7 53.7Q251.7 60.3 248.4 65.4Q245.1 70.5 239.25 73.35Q233.4 76.2 225.5 76.4Z","M314.1 76.4 286.1 12.2 281.4 64.8Q281 68.8 283.7 71.3Q286.4 73.8 290.3 74V75H270.3V74Q274.1 73.8 276.7 71.2Q279.3 68.6 279.7 64.7L284.7 9.4Q282.8 5.5 279.95 3.25Q277.1 1 272.6 1V0H296.6L321 56.5L345.4 0H364.1V1Q360.9 1 358.7 2.9Q356.5 4.8 356.7 8.1L361.8 67.3Q362.3 70.7 365.05 72.4Q367.8 74.1 370.5 74.1V75H339.5V74.1Q341.2 74.1 343 73.3Q344.8 72.5 345.95 71Q347.1 69.5 346.8 67.5L341.9 12.3Z","M431.9 76.4Q419.9 76.4 410.85 71.55Q401.8 66.7 396.75 57.95Q391.7 49.2 391.7 37.5Q391.7 25.8 396.75 17.05Q401.8 8.3 410.85 3.45Q419.9 -1.4 431.9 -1.4Q443.9 -1.4 452.95 3.45Q462 8.3 467.05 17.05Q472.1 25.8 472.1 37.5Q472.1 49.2 467.05 57.95Q462 66.7 452.95 71.55Q443.9 76.4 431.9 76.4ZM431.9 74.8Q437.1 74.8 441.4 72.1Q445.7 69.4 448.8 64.5Q451.8 59.6 453.45 52.7Q455.1 45.8 455.1 37.4Q455.1 29 453.45 22.05Q451.8 15.1 448.8 10.2Q445.7 5.3 441.4 2.6Q437.1 -0.1 431.9 -0.1Q426.7 -0.1 422.4 2.6Q418.1 5.3 415.1 10.2Q412 15.1 410.35 22.05Q408.7 29 408.7 37.4Q408.7 45.8 410.35 52.7Q412 59.6 415.1 64.5Q418.1 69.4 422.4 72.1Q426.7 74.8 431.9 74.8Z"]};
    const HL = [[134.74, 56.26, 8.88, 'T'], [95.5, 40, 6.11, 'M'], [56.26, 56.26, 12.21, 'O'], [40, 95.5, 7.21, 'M'], [56.26, 134.74, 10.54, 'T'], [95.5, 151, 5.55, 'M'], [134.74, 134.74, 8.32, 'O']];
    const HSPARK = [168.76, 95.5, 7.77];
    const C = { M: '#F3EFE6', T: '#B9492C', O: '#C9A24B', L: '#F3EFE6' };
    const cx = logo.getContext('2d');
    const WMP = WM.paths.map(d => new Path2D(d));
    const aan = ['#woordmerk', '#tagline', '#hero-titel', '#hero-onder'].map(s => $(s));
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const CH = 800, OR = 1200, T_ARC = CH + OR - 250, AR = 500, T_LET = 2300, T_TXT = 3100;
    let W, H, S, ox, oy, P = [], t0 = 0, alive = null, klaar = false;

    function maat() {
      const r = logo.parentElement.getBoundingClientRect(); W = r.width; H = r.height;
      logo.width = W * dpr; logo.height = H * dpr;
      S = Math.min(W * .00095, H * .0042, 1.15); ox = W / 2 - 364 * S; oy = H / 2 - 95.5 * S;
    }
    function drawLogo(karc, kspark, nlet, klet, glow, puls) {
      cx.setTransform(dpr * S, 0, 0, dpr * S, dpr * ox, dpr * oy);
      if (karc > 0) {
        let total = 0, seg = []; for (let i = 1; i < HL.length; i++) { const d = Math.hypot(HL[i][0] - HL[i - 1][0], HL[i][1] - HL[i - 1][1]); seg.push(d); total += d; }
        let rem = karc * total; cx.strokeStyle = C.L; cx.lineWidth = 1.11; cx.lineCap = 'round'; cx.setLineDash([3.61, 4.44]); cx.beginPath(); cx.moveTo(HL[0][0], HL[0][1]);
        for (let i = 1; i < HL.length && rem > 0; i++) { const d = seg[i - 1]; if (rem >= d) { cx.lineTo(HL[i][0], HL[i][1]); rem -= d; } else { const f = rem / d; cx.lineTo(HL[i - 1][0] + (HL[i][0] - HL[i - 1][0]) * f, HL[i - 1][1] + (HL[i][1] - HL[i - 1][1]) * f); rem = 0; } }
        cx.stroke(); cx.setLineDash([]);
      }
      HL.forEach((q, i) => { cx.fillStyle = C[q[3]]; if (glow) { cx.shadowColor = C[q[3]]; cx.shadowBlur = 12; } cx.beginPath(); cx.arc(q[0], q[1], q[2] * (puls ? 1 + .06 * Math.sin(puls + i) : 1), 0, 6.3); cx.fill(); cx.shadowBlur = 0; });
      if (kspark > 0) {
        const sc = kspark < .7 ? kspark / .7 * 1.25 : 1.25 - (kspark - .7) / .3 * .25; const [sx, sy, r0] = HSPARK; const r = r0 * sc;
        cx.fillStyle = C.L; if (glow) { cx.shadowColor = C.L; cx.shadowBlur = 14; }
        cx.beginPath(); cx.moveTo(sx, sy - r); cx.quadraticCurveTo(sx, sy, sx + r, sy); cx.quadraticCurveTo(sx, sy, sx, sy + r); cx.quadraticCurveTo(sx, sy, sx - r, sy); cx.quadraticCurveTo(sx, sy, sx, sy - r); cx.fill(); cx.shadowBlur = 0;
      }
      if (nlet > 0) { cx.translate(WM.tx, WM.ty); cx.fillStyle = C.L; for (let i = 0; i < WMP.length; i++) { if (i + 1 > nlet) break; const k = i + 1 === nlet ? klet : 1; cx.save(); cx.globalAlpha *= k; cx.translate(0, (1 - k) * 10); cx.fill(WMP[i]); cx.restore(); } }
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function reset() {
      if (alive) alive.alive = false; const me = { alive: true }; alive = me; klaar = false;
      aan.forEach(el => el && el.classList.remove('aan'));
      maat();
      const N = 110; P = [];
      for (let i = 0; i < N; i++) { const c = i < 7; P.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .9, vy: (Math.random() - .5) * .9, r: c ? 2 + Math.random() * 3 : .6 + Math.random() * 1.6, col: c ? C[HL[i][3]] : ['#F3EFE6', '#F3EFE6', '#C9A24B', '#8FA0FF'][i % 4], a: .9, sx: 0, sy: 0, sr: 0, c }); }
      t0 = performance.now();
      function frame(now) {
        if (!me.alive) return; const t = now - t0;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
        if (t < CH) { for (const p of P) { p.x += p.vx + Math.sin(now / 300 + p.r) * .3; p.y += p.vy + Math.cos(now / 330 + p.r) * .3; } }
        else if (!P[0].sr) { for (let i = 0; i < N; i++) { const p = P[i]; p.sx = p.x; p.sy = p.y; p.sr = p.r; if (p.c) { p.tx = ox + HL[i][0] * S; p.ty = oy + HL[i][1] * S; p.tr = HL[i][2] * S; } else { p.tx = p.x + (Math.random() - .5) * 60; p.ty = p.y + (Math.random() - .5) * 60; p.tr = p.r * .8; } } }
        if (t >= CH) { const k = ease(Math.min(1, (t - CH) / OR)); for (const p of P) { p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k; p.r = p.sr + (p.tr - p.sr) * k; if (!p.c) p.a = .9 - .6 * k; } }
        const formed = t >= CH + OR;
        for (const p of P) { if (p.c && formed) continue; if (!p.c && formed) { p.x += Math.sin(now / 900 + p.r) * .15; p.y += Math.cos(now / 1100 + p.r) * .12; } cx.globalAlpha = p.a; cx.fillStyle = p.col; if (p.c) { cx.shadowColor = p.col; cx.shadowBlur = 14; } cx.beginPath(); cx.arc(p.x, p.y, Math.max(.3, p.r), 0, 6.3); cx.fill(); cx.shadowBlur = 0; }
        cx.globalAlpha = 1;
        const karc = Math.max(0, Math.min(1, (t - T_ARC) / AR)), kspark = Math.max(0, Math.min(1, (t - T_ARC - AR + 120) / 320));
        let nlet = 0, klet = 1; if (t >= T_LET) { const u = (t - T_LET) / 120; nlet = Math.min(5, Math.floor(u) + 1); klet = u < 5 ? u - Math.floor(u) : 1; }
        if (formed) drawLogo(karc, kspark, nlet, klet, t < T_TXT + 600, t > T_TXT ? now / 700 : 0);
        if (t > T_LET + 500 && aan[1]) aan[1].classList.add('aan');
        if (t > T_TXT) { aan.slice(2).forEach(el => el && el.classList.add('aan')); klaar = true; }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if (beperkt) { maat(); drawLogo(1, 1, 5, 1, false, 0); aan.forEach(el => el && el.classList.add('aan')); }
    else { reset(); addEventListener('resize', () => { if (klaar) { maat(); } }); }
    const opnieuw = $('#opnieuw'); if (opnieuw) opnieuw.addEventListener('click', reset);
    logo.addEventListener('click', () => { if (!klaar && alive) { /* overslaan */ t0 -= 5000; } });
  }

  /* ---------- Probleemkaarten: uitlijnen bij scroll ---------- */
  const probleem = $('#probleem-kaarten');
  if (probleem) {
    const kaarten = $$('.cosmo-kaart', probleem);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { kaarten.forEach((k, i) => setTimeout(() => k.classList.add('zichtbaar'), i * 180)); io.disconnect(); } }, { threshold: .3 });
      io.observe(probleem);
    } else kaarten.forEach(k => k.classList.add('zichtbaar'));
  }

  /* ---------- Acroniem ---------- */
  const letters = $$('.letter');
  if (letters.length) {
    const woord = $('#acro-woord'), tekst = $('#acro-tekst');
    const data = [
      ['<em>C</em>ompany\'s', 'Het geheugen van úw organisatie, met uw processen, uw mensen en uw afspraken. In de persoonlijke editie staat de C voor de eigenaar zelf.'],
      ['<em>O</em>rganized', 'Orde tegenover chaos. Van het Griekse κόσμος: niet meer informatie, maar informatie op zijn plek. Dat is wat COSMO doet, elke dag opnieuw.'],
      ['<em>S</em>econd', 'Een tweede geheugen naast het eerste. Niet om mensen te vervangen, maar om ze te ontlasten van onthouden, zoeken en reconstrueren.'],
      ['<em>M</em>ind', 'Een brein dat verbanden legt. Besluiten horen bij processen, processen bij mensen, mensen bij afdelingen. COSMO kent die lijnen.'],
      ['<em>O</em>perator', 'Hij doet het zelf. Instroom, ordening, controle en bijwerken lopen in een vast ritme, zonder dat iemand ernaar om hoeft te kijken.']
    ];
    let huidig = 0, timer;
    function zet(i) {
      huidig = i;
      letters.forEach((l, j) => l.classList.toggle('aan', j === i));
      woord.style.opacity = 0; tekst.style.opacity = 0;
      setTimeout(() => { woord.innerHTML = data[i][0]; tekst.textContent = data[i][1]; woord.style.opacity = 1; tekst.style.opacity = 1; }, 220);
    }
    letters.forEach(l => l.addEventListener('click', () => { zet(+l.dataset.k); clearInterval(timer); }));
    zet(0);
    if (!beperkt) timer = setInterval(() => zet((huidig + 1) % data.length), 3800);
  }

  /* ---------- Sterrenkaart: van bron naar keuze ---------- */
  const graaf = $('#graaf');
  if (graaf) {
    const ctx = graaf.getContext('2d');
    const paneel = { label: $('#paneel-label'), titel: $('#paneel-titel'), tekst: $('#paneel-tekst'), dots: $('#paneel-dots') };
    const knopen = [
      { id: 'bron', naam: 'Bronnen', x: .12, y: .5, r: 9, k: MARMER, titel: 'Bronnen', tekst: 'E-mail, Teams, SharePoint, documenten, gesprekken en systemen. COSMO sluit aan op wat er al is, zonder dat mensen anders hoeven te werken.' },
      { id: 'b1', naam: 'Outlook', x: .07, y: .22, r: 4, k: MARMER, sat: 'bron' },
      { id: 'b2', naam: 'Teams', x: .06, y: .5, r: 4, k: MARMER, sat: 'bron' },
      { id: 'b3', naam: 'SharePoint', x: .08, y: .78, r: 4, k: MARMER, sat: 'bron' },
      { id: 'instroom', naam: 'Instroom', x: .32, y: .3, r: 8, k: MARMER, titel: 'Instroom', tekst: 'Elke werkdag haalt COSMO op wat er nieuw is: besluiten, afspraken, wijzigingen. Niets hoeft overgetypt te worden.' },
      { id: 'ordening', naam: 'Ordening', x: .5, y: .62, r: 10, k: OKER, titel: 'Ordening', tekst: 'De AI-laag sorteert, koppelt en controleert. Een besluit komt bij het proces, het proces bij de afdeling, de afdeling bij de mensen. Chaos wordt cosmos.' },
      { id: 'geheugen', naam: 'Geheugen', x: .68, y: .32, r: 11, k: OKER, titel: 'Geheugen', tekst: 'Het georganiseerde tweede brein: leesbare, open notities in een vaste structuur. Van u, in uw eigen omgeving, los van één AI-leverancier.' },
      { id: 'inzicht', naam: 'Inzicht', x: .84, y: .6, r: 8, k: MARMER, titel: 'Inzicht', tekst: 'Vraag het in gewone taal: wat is er afgesproken, waarom, met wie en wat staat open. Het antwoord komt met de context erbij.' },
      { id: 'keuze', naam: 'Keuze', x: .91, y: .3, r: 9, k: TERRA, titel: 'Keuze', tekst: 'Hier draait het om. Uw mensen beslissen met het hele beeld, vandaag in plaats van volgende week. Minder zoeken, beter beslissen.' }
    ];
    const hoofd = knopen.filter(k => k.titel);
    const randen = [['b1', 'bron'], ['b2', 'bron'], ['b3', 'bron'], ['bron', 'instroom'], ['instroom', 'ordening'], ['ordening', 'geheugen'], ['geheugen', 'inzicht'], ['inzicht', 'keuze'], ['geheugen', 'ordening']];
    const deeltjes = randen.map((r, i) => ({ r, t: Math.random(), s: .0025 + Math.random() * .002 }));
    let W, H, actief = 'bron', hover = null, muis = { x: -1, y: -1 };
    const vind = id => knopen.find(k => k.id === id);
    const pos = k => ({ x: k.x * W, y: k.y * H });

    function maat() {
      const r = graaf.parentElement.getBoundingClientRect(); W = r.width; H = r.height;
      graaf.width = W * dpr; graaf.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function zet(id) {
      actief = id; const k = vind(id); const i = hoofd.indexOf(k);
      paneel.titel.style.opacity = 0; paneel.tekst.style.opacity = 0;
      setTimeout(() => { paneel.label.textContent = 'Stap ' + (i + 1) + ' van ' + hoofd.length; paneel.titel.textContent = k.titel; paneel.tekst.textContent = k.tekst; paneel.titel.style.opacity = 1; paneel.tekst.style.opacity = 1; }, 200);
      $$('button', paneel.dots).forEach((b, j) => b.classList.toggle('aan', j === i));
    }
    hoofd.forEach((k, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', k.titel); b.addEventListener('click', () => { zet(k.id); clearInterval(timer); }); paneel.dots.appendChild(b); });

    function teken(t) {
      ctx.clearRect(0, 0, W, H);
      const wob = (k, i) => ({ x: pos(k).x + Math.sin(t * .0006 + i) * 4, y: pos(k).y + Math.cos(t * .0005 + i * 1.7) * 4 });
      const P = {}; knopen.forEach((k, i) => P[k.id] = wob(k, i));
      // randen
      randen.forEach(([a, b]) => {
        const A = P[a], B = P[b];
        const aan = a === actief || b === actief;
        ctx.strokeStyle = aan ? 'rgba(201,162,75,.7)' : 'rgba(243,239,230,.18)';
        ctx.lineWidth = aan ? 1.4 : 1; ctx.setLineDash([3, 6]);
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); ctx.setLineDash([]);
      });
      // deeltjes langs randen
      deeltjes.forEach(d => {
        d.t += d.s * (beperkt ? 0 : 1); if (d.t > 1) d.t = 0;
        const A = P[d.r[0]], B = P[d.r[1]];
        const x = A.x + (B.x - A.x) * d.t, y = A.y + (B.y - A.y) * d.t;
        ctx.fillStyle = 'rgba(201,162,75,.9)'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill();
      });
      // knopen
      knopen.forEach(k => {
        const p = P[k.id]; const isActief = k.id === actief, isHover = k === hover;
        const r = k.r * (isActief ? 1.3 : isHover ? 1.15 : 1);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
        g.addColorStop(0, k.k + (isActief ? 'CC' : '66')); g.addColorStop(1, k.k + '00');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3.5, 0, 6.283); ctx.fill();
        ctx.fillStyle = k.k; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill();
        if (isActief) { ctx.strokeStyle = k.k; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, r + 7 + Math.sin(t * .004) * 2, 0, 6.283); ctx.stroke(); }
        ctx.fillStyle = k.sat ? 'rgba(243,239,230,.5)' : (isActief ? MARMER : 'rgba(243,239,230,.8)');
        ctx.font = (k.sat ? '500 10px' : (isActief ? '500 13px' : '500 12px')) + ' "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(k.naam.toUpperCase(), p.x, p.y + r + 18);
      });
      requestAnimationFrame(teken);
    }
    function onderMuis(x, y) {
      let best = null, bd = 28;
      knopen.filter(k => k.titel).forEach(k => { const p = pos(k); const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = k; } });
      return best;
    }
    graaf.addEventListener('mousemove', e => { const r = graaf.getBoundingClientRect(); hover = onderMuis(e.clientX - r.left, e.clientY - r.top); graaf.style.cursor = hover ? 'pointer' : 'default'; });
    graaf.addEventListener('click', e => { const r = graaf.getBoundingClientRect(); const k = onderMuis(e.clientX - r.left, e.clientY - r.top); if (k) { zet(k.id); clearInterval(timer); } });
    maat(); window.addEventListener('resize', maat); zet('bron'); requestAnimationFrame(teken);
    let timer = beperkt ? null : setInterval(() => { const i = hoofd.findIndex(k => k.id === actief); zet(hoofd[(i + 1) % hoofd.length].id); }, 4200);
  }

  /* ---------- Zonder / met ---------- */
  const schakel = $('#schakel'), vergelijk = $('#vergelijk');
  if (schakel && vergelijk) {
    function toggle() { const aan = schakel.classList.toggle('aan'); vergelijk.classList.toggle('aan', aan); schakel.setAttribute('aria-checked', String(aan)); }
    schakel.addEventListener('click', toggle);
    schakel.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
    // automatisch één keer omzetten als het blok in beeld komt
    if (!beperkt && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { setTimeout(() => { if (!schakel.classList.contains('aan')) toggle(); }, 1800); io.disconnect(); } }, { threshold: .5 });
      io.observe(vergelijk);
    }
  }
})();
