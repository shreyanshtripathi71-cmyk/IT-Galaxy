/**
 * IT Galaxy — Shopify Theme Scripts
 * Modular, performant, Shopify-ready
 */

(function() {
  'use strict';

  /* ===================================
     Header Scroll Effect
     =================================== */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
      const megaMenu = document.getElementById('megaMenu');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        if (!megaMenu || !megaMenu.classList.contains('active')) {
          header.classList.remove('scrolled');
          header.style.background = '';
        }
      }
    });
  }

  /* ===================================
     Mega Menu
     =================================== */
  function initMegaMenu() {
    const navLinks = document.querySelectorAll('#mainNav li[data-menu]');
    const megaMenu = document.getElementById('megaMenu');
    const megaContent = document.getElementById('megaContent');
    const headerContainer = document.getElementById('siteHeader');

    if (!megaMenu || !megaContent || !headerContainer) return;

    let menuTimeout;

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        clearTimeout(menuTimeout);
        const menuId = link.getAttribute('data-menu');

        if (menuId === 'home') {
          megaMenu.classList.remove('active');
          if (window.scrollY < 50) {
            headerContainer.style.background = 'var(--glass-bg)';
            headerContainer.classList.remove('scrolled');
          }
          return;
        }

        // Get menu content from data attribute or template
        const menuTemplate = document.getElementById('mega-menu-' + menuId);
        if (menuTemplate) {
          megaContent.innerHTML = menuTemplate.innerHTML;
        } else {
          megaContent.innerHTML = `
            <div class="mega-menu-column">
              <div class="mega-menu-title">Explore ${menuId.charAt(0).toUpperCase() + menuId.slice(1)}</div>
              <a href="/collections/${menuId}">View All</a>
              <a href="/collections/${menuId}?sort_by=created-descending">New Arrivals</a>
              <a href="/collections/${menuId}?sort_by=best-selling">Bestsellers</a>
            </div>
          `;
        }

        megaMenu.classList.add('active');
        headerContainer.classList.add('scrolled');
        headerContainer.style.background = 'rgba(5, 5, 5, 0.98)';
      });

      link.addEventListener('mouseleave', hideMenu);
    });

    megaMenu.addEventListener('mouseenter', () => clearTimeout(menuTimeout));
    megaMenu.addEventListener('mouseleave', hideMenu);

    function hideMenu() {
      menuTimeout = setTimeout(() => {
        megaMenu.classList.remove('active');
        if (window.scrollY < 50) {
          headerContainer.style.background = 'var(--glass-bg)';
          headerContainer.classList.remove('scrolled');
        }
      }, 100);
    }
  }

  /* ===================================
     Scroll Animations (Intersection Observer)
     =================================== */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  /* ===================================
     Horizontal Scroller Logic
     =================================== */
  function initScrollers() {
    // Generic scroller function
    window.scrollSection = function(scrollerId, direction) {
      const scroller = document.getElementById(scrollerId);
      if (!scroller) return;
      const scrollAmount = Math.min(scroller.clientWidth * 0.8, 800);
      scroller.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };
  }

  /* ===================================
     Elite Collection Tab System
     =================================== */
  function initEliteTabs() {
    const tabData = {};

    // Read tab data from data attributes on the section
    document.querySelectorAll('[data-elite-tab]').forEach(el => {
      const id = el.getAttribute('data-elite-tab');
      tabData[id] = {
        title: el.getAttribute('data-title'),
        desc: el.getAttribute('data-desc'),
        img: el.getAttribute('data-img'),
        spec1Label: el.getAttribute('data-spec1-label'),
        spec1Val: el.getAttribute('data-spec1-val'),
        spec2Label: el.getAttribute('data-spec2-label'),
        spec2Val: el.getAttribute('data-spec2-val'),
      };
    });

    window.switchEliteTab = function(tabId) {
      const tabs = document.querySelectorAll('.elite-tabs .btn');
      tabs.forEach(btn => btn.className = 'btn btn-outline');

      const activeBtn = document.getElementById('tab-' + tabId);
      if (activeBtn) activeBtn.className = 'btn btn-primary';

      const img = document.getElementById('eliteImage');
      const content = document.getElementById('eliteTextContainer');
      if (!img || !content) return;

      img.style.opacity = '0';
      content.style.opacity = '0';
      img.style.transform = 'scale(0.95)';

      setTimeout(() => {
        const data = tabData[tabId];
        if (!data) return;

        img.src = data.img;
        const titleEl = document.getElementById('eliteTitle');
        const descEl = document.getElementById('eliteDesc');
        const specsEl = document.getElementById('eliteSpecs');

        if (titleEl) titleEl.innerText = data.title;
        if (descEl) descEl.innerText = data.desc;
        if (specsEl) {
          specsEl.innerHTML = `
            <div class="product-card" style="margin:0;padding:15px;background:rgba(255,255,255,0.03);">
              <h4 style="font-size:0.9rem;color:var(--accent);">${data.spec1Label}</h4>
              <p style="font-size:1.2rem;font-weight:bold;">${data.spec1Val}</p>
            </div>
            <div class="product-card" style="margin:0;padding:15px;background:rgba(255,255,255,0.03);">
              <h4 style="font-size:0.9rem;color:var(--accent);">${data.spec2Label}</h4>
              <p style="font-size:1.2rem;font-weight:bold;">${data.spec2Val}</p>
            </div>
          `;
        }

        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
        content.style.opacity = '1';
      }, 300);
    };
  }

  /* ===================================
     Flash Deals Countdown Timer
     =================================== */
  function initCountdownTimer() {
    const vals = document.querySelectorAll('.countdown-val');
    if (vals.length < 3) return;

    setInterval(() => {
      let h = parseInt(vals[0].innerText);
      let m = parseInt(vals[1].innerText);
      let s = parseInt(vals[2].innerText);

      s--;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 23; }

      vals[0].innerText = h.toString().padStart(2, '0');
      vals[1].innerText = m.toString().padStart(2, '0');
      vals[2].innerText = s.toString().padStart(2, '0');
    }, 1000);
  }

  /* ===================================
     Comparison Slider
     =================================== */
  function initComparisonSlider() {
    const container = document.getElementById('monitorComparison');
    const overlay = document.getElementById('comparisonOverlay');
    const slider = document.getElementById('comparisonSlider');

    if (!container || !overlay || !slider) return;

    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = container.getBoundingClientRect();
      let position = ((clientX - rect.left) / rect.width) * 100;
      position = Math.max(0, Math.min(100, position));
      slider.style.transition = 'none';
      overlay.style.transition = 'none';
      slider.style.left = `${position}%`;
      overlay.style.width = `${position}%`;
    };

    slider.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', e => { if (isDragging) updateSlider(e.clientX); });

    // Touch support
    slider.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', e => { if (isDragging) updateSlider(e.touches[0].clientX); });
  }

  /* ===================================
     Sales Popup Notifications
     =================================== */
  function initSalesPopup() {
    const popup = document.getElementById('salesPopup');
    if (!popup) return;

    const names = popup.getAttribute('data-names');
    const products = popup.getAttribute('data-products');
    const times = popup.getAttribute('data-times');

    if (!names || !products || !times) return;

    const nameArr = names.split('|');
    const productArr = products.split('|');
    const timeArr = times.split('|');

    setInterval(() => {
      const rName = nameArr[Math.floor(Math.random() * nameArr.length)];
      const rProd = productArr[Math.floor(Math.random() * productArr.length)];
      const rTime = timeArr[Math.floor(Math.random() * timeArr.length)];

      const nameEl = document.getElementById('spName');
      const prodEl = document.getElementById('spProduct');
      const timeEl = document.getElementById('spTime');

      if (nameEl) nameEl.innerText = rName;
      if (prodEl) prodEl.innerText = rProd;
      if (timeEl) timeEl.innerText = rTime;

      popup.classList.add('show');
      setTimeout(() => popup.classList.remove('show'), 5000);
    }, 25000);
  }

  /* ===================================
     Cursor Optimization
     =================================== */
  function initCursors() {
    document.querySelectorAll('a, button, .product-card, .bento-card, .brand-logo')
      .forEach(el => el.style.cursor = 'pointer');
  }

  /* ===================================
     Initialize Everything
     =================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMegaMenu();
    initScrollAnimations();
    initScrollers();
    initEliteTabs();
    initCountdownTimer();
    initComparisonSlider();
    initSalesPopup();
    initCursors();
  });

})();
