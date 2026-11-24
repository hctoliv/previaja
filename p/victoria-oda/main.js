// Prévia · Victoria Oda
// A senha só protege a prévia de visitas casuais (o site é estático e público).
(() => {
  const HASH = '2913d78fbe93d91f4e24b50c6d63430a6c36a70152bbb64683612edb8b725911';
  const KEY = 'pj-victoria-oda';
  const WA = '5511996097436';
  const MSG = 'Olá, Victoria! Vim pelo site e gostaria de agendar uma avaliação psicopedagógica.';

  const $ = (s) => document.querySelector(s);
  const gate = $('#gate'), welcome = $('#welcome'), site = $('#site');
  const form = $('#gate-form'), input = $('#gate-pass'), err = $('#gate-error');

  const sha256 = async (t) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const openSite = (animate) => {
    gate.hidden = true;
    const show = () => {
      welcome.hidden = true;
      site.hidden = false;
      document.body.classList.remove('locked');
      requestAnimationFrame(() => site.classList.add('is-in'));
    };
    if (!animate) return show();
    welcome.hidden = false;
    setTimeout(show, 1600);
  };

  let ok = false;
  try { ok = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (ok) openSite(false); else input.focus();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = input.value.trim().toLowerCase();
    if (v && (await sha256(v)) === HASH) {
      try { sessionStorage.setItem(KEY, '1'); } catch (e2) {}
      err.hidden = true;
      openSite(true);
    } else {
      err.hidden = false;
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      input.select();
    }
  });

  // WhatsApp
  const url = `https://wa.me/${WA}?text=${encodeURIComponent(MSG)}`;
  document.querySelectorAll('.js-wa').forEach((a) => {
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
})();
