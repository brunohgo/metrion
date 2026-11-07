import { showToast } from '../utils/toast.js';

/**
 * RGPD & ePrivacy Compliant Cookie Banner
 */
export function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  const storageKey = 'metrion_cookie_consent';
  const currentConsent = localStorage.getItem(storageKey);

  if (!currentConsent) {
    // Show after slight delay
    setTimeout(() => {
      banner.classList.add('is-visible');
    }, 1200);
  }

  const acceptBtn = banner.querySelector('#cookie-accept-all');
  const rejectBtn = banner.querySelector('#cookie-reject-optional');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(storageKey, JSON.stringify({
        necessary: true,
        analytics: true,
        date: new Date().toISOString(),
      }));
      banner.classList.remove('is-visible');
      showToast('Preferências de cookies guardadas: Todos autorizados.', 'info');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(storageKey, JSON.stringify({
        necessary: true,
        analytics: false,
        date: new Date().toISOString(),
      }));
      banner.classList.remove('is-visible');
      showToast('Preferências guardadas: Apenas cookies estritamente necessários.', 'info');
    });
  }
}
