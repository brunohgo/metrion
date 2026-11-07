import '../styles/main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initHeader } from './components/header.js';
import { initPreloader } from './components/preloader.js';
import { initHeroAnimation } from './animations/heroAnimation.js';
import { initScrollStorytelling } from './animations/scrollStorytelling.js';
import { initEquipmentExplorer } from './components/equipmentExplorer.js';
import { initFaqAccordion } from './components/faqAccordion.js';
import { initCookieBanner } from './components/cookieBanner.js';
import { initQuoteModal } from './components/quoteModal.js';
import { initBackToTop } from './components/backToTop.js';
import { initMagneticButtons } from './components/magneticButtons.js';
import { initCounters } from './components/counterAnimation.js';
import { initInteractiveGauge } from './components/interactiveGaugeCanvas.js';
import { initSkeletonPlaceholders } from './components/skeletonLoader.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scroll for Desktop only (preserves native momentum scrolling on mobile)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileOrTouch = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
let lenis = null;

if (!prefersReduced && !isMobileOrTouch) {
  lenis = new Lenis({
    duration: 0.85,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}

// Suspend smooth scrolling while a dialog is open. Without this, Lenis keeps
// consuming wheel events and the modal card cannot scroll natively.
window.addEventListener('mp:modal-open', () => {
  if (lenis) lenis.stop();
});

window.addEventListener('mp:modal-close', () => {
  if (lenis) lenis.start();
});

// Healthy lag smoothing prevents abrupt jumps
gsap.ticker.lagSmoothing(500, 33);

// Non-blocking scroll reveal animations for sections
function initScrollReveals() {
  if (prefersReduced || isMobileOrTouch) {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .service-card').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Smooth gentle reveals without hiding content
  const revealElements = document.querySelectorAll('.reveal-up');
  revealElements.forEach((el) => {
    gsap.from(el, {
      opacity: 0.75,
      y: 15,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      }
    });
  });

  // Reveal Left (Section 03 text content)
  document.querySelectorAll('.reveal-left').forEach((el) => {
    gsap.from(el, {
      opacity: 0.75,
      x: -15,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      }
    });
  });

  // Reveal Right (Section 03 lab image)
  document.querySelectorAll('.reveal-right').forEach((el) => {
    gsap.from(el, {
      opacity: 0.75,
      x: 15,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      }
    });
  });

  // Reveal Scale
  document.querySelectorAll('.reveal-scale').forEach((el) => {
    gsap.from(el, {
      opacity: 0.8,
      scale: 0.99,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      }
    });
  });

  // Staggered Bento Cards (cards start 100% visible, smoothly lift on scroll)
  const bentoGrid = document.querySelector('.services-grid');
  if (bentoGrid) {
    const cards = bentoGrid.querySelectorAll('.service-card');
    cards.forEach((c) => {
      c.style.opacity = '1';
      c.style.transform = 'none';
    });
    gsap.from(cards, {
      opacity: 0.75,
      y: 15,
      duration: 0.35,
      stagger: 0.06,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: bentoGrid,
        start: 'top 95%',
        once: true,
      }
    });
  }
}

// Robust execution whether DOM is loading or already ready
function start() {
  initHeader();
  initFaqAccordion();
  initEquipmentExplorer();
  initCookieBanner();
  initQuoteModal();
  initBackToTop();
  initMagneticButtons();
  initCounters();
  initInteractiveGauge();
  initSkeletonPlaceholders();

  // Run preloader, then trigger hero entrance and scroll triggers
  initPreloader(() => {
    initHeroAnimation();
    initScrollStorytelling();
    initScrollReveals();
    ScrollTrigger.refresh();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
