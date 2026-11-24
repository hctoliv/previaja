(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* intro */
  const intro = $('#intro');
  document.body.classList.add('is-locked');
  const endIntro = () => {
    if (intro.classList.contains('is-out')) return;
    intro.classList.add('is-out');
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-ready');
    splitTitle();
    countUp();
  };
  setTimeout(endIntro, reduce ? 0 : 1700);
  intro.addEventListener('click', endIntro);

  /* split letters */
  function splitTitle() {
    $$('[data-split]').forEach((el) => {
      const t = el.textContent; el.textContent = ''; el.setAttribute('aria-label', t);
      [...t].forEach((c, i) => {
        const s = document.createElement('span'); s.className = 'ch'; s.textContent = c;
        s.setAttribute('aria-hidden', 'true'); s.style.animationDelay = (0.15 + i * 0.07) + 's'; el.appendChild(s);
      });
    });
  }

  /* counters */
  function countUp() {
    $$('.count').forEach((el) => {
      const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      const fmt = (v) => 'thousands' in el.dataset ? String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : v.toFixed(dec).replace('.', ',');
      if (reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), d = 1600;
      const step = (t) => { const p = Math.min(1, (t - t0) / d); el.textContent = fmt(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* nav */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('is-open', open);
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); }));
  const secs = $$('main section[id]');
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$('a', menu).forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => spy.observe(s));

  /* reveal */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = ((i % 3) * 0.08) + 's'; io.observe(el); });

  /* news filter */
  const grid = $('#newsGrid'), empty = $('#newsEmpty');
  $$('.chip').forEach((b) => b.addEventListener('click', () => {
    $$('.chip').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    const f = b.dataset.f; let n = 0;
    $$('.card', grid).forEach((c) => {
      const show = f === 'all' || c.dataset.tags.split(' ').includes(f);
      c.classList.toggle('is-hidden', !show); if (show) { n++; c.classList.add('is-in'); }
    });
    empty.hidden = n > 0;
  }));

  /* Vice City scrollytelling */
  const steps = $$('.vc__step'), imgs = $$('.vc__img'), num = $('#vcNum');
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = e.target.dataset.i;
    steps.forEach((s) => s.classList.toggle('is-on', s === e.target));
    imgs.forEach((im) => im.classList.toggle('is-on', im.dataset.i === i));
    num.textContent = String(+i + 1).padStart(2, '0');
  }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => vio.observe(s));

  /* discografia: carrossel + player do Spotify */
  const track = $('#albTrack'), albs = $$('.alb', track), infos = $$('.albinfo'), player = $('#albPlayer');
  let cur = albs.length - 1, playing = false, tId = 0, lockUntil = 0;
  const embed = (type, id, h) => {
    const f = document.createElement('iframe');
    f.src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    f.height = h; f.loading = 'lazy'; f.title = 'Player do Spotify';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    return f;
  };
  const setAlb = (i) => {
    if (i === cur && albs[i].classList.contains('is-on')) return;
    cur = i;
    albs.forEach((a, k) => { a.classList.toggle('is-on', k === i); a.setAttribute('aria-current', k === i); });
    infos.forEach((p, k) => { p.hidden = k !== i; });
    if (playing) player.replaceChildren(embed('album', infos[i].dataset.sp, 352));
  };
  const goTo = (i, smooth = true) => {
    i = Math.max(0, Math.min(albs.length - 1, i));
    const a = albs[i];
    lockUntil = Date.now() + 700;
    track.scrollTo({ left: a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    setAlb(i);
  };
  const nearest = () => {
    const mid = track.scrollLeft + track.clientWidth / 2; let best = 0, d = Infinity;
    albs.forEach((a, k) => { const c = a.offsetLeft + a.offsetWidth / 2; if (Math.abs(c - mid) < d) { d = Math.abs(c - mid); best = k; } });
    return best;
  };
  track.addEventListener('scroll', () => { clearTimeout(tId); tId = setTimeout(() => { if (Date.now() > lockUntil) setAlb(nearest()); }, 90); }, { passive: true });
  albs.forEach((a, k) => a.addEventListener('click', () => goTo(k)));
  $('#albPrev').addEventListener('click', () => goTo(cur - 1));
  $('#albNext').addEventListener('click', () => goTo(cur + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(cur - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1); }
  });
  infos.forEach((p) => $('[data-play]', p).addEventListener('click', () => {
    playing = true; player.hidden = false; player.replaceChildren(embed('album', p.dataset.sp, 352));
    player.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }));
  requestAnimationFrame(() => goTo(cur, false));
  addEventListener('resize', () => goTo(cur, false));

  /* playlist */
  $('#plPlay').addEventListener('click', () => { $('#plPlayer').replaceChildren(embed('playlist', '37i9dQZF1DZ06evO0vGf4I', 452)); });

  /* Lolla: contagem regressiva ate 19/03/2027 (horario de Brasilia) */
  const days = Math.ceil((Date.parse('2027-03-19T00:00:00-03:00') - Date.now()) / 864e5);
  $('#lollaDays').textContent = days > 0 ? days : 'É agora';

  /* lightbox */
  const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbClose = $('#lbClose');
  let lastFocus = null;
  const closeLb = () => { lb.hidden = true; document.body.classList.remove('is-locked'); if (lastFocus) lastFocus.focus(); };
  $$('.shot').forEach((s) => s.addEventListener('click', () => {
    lastFocus = s; lbImg.src = s.dataset.full; lbImg.alt = s.querySelector('img').alt; lbCap.textContent = s.dataset.cap;
    lb.hidden = false; document.body.classList.add('is-locked'); lbClose.focus();
  }));
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* quiz */
  const Q = [
    { q: 'Sexta à noite. Qual é o plano?', o: [['🎢', 'Parque de diversões até fechar', 'astro'], ['🌵', 'Rolê no deserto, só os amigos', 'rodeo'], ['🌆', 'Vice City, carro rápido e neon', 'gta'], ['🛸', 'Algo que ninguém entendeu ainda', 'utopia']] },
    { q: 'Escolha a faixa para abrir o show:', o: [['🔥', 'Algo para a pista abrir na hora', 'astro'], ['🐎', 'Um clássico do começo de tudo', 'rodeo'], ['🎮', 'A que tocou na missão do jogo', 'gta'], ['🌑', 'Uma experimental, pesada e escura', 'utopia']] },
    { q: 'Seu lugar no show é…', o: [['🌀', 'No meio da roda, sempre', 'astro'], ['📼', 'Grade, filmando tudo para guardar', 'rodeo'], ['🏝️', 'Camarote olhando o mar', 'gta'], ['🎧', 'Fundo, prestando atenção em cada detalhe', 'utopia']] },
    { q: 'O que não pode faltar no fit?', o: [['🎡', 'Camiseta de tour, das antigas', 'astro'], ['🤠', 'Algo vintage com história', 'rodeo'], ['🕶️', 'Óculos escuros e corrente pesada', 'gta'], ['🖤', 'Tudo preto, minimalista', 'utopia']] }
  ];
  const R = {
    astro: ['Astroworld', '2018 · Você é pura energia. Montanha-russa, roda aberta e o show que nunca termina.'],
    rodeo: ['Rodeo', '2015 · Fã raiz. Você conhece o Travis desde antes de virar fenômeno, e faz questão de lembrar.'],
    gta: ['Era GTA VI', '2026 · Você vive o agora: Vice City, neon e Burn This Sh*t Down no repeat.'],
    utopia: ['Utopia', '2023 · Você curte o lado experimental, o som denso e o detalhe que ninguém percebeu.']
  };
  const stage = $('#quizStage'), qbar = $('#quizBar');
  let qi = 0, score = {};
  const renderQ = () => {
    qbar.style.width = (qi / Q.length * 100) + '%';
    if (qi >= Q.length) {
      const top = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
      const [era, txt] = R[top];
      stage.innerHTML = '';
      const d = document.createElement('div'); d.className = 'quiz__res';
      d.className = 'quiz__res quiz__res--end';
      d.innerHTML = '<p class="quiz__n">Sua era é</p><p class="era"></p><p class="txt"></p><div class="ctas ctas--center"><a class="btn btn--on-red" target="_blank" rel="noopener" href="https://www.instagram.com/acessotravis/">Conta nos comentários do @acessotravis</a><button class="btn btn--line-light" type="button">Refazer</button></div>';
      $('.era', d).textContent = era; $('.txt', d).textContent = txt;
      $('button', d).addEventListener('click', () => { qi = 0; score = {}; renderQ(); });
      stage.appendChild(d); return;
    }
    const { q, o } = Q[qi];
    stage.innerHTML = '';
    const w = document.createElement('div'); w.className = 'quiz__res';
    const n = document.createElement('p'); n.className = 'quiz__n'; n.textContent = `Pergunta ${qi + 1} de ${Q.length}`;
    const h = document.createElement('p'); h.className = 'quiz__q'; h.textContent = q;
    const opts = document.createElement('div'); opts.className = 'quiz__opts';
    o.forEach(([ico, label, k]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'quiz__opt';
      const i = document.createElement('i'); i.textContent = ico; i.setAttribute('aria-hidden', 'true');
      b.append(i, document.createTextNode(label));
      b.addEventListener('click', () => { score[k] = (score[k] || 0) + 1; qi++; renderQ(); });
      opts.appendChild(b);
    });
    w.append(n, h, opts); stage.appendChild(w);
  };
  renderQ();

  /* bell */
  const bell = $('#bell'), tip = $('#bellTip');
  bell.addEventListener('click', () => { const on = bell.getAttribute('aria-pressed') !== 'true'; bell.setAttribute('aria-pressed', on); tip.classList.toggle('is-on', on); $('.bell__txt', bell).textContent = on ? 'Boa! Agora é só ativar no Instagram 👉' : 'Quero ser avisado de tudo'; });

  /* hero: recorte do Travis sobe devagar no scroll */
  const cut = $('#heroCut');
  if (!reduce) addEventListener('scroll', () => { if (scrollY < innerHeight * 1.2) cut.style.transform = `translateY(${scrollY * -0.12}px)`; }, { passive: true });
})();
