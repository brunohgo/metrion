import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero entrance and ScrollTrigger scrub
 */
export function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bgImage = hero.querySelector('.hero__bg-image');
  const badge = hero.querySelector('.hero__badge');
  const titleLines = hero.querySelectorAll('.hero__title-line');
  const subtitle = hero.querySelector('.hero__subtitle');
  const actions = hero.querySelector('.hero__actions');
  const scrollIndicator = hero.querySelector('.hero__scroll-indicator');

  const isMobile = window.innerWidth <= 768;

  if (prefersReduced || isMobile) {
    // Immediate display on mobile and reduced motion without any delay
    if (bgImage) gsap.set(bgImage, { opacity: 0.85, scale: 1 });
    if (badge) gsap.set(badge, { opacity: 1, y: 0 });
    if (titleLines) gsap.set(titleLines, { opacity: 1, y: 0 });
    if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
    if (actions) gsap.set(actions, { opacity: 1, y: 0 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 1 });
    return;
  }

  // Desktop: Fast, ultra-smooth micro-entrance (all within 0.35s, no blank screen)
  const tl = gsap.timeline();

  if (bgImage) {
    tl.fromTo(bgImage, { scale: 1.04, opacity: 0.7 }, { scale: 1, opacity: 0.85, duration: 0.45, ease: 'power2.out' });
  }

  if (titleLines.length) {
    tl.fromTo(titleLines, { y: 15, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, '-=0.35');
  }

  if (subtitle) {
    tl.fromTo(subtitle, { y: 10, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.25');
  }

  if (actions) {
    tl.fromTo(actions, { y: 10, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.2');
  }

  if (scrollIndicator) {
    tl.fromTo(scrollIndicator, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '-=0.15');
  }

  // Scroll-driven animation (GSAP scrub)
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      if (bgImage) {
        gsap.set(bgImage, {
          scale: 1 + progress * 0.1,
          y: progress * 60,
          opacity: 0.85 - progress * 0.35
        });
      }
      const heroContent = hero.querySelector('.hero__content');
      if (heroContent) {
        gsap.set(heroContent, {
          y: progress * 50,
          opacity: 1 - progress * 1.1
        });
      }
    }
  });
}