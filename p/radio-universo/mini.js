// Player fixo das páginas internas
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio"), btn = document.getElementById("miniBtn"), mini = document.getElementById("mini");
    if (!audio || !btn) return;
    let on = false;
    const set = (v) => { on = v; mini.classList.toggle("is-playing", v); btn.classList.toggle("is-playing", v); btn.setAttribute("aria-label", v ? "Pausar a rádio" : "Ouvir a rádio ao vivo"); };
    btn.addEventListener("click", () => {
      if (on) { audio.pause(); audio.removeAttribute("src"); audio.load(); set(false); return; }
      audio.src = `${audio.dataset.stream}?t=${Date.now()}`;
      audio.play().then(() => set(true)).catch(() => set(false));
    });
    const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
  });
})();
