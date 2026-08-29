// Preloader: shows for a minimum time (so it doesn't just flash) and hides once
// the page is fully loaded, with a hard safety cap so a slow/failed asset can
// never trap someone on the loading screen indefinitely.
(() => {
  const el = document.getElementById('preloader');
  if (!el) return;
  const MIN_MS = 2000;
  const MAX_MS = 4500;
  const start = Date.now();
  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    el.classList.add('pl-hide');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 700); // fallback in case transitionend never fires
  };
  const tryHide = () => {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, MIN_MS - elapsed);
    setTimeout(hide, wait);
  };
  if (document.readyState === 'complete') {
    tryHide();
  } else {
    window.addEventListener('load', tryHide, { once: true });
  }
  setTimeout(hide, MAX_MS); // hard safety cap
})();

// Sticky nav background on scroll
const siteNav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  siteNav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Scroll-linked parallax for CTA band photo (transform-based, not background-attachment:fixed,
// which is unreliable/janky on iOS Safari)
const parallaxLayers = document.querySelectorAll('.cta-parallax-img');
if (parallaxLayers.length) {
  let ticking = false;
  const updateParallax = () => {
    parallaxLayers.forEach(layer => {
      const rect = layer.parentElement.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2) / (window.innerHeight + rect.height) - 0.5;
      const offset = progress * -60; // px of travel
      layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();
}

// Mobile drawer
const burgerBtn = document.getElementById('burgerBtn');
const drawerClose = document.getElementById('drawerClose');
const mobileDrawer = document.getElementById('mobileDrawer');
burgerBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileDrawer.classList.remove('open')));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// 3D tilt on hero cards (mouse move parallax)
const tiltStage = document.getElementById('tiltStage');
if (tiltStage && window.matchMedia('(hover: hover)').matches) {
  const cards = tiltStage.querySelectorAll('.tilt-card');
  tiltStage.addEventListener('mousemove', (e) => {
    const rect = tiltStage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    cards.forEach(card => {
      const depth = parseFloat(card.dataset.depth) || 15;
      const rx = (relY * -depth).toFixed(2);
      const ry = (relX * depth).toFixed(2);
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  });
  tiltStage.addEventListener('mouseleave', () => {
    cards.forEach(card => { card.style.transform = ''; });
  });
}

// Floating WhatsApp click-to-chat button (site-wide)
(() => {
  const waNumber = '922199245251'; // Arena main line, WhatsApp format — confirm this line is on WhatsApp before launch
  const waMsg = encodeURIComponent("Hi Arena! I'd like to ask about ");
  const wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = `https://wa.me/${waNumber}?text=${waMsg}`;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Chat with Arena on WhatsApp');
  wa.innerHTML = `<svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.23.6 4.33 1.65 6.14L4 29l8.02-1.6a12.9 12.9 0 0 0 4 .63h.01c6.63 0 12.02-5.4 12.02-12.03C28.05 8.4 22.66 3 16.02 3Zm0 22.02h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.76.98 1-3.67-.24-.38a9.94 9.94 0 0 1-1.53-5.34c0-5.5 4.48-9.98 9.99-9.98 2.67 0 5.17 1.04 7.06 2.93a9.9 9.9 0 0 1 2.93 7.06c0 5.5-4.48 9.99-10.03 9.99Zm5.48-7.48c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5-.17 0-.37-.03-.57-.03-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.08 3.18 5.05 4.46.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>`;
  document.body.appendChild(wa);
})();

// Buffet menu tabs (visual toggle only)
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
