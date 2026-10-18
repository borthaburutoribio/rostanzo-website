(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));

  /* entradas escalonadas por sección */
  const count = new Map();
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const sec = el.closest('section, footer') || document.body;
    const n = count.get(sec) || 0;
    el.style.setProperty('--d', (n % 6) * 80 + 'ms');
    count.set(sec, n + 1);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
  }

  /* acordeón de pasos: uno abierto por vez */
  const panels = [...document.querySelectorAll('.acc__panel')];
  panels.forEach(p => p.querySelector('.acc__tab').addEventListener('click', () => {
    panels.forEach(q => {
      const open = q === p;
      q.classList.toggle('is-open', open);
      q.querySelector('.acc__tab').setAttribute('aria-expanded', open);
    });
  }));

  /* fichas de preguntas */
  const cards = [...document.querySelectorAll('.card')];
  cards.forEach(c => c.querySelector('.card__head').addEventListener('click', () => {
    const was = c.classList.contains('is-open');
    cards.forEach(d => { d.classList.remove('is-open'); d.querySelector('.card__head').setAttribute('aria-expanded', 'false'); });
    if (!was) { c.classList.add('is-open'); c.querySelector('.card__head').setAttribute('aria-expanded', 'true'); }
  }));

  /* cupón: arma el WhatsApp */
  const form = document.getElementById('coupon');
  const preview = document.getElementById('preview');
  const waText = document.getElementById('waText');
  const build = () => {
    const f = new FormData(form);
    const nombre = (f.get('nombre') || '').trim();
    let t = form.dataset.msg; for (const [k, v] of f.entries()) t = t.replaceAll('{' + k + '}', v); t = t.replace('{saludo}', nombre ? ', soy ' + nombre : '');
    preview.textContent = t; waText.value = t;
  };
  form.addEventListener('input', build);
  form.addEventListener('change', build);
  form.addEventListener('submit', e => {
    e.preventDefault(); build();
    window.open(form.action + '?text=' + encodeURIComponent(waText.value), '_blank', 'noopener');
  });
  build();

  /* CTA fijo: aparece después del hero, se va en el cupón y el pie */
  const sticky = document.querySelector('.sticky');
  const zones = [document.querySelector('.ticketzone'), document.getElementById('reservar'), document.querySelector('.foot')];
  let tick = false;
  const upd = () => {
    const vh = innerHeight;
    const over = zones.some(z => { const r = z.getBoundingClientRect(); return r.top < vh * .85 && r.bottom > 0; });
    sticky.classList.toggle('hide', over || scrollY < vh * .6);
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();

  /* compartir */
  const share = document.getElementById('share');
  share.addEventListener('click', async () => {
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: location.href });
      else { await navigator.clipboard.writeText(location.href); share.textContent = 'Link copiado'; }
    } catch (_) {}
  });
})();
