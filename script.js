// FastBite interactions: nav toggle, parallax, add-to-cart feedback, reveal on scroll
(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Set year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const navLinks = $('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const shown = navLinks.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(shown));
    });
    // Close when clicking a link (mobile)
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('show')));
  }

  // Parallax on hero product
  const hero = $('#heroParallax');
  if (hero) {
    const items = $$('.item', hero);
    const damp = 30;
    const apply = (x, y) => {
      items.forEach((el, idx) => {
        const depth = (idx + 1) / items.length; // 0..1
        el.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${(idx-1) * 3}deg)`;
      });
    };
    let rect;
    const onMove = (e) => {
      rect = rect || hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientX - cx) / damp;
      const y = (e.clientY - cy) / damp;
      apply(x, y);
    };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', () => apply(0, 0));
  }

  // Add-to-cart feedback
  function toast(message) {
    let tray = $('#toast-tray');
    if (!tray) {
      tray = document.createElement('div');
      tray.id = 'toast-tray';
      tray.style.position = 'fixed';
      tray.style.right = '16px';
      tray.style.bottom = '16px';
      tray.style.display = 'grid';
      tray.style.gap = '8px';
      tray.style.zIndex = '1000';
      document.body.appendChild(tray);
    }
    const el = document.createElement('div');
    el.textContent = message;
    el.style.background = 'linear-gradient(180deg,#ffc400,#ffb300)';
    el.style.color = '#742600';
    el.style.fontWeight = '800';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '12px';
    el.style.boxShadow = '0 10px 20px rgba(0,0,0,.15)';
    el.style.transform = 'translateY(10px)';
    el.style.opacity = '0';
    el.style.transition = 'transform .25s ease, opacity .25s ease';
    tray.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    });
    setTimeout(() => {
      el.style.transform = 'translateY(10px)';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 250);
    }, 1800);
  }

  $$('.add-btn').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.getAttribute('data-item') || 'Item';
    toast(`🛒 ${item} added to cart!`);
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 400);
  }));

  // Menu filtering
  const filterBtns = $$('.filter-btn');
  const cards = $$('.card[data-category]');
  
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter cards with animation
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }));

  // Countdown timer animation
  const updateTimer = () => {
    const units = $$('.timer-unit');
    units.forEach(unit => {
      const current = parseInt(unit.textContent);
      if (Math.random() > 0.7) { // Random update for demo
        const newVal = Math.max(0, current - Math.floor(Math.random() * 2));
        unit.innerHTML = `${newVal}<small>${unit.querySelector('small').textContent}</small>`;
      }
    });
  };
  
  // Update timer every few seconds for demo effect
  setInterval(updateTimer, 3000);

  // Reveal on scroll
  const revealEls = [];
  const markReveal = (root = document) => {
    $$('.card, .about-inner, .promo-inner, .hero-copy').forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        revealEls.push(el);
      }
    });
  };
  markReveal();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => io.observe(el));
})();
