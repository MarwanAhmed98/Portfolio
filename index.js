// =========================================================
// Marwan Ahmed — Portfolio (modern build)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('modern');

  /* ---------- mobile menu ---------- */
  const burger = document.querySelector('.m-burger');
  const mobileMenu = document.querySelector('.m-mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
    });
  }

  /* ---------- typing role effect ---------- */
  const roleEl = document.querySelector('.m-hero-role');
  const roles = [
    'Frontend Developer',
    'Angular Developer',
    'TailwindCSS Enthusiast',
    'RESTful API Integrator'
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (roleEl && !reduceMotion) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
  } else if (roleEl) {
    roleEl.textContent = roles[0];
  }

  /* ---------- scrollspy for top tabs ---------- */
  const tabs = document.querySelectorAll('.m-tab[data-section]');
  const sections = Array.from(tabs)
    .map((tab) => document.getElementById(tab.dataset.section))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tabs.forEach((tab) => tab.classList.remove('is-active'));
            const activeTab = document.querySelector(`.m-tab[data-section="${entry.target.id}"]`);
            if (activeTab) activeTab.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.m-reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => reveal.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- project filter ---------- */
  const filterBtns = document.querySelectorAll('.m-filter-btn');
  const cards = document.querySelectorAll('.m-card[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- footer year ---------- */
  const yearEl = document.querySelector('.m-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- contact form (Web3Forms) ---------- */
  const form = document.querySelector('.m-terminal-body form');
  if (form) {
    const statusEl = form.querySelector('.m-form-status');
    const btn = form.querySelector('button[type="submit"]');
    const originalBtnText = btn.textContent;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        if (statusEl) {
          statusEl.textContent = 'Form is not configured yet — add a Web3Forms access key.';
          statusEl.classList.add('is-error');
        }
        return;
      }

      btn.disabled = true;
      btn.textContent = '$ sending...';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('is-error', 'is-success');
      }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        const data = await res.json();

        if (data.success) {
          btn.textContent = '$ message-sent ✓';
          if (statusEl) {
            statusEl.textContent = 'Thanks — your message is on its way. I\u2019ll reply soon.';
            statusEl.classList.add('is-success');
          }
          form.reset();
        } else {
          throw new Error(data.message || 'Something went wrong');
        }
      } catch (err) {
        btn.textContent = '$ send-message';
        if (statusEl) {
          statusEl.textContent = 'Could not send your message. Please try again or email me directly.';
          statusEl.classList.add('is-error');
        }
      } finally {
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalBtnText;
        }, 2200);
      }
    });
  }
});