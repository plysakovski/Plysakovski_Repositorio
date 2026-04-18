/* ---------- Custom Cursor (com detecção robusta de touch/pointer) ---------- */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const ringEl = document.getElementById('ringEl');
let mx = 0, my = 0, rx = 0, ry = 0;

function isTouchDevice() {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
}

function disableCustomCursor() {
  document.body.classList.add('custom-cursor-disabled');
}

function enableCustomCursor() {
  document.body.classList.remove('custom-cursor-disabled');
  
  if (!dot || !ring) return;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  function lerpCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  const hoverEls = document.querySelectorAll('a, button, .cert-item, .project-row, .social-item');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ringEl.classList.add('hover'));
    el.addEventListener('mouseleave', () => ringEl.classList.remove('hover'));
  });
}

function initCursor() {
  if (!dot || !ring) return;

  const isTouch = isTouchDevice();
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isTouch || !hasFinePointer) {
    disableCustomCursor();
  } else {
    enableCustomCursor();
    // Adiciona estilo para esconder cursor padrão apenas se custom ativo
    const style = document.createElement('style');
    style.textContent = `
      body { cursor: none; }
      a, button, .cert-item, .project-row, .social-item, .btn-lime, .btn-ghost, .nav-cta { cursor: none; }
    `;
    document.head.appendChild(style);
  }
}

/* ---------- Scroll Reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ---------- Nav scroll effect ---------- */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Nav active link ---------- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function updateActiveLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href === '#' + current) {
      a.style.color = 'var(--white)';
    } else {
      a.style.color = '';
    }
  });
}
window.addEventListener('scroll', updateActiveLink);
updateActiveLink(); // inicial

/* ---------- Menu Mobile (Hamburguer) ---------- */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' ? false : true;
    navToggle.setAttribute('aria-expanded', expanded);
    navMenu.classList.toggle('active');
  });

  // Fecha menu ao clicar em um link (mobile)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Formulário com feedback (AJAX) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('formFeedback');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'enviando...';
    submitBtn.disabled = true;
    feedback.textContent = '';
    feedback.style.color = 'var(--muted)';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        feedback.textContent = '✓ Mensagem enviada com sucesso! Entrarei em contato em breve.';
        feedback.style.color = 'var(--lime)';
        contactForm.reset();
      } else {
        throw new Error('Erro no servidor');
      }
    } catch (error) {
      feedback.textContent = '✗ Ops! Ocorreu um erro. Tente novamente ou use os links sociais.';
      feedback.style.color = '#FF5F57';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Inicializa o cursor com a nova lógica
initCursor();