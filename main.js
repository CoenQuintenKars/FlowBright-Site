/* ============================================================
   Flowbright — main.js
   Gedeelde interactie: navigatie, scroll-reveal, hero-stroomveld,
   kluwen-slider, herkenningslijst, tijdlijn, naamspeler, contact.
   Alles is optioneel: een onderdeel start alleen als het element
   op de pagina staat.
   ============================================================ */

(function () {
  'use strict';

  const beperkt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Navigatie ---------- */
  const header = $('.site-header');
  const heroAanwezig = !!$('.hero');
  function zetHeader() {
    if (!header) return;
    const boven = window.scrollY < 40;
    header.classList.toggle('transparant', boven && heroAanwezig);
  }
  zetHeader();
  window.addEventListener('scroll', zetHeader, { passive: true });

  const menuKnop = $('.menu-knop');
  if (menuKnop) {
    menuKnop.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      menuKnop.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  /* ---------- Hero: woord voor woord ---------- */
  $$('.woorden').forEach(el => {
    const nodes = Array.from(el.childNodes);
    let i = 0;
    el.innerHTML = '';
    nodes.forEach(node => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(deel => {
          if (!deel) return;
          if (/^\s+$/.test(deel)) { el.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = deel;
          el.appendChild(s);
        });
      } else {
        const s = document.createElement('span');
        s.className = 'w'; s.style.setProperty('--i', i++);
        s.appendChild(node.cloneNode(true));
        el.appendChild(s);
      }
    });
  });

  /* ---------- Scroll-reveal ---------- */
  const reveal = $$('[data-reveal]');
  if ('IntersectionObserver' in window && reveal.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('zichtbaar'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(el => io.observe(el));
  } else {
    reveal.forEach(el => el.classList.add('zichtbaar'));
  }

  /* ---------- Cursor-gloed en kaart-gloed ---------- */
  if (window.matchMedia('(hover: hover)').matches && !beperkt) {
    const gloed = document.createElement('div');
    gloed.className = 'cursor-gloed';
    document.body.appendChild(gloed);
    let gx = 0, gy = 0, tx = 0, ty = 0, actief = false;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; if (!actief) { actief = true; gloed.classList.add('aan'); } });
    window.addEventListener('mouseleave', () => gloed.classList.remove('aan'));
    (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; gloed.style.transform = `translate(${gx - 210}px, ${gy - 210}px)`; requestAnimationFrame(loop); })();
  }
  $$('.kaart').forEach(k => {
    k.addEventListener('mousemove', e => {
      const r = k.getBoundingClientRect();
      k.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      k.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Hero-stroomveld (canvas) ---------- */
  const stroomveld = $('#stroomveld');
  if (stroomveld && !beperkt) {
    const ctx = stroomveld.getContext('2d');
    let W, H, deeltjes = [], lichten = [], muis = { x: -9999, y: -9999 };
    const AANTAL = () => Math.min(260, Math.floor((W * H) / 6500));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function maat() {
      const r = stroomveld.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      stroomveld.width = W * dpr; stroomveld.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      deeltjes = Array.from({ length: AANTAL() }, nieuw);
      lichten = Array.from({ length: 7 }, (_, i) => ({
        x: W * (0.12 + 0.76 * ((i * 0.618) % 1)), y: H * (0.18 + 0.64 * ((i * 0.382 + 0.2) % 1)), r: 0, doel: 0
      }));
      ctx.fillStyle = 'rgba(11,23,36,1)'; ctx.fillRect(0, 0, W, H);
    }
    function nieuw() {
      return { x: Math.random() * W, y: Math.random() * H, leven: 80 + Math.random() * 160, s: .6 + Math.random() * 1.2 };
    }
    function veld(x, y, t) {
      // zachte stroming van links naar rechts met golven; geen echte noise nodig
      const a = Math.sin(y * 0.004 + t * 0.0004) * 0.9 + Math.cos(x * 0.003 - t * 0.0003) * 0.6;
      return a * 0.55;
    }
    let laatste = 0;
    function teken(t) {
      // fade in plaats van wissen: dit geeft de sporen
      ctx.fillStyle = 'rgba(11,23,36,0.085)';
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1.1;
      deeltjes.forEach(d => {
        const hoek = veld(d.x, d.y, t);
        let vx = Math.cos(hoek) * d.s + 0.55 * d.s, vy = Math.sin(hoek) * d.s;
        const dx = d.x - muis.x, dy = d.y - muis.y, dist = Math.hypot(dx, dy);
        if (dist < 140) { const k = (140 - dist) / 140; vx += (dx / dist) * k * 2.4; vy += (dy / dist) * k * 2.4; }
        const nx = d.x + vx, ny = d.y + vy;
        ctx.strokeStyle = 'rgba(42,157,179,0.55)';
        lichten.forEach(l => { if (Math.hypot(l.x - nx, l.y - ny) < 60) { l.doel = 1; ctx.strokeStyle = 'rgba(242,163,60,0.8)'; } });
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(nx, ny); ctx.stroke();
        d.x = nx; d.y = ny; d.leven--;
        if (d.leven <= 0 || d.x > W + 10 || d.y < -10 || d.y > H + 10) { const n = nieuw(); n.x = -5 + Math.random() * 20; d.x = n.x; d.y = n.y; d.leven = n.leven; }
      });
      lichten.forEach(l => {
        l.r += (l.doel - l.r) * 0.04; l.doel *= 0.97;
        if (l.r > 0.01) {
          const rad = 16 + l.r * 22;
          const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, rad);
          g.addColorStop(0, `rgba(242,163,60,${0.55 * l.r})`); g.addColorStop(1, 'rgba(242,163,60,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y, rad, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(255,236,200,${0.9 * l.r})`; ctx.beginPath(); ctx.arc(l.x, l.y, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      });
      laatste = t;
      requestAnimationFrame(teken);
    }
    maat();
    window.addEventListener('resize', maat);
    stroomveld.parentElement.addEventListener('mousemove', e => { const r = stroomveld.getBoundingClientRect(); muis.x = e.clientX - r.left; muis.y = e.clientY - r.top; });
    stroomveld.parentElement.addEventListener('mouseleave', () => { muis.x = -9999; muis.y = -9999; });
    requestAnimationFrame(teken);
  }

  /* ---------- Kluwen → één beeld ---------- */
  const kluwenSvg = $('#kluwen-svg');
  if (kluwenSvg) {
    const slider = $('#kluwen-slider');
    const status = $('#kluwen-status');
    const stappen = $$('.kluwen-tekst .stappen li');
    const paden = $$('path.lijn', kluwenSvg);
    const knopen = $$('.knoop', kluwenSvg);
    const N = paden.length, B = 600, Hh = 340;
    // chaos: kronkelende bezier-paden; orde: rechte evenwijdige lijnen naar één punt rechts
    const chaos = paden.map((_, i) => {
      const r = (s) => Math.sin(i * 12.9898 + s * 78.233) * 0.5 + 0.5;
      return [
        [20, 40 + r(1) * 260], [120 + r(2) * 120, 20 + r(3) * 300], [250 + r(4) * 150, 20 + r(5) * 300], [380 + r(6) * 120, 30 + r(7) * 280], [560, 40 + r(8) * 260]
      ];
    });
    const orde = paden.map((_, i) => {
      const y = 50 + (i / (N - 1)) * 240;
      return [[20, y], [180, y], [330, y], [450, 170 + (y - 170) * .35], [560, 170]];
    });
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    function teken(t) {
      const e = ease(t);
      paden.forEach((p, i) => {
        const c = chaos[i], o = orde[i];
        const pt = c.map((cp, j) => [lerp(cp[0], o[j][0], e), lerp(cp[1], o[j][1], e)]);
        const f = n => n.toFixed(1);
        p.setAttribute('d', `M ${f(pt[0][0])} ${f(pt[0][1])} C ${f(pt[1][0])} ${f(pt[1][1])} ${f(pt[2][0])} ${f(pt[2][1])} ${f(pt[3][0])} ${f(pt[3][1])} S ${f(pt[4][0])} ${f(pt[4][1])} ${f(pt[4][0])} ${f(pt[4][1])}`);
        const kleur = e > .5 ? `rgba(42,157,179,${0.5 + e * .5})` : `rgba(154,166,173,${0.6})`;
        p.setAttribute('stroke', e > .85 ? '#F2A33C' : kleur);
      });
      knopen.forEach(k => { k.setAttribute('opacity', Math.max(0, (e - .7) / .3)); k.setAttribute('r', 6 + 10 * Math.max(0, (e - .7) / .3)); });
      const teksten = ['Kluwen: informatie lekt weg tussen afdelingen', 'Luisteren: waar breekt de flow?', 'Vertalen: de kluwen wordt één beeld', 'Eén beeld dat voor iedereen klopt'];
      const idx = e < .25 ? 0 : e < .6 ? 1 : e < .9 ? 2 : 3;
      if (status) status.textContent = teksten[idx];
      stappen.forEach((li, i) => li.classList.toggle('aan', i <= idx - 1));
    }
    slider.addEventListener('input', () => teken(slider.value / 100));
    teken(0);
    // automatisch afspelen als de sectie in beeld komt
    if (!beperkt && 'IntersectionObserver' in window) {
      let gespeeld = false;
      new IntersectionObserver(en => {
        if (en[0].isIntersecting && !gespeeld) {
          gespeeld = true;
          const start = performance.now();
          (function anim(now) {
            const t = Math.min(1, (now - start) / 3200);
            slider.value = Math.round(t * 100); teken(t);
            if (t < 1) requestAnimationFrame(anim);
          })(start);
        }
      }, { threshold: .5 }).observe(kluwenSvg);
    }
  }

  /* ---------- Herkenning ---------- */
  const herken = $$('.herken-item');
  if (herken.length) {
    const uitkomst = $('#herken-uitkomst');
    function update() {
      const n = herken.filter(h => h.classList.contains('aan')).length;
      const titel = $('strong', uitkomst), tekst = $('p', uitkomst);
      if (n === 0) { titel.textContent = 'Herkent u het?'; tekst.textContent = 'Vink aan wat bij uw organisatie speelt.'; }
      else if (n <= 2) { titel.textContent = `${n} van ${herken.length} herkend`; tekst.textContent = 'Het begint te knellen. Een goed moment om de hele keten eens te overzien.'; }
      else if (n <= 4) { titel.textContent = `${n} van ${herken.length} herkend`; tekst.textContent = 'Dit is scène één van het verhaal. De groei ging sneller dan de processen. Een kennismaking is de moeite waard.'; }
      else { titel.textContent = 'Alles herkend'; tekst.textContent = 'Dan ligt het niet aan uw mensen, maar aan hoe het werk stroomt. Laten we kijken waar de flow breekt.'; }
    }
    herken.forEach(h => h.addEventListener('click', () => { h.classList.toggle('aan'); update(); }));
    update();
  }

  /* ---------- Tijdlijn (werkwijze) ---------- */
  const tijdlijn = $('.tijdlijn');
  if (tijdlijn) {
    const lijn = $('.tijdlijn-lijn', tijdlijn);
    const stappen = $$('.stap', tijdlijn);
    function scroll() {
      const r = tijdlijn.getBoundingClientRect();
      const midden = window.innerHeight * .6;
      const v = Math.min(1, Math.max(0, (midden - r.top) / r.height));
      lijn.style.setProperty('--voortgang', v.toFixed(3));
      stappen.forEach((s, i) => {
        const sr = s.getBoundingClientRect();
        const actief = sr.top < midden;
        s.classList.toggle('actief', actief);
        if (i === stappen.length - 1) s.classList.toggle('licht-aan', actief);
      });
    }
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
  }

  /* ---------- Naamspeler (over) ---------- */
  const naam = $('.naam-groot');
  if (naam) {
    const uitleg = { flow: $('#uitleg-flow'), bright: $('#uitleg-bright') };
    let stand = 0;
    function zet(k) {
      naam.classList.toggle('toon-flow', k === 'flow');
      naam.classList.toggle('toon-bright', k === 'bright');
      Object.keys(uitleg).forEach(key => uitleg[key] && uitleg[key].classList.toggle('actief', key === k));
    }
    ['flow', 'bright'].forEach(k => {
      $('.' + k, naam).addEventListener('mouseenter', () => zet(k));
      $('.' + k, naam).addEventListener('click', () => zet(k));
      uitleg[k] && uitleg[k].addEventListener('mouseenter', () => zet(k));
    });
    if (!beperkt) setInterval(() => { if (!naam.matches(':hover')) { stand = (stand + 1) % 2; zet(stand === 0 ? 'flow' : 'bright'); } }, 2600);
    zet('flow');
  }

  /* ---------- Contact ---------- */
  const formulier = $('#contact-formulier');
  if (formulier) {
    const chips = $$('.onderwerp', formulier);
    const param = new URLSearchParams(location.search).get('onderwerp');
    chips.forEach(c => c.addEventListener('click', () => { chips.forEach(x => x.classList.remove('aan')); c.classList.add('aan'); }));
    if (param) { const c = chips.find(x => x.dataset.key === param); if (c) c.classList.add('aan'); }
    else chips[0].classList.add('aan');
    if (param === 'cosmo') { const t = $('#bericht'); if (t && !t.value) t.value = 'Ik wil graag een demo van COSMO zien. '; }
    formulier.addEventListener('submit', e => {
      e.preventDefault();
      const naamV = $('#naam').value.trim(), bedrijf = $('#bedrijf').value.trim(), bericht = $('#bericht').value.trim();
      const onderwerp = (chips.find(c => c.classList.contains('aan')) || chips[0]).textContent.trim();
      const body = `${bericht}\n\n${naamV}${bedrijf ? ' · ' + bedrijf : ''}`;
      location.href = `mailto:info@flowbright.nl?subject=${encodeURIComponent('Flowbright · ' + onderwerp)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ---------- COSMO-teaser: mini sterrenveld ---------- */
  const mini = $('#mini-sterren');
  if (mini && !beperkt) {
    const ctx = mini.getContext('2d');
    let W, H, sterren = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function maat() {
      const r = mini.parentElement.getBoundingClientRect();
      W = r.width; H = r.height; mini.width = W * dpr; mini.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sterren = Array.from({ length: Math.floor(W * H / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, f: Math.random() * Math.PI * 2, s: .4 + Math.random() * .8 }));
    }
    function teken(t) {
      ctx.clearRect(0, 0, W, H);
      sterren.forEach(s => {
        const a = .35 + .5 * (Math.sin(t * .0012 * s.s + s.f) * .5 + .5);
        ctx.fillStyle = `rgba(243,239,230,${a})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        s.y -= .05 * s.s; if (s.y < -2) s.y = H + 2;
      });
      requestAnimationFrame(teken);
    }
    maat(); window.addEventListener('resize', maat); requestAnimationFrame(teken);
  }
})();
