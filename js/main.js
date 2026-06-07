(function () {
  'use strict';

  // ─── Theme ───
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  };

  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    setTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ─── Mobile Nav ───
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // ─── Nav Scroll Shadow ───
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    nav.classList.toggle('scrolled', currentScroll > 50);
  }, { passive: true });

  // ─── Scroll Reveal ───
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── Rotating Titles (Crossfade) ───
  const roleEl = document.getElementById('rotatingRole');
  if (roleEl) {
    const roles = ['Backend Engineer', 'DevOps Engineer', 'Global CS Mentor'];
    let index = 0;

    const rotate = () => {
      index = (index + 1) % roles.length;
      roleEl.style.opacity = '0';
      roleEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        roleEl.textContent = roles[index];
        roleEl.style.opacity = '1';
        roleEl.style.transform = 'translateY(0)';
      }, 250);
    };

    setInterval(rotate, 5000);
  }

  // ─── Visitor Notification Email ───
  const notifiedKey = `portfolio_notified_${new Date().toISOString().split('T')[0]}`;
  if (!localStorage.getItem(notifiedKey)) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const info = [
        `New visitor on your portfolio!`,
        `Time: ${new Date().toLocaleString()}`,
        `Timezone: ${tz}`,
        `Browser: ${navigator.userAgent.substring(0, 120)}`,
        `Language: ${navigator.language}`,
        `Platform: ${navigator.platform}`
      ].join('\n');
      fetch('https://formspree.io/f/mqeopgoo', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Portfolio Visitor',
          email: 'visitor@portfolio',
          message: info
        }),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      localStorage.setItem(notifiedKey, '1');
    } catch (_) {}
  }

  // ─── Visitor Counter (unique-visitor only) ───
  const COUNTER_NS = 'abhinav-portfolio-v3';
  const totalEl = document.getElementById('visitorCount');
  const todayEl = document.getElementById('todayCount');

  const updateCounter = async () => {
    const today = new Date().toISOString().split('T')[0];
    const countedKey = `portfolio_counted_${today}`;
    const isNewVisitor = !localStorage.getItem(countedKey);

    try {
      const endpoint = isNewVisitor ? 'hit' : 'get';
      const [totalRes, todayRes] = await Promise.all([
        fetch(`https://api.countapi.xyz/${endpoint}/${COUNTER_NS}/total`),
        fetch(`https://api.countapi.xyz/${endpoint}/${COUNTER_NS}/${today}`)
      ]);
      const totalData = await totalRes.json();
      const todayData = await todayRes.json();
      if (totalEl && totalData.value) totalEl.textContent = totalData.value.toLocaleString();
      if (todayEl && todayData.value) todayEl.textContent = todayData.value.toLocaleString();
      if (isNewVisitor) localStorage.setItem(countedKey, '1');
    } catch (_) {
      const countedEver = localStorage.getItem('portfolio_visits');
      if (!countedEver) localStorage.setItem('portfolio_visits', '1');
      if (totalEl) totalEl.textContent = localStorage.getItem('portfolio_visits');
    }
  };
  updateCounter();

  // ─── Smooth anchor scroll ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
