import gsap from 'gsap';

/**
 * High-Precision Preloader Sequence
 * Features an animated dial gauge, needle deflection, percentage readout,
 * and high-tech calibration sweep. Optimized for zero perceived lag.
 */
export function initPreloader(onCompleteCallback) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) {
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }

  // Accessibility: Respect reduced motion immediately
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    preloader.classList.add('is-hidden');
    setTimeout(() => {
      preloader.remove();
      if (typeof onCompleteCallback === 'function') onCompleteCallback();
    }, 40);
    return;
  }

  const logo = preloader.querySelector('.preloader__logo');
  const svgContainer = preloader.querySelector('.preloader__svg-container');
  const progressBar = preloader.querySelector('.preloader__progress-bar');
  const progressFill = preloader.querySelector('.preloader__progress-fill');
  const gaugeProgress = preloader.querySelector('.gauge-progress');
  const gaugeNeedle = preloader.querySelector('.gauge-needle');
  const valueDisplay = preloader.querySelector('.preloader__value');

  // Check if user already saw the preloader in this session
  const alreadyVisited = sessionStorage.getItem('metri_preloaded') === 'true';

  let progress = { value: 0 };
  let isDone = false;

  const setProgressVisuals = (val) => {
    const rounded = Math.round(val);
    if (progressFill) progressFill.style.width = `${rounded}%`;
    if (valueDisplay) valueDisplay.textContent = `${rounded}%`;

    // Gauge ring circle: circumference 283
    if (gaugeProgress) {
      const offset = 283 - (283 * (val / 100));
      gaugeProgress.style.strokeDashoffset = offset;
    }

    // Needle rotation: -90deg to +90deg (180deg sweep)
    if (gaugeNeedle) {
      const rotation = -90 + (val / 100) * 180;
      gaugeNeedle.setAttribute('transform', `rotate(${rotation} 50 50)`);
    }
  };

  const finishAndReveal = (duration = 0.25) => {
    if (isDone) return;
    isDone = true;

    sessionStorage.setItem('metri_preloaded', 'true');

    gsap.to(progress, {
      value: 100,
      duration,
      ease: 'power2.out',
      onUpdate: () => setProgressVisuals(progress.value),
      onComplete: () => {
        // Trigger hero reveal immediately as preloader starts fading!
        if (typeof onCompleteCallback === 'function') onCompleteCallback();

        // High-tech exit sequence
        const exitTl = gsap.timeline({
          onComplete: () => {
            preloader.classList.add('is-hidden');
            setTimeout(() => preloader.remove(), 250);
          }
        });

        exitTl.to([logo, svgContainer, progressBar], {
          opacity: 0,
          scale: 0.96,
          y: -10,
          duration: 0.18,
          stagger: 0.03,
          ease: 'power2.in'
        })
        .to(preloader, {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.inOut'
        }, '-=0.06');
      }
    });
  };

  if (alreadyVisited) {
    // Returning visitor: Snappy 250ms calibration pulse
    gsap.set([logo, svgContainer, progressBar], { opacity: 1, scale: 1 });
    gsap.to(progress, {
      value: 100,
      duration: 0.25,
      ease: 'power3.inOut',
      onUpdate: () => setProgressVisuals(progress.value),
      onComplete: () => finishAndReveal(0.15)
    });
    return;
  }

  // First time visitor: Smooth & punchy high-precision calibration sweep (~650ms total)
  const entryTl = gsap.timeline();
  entryTl
    .to(logo, { opacity: 1, duration: 0.2, ease: 'power2.out' })
    .to(svgContainer, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.2)' }, '-=0.1')
    .to(progressBar, { opacity: 1, duration: 0.15 }, '-=0.1');

  // Fast initial sweep to 72%
  gsap.to(progress, {
    value: 72,
    duration: 0.35,
    ease: 'power2.out',
    onUpdate: () => setProgressVisuals(progress.value)
  });

  // When DOM is ready, complete to 100% briskly
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => finishAndReveal(0.25), 320);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => finishAndReveal(0.25), 250);
    });
    // Safety fallback: maximum 900ms
    setTimeout(() => finishAndReveal(0.25), 900);
  }
}
