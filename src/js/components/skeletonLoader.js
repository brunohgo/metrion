/**
 * Skeleton Placeholder System for Homepage Media
 *
 * Progressive enhancement: the media is ALWAYS rendered by the browser.
 * This module only stops the shimmer overlay once the bytes have arrived,
 * so a slow connection never leaves an invisible (blank) area on screen.
 */
export function initSkeletonPlaceholders() {
  const skeletonBoxes = document.querySelectorAll('.skeleton-box');
  if (!skeletonBoxes.length) return;

  skeletonBoxes.forEach((box) => {
    const img = box.querySelector('img');
    if (!img) return;

    const markLoaded = () => {
      box.classList.add('is-loaded');
      img.classList.add('is-loaded');
    };

    // Already decoded (cached or eager) — stop the shimmer right away.
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
      return;
    }

    // `loading="lazy"` images are not fetched until they approach the
    // viewport, so `complete` is false and the load event fires late.
    // Listening for both keeps the shimmer honest without blocking content.
    img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', markLoaded, { once: true });
  });
}
