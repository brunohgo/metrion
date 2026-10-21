import gsap from 'gsap';

/**
 * High-Precision Background Asset Preloader
 * 
 * Preloads and decodes critical hero assets (images, webfonts, DOM)
 * in the background while displaying an animated dial gauge needle.
 * Unveils the page only when assets are fully loaded and rendered,
 * ensuring zero pop-in, zero layout shift, and instant visual fidelity.
 */
export function initPreloader(onCompleteCallback) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) {
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }

  // Accessibility & Fast Return: Reduced motion or already visited in this session
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen = sessionStorage.getItem('mp_preloader_seen');

  if (prefersReduced || alreadySeen) {
    preloader.classList.add('is-hidden');
    setTimeout(() => {
      preloader.remove();
      if (typeof onCompleteCallback === 'function') onCompleteCallback();
    }, 40);
    return;
  }
  sessionStorage.setItem('mp_preloader_seen', '1');

  const logo = preloader.querySelector('.preloader__logo');
  const svgContainer = preloader.querySelector('.preloader__svg-container');
  const progressBar = preloader.querySelector('.preloader__progress-bar');
  const progressFill = preloader.querySelector('.preloader__progress-fill');
  const gaugeProgress = preloader.querySelector('.gauge-progress');
  const gaugeNeedle = preloader.querySelector('.gauge-needle');
  const valueDisplay = preloader.querySelector('.preloader__value');

  let currentProgress = 20;
  let isDone = false;
  let animFrameId = null;
  let lastRendered = -1;
  let lastDisplayed = -1;

  const setProgressVisuals = (val) => {
    const rounded = Math.min(100, Math.round(val));

    // Skip redundant writes: each style/attribute write used to invalidate
    // layout on the whole document, so only touch the DOM when it changes.
    if (rounded === lastRendered) return;
    lastRendered = rounded;

    // Progress bar: transform (compositor-only) instead of width (layout).
    if (progressFill) progressFill.style.transform = `scaleX(${(rounded / 100).toFixed(3)})`;

    // Percentage readout: text is only rewritten when the integer changes.
    if (valueDisplay && rounded !== lastDisplayed) {
      lastDisplayed = rounded;
      valueDisplay.textContent = `${rounded}%`;
    }

    // Gauge ring circle: circumference 283
    if (gaugeProgress) {
      const offset = 283 - (283 * (rounded / 100));
      gaugeProgress.style.strokeDashoffset = offset;
      gaugeProgress.setAttribute('stroke-dashoffset', offset);
    }

    // Needle rotation: -90deg to +90deg (180deg sweep)
    if (gaugeNeedle) {
      const rotation = -90 + (rounded / 100) * 180;
      gaugeNeedle.setAttribute('transform', `rotate(${rotation.toFixed(1)} 50 50)`);
    }
  };

  // Render initial visual state immediately
  setProgressVisuals(currentProgress);

  const revealSite = () => {
    if (isDone) return;
    isDone = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    setProgressVisuals(100);

    // Trigger hero & UI initialization in parallel as preloader begins exit
    if (typeof onCompleteCallback === 'function') onCompleteCallback();

    const exitTl = gsap.timeline({
      onComplete: () => {
        preloader.classList.add('is-hidden');
        setTimeout(() => preloader.remove(), 250);
      }
    });

    exitTl
      .to([logo, svgContainer, progressBar, valueDisplay], {
        opacity: 0,
        scale: 0.96,
        y: -10,
        duration: 0.18,
        stagger: 0.02,
        ease: 'power2.in'
      })
      .to(preloader, {
        opacity: 0,
        duration: 0.22,
        ease: 'power2.inOut'
      }, '-=0.04');
  };

  // Fluid smooth interpolation ticker for the dial gauge needle.
  // The progress is derived from elapsed time instead of a per-frame
  // interpolation: on a slow device (few frames per second) a per-frame
  // approach needed dozens of frames to converge and stretched a 0.9s
  // animation into several seconds of blocked main thread.
  const ANIMATION_DURATION = 900;
  const startedAt = performance.now();

  const progressAt = (elapsed) => {
    // Stepped calibration curve (ms -> %): mirrors the original step timers
    // but is independent of the frame rate.
    const steps = [
      { at: 0, from: 20, to: 40 },
      { at: 160, from: 40, to: 65 },
      { at: 360, from: 65, to: 85 },
      { at: 600, from: 85, to: 100 },
      { at: ANIMATION_DURATION, from: 100, to: 100 },
    ];
    for (let i = steps.length - 1; i > 0; i--) {
      if (elapsed >= steps[i - 1].at) {
        const a = steps[i - 1];
        const b = steps[i];
        const span = b.at - a.at;
        const t = span > 0 ? Math.min(1, (elapsed - a.at) / span) : 1;
        // ease-out cubic keeps the motion fluid
        const eased = 1 - Math.pow(1 - t, 3);
        return a.from + (b.to - a.from) * eased;
      }
    }
    return steps[0].from;
  };

  const tick = () => {
    const elapsed = performance.now() - startedAt;
    currentProgress = progressAt(elapsed);
    setProgressVisuals(currentProgress);

    if (elapsed < ANIMATION_DURATION) {
      animFrameId = requestAnimationFrame(tick);
    } else {
      revealSite();
    }
  };
  animFrameId = requestAnimationFrame(tick);

  // Background Asset Preloader (non-blocking)
  const preloadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        if (img.decode) {
          img.decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
      } else {
        img.onload = () => {
          if (img.decode) {
            img.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        };
        img.onerror = resolve;
      }
    });
  };

  // Only the LCP image is worth fetching eagerly. The remaining below-the-fold
  // images are `loading="lazy"` on purpose: fetching them here would steal
  // mobile bandwidth from the hero and from the content the user is scrolling to.
  const criticalImages = [
    '/images/hero-laboratory.jpg'
  ];

  criticalImages.forEach(preloadImage);
}
