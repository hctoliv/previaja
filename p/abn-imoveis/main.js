(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isPhone = () => innerWidth <= 640;

  /* imóveis fictícios da prévia */
  const P = [
    { id: 'casa-vila-assuncao', title: 'Casa com 4 dormitórios', type: 'Casa', deal: 'venda', city: 'Santo André', hood: 'Vila Assunção', price: 'R$ 1.890.000', area: 240, beds: 4, suites: 2, park: 4, img: 'f78333126', gal: ['f187101716', 'f192968130', 'f198617474'], feat: true,
      desc: 'Casa contemporânea em rua tranquila, com sala ampla integrada ao jardim e cozinha gourmet.', feats: ['Jardim na frente', 'Cozinha gourmet', '2 suítes', 'Área de serviço'] },
    { id: 'sobrado-rudge', title: 'Sobrado com 3 suítes', type: 'Sobrado', deal: 'venda', city: 'São Bernardo do Campo', hood: 'Rudge Ramos', price: 'R$ 1.150.000', area: 180, beds: 3, suites: 3, park: 3, img: 'f146878282', gal: ['f192968130', 'f196043410-960', 'f198617474'], feat: true,
      desc: 'Sobrado moderno com varanda de vidro, garagem para três carros e todas as suítes no andar de cima.', feats: ['Varanda de vidro', '3 suítes', 'Garagem coberta', 'Portão eletrônico'] },
    { id: 'apto-jardim', title: 'Apartamento com 3 dormitórios', type: 'Apartamento', deal: 'venda', city: 'Santo André', hood: 'Jardim', price: 'R$ 689.000', area: 92, beds: 3, suites: 1, park: 2, img: 'f187101720', gal: ['f186239762', 'f198617474'], feat: true,
      desc: 'Apartamento claro com varanda, sala para dois ambientes e cozinha planejada.', feats: ['Varanda', 'Cozinha planejada', 'Lazer no condomínio', 'Portaria 24 h'] },
    { id: 'apto-santa-paula', title: 'Apartamento com sacada', type: 'Apartamento', deal: 'venda', city: 'São Caetano do Sul', hood: 'Santa Paula', price: 'R$ 598.000', area: 74, beds: 2, suites: 1, park: 1, img: 'f36694422-960', gal: ['f165047557', 'f189229280'], feat: true,
      desc: 'Apartamento de dois dormitórios com sacada, perto do comércio do Santa Paula.', feats: ['Sacada', '1 suíte', 'Elevador', 'Perto do comércio'] },
    { id: 'apto-centro-scs', title: 'Apartamento com 2 dormitórios', type: 'Apartamento', deal: 'aluguel', city: 'São Caetano do Sul', hood: 'Centro', price: 'R$ 3.200/mês', area: 68, beds: 2, suites: 0, park: 1, img: 'f165047557', gal: ['f189229280', 'f196043410-960'],
      desc: 'Apartamento iluminado no Centro de São Caetano, pronto para morar.', feats: ['Janelas amplas', 'Piso de madeira', 'Pronto para morar', 'Aceita pet'] },
    { id: 'studio-baeta', title: 'Studio mobiliado', type: 'Studio', deal: 'aluguel', city: 'São Bernardo do Campo', hood: 'Baeta Neves', price: 'R$ 2.150/mês', area: 38, beds: 1, suites: 0, park: 1, img: 'f189229280', gal: ['f196043410-960', 'f198617474'],
      desc: 'Studio mobiliado com cozinha montada, ideal para quem quer chegar e morar.', feats: ['Mobiliado', 'Cozinha montada', '1 vaga', 'Contas individuais'] }
  ];
  const src = (k) => `img/${k}.webp`;
  const specs = (p) => `<li><i>⌂</i>${p.area} m²</li><li><i>▣</i>${p.beds} ${p.beds > 1 ? 'dorms' : 'dorm'}</li>${p.suites ? `<li><i>✦</i>${p.suites} ${p.suites > 1 ? 'suítes' : 'suíte'}</li>` : ''}<li><i>◧</i>${p.park} ${p.park > 1 ? 'vagas' : 'vaga'}</li>`;
  const dealTxt = (d) => (d === 'venda' ? 'À venda' : 'Para alugar');

  /* abertura */
  const loader = $('#loader'), bar = $('#loaderBar');
  let pct = 0;
  let tick = 0;
  const ready = () => {
    clearInterval(tick); bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('is-out'); document.body.classList.remove('is-loading'); document.body.classList.add('is-ready');
      setTimeout(() => loader.classList.add('is-gone'), 1100);
    }, reduce ? 0 : 350);
  };
  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r)));
  (window.ABN_GATE || Promise.resolve()).then(() => {
    tick = setInterval(() => { pct = Math.min(100, pct + 9 + Math.random() * 14); bar.style.width = pct + '%'; if (pct >= 100) clearInterval(tick); }, 110);
    const minTime = new Promise((r) => setTimeout(r, reduce ? 0 : 1500));
    Promise.race([Promise.all([minTime, loaded]), new Promise((r) => setTimeout(r, 4000))]).then(ready);
  });
  $$('.hero__lead, .search, .hero .eyebrow').forEach((el, i) => { el.classList.add('fade-up'); el.style.animationDelay = (0.45 + i * 0.12) + 's'; });

  /* nav */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  let lastY = 0;
  const onNav = () => {
    const y = scrollY; nav.classList.toggle('is-solid', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 600 && !menu.classList.contains('is-open')); lastY = y;
  };
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('is-open', open); document.body.classList.toggle('is-locked', open);
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); document.body.classList.remove('is-locked'); }));
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$('a', menu).forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* destaques */
  const track = $('#featTrack'), featSec = $('#destaques'), featBar = $('#featBar'), featNum = $('#featNum');
  const feats = P.filter((p) => p.feat);
  track.innerHTML = feats.map((p) => `
    <button class="fcard" type="button" data-id="${p.id}" data-cursor="view" aria-label="Ver detalhes: ${p.title}, ${p.hood}">
      <img src="${src(p.img)}" alt="" loading="lazy">
      <span class="fcard__info">
        <span><span class="fcard__tag">${dealTxt(p.deal)}</span><h3>${p.title}</h3><p class="fcard__where">${p.hood}, ${p.city}</p></span>
        <span class="fcard__right"><span class="fcard__price gold-text">${p.price}</span><br><span class="fcard__go">Ver detalhes →</span></span>
      </span>
    </button>`).join('');

  /* catálogo */
  const grid = $('#grid'), empty = $('#empty'), count = $('#catCount'), fCity = $('#fCity');
  const favs = new Set();
  let fDeal = 'all', fType = '';
  const render = () => {
    const list = P.filter((p) => (fDeal === 'all' || p.deal === fDeal) && (!fCity.value || p.city === fCity.value) && (!fType || p.type === fType));
    grid.innerHTML = list.map((p, i) => `
      <article class="card" data-id="${p.id}" data-cursor="view" style="animation-delay:${i * 0.07}s" tabindex="0" role="button" aria-label="Ver detalhes: ${p.title}, ${p.hood}">
        <div class="card__media"><img src="${src(p.img + (p.img.endsWith('-960') ? '' : '-960'))}" alt="${p.title} em ${p.hood}" loading="lazy">
          <span class="card__tag">${dealTxt(p.deal)}</span>
          <button class="card__fav${favs.has(p.id) ? ' is-on' : ''}" type="button" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Favoritar ${p.title}">${favs.has(p.id) ? '♥' : '♡'}</button>
        </div>
        <div class="card__body">
          <p class="card__price gold-text">${p.price}</p>
          <h3>${p.title}</h3>
          <p class="card__where">${p.hood}, ${p.city}</p>
          <ul class="specs">${specs(p)}</ul>
        </div>
      </article>`).join('');
    count.textContent = list.length; empty.hidden = list.length > 0;
  };
  $$('.chip').forEach((c) => c.addEventListener('click', () => { fDeal = c.dataset.f; $$('.chip').forEach((x) => { x.classList.toggle('is-on', x === c); x.setAttribute('aria-pressed', x === c); }); render(); }));
  fCity.addEventListener('change', render);
  $('#clearF').addEventListener('click', () => { fDeal = 'all'; fType = ''; fCity.value = ''; $$('.chip').forEach((x) => { x.classList.toggle('is-on', x.dataset.f === 'all'); x.setAttribute('aria-pressed', x.dataset.f === 'all'); }); render(); });
  grid.addEventListener('click', (e) => {
    const f = e.target.closest('[data-fav]');
    if (f) { e.stopPropagation(); const id = f.dataset.fav; favs.has(id) ? favs.delete(id) : favs.add(id); f.classList.toggle('is-on', favs.has(id)); f.textContent = favs.has(id) ? '♥' : '♡'; f.setAttribute('aria-pressed', favs.has(id)); return; }
    const c = e.target.closest('.card'); if (c) openModal(c.dataset.id, c);
  });
  grid.addEventListener('keydown', (e) => { const c = e.target.closest('.card'); if (c && (e.key === 'Enter' || e.key === ' ') && e.target === c) { e.preventDefault(); openModal(c.dataset.id, c); } });
  track.addEventListener('click', (e) => { const c = e.target.closest('.fcard'); if (c) openModal(c.dataset.id, c); });
  render();

  /* busca do topo */
  const tabs = $$('.search__tab'), pill = $('.search__pill');
  let sDeal = 'venda';
  const movePill = () => { const on = tabs.find((t) => t.classList.contains('is-on')); pill.style.width = on.offsetWidth + 'px'; pill.style.transform = `translateX(${on.offsetLeft - 4}px)`; };
  tabs.forEach((t) => t.addEventListener('click', () => { sDeal = t.dataset.deal; tabs.forEach((x) => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-pressed', x === t); }); movePill(); }));
  addEventListener('resize', movePill); document.fonts && document.fonts.ready.then(movePill); movePill();
  $('#search').addEventListener('submit', (e) => {
    e.preventDefault();
    fDeal = sDeal; fType = $('#sType').value; fCity.value = $('#sCity').value;
    $$('.chip').forEach((x) => { x.classList.toggle('is-on', x.dataset.f === fDeal); x.setAttribute('aria-pressed', x.dataset.f === fDeal); });
    render(); $('#imoveis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* modal */
  const modal = $('#modal'); let lastFocus = null;
  function openModal(id, from) {
    const p = P.find((x) => x.id === id); if (!p) return; lastFocus = from;
    const imgs = [p.img, ...p.gal];
    $('#mTag').textContent = `${dealTxt(p.deal)} · ${p.type}`; $('#mTitle').textContent = p.title; $('#mWhere').textContent = `${p.hood}, ${p.city}`;
    $('#mPrice').textContent = p.price; $('#mSpecs').innerHTML = specs(p); $('#mDesc').textContent = p.desc;
    $('#mFeats').innerHTML = p.feats.map((f) => `<li>${f}</li>`).join('');
    const main = $('#mImg'), th = $('#mThumbs');
    const show = (k) => { main.src = src(k); main.alt = `${p.title}, foto`; main.style.animation = 'none'; main.offsetHeight; main.style.animation = ''; $$('button', th).forEach((b) => b.classList.toggle('is-on', b.dataset.k === k)); };
    th.innerHTML = imgs.map((k, i) => `<button type="button" data-k="${k}" aria-label="Foto ${i + 1}"><img src="${src(k.endsWith('-960') ? k : k + '-960')}" alt=""></button>`).join('');
    $$('button', th).forEach((b) => b.addEventListener('click', () => show(b.dataset.k)));
    show(imgs[0]);
    $('#mBook').onclick = () => { closeModal(false); $('#fProp').value = `${p.title}, ${p.hood}`; $('#fDeal').value = p.deal === 'venda' ? 'Comprar' : 'Alugar'; };
    modal.hidden = false; document.body.classList.add('is-locked'); $('.modal__close').focus();
  }
  function closeModal(refocus = true) { modal.hidden = true; document.body.classList.remove('is-locked'); if (refocus && lastFocus) lastFocus.focus(); }
  $$('[data-close]', modal).forEach((b) => b.addEventListener('click', () => closeModal()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* tour */
  const tourSec = $('#tour'), tImgs = $$('.tour__img'), tList = $$('.tour__list li'), tBig = $('#tourBig');
  const rooms = ['Sala', 'Cozinha', 'Quarto', 'Banheiro']; let tCur = 0;
  const setTour = (i) => {
    if (i === tCur) return; tCur = i;
    tImgs.forEach((im, k) => { im.classList.toggle('is-on', k === i); im.classList.toggle('is-past', k < i); im.style.zIndex = k === i ? 2 : k < i ? 1 : 0; });
    tList.forEach((li, k) => li.classList.toggle('is-on', k === i));
    tBig.style.opacity = 0; setTimeout(() => { tBig.textContent = rooms[i]; tBig.style.opacity = 1; }, 250);
  };
  tImgs.forEach((im, k) => { im.style.zIndex = k === 0 ? 2 : 0; });

  /* região */
  const panels = $$('.panel');
  panels.forEach((p) => {
    const open = () => panels.forEach((x) => { x.classList.toggle('is-open', x === p); x.setAttribute('aria-expanded', x === p); });
    if (fine) p.addEventListener('mouseenter', open);
    p.addEventListener('click', () => {
      if (!p.classList.contains('is-open')) { open(); return; }
      fCity.value = p.dataset.city; fDeal = 'all'; fType = '';
      $$('.chip').forEach((x) => { x.classList.toggle('is-on', x.dataset.f === 'all'); x.setAttribute('aria-pressed', x.dataset.f === 'all'); });
      render(); $('#imoveis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* revelar ao rolar */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach((el) => { const sib = [...el.parentElement.children].filter((c) => c.classList.contains('reveal')); el.style.transitionDelay = Math.min(sib.indexOf(el), 4) * 0.1 + 's'; io.observe(el); });

  /* scroll: progresso, destaques horizontais, tour, linha das etapas, parallax */
  const prog = $('#progress'), heroMedia = $('#heroMedia'), stepsLine = $('#stepsLine'), stepsSec = $('#como'), vBg = $('.visit__bg'), vSec = $('#visita');
  let ticking = false;
  const onScroll = () => {
    ticking = false; onNav();
    const H = innerHeight, y = scrollY;
    prog.style.transform = `scaleX(${y / (document.documentElement.scrollHeight - H)})`;
    if (!reduce && y < H) heroMedia.style.transform = `translateY(${y * 0.25}px)`;
    if (!isPhone()) {
      const r = featSec.getBoundingClientRect(), total = featSec.offsetHeight - H;
      const t = Math.min(1, Math.max(0, -r.top / total));
      const max = track.scrollWidth - innerWidth;
      track.style.transform = `translateX(${-t * max}px)`;
      featBar.style.width = t * 100 + '%';
      featNum.textContent = String(Math.min(feats.length, Math.floor(t * feats.length) + 1)).padStart(2, '0');
      $$('.fcard img', track).forEach((im, i) => { im.style.objectPosition = `${50 + (t * feats.length - i) * -8}% 50%`; });
    }
    const tr = tourSec.getBoundingClientRect(), tt = Math.min(0.999, Math.max(0, -tr.top / (tourSec.offsetHeight - H)));
    setTour(Math.floor(tt * rooms.length));
    const sr = stepsSec.getBoundingClientRect(), st = Math.min(1, Math.max(0, (H * 0.85 - sr.top) / (sr.height * 0.6)));
    stepsLine.style.transform = `scaleX(${st})`;
    const vr = vSec.getBoundingClientRect();
    if (!reduce && vr.top < H && vr.bottom > 0) vBg.style.transform = `translateY(${(vr.top / H) * -60 - 40}px)`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* cursor */
  if (fine && !reduce) {
    const cur = $('#cursor'), lbl = $('span', cur); let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add('is-on'); });
    document.addEventListener('pointerover', (e) => {
      const v = e.target.closest('[data-cursor="view"]'), l = e.target.closest('a, button, select, input');
      cur.classList.toggle('is-view', !!v && !e.target.closest('.card__fav')); cur.classList.toggle('is-link', !v && !!l); lbl.textContent = v ? 'Ver' : '';
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    const loop = () => { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
    loop();
  }

  /* formulário (prévia: confirma na tela) */
  const form = $('#form'), msg = $('#formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const req = [$('#fName'), $('#fContact')]; let bad = null;
    req.forEach((i) => { const ok = i.value.trim().length > 1; i.setAttribute('aria-invalid', !ok); if (!ok && !bad) bad = i; });
    if (bad) { msg.textContent = 'Preencha seu nome e um telefone ou email.'; bad.focus(); return; }
    msg.textContent = `Pronto, ${$('#fName').value.trim().split(' ')[0]}. Um corretor da ABN vai confirmar sua visita.`;
    form.reset();
  });
})();
