/**
 * Header and Navigation Component
 */
export function initHeader() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.header__mobile-toggle');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-link');

  if (!header) return;

  // Scroll detection for header backdrop
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active link based on current path
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/') || '/';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize path comparison
    const isHome = (href === '/' || href === '/index.html' || href === './index.html') && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '');
    const isMatch = isHome || (href !== '/' && currentPath.includes(href.replace(/^\.\//, '')));
    
    if (isMatch) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    const closeMenu = () => {
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      header.classList.remove('is-menu-open');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      mobileToggle.classList.toggle('is-active', newState);
      mobileToggle.setAttribute('aria-expanded', String(newState));
      mobileMenu.classList.toggle('is-open', newState);
      header.classList.toggle('is-menu-open', newState);

      if (newState) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a, button').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Reset when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    }, { passive: true });
  }
}
