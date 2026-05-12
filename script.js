/* ============================================
   PUISSANCE TECH — Script
   ============================================ */

(() => {
  'use strict';

  /* ----- Configuration ----- */
  const CONFIG = {
    email: 'Puissancetechsm@gmail.com',
    whatsapp: '22655498333', // numéro principal
  };

  /* ----- Année dans le footer ----- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ----- Navigation : effet scroll ----- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Menu mobile ----- */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Fermer le menu mobile en cliquant sur un lien
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  /* ----- Reveal on scroll ----- */
  const revealTargets = document.querySelectorAll(
    '.service, .review, .section-head, .order__intro, .order__form, .contact__inner'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  /* ----- Toast ----- */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, duration = 4000) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  /* ----- Validation du formulaire ----- */
  const form = document.getElementById('orderForm');

  function getFormData() {
    const data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      service: form.querySelector('input[name="service"]:checked')?.value || '',
      message: form.message.value.trim(),
      budget: form.budget.value,
    };
    return data;
  }

  function validate(data) {
    const errors = [];
    if (!data.name) errors.push('votre nom');
    if (!data.phone) errors.push('votre téléphone');
    if (!data.service) errors.push('un service');
    if (!data.message) errors.push('vos commentaires');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('un email valide');
    }
    return errors;
  }

  function buildMessage(data) {
    return [
      `Bonjour Puissance Tech,`,
      ``,
      `Je souhaite démarrer un projet avec vous.`,
      ``,
      `— Nom : ${data.name}`,
      `— Téléphone : ${data.phone}`,
      data.email ? `— Email : ${data.email}` : null,
      `— Service souhaité : ${data.service}`,
      data.budget ? `— Budget : ${data.budget}` : null,
      ``,
      `— Détails du projet :`,
      data.message,
      ``,
      `Merci, dans l'attente de votre retour.`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  function sendByEmail(data) {
    const subject = `Nouvelle demande — ${data.service.split(' —')[0]}`;
    const body = buildMessage(data);
    const url = `mailto:${CONFIG.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    showToast('📧 Votre client mail va s\'ouvrir…');
  }

  function sendByWhatsApp(data) {
    const body = buildMessage(data);
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener');
    showToast('💬 Redirection vers WhatsApp…');
  }

  // Gestion du submit — on récupère le bouton cliqué pour savoir email/whatsapp
  let clickedMethod = 'email';
  form.querySelectorAll('button[type="submit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      clickedMethod = btn.dataset.method || 'email';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData();
    const errors = validate(data);

    if (errors.length) {
      showToast(`⚠️ Merci de renseigner : ${errors.join(', ')}.`, 5000);
      // Focus sur le premier champ manquant
      if (!data.name) form.name.focus();
      else if (!data.phone) form.phone.focus();
      else if (!data.service) form.querySelector('input[name="service"]').focus();
      else if (!data.message) form.message.focus();
      return;
    }

    if (clickedMethod === 'whatsapp') {
      sendByWhatsApp(data);
    } else {
      sendByEmail(data);
    }
  });

  /* ----- Lien fluide pour les ancres ----- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
