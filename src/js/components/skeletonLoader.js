/**
 * Skeleton Shimmer Placeholder System for Homepage Media
 * Ensures smooth visual transitions with zero blank pop-in
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

    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });
}
