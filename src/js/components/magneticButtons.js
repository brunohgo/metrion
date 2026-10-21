import gsap from 'gsap';

/**
 * Magnetic Buttons: Smoothly pulls buttons toward mouse cursor within proximity
 * Optimized with cached bounding box on enter to avoid layout thrashing
 */
export function initMagneticButtons() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
  if (prefersReduced || isTouch) return;

  const buttons = document.querySelectorAll('.btn, .header__cta, .btn-magnetic');

  buttons.forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
    let rect = null;

    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect();
    }, { passive: true });

    btn.addEventListener('mousemove', (e) => {
      if (!rect) rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Magnetic pull range (up to 12px)
      xTo(x * 0.28);
      yTo(y * 0.28);
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      rect = null;
      xTo(0);
      yTo(0);
    });
  });
}
