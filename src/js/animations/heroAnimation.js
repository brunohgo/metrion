import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero entrance, mouse parallax, digital micrometer readout, and ScrollTrigger scrub
 */
export function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bgImage = hero.querySelector('.hero__bg-image');
  const gridLines = hero.querySelector('.hero__grid-lines');
  const luminousLine = hero.querySelector('.hero__luminous-line');
  const badge = hero.querySelector('.hero__badge');
  const titleLines = hero.querySelectorAll('.hero__title-line');
  const subtitle = hero.querySelector('.hero__subtitle');
  const actions = hero.querySelector('.hero__actions');
  const measurements = hero.querySelector('.hero__measurements');
  const scrollIndicator = hero.querySelector('.hero__scroll-indicator');
  const liveMicrometer = hero.querySelector('#live-micrometer-val');

  const isMobile = window.innerWidth <= 768;

  if (prefersReduced || isMobile) {
    // Immediate display on mobile and reduced motion without any delay
    if (bgImage) gsap.set(bgImage, { opacity: 0.85, scale: 1 });
    if (badge) gsap.set(badge, { opacity: 1, y: 0 });
    if (titleLines) gsap.set(titleLines, { opacity: 1, y: 0 });
    if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
    if (actions) gsap.set(actions, { opacity: 1, y: 0 });
    if (measurements) gsap.set(measurements, { opacity: 1, x: 0 });
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

  if (measurements) {
    tl.fromTo(measurements, { x: 15, opacity: 0.3 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.25');
  }

  if (scrollIndicator) {
    tl.fromTo(scrollIndicator, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '-=0.15');
  }

  // Live micron reading jitter simulation
  if (liveMicrometer) {
    const baseValue = 38.2540;
    setInterval(() => {
      // Small fluctuation within +/- 0.0003 mm to simulate live sub-micron thermal calibration sensor
      const jitter = (Math.random() - 0.5) * 0.0004;
      const current = (baseValue + jitter).toFixed(4);
      liveMicrometer.textContent = current;
    }, 1800);
  }

  // Mouse Parallax Effect (Desktop only with visibility observer)
  const isTouch = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && bgImage) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMoving = false;
    const renderParallax = () => {
      if (!isHeroVisible) {
        isMoving = false;
        parallaxRaf = null;
        return;
      }

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) {
        currentX += dx * 0.05;
        currentY += dy * 0.05;

        if (measurements) {
          measurements.style.transform = `translate3d(${(currentX * 0.5).toFixed(2)}px, calc(-50% + ${(currentY * 0.5).toFixed(2)}px), 0)`;
        }
        parallaxRaf = requestAnimationFrame(renderParallax);
      } else {
        isMoving = false;
        parallaxRaf = null;
      }
    };

    const onMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 20;
      mouseY = (e.clientY / innerHeight - 0.5) * 15;
      if (!isMoving && isHeroVisible) {
        isMoving = true;
        parallaxRaf = requestAnimationFrame(renderParallax);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const heroObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        isHeroVisible = true;
        if (!isMoving) {
          isMoving = true;
          parallaxRaf = requestAnimationFrame(renderParallax);
        }
      } else {
        isHeroVisible = false;
        if (parallaxRaf) {
          cancelAnimationFrame(parallaxRaf);
          parallaxRaf = null;
        }
        isMoving = false;
      }
    }, { threshold: 0.05 });

    heroObserver.observe(hero);
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
