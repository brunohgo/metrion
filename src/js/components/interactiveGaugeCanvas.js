/**
 * High-Precision Interactive Dial Gauge Canvas
 * Highly optimized with static dial plate caching and IntersectionObserver visibility pausing
 */
export function initInteractiveGauge(canvasId = 'hero-gauge-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Don't initialize on mobile or when hidden
  if (window.innerWidth <= 1024 || canvas.offsetParent === null) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let radius = 0;

  let targetAngle = 0;
  let currentAngle = 0;
  let isHovered = false;
  let isVisible = false;
  let rafId = null;

  // Offscreen pre-rendered static dial plate
  let offscreenCanvas = null;

  const renderStaticPlate = () => {
    if (width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width * dpr;
    offscreenCanvas.height = height * dpr;
    const offCtx = offscreenCanvas.getContext('2d');
    offCtx.scale(dpr, dpr);

    // 1. Outer Dark Dial Body
    const grad = offCtx.createRadialGradient(centerX, centerY, radius * 0.4, centerX, centerY, radius);
    grad.addColorStop(0, '#242424');
    grad.addColorStop(0.85, '#121212');
    grad.addColorStop(1, '#343434');

    offCtx.beginPath();
    offCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    offCtx.fillStyle = grad;
    offCtx.fill();
    offCtx.lineWidth = 2;
    offCtx.strokeStyle = 'rgba(255, 106, 0, 0.4)';
    offCtx.stroke();

    // Subtle inner glowing border
    offCtx.beginPath();
    offCtx.arc(centerX, centerY, radius * 0.94, 0, Math.PI * 2);
    offCtx.lineWidth = 1;
    offCtx.strokeStyle = 'rgba(255, 157, 61, 0.2)';
    offCtx.stroke();

    // 2. Graduation Ticks (60 divisions)
    const totalTicks = 60;
    for (let i = 0; i < totalTicks; i++) {
      const angle = (i / totalTicks) * Math.PI * 2 - Math.PI / 2;
      const isMajor = i % 5 === 0;
      const isSuperMajor = i % 15 === 0;

      const innerR = radius * (isSuperMajor ? 0.72 : isMajor ? 0.78 : 0.83);
      const outerR = radius * 0.89;

      const x1 = centerX + Math.cos(angle) * innerR;
      const y1 = centerY + Math.sin(angle) * innerR;
      const x2 = centerX + Math.cos(angle) * outerR;
      const y2 = centerY + Math.sin(angle) * outerR;

      offCtx.beginPath();
      offCtx.moveTo(x1, y1);
      offCtx.lineTo(x2, y2);
      offCtx.lineWidth = isSuperMajor ? 2.5 : isMajor ? 1.5 : 1;
      offCtx.strokeStyle = isSuperMajor ? '#ff9d3d' : isMajor ? '#ff6a00' : 'rgba(183, 178, 170, 0.4)';
      offCtx.stroke();

      // Numerical labels on major ticks
      if (isMajor) {
        const textR = radius * 0.65;
        const tx = centerX + Math.cos(angle) * textR;
        const ty = centerY + Math.sin(angle) * textR;
        offCtx.font = '700 9px monospace';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillStyle = isSuperMajor ? '#ff9d3d' : 'rgba(183, 178, 170, 0.8)';
        offCtx.fillText(String(i * 10), tx, ty);
      }
    }

    // 3. Dial Center Branding
    offCtx.font = '700 10px "Space Grotesk", sans-serif';
    offCtx.textAlign = 'center';
    offCtx.fillStyle = '#FFFFFF';
    offCtx.fillText('METRION', centerX, centerY - radius * 0.32);

    offCtx.font = '500 8px monospace';
    offCtx.fillStyle = '#ff9d3d';
    offCtx.fillText('0.001 mm / RES', centerX, centerY - radius * 0.2);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    centerX = width / 2;
    centerY = height / 2;
    radius = Math.min(centerX, centerY) * 0.88;

    renderStaticPlate();
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Mouse interaction
  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    targetAngle = Math.atan2(y, x) + Math.PI / 2;
    isHovered = true;
  };

  const onMouseLeave = () => {
    isHovered = false;
  };

  canvas.addEventListener('mousemove', onMouseMove, { passive: true });
  canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });

  // Render loop — only active when visible!
  let tickTime = 0;
  const draw = () => {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Inertia spring physics
    if (!isHovered && !prefersReduced) {
      tickTime += 0.02;
      targetAngle = Math.sin(tickTime) * 0.8 + Math.cos(tickTime * 0.5) * 0.4;
    }

    currentAngle += (targetAngle - currentAngle) * 0.08;

    // Fast copy of pre-rendered static dial plate
    if (offscreenCanvas) {
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);
    }

    // Indicator Needle
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle);

    // Needle body
    ctx.beginPath();
    ctx.moveTo(-2.5, 12);
    ctx.lineTo(2.5, 12);
    ctx.lineTo(1, -radius * 0.85);
    ctx.lineTo(-1, -radius * 0.85);
    ctx.closePath();
    ctx.fillStyle = '#ff9d3d';
    ctx.fill();

    // Counterweight tail
    ctx.beginPath();
    ctx.arc(0, 12, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6a00';
    ctx.fill();

    ctx.restore();

    // Center Pivot Cap
    ctx.beginPath();
    ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fffaf4';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#121212';
    ctx.fill();

    rafId = requestAnimationFrame(draw);
  };

  // Pause when offscreen with IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry && entry.isIntersecting) {
      if (!isVisible) {
        isVisible = true;
        if (width === 0) resize();
        rafId = requestAnimationFrame(draw);
      }
    } else {
      isVisible = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  }, { threshold: 0.05 });

  observer.observe(canvas);
}
