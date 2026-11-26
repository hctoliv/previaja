// Blog: monta os cards (início e blog.html) e a página do post (post.html).
(() => {
  const POSTS = (window.POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const fmt = (d) => { const [y, m, dd] = d.split("-"); return `${+dd} ${MESES[+m - 1]} ${y}`; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const minutos = (p) => Math.max(1, Math.round(p.body.join(" ").replace(/<[^>]+>/g, "").split(/\s+/).length / 200));
  const card = (p) => `
    <a class="post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
      <span class="post-card__cover ${esc(p.cover)}"><span class="post-card__icon" aria-hidden="true"><svg><use href="#i-${esc(p.icon)}"/></svg></span><span class="post-card__cat">${esc(p.cat)}</span></span>
      <span class="post-card__body">
        <span class="post-card__meta">${fmt(p.date)} · ${minutos(p)} min de leitura</span>
        <span class="post-card__title">${esc(p.title)}</span>
        <span class="post-card__ex">${esc(p.excerpt)}</span>
        <span class="post-card__more">Ler post<svg class="ar"><use href="#i-arrow"/></svg></span>
      </span>
    </a>`;

  document.addEventListener("DOMContentLoaded", () => {
    // início: 3 mais recentes
    const home = document.getElementById("blogGrid");
    if (home) home.innerHTML = POSTS.slice(0, 3).map(card).join("");

    // blog.html: todos, com filtro
    const list = document.getElementById("blogList"), chips = document.getElementById("blogCats");
    if (list) {
      const cats = ["Todos", ...new Set(POSTS.map((p) => p.cat))];
      let cur = "Todos";
      const render = () => { list.innerHTML = POSTS.filter((p) => cur === "Todos" || p.cat === cur).map(card).join(""); };
      chips.innerHTML = cats.map((c) => `<button type="button" class="chip${c === cur ? " is-on" : ""}" aria-pressed="${c === cur}">${esc(c)}</button>`).join("");
      chips.addEventListener("click", (e) => {
        const b = e.target.closest(".chip"); if (!b) return;
        cur = b.textContent;
        [...chips.children].forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b); });
        render();
      });
      render();
    }

    // post.html
    const art = document.getElementById("post");
    if (art) {
      const slug = new URLSearchParams(location.search).get("p");
      const p = POSTS.find((x) => x.slug === slug);
      if (!p) { art.innerHTML = `<h1 class="post__title">Post não encontrado</h1><p class="lead">Ele pode ter mudado de endereço. <a href="blog.html">Ver todos os posts</a>.</p>`; return; }
      document.title = `${p.title} · Blog Rádio Universo`;
      const d = document.querySelector('meta[name="description"]'); if (d) d.content = p.excerpt;
      art.innerHTML = `
        <p class="post__crumb"><a href="blog.html">Blog</a> / ${esc(p.cat)}</p>
        <h1 class="post__title">${esc(p.title)}</h1>
        <p class="post__meta">${fmt(p.date)} · ${minutos(p)} min de leitura · Rádio e TV Universo</p>
        <div class="post__cover ${esc(p.cover)}" aria-hidden="true"><span><svg><use href="#i-${esc(p.icon)}"/></svg></span></div>
        <div class="post__body">${p.body.map((b) => (b.trim().startsWith("<") ? b : `<p>${b}</p>`)).join("")}</div>
        <div class="post__share">
          <span>Compartilhe:</span>
          <a href="https://wa.me/?text=${encodeURIComponent(p.title + " " + location.href)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>WhatsApp</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank" rel="noopener"><svg><use href="#i-fb"/></svg>Facebook</a>
        </div>`;
      const more = document.getElementById("postMore");
      if (more) more.innerHTML = POSTS.filter((x) => x.slug !== p.slug).slice(0, 3).map(card).join("");
    }
  });
})();
