/**
 * Back to top floating button
 */
export function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 450) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
