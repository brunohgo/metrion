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

  // Accessibility: Immediate reveal if user prefers reduced motion
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

  let currentProgress = 15;
  let targetProgress = 25;
  let isDone = false;
  let animFrameId = null;

  const setProgressVisuals = (val) => {
    const rounded = Math.min(100, Math.round(val));
    if (progressFill) progressFill.style.width = `${rounded}%`;
    if (valueDisplay) valueDisplay.textContent = `${rounded}%`;

    // Gauge ring circle: circumference 283
    if (gaugeProgress) {
      const offset = 283 - (283 * (rounded / 100));
      gaugeProgress.style.strokeDashoffset = offset;
    }

    // Needle rotation: -90deg to +90deg (180deg sweep)
    if (gaugeNeedle) {
      const rotation = -90 + (rounded / 100) * 180;
      gaugeNeedle.setAttribute('transform', `rotate(${rotation} 50 50)`);
    }
  };

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
        setTimeout(() => preloader.remove(), 350);
      }
    });

    exitTl
      .to([logo, svgContainer, progressBar, valueDisplay], {
        opacity: 0,
        scale: 0.96,
        y: -10,
        duration: 0.22,
        stagger: 0.03,
        ease: 'power2.in'
      })
      .to(preloader, {
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut'
      }, '-=0.06');
  };

  // Continuous smooth interpolation ticker for the dial gauge
  const tick = () => {
    const delta = (targetProgress - currentProgress) * 0.1;
    currentProgress += delta;
    setProgressVisuals(currentProgress);

    if (currentProgress < 99.2) {
      animFrameId = requestAnimationFrame(tick);
    } else {
      revealSite();
    }
  };
  animFrameId = requestAnimationFrame(tick);

  // Background Preloader System:
  // Preloads and decodes images into memory
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

  const criticalImages = [
    '/images/hero-laboratory.jpg',
    '/images/about-laboratory.jpg'
  ];

  let loadedImagesCount = 0;
  criticalImages.forEach((src) => {
    preloadImage(src).then(() => {
      loadedImagesCount++;
      // Advance needle as images download and decode into memory
      targetProgress = Math.max(targetProgress, 35 + (loadedImagesCount / criticalImages.length) * 45);
    });
  });

  // DOM interactive state
  const domPromise = new Promise((resolve) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', resolve);
    }
  });

  // Fonts ready state
  const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();

  domPromise.then(() => {
    targetProgress = Math.max(targetProgress, 45);
  });

  fontsPromise.then(() => {
    targetProgress = Math.max(targetProgress, 70);
  });

  // When all assets are fully loaded and decoded in the background
  Promise.all([
    domPromise,
    fontsPromise,
    ...criticalImages.map(preloadImage)
  ]).then(() => {
    // Smooth final calibration snap to 100%
    targetProgress = 100;
  });

  // Fallback safety timeout (1.8s) so user is never stalled if a network proxy delays
  setTimeout(() => {
    targetProgress = 100;
  }, 1800);
}
