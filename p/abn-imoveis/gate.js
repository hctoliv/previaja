// Prévia · ABN Imóveis, desenvolvida pela Conecta Aí
// A senha só protege a prévia de visitas casuais (o site é estático e público).
(() => {
  const HASH = '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090';
  const KEY = 'cai-abn-imoveis';
  const gate = document.getElementById('gate');
  const form = document.getElementById('gateForm');
  const input = document.getElementById('gatePass');
  const err = document.getElementById('gateError');
  let release;
  window.ABN_GATE = new Promise((r) => { release = r; });

  const sha256 = async (t) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };
  const open = (animate) => {
    if (!animate) { gate.remove(); release(); return; }
    gate.classList.add('is-ok');
    setTimeout(() => { gate.classList.add('is-out'); release(); }, 900);
    setTimeout(() => gate.remove(), 1900);
  };

  let ok = false;
  try { ok = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* sem storage */ }
  if (ok) { open(false); return; }
  document.body.classList.add('is-gated');
  gate.hidden = false;
  setTimeout(() => input.focus(), 400);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = input.value.trim().toLowerCase();
    if (v && (await sha256(v)) === HASH) {
      try { sessionStorage.setItem(KEY, '1'); } catch (e2) { /* sem storage */ }
      err.hidden = true; document.body.classList.remove('is-gated'); open(true);
    } else {
      err.hidden = false;
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      input.select();
    }
  });
})();
