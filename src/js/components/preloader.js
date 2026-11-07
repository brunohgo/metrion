import gsap from 'gsap';

/**
 * Branded, measurement-inspired page preloader.
 *
 * The readout is driven by real loading signals (boot, webfonts, hero image,
 * window load), so the 0–100 counter only advances when there is something to
 * wait for. A minimum display time keeps the animation from flickering on fast
 * connections, and a hard stop guarantees the page is never trapped.
 */

const MIN_VISIBLE_MS = 500;
const MAX_VISIBLE_MS = 6000;
const HARD_STOP_MS = 8000;

// Each signal contributes a share of the 100%. "boot" is already satisfied when
// this module runs, so the counter starts moving immediately.
const SIGNAL_WEIGHTS = {
  boot: 15,
  fonts: 25,
  hero: 40,
  load: 20,
};

const STATUS_BANDS = [
  { upTo: 25, label: 'A inicializar instrumentos' },
  { upTo: 55, label: 'A carregar referências metrológicas' },
  { upTo: 80, label: 'A calibrar escalas' },
  { upTo: 99, label: 'A verificar incerteza' },
  { upTo: 101, label: 'Pronto' },
];

export function initPreloader(onCompleteCallback) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) {
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }

  // Accessibility & fast return: reduced motion or already seen this session.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen = sessionStorage.getItem('mp_preloader_seen');

  if (prefersReduced || alreadySeen) {
    preloader.classList.add('is-hidden');
    preloader.remove();
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }

  sessionStorage.setItem('mp_preloader_seen', '1');
  preloader.dataset.booted = '1';

  const inner = preloader.querySelector('.preloader__inner');
  const progressFill = preloader.querySelector('.preloader__progress-fill');
  const gaugeProgress = preloader.querySelector('.gauge-progress');
    const gaugePointer = preloader.querySelector('.gauge-pointer');
  const ticksGroup = preloader.querySelector('.gauge-ticks');
  const valueDisplay = preloader.querySelector('.preloader__value');
  const statusDisplay = preloader.querySelector('.preloader__status');

  buildTicks(ticksGroup);

  const completed = {
    boot: true,
    fonts: false,
    hero: false,
    load: false,
  };

  let displayed = 0;
  let lastRendered = -1;
  let lastStatus = '';
  let isDone = false;
  let animFrameId = null;
  let lastFrameAt = performance.now();
  const startedAt = lastFrameAt;

  const signalTotal = () =>
    Object.keys(SIGNAL_WEIGHTS).reduce(
      (total, key) => total + (completed[key] ? SIGNAL_WEIGHTS[key] : 0),
      0
    );

  const allSignalsReady = () => completed.fonts && completed.hero && completed.load;

  const render = (value) => {
    const percent = Math.max(0, Math.min(100, Math.round(value)));
    if (percent === lastRendered) return;
    lastRendered = percent;

    // Progress bar: transform (compositor-only) instead of width (layout).
    if (progressFill) {
      progressFill.style.transform = `scaleX(${(percent / 100).toFixed(3)})`;
    }

    if (valueDisplay) valueDisplay.textContent = String(percent);

    // Gauge ring: circumference 2·π·45 ≈ 283.
    if (gaugeProgress) {
      const offset = 283 - 283 * (percent / 100);
      gaugeProgress.style.strokeDashoffset = offset;
      gaugeProgress.setAttribute('stroke-dashoffset', offset);
    }

    // The index marker always sits on the leading edge of the filled ring.
        if (gaugePointer) {
          gaugePointer.setAttribute('transform', `rotate(${(percent * 3.6).toFixed(1)} 50 50)`);
        }

    preloader.setAttribute('aria-valuenow', String(percent));

    const band = STATUS_BANDS.find((entry) => percent < entry.upTo) || STATUS_BANDS[STATUS_BANDS.length - 1];
    if (statusDisplay && band.label !== lastStatus) {
      lastStatus = band.label;
      statusDisplay.textContent = band.label;
    }
  };

  const revealSite = () => {
    if (isDone) return;
    isDone = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);

    render(100);

    // Trigger hero & UI initialization in parallel as preloader begins exit.
    if (typeof onCompleteCallback === 'function') onCompleteCallback();

    const exitTl = gsap.timeline({
      onComplete: () => {
        preloader.classList.add('is-hidden');
        setTimeout(() => preloader.remove(), 250);
      }
    });

    exitTl
      .to(inner, {
        opacity: 0,
        y: -14,
        duration: 0.28,
        ease: 'power2.inOut'
      })
      .to(preloader, {
        opacity: 0,
        scale: 1.03,
        duration: 0.45,
        ease: 'power2.inOut'
      }, '-=0.12');
  };

  const tick = (now) => {
    // Clamped delta keeps the smoothing stable after a long frame or a
    // background-tab resume.
    const delta = Math.min(80, now - lastFrameAt);
    lastFrameAt = now;
    const elapsed = now - startedAt;

    // Real signals decide how much there is left to wait for; the minimum
    // display time avoids a one-frame flash on fast connections.
    const canExit =
      elapsed >= MIN_VISIBLE_MS && (allSignalsReady() || elapsed >= MAX_VISIBLE_MS);
    const target = canExit ? 100 : signalTotal();

    // Exponential approach: monotonic, frame-rate independent, never overshoots.
    if (displayed < target) {
      const step = (target - displayed) * (1 - Math.exp(-delta / 150));
      displayed = Math.min(target, displayed + step);
    }

    render(displayed);

    if (canExit && displayed >= 99.5) {
      revealSite();
      return;
    }
    if (elapsed >= HARD_STOP_MS) {
      revealSite();
      return;
    }
    animFrameId = requestAnimationFrame(tick);
  };

  render(0);
  animFrameId = requestAnimationFrame(tick);

  // --- Real loading signals -------------------------------------------------

  const markSignal = (key) => {
    if (completed[key]) return;
    completed[key] = true;
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => markSignal('fonts')).catch(() => markSignal('fonts'));
  } else {
    markSignal('fonts');
  }

  preloadImage('/images/hero-laboratory.jpg').then(() => markSignal('hero'));

  if (document.readyState === 'complete') {
    markSignal('load');
  } else {
    window.addEventListener('load', () => markSignal('load'), { once: true });
  }
}

/**
 * Draws the dial's tick marks (one every 10°, longer every 30°) directly into
 * the SVG so the markup stays readable.
 */
function buildTicks(group) {
  if (!group) return;

  const namespace = 'http://www.w3.org/2000/svg';
  const center = 50;
  const tickCount = 36;

  for (let index = 0; index < tickCount; index += 1) {
    const isMajor = index % 3 === 0;
    const angle = (index / tickCount) * 360 - 90;
    const radians = (angle * Math.PI) / 180;
    const outer = 49.4;
        const inner = isMajor ? 46.8 : 47.8;

    const line = document.createElementNS(namespace, 'line');
    line.setAttribute('x1', (center + Math.cos(radians) * inner).toFixed(2));
    line.setAttribute('y1', (center + Math.sin(radians) * inner).toFixed(2));
    line.setAttribute('x2', (center + Math.cos(radians) * outer).toFixed(2));
    line.setAttribute('y2', (center + Math.sin(radians) * outer).toFixed(2));
    line.setAttribute('class', isMajor ? 'gauge-tick gauge-tick--major' : 'gauge-tick');
    group.appendChild(line);
  }
}

/**
 * Fetches and decodes an image, resolving either way so a missing asset never
 * blocks the counter.
 */
function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    const finish = () => {
      if (image.decode) {
        image.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    image.src = src;
    if (image.complete) {
      finish();
    } else {
      image.onload = finish;
      image.onerror = resolve;
    }
  });
}
