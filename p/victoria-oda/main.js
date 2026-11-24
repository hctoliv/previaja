// Prévia · Victoria Oda
// A senha só protege a prévia de visitas casuais (o site é estático e público).
(() => {
  const HASH = '2913d78fbe93d91f4e24b50c6d63430a6c36a70152bbb64683612edb8b725911';
  const KEY = 'pj-victoria-oda';
  const WA = '5511996097436';
  const MSG = 'Olá, Victoria! Vim pelo site e gostaria de conversar sobre o meu filho.';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

  /* ---------- senha ---------- */
  const gate = $('#gate'), welcome = $('#welcome'), site = $('#site');
  const form = $('#gate-form'), input = $('#gate-pass'), err = $('#gate-error');
  const sha256 = async (t) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };
  const openSite = (animate) => {
    gate.hidden = true;
    const show = () => {
      welcome.hidden = true; site.hidden = false;
      document.body.classList.remove('locked');
      requestAnimationFrame(() => { site.classList.add('is-in'); initSite(); });
    };
    if (!animate) return show();
    welcome.hidden = false; setTimeout(show, 1600);
  };
  let ok = false;
  try { ok = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (ok) openSite(false); else input.focus();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = input.value.trim().toLowerCase();
    if (v && (await sha256(v)) === HASH) {
      try { sessionStorage.setItem(KEY, '1'); } catch (e2) {}
      err.hidden = true; openSite(true);
    } else {
      err.hidden = false;
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      input.select();
    }
  });

  /* ---------- site ---------- */
  let started = false;
  function initSite() {
    if (started) return; started = true;

    $$('.js-wa').forEach((a) => { a.href = wa(MSG); a.target = '_blank'; a.rel = 'noopener noreferrer'; });

    // aparecer ao rolar
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
    document.querySelector('.hero').classList.add('go');

    // letras que fogem do mouse e acompanham a rolagem
    const fls = $$('.fl');
    let mx = 0, my = 0, sy = 0, raf = 0;
    const paint = () => {
      raf = 0;
      fls.forEach((f) => {
        const d = parseFloat(f.dataset.d);
        f.style.translate = `${mx * 26 * d}px ${my * 20 * d - sy * .18 * d}px`;
      });
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    if (!reduce) {
      addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; ask(); }, { passive: true });
      addEventListener('scroll', () => { sy = Math.min(scrollY, 900); ask(); }, { passive: true });
    }

    // teste rápido
    const chips = $$('.chip'), ring = $('#ring'), count = $('#count'), msg = $('#quiz-msg'), qbtn = $('#quiz-btn');
    const C = 2 * Math.PI * 52;
    ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C;
    const update = () => {
      const on = chips.filter((c) => c.getAttribute('aria-pressed') === 'true');
      const n = on.length;
      count.textContent = n;
      ring.style.strokeDashoffset = C * (1 - n / chips.length);
      if (n === 0) { msg.textContent = 'Toque nos sinais que você reconhece.'; qbtn.hidden = true; return; }
      msg.textContent = n === 1
        ? 'Um sinal sozinho pode ser só uma fase. Mas se ele se repete e incomoda, vale conversar.'
        : n <= 3
          ? `Você marcou ${n} sinais. Vale uma conversa pra entender o que está por trás deles.`
          : `Você marcou ${n} sinais. Uma avaliação pode trazer clareza e alívio pra vocês dois.`;
      qbtn.hidden = false;
      const lista = on.map((c) => '• ' + c.lastChild.textContent.trim()).join('\n');
      qbtn.href = wa(`Olá, Victoria! Fiz o teste rápido no seu site e percebi no meu filho:\n${lista}\nGostaria de conversar.`);
      qbtn.target = '_blank'; qbtn.rel = 'noopener noreferrer';
    };
    chips.forEach((c) => c.addEventListener('click', () => {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      update();
    }));

    // jornada
    const steps = $$('.step'), jn = $('#j-num'), je = $('#j-emo'), jb = $('#j-bar'), card = $('.journey__card');
    const sio = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      steps.forEach((s) => s.classList.toggle('on', s === en.target));
      const i = steps.indexOf(en.target);
      jn.textContent = en.target.dataset.n; je.textContent = en.target.dataset.e;
      jb.style.width = `${((i + 1) / steps.length) * 100}%`;
      card.style.setProperty('--bg', ['var(--butter)', 'var(--sky)', 'var(--sage)', 'var(--coral)'][i]);
      card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
    }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => sio.observe(s));

    // trilho de dicas: arrastar com o mouse
    const rail = $('.tips__rail');
    let down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('drag'); });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('drag'); });
    rail.addEventListener('pointermove', (e) => { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
  }
})();
