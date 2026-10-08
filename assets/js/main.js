(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = '221784169909';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // menu mobile
  const hdr = $('.hdr'), burger = $('.burger');
  if (burger) burger.addEventListener('click', () => {
    const open = hdr.classList.toggle('open');
    burger.setAttribute('aria-expanded', open); burger.textContent = open ? '×' : '≡';
  });

  // découpe des titres en mots animés
  const split = el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) =>
      `<span class="w"><span style="animation-delay:${0.1 + i * 0.08}s">${w}</span></span>`).join('');
  };

  // slider hero
  const box = $('.hero-box');
  if (box) {
    const slides = $$('.slide', box), dots = $$('.dot', box), title = $('#hero-title'), kick = $('#hero-k'), num = $('#hero-n');
    let i = 0, t;
    const show = n => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
      dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-current', k === i); });
      title.textContent = slides[i].dataset.title; kick.textContent = slides[i].dataset.kicker; num.textContent = '0' + (i + 1);
      split(title);
    };
    const auto = () => { clearInterval(t); if (!reduced) t = setInterval(() => show(i + 1), 6500); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
    const copy = $('.hero-copy');
    addEventListener('scroll', () => {
      if (reduced) return;
      const p = Math.min(1, scrollY / 600);
      copy.style.transform = `translate3d(0,${-p * 90}px,0)`; copy.style.opacity = 1 - p * 0.9;
    }, { passive: true });
  }

  // étapes "du champ à la tasse"
  const steps = $$('.jstep'), pics = $$('.jpics img');
  steps.forEach((s, k) => {
    const on = () => { steps.forEach((x, j) => { x.classList.toggle('on', j === k); x.setAttribute('aria-expanded', j === k); }); pics.forEach((p, j) => p.classList.toggle('on', j === k)); };
    s.addEventListener('click', on); s.addEventListener('mouseenter', on);
  });

  // commande produit
  const buy = $('.buy');
  if (buy) {
    const PRICE = 5000, fmt = n => n.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' F';
    let pack = 1, qty = 1;
    const packs = $$('.pack', buy), out = $('output', buy), total = $('#total'), order = $('#order');
    const upd = () => {
      const n = pack * qty;
      out.textContent = qty; total.textContent = fmt(PRICE * n);
      order.href = `https://wa.me/${WA}?text=` + encodeURIComponent(`Bonjour Framboisia ! Je souhaite commander ${n} boîte${n > 1 ? 's' : ''} de tisane (${fmt(PRICE * n)}).`);
    };
    packs.forEach(p => p.addEventListener('click', () => { pack = +p.dataset.n; packs.forEach(x => x.setAttribute('aria-pressed', x === p)); upd(); }));
    $('#minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); upd(); });
    $('#plus').addEventListener('click', () => { qty = Math.min(20, qty + 1); upd(); });
    upd();
  }

  // formulaire contact → WhatsApp
  const form = $('#cform');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = `Bonjour Framboisia ! Je m'appelle ${d.get('nom')} (${d.get('tel')}). Je souhaite ${d.get('qte') || 1} boîte(s). ${d.get('msg') || ''}`;
    open(`https://wa.me/${WA}?text=` + encodeURIComponent(msg.trim()), '_blank');
  });

  // apparitions au défilement
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    $$('[data-reveal]').forEach(el => {
      const k = [...el.parentNode.children].indexOf(el) % 6;
      el.style.transitionDelay = k * 0.09 + 's';
      io.observe(el);
    });
    setTimeout(() => $$('[data-reveal]').forEach(el => el.classList.add('in')), 5000);
  }
})();
