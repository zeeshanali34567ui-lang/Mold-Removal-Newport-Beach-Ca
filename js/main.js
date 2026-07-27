/* ==========================================================
   MAIN.JS — Navigation · Scroll · AOS · FAQ · Mobile Menu
   Brockton Mold Experts
   ========================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------
     DOM REFERENCES
     -------------------------------------------------------- */
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('nav-toggle');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const overlay     = document.getElementById('mobile-overlay');

  /* --------------------------------------------------------
     NAVBAR — Shadow on Scroll
     -------------------------------------------------------- */
  let lastScroll = 0;
  let ticking    = false;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      navbar.classList.add('nav--scrolled');
    } else {
      navbar.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* --------------------------------------------------------
     MOBILE MENU — Open / Close
     -------------------------------------------------------- */
  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-expanded', 'true');

    // Focus trap — focus close button
    setTimeout(function() {
      mobileClose.focus();
      // Animate links
      var links = mobileMenu.querySelectorAll('li');
      links.forEach(function(link, index) {
        link.style.animation = `fadeUp 0.4s ease forwards ${index * 0.1}s`;
      });
    }, 100);
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');

    // Reset link animations
    var links = mobileMenu.querySelectorAll('li');
    links.forEach(function(link) {
      link.style.animation = '';
    });

    // Hide overlay after transition
    setTimeout(function() {
      overlay.style.display = 'none';
    }, 350);

    navToggle.focus();
  }

  if (navToggle) {
    navToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on link click
  var mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile-sublink');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });

  /* --------------------------------------------------------
     DROPDOWN — Keyboard Accessibility
     -------------------------------------------------------- */
  var dropdownTriggers = document.querySelectorAll('.nav__dropdown-trigger');

  dropdownTriggers.forEach(function(trigger) {
    trigger.addEventListener('keydown', function(e) {
      var dropdown = this.closest('.nav__dropdown');
      var menu = dropdown.querySelector('.nav__dropdown-menu');

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          menu.style.opacity = '1';
          menu.style.visibility = 'visible';
          menu.style.transform = 'translateX(-50%) translateY(0)';
          var firstLink = menu.querySelector('a');
          if (firstLink) firstLink.focus();
        } else {
          menu.style.opacity = '';
          menu.style.visibility = '';
          menu.style.transform = '';
        }
      }

      if (e.key === 'Escape') {
        this.setAttribute('aria-expanded', 'false');
        menu.style.opacity = '';
        menu.style.visibility = '';
        menu.style.transform = '';
        this.focus();
      }
    });
  });

  /* --------------------------------------------------------
     FAQ ACCORDION
     -------------------------------------------------------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-question');
    var answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', function() {
      var isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(function(otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Keyboard support
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* --------------------------------------------------------
     SMOOTH SCROLL — Anchor Links
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      }
    });
  });

  /* --------------------------------------------------------
     ACTIVE NAV LINK
     -------------------------------------------------------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(function(link) {
    link.classList.remove('nav__link--active');
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* --------------------------------------------------------
     AOS INIT
     -------------------------------------------------------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }

  /* --------------------------------------------------------
     LUCIDE ICONS INIT
     -------------------------------------------------------- */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

})();
