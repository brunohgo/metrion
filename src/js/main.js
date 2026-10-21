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

// Healthy lag smoothing prevents abrupt jumps
gsap.ticker.lagSmoothing(500, 33);

// Scroll reveal animations for sections
function initScrollReveals() {
  if (prefersReduced) {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal-up');
  revealElements.forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Reveal Left (Section 03 text content)
  document.querySelectorAll('.reveal-left').forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, x: -35 },
      {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Reveal Right (Section 03 lab image)
  document.querySelectorAll('.reveal-right').forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, x: 35 },
      {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Reveal Scale
  document.querySelectorAll('.reveal-scale').forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Staggered Bento Cards
  const bentoGrid = document.querySelector('.services-grid');
  if (bentoGrid) {
    const cards = bentoGrid.querySelectorAll('.service-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bentoGrid,
          start: 'top 80%',
        }
      }
    );
  }
}

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFaqAccordion();
  initEquipmentExplorer();
  initCookieBanner();
  initQuoteModal();
  initBackToTop();
  initMagneticButtons();
  initCounters();
  initInteractiveGauge();

  // Run preloader, then trigger hero entrance and scroll triggers
  initPreloader(() => {
    initHeroAnimation();
    initScrollStorytelling();
    initScrollReveals();
    ScrollTrigger.refresh();
  });
});
