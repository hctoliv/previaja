(() => {
  const WA = "5553981244723";
  const TV = "https://playerv.voxtvhd.com.br/video/lucas7029/1/true/true/c3Rtdjcudm94dHZoZC5jb20uYnIrMQ==/16:9/nocover/nao/";
  const SLOTS = [
    { s: 0, e: 5, name: "Show da Madrugada", host: "PW", h: "00:00 às 04:59" },
    { s: 5, e: 12, name: "Show da Manhã", host: "PW", h: "05:00 às 11:59" },
    { s: 12, e: 18, name: "Show da Tarde", host: "PW", h: "12:00 às 17:59" },
    { s: 18, e: 24, name: "Show da Noite", host: "PW", h: "18:00 às 23:59" },
  ];
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  // hora de Brasília
  const spNow = () => {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const h = +p.find((x) => x.type === "hour").value, m = +p.find((x) => x.type === "minute").value;
    return h + m / 60;
  };

  document.addEventListener("DOMContentLoaded", () => {
    $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
    $("#year").textContent = new Date().getFullYear();

    // nav
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("is-solid", scrollY > 30);
    onScroll(); addEventListener("scroll", onScroll, { passive: true });

    // programação no ar
    const schedule = () => {
      const t = spNow();
      const cur = SLOTS.find((x) => t >= x.s && t < x.e) || SLOTS[0];
      $("#nowProg").textContent = cur.name;
      $("#nowMeta").textContent = `com ${cur.host} · ${cur.h}`;
      $("#miniProg").textContent = cur.name;
      $$("#slots .slot").forEach((li) => {
        const s = +li.dataset.s, e = +li.dataset.e, on = t >= s && t < e;
        li.classList.toggle("is-now", on);
        if (on) li.querySelector(".slot__bar span").style.setProperty("--p", `${((t - s) / (e - s)) * 100}%`);
      });
    };
    schedule(); setInterval(schedule, 30000);

    // player
    const audio = $("#audio"), player = $("#player"), btn = $("#playBtn"), mini = $("#mini"), miniBtn = $("#miniBtn");
    const msg = $("#playerMsg"), vol = $("#vol"), mute = $("#muteBtn");
    const STREAM = player.dataset.stream;
    let playing = false;
    const setState = (on) => {
      playing = on;
      [player, mini].forEach((el) => el.classList.toggle("is-playing", on));
      [btn, miniBtn].forEach((b) => { b.classList.toggle("is-playing", on); b.setAttribute("aria-label", on ? "Pausar a rádio" : "Ouvir a rádio ao vivo"); });
      btn.setAttribute("aria-pressed", on);
    };
    const play = () => {
      msg.textContent = "Conectando…";
      audio.src = `${STREAM}?t=${Date.now()}`; // sempre o ao vivo, sem atraso acumulado
      audio.volume = vol.value / 100;
      audio.play().then(() => { msg.textContent = ""; setState(true); })
        .catch(() => { msg.textContent = "Não foi possível tocar agora. Toque de novo em alguns segundos."; setState(false); });
    };
    const stop = () => { audio.pause(); audio.removeAttribute("src"); audio.load(); setState(false); msg.textContent = ""; };
    const toggle = () => (playing ? stop() : play());
    btn.addEventListener("click", toggle);
    miniBtn.addEventListener("click", toggle);
    audio.addEventListener("error", () => { if (audio.getAttribute("src")) { msg.textContent = "A transmissão oscilou. Toque no play para reconectar."; setState(false); } });
    const paintVol = () => vol.style.setProperty("--v", `${vol.value}%`);
    vol.addEventListener("input", () => { audio.volume = vol.value / 100; audio.muted = false; player.classList.remove("is-muted"); paintVol(); });
    mute.addEventListener("click", () => { audio.muted = !audio.muted; player.classList.toggle("is-muted", audio.muted); mute.setAttribute("aria-label", audio.muted ? "Ativar som" : "Silenciar"); });
    paintVol();
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: "Ao vivo", artist: "Rádio e TV Universo", artwork: [{ src: "img/icon-512.png", sizes: "512x512", type: "image/png" }] });
      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", stop);
    }

    // mini player aparece depois do topo
    const hero = $("#topo");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        const on = !e.isIntersecting;
        mini.classList.toggle("is-on", on);
        mini.setAttribute("aria-hidden", !on);
        miniBtn.tabIndex = on ? 0 : -1;
      }, { threshold: 0.12 }).observe(hero);
    }

    // web tv: só carrega ao tocar
    $("#tvBtn").addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = TV; f.title = "Web TV Rádio e TV Universo ao vivo"; f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true;
      $("#tvScreen").replaceChildren(f);
      if (playing) stop(); // evita som duplicado
    });

    // pedido de música
    const form = $("#askForm"), err = $("#askErr");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements, nome = f.nome.value.trim(), mus = f.musica.value.trim();
      [f.nome, f.musica].forEach((x) => x.toggleAttribute("aria-invalid", !x.value.trim()));
      if (!nome || !mus) { err.hidden = false; return; }
      err.hidden = true;
      let m = `🎵 Pedido de música\nNome: ${nome}\nMúsica: ${mus}`;
      if (f.cidade.value.trim()) m += `\nCidade: ${f.cidade.value.trim()}`;
      if (f.recado.value.trim()) m += `\nRecado: ${f.recado.value.trim()}`;
      const w = open(wa(m), "_blank");
      if (w) w.opener = null; else location.href = wa(m);
    });

    // revelar ao rolar
    const rv = $$(".sec .kicker, .sec .h2, .sec .lead, .slot, .chart li, .tv__screen, .form, .social li, .app__btns, .link, .post-card");
    rv.forEach((el) => el.classList.add("rv"));
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
      rv.forEach((el) => io.observe(el));
    } else rv.forEach((el) => el.classList.add("is-in"));

    space(() => playing);
  });

  // ---------- o universo do topo ----------
  function space(isPlaying) {
    const cv = document.getElementById("space"), ctx = cv.getContext("2d");
    let W, H, dpr, stars = [], mx = 0, my = 0, tmx = 0, tmy = 0, level = 0, visible = true;
    const N_BARS = 72;
    const bars = Array.from({ length: N_BARS }, (_, i) => ({ v: 0, ph: Math.random() * 6.28, sp: .6 + Math.random() * 1.6 }));
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / 5200);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random(), tw: Math.random() * 6.28 }));
    };
    resize(); addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { tmx = e.clientX / W - .5; tmy = e.clientY / H - .5; }, { passive: true });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);

    const draw = (t) => {
      requestAnimationFrame(draw);
      if (!visible) return;
      t /= 1000;
      mx += (tmx - mx) * .05; my += (tmy - my) * .05;
      const target = isPlaying() ? 1 : .25;
      level += (target - level) * .03;
      ctx.clearRect(0, 0, W, H);

      // nebulosa
      const mobile = W < 640;
      const cx = mobile ? W * .62 : W * .76, cy = mobile ? H * .3 : H * .4;
      const R = Math.min(W, H) * (mobile ? .26 : .24);
      let g = ctx.createRadialGradient(cx, cy, R * .2, cx, cy, R * 3.2);
      g.addColorStop(0, "rgba(107,92,255,.28)"); g.addColorStop(.5, "rgba(192,76,240,.08)"); g.addColorStop(1, "rgba(11,13,24,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // estrelas com parallax
      for (const s of stars) {
        const px = s.x - mx * 40 * s.z, py = s.y - my * 40 * s.z;
        const a = .25 + .6 * s.z * (.6 + .4 * Math.sin(t * (1 + s.z * 2) + s.tw));
        ctx.fillStyle = `rgba(230,228,255,${a})`;
        ctx.fillRect(px, py, s.z * 1.8 + .4, s.z * 1.8 + .4);
      }

      const ox = cx + mx * 30, oy = cy + my * 30;
      const tilt = -.36;

      // anel de som (barras ao redor do planeta)
      for (let i = 0; i < N_BARS; i++) {
        const b = bars[i];
        const want = (.18 + .82 * Math.abs(Math.sin(t * b.sp * 2.2 + b.ph))) * level;
        b.v += (want - b.v) * .18;
        const ang = (i / N_BARS) * Math.PI * 2 + t * .05;
        const r1 = R * 1.14, r2 = r1 + R * .42 * b.v + 2;
        const hue = 265 - 55 * ((Math.cos(ang) + 1) / 2);
        ctx.strokeStyle = `hsla(${hue},95%,68%,${.25 + .6 * b.v})`;
        ctx.lineWidth = Math.max(2, R * .022);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ox + Math.cos(ang) * r1, oy + Math.sin(ang) * r1);
        ctx.lineTo(ox + Math.cos(ang) * r2, oy + Math.sin(ang) * r2);
        ctx.stroke();
      }

      // órbita (metade de trás)
      const ring = (front) => {
        ctx.save(); ctx.translate(ox, oy); ctx.rotate(tilt);
        const rg = ctx.createLinearGradient(-R * 1.9, 0, R * 1.9, 0);
        rg.addColorStop(0, "rgba(192,76,240,.95)"); rg.addColorStop(.5, "rgba(122,92,255,.9)"); rg.addColorStop(1, "rgba(62,198,255,.95)");
        ctx.strokeStyle = rg; ctx.lineWidth = R * .075;
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 1.85, R * .5, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
        ctx.stroke();
        // lua em órbita
        const a = t * .5;
        const lx = Math.cos(a) * R * 1.85, ly = Math.sin(a) * R * .5;
        if ((Math.sin(a) > 0) === front) {
          ctx.fillStyle = "#e9e6ff"; ctx.shadowColor = "#3ec6ff"; ctx.shadowBlur = 20;
          ctx.beginPath(); ctx.arc(lx, ly, R * .06, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      };
      ring(false);

      // planeta
      g = ctx.createRadialGradient(ox - R * .35, oy - R * .4, R * .1, ox, oy, R);
      g.addColorStop(0, "#a05cff"); g.addColorStop(.55, "#4b3fd6"); g.addColorStop(1, "#1a3f9e");
      ctx.fillStyle = g; ctx.shadowColor = "rgba(107,92,255,.6)"; ctx.shadowBlur = 80 + 60 * level;
      ctx.beginPath(); ctx.arc(ox, oy, R * (1 + .015 * level * Math.sin(t * 6)), 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      // brilho e faixas
      ctx.save(); ctx.beginPath(); ctx.arc(ox, oy, R, 0, Math.PI * 2); ctx.clip();
      for (let k = -3; k <= 3; k++) {
        ctx.strokeStyle = `rgba(255,255,255,${.035 + .02 * (k % 2)})`; ctx.lineWidth = R * .09;
        ctx.beginPath(); ctx.ellipse(ox, oy + k * R * .28 + Math.sin(t * .4 + k) * 4, R * 1.2, R * .14, tilt * .4, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();

      // microfone (símbolo da marca)
      ctx.save(); ctx.translate(ox, oy);
      const mw = R * .34, mh = R * .58;
      ctx.lineWidth = R * .05; ctx.strokeStyle = "rgba(233,236,255,.92)"; ctx.fillStyle = "rgba(62,198,255,.92)";
      ctx.beginPath(); ctx.roundRect(-mw / 2, -mh * .62, mw, mh * .72, mw / 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(11,13,40,.55)"; ctx.lineWidth = R * .03;
      for (let k = 0; k < 3; k++) { const yy = -mh * .45 + k * mh * .13; ctx.beginPath(); ctx.moveTo(-mw * .28, yy); ctx.lineTo(mw * .28, yy); ctx.stroke(); }
      ctx.strokeStyle = "rgba(233,236,255,.92)"; ctx.lineWidth = R * .05;
      ctx.beginPath(); ctx.arc(0, -mh * .05, mw * .82, 0.15, Math.PI - .15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, mh * .33); ctx.lineTo(0, mh * .5); ctx.moveTo(-mw * .35, mh * .52); ctx.lineTo(mw * .35, mh * .52); ctx.stroke();
      // ondas
      for (let k = 1; k <= 2; k++) {
        ctx.strokeStyle = `rgba(62,198,255,${(.7 - k * .2) * (.5 + .5 * level) * (.6 + .4 * Math.sin(t * 4 - k))})`;
        ctx.lineWidth = R * .04;
        const rr = mw * (.75 + k * .38);
        ctx.beginPath(); ctx.arc(0, -mh * .28, rr, -.55, .55); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -mh * .28, rr, Math.PI - .55, Math.PI + .55); ctx.stroke();
      }
      ctx.restore();

      ring(true);
    };
    if (reduce) { level = .25; requestAnimationFrame((t) => { draw(t); }); }
    else requestAnimationFrame(draw);
  }
})();
