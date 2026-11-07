import gsap from 'gsap';

/**
 * Interactive Equipment & Physical Quantities Explorer
 * With professional skeleton loading state transitions
 */
export function initEquipmentExplorer() {
  const container = document.querySelector('.equipment-explorer');
  if (!container) return;

  const tabs = container.querySelectorAll('.equipment-tab');
  const cards = container.querySelectorAll('.equipment-card');
  const grid = container.querySelector('.equipment-grid');
  const countBadge = container.querySelector('#equipment-count');

  if (!tabs.length || !cards.length || !grid) return;

  // Create skeleton container
  let skeletonContainer = container.querySelector('.equipment-skeletons');
  if (!skeletonContainer) {
    skeletonContainer = document.createElement('div');
    skeletonContainer.className = 'equipment-skeletons hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5';
    for (let i = 0; i < 4; i++) {
      const sk = document.createElement('div');
      sk.className = 'p-6 rounded-2xl bg-[#242424]/50 border border-[#ff6a00]/10 flex flex-col justify-between h-[210px] relative overflow-hidden';
      sk.innerHTML = `
        <div>
          <div class="skeleton skeleton--text w-24 h-4 mb-3"></div>
          <div class="skeleton skeleton--title w-48 h-6 mb-3"></div>
          <div class="skeleton skeleton--text w-full h-3 mb-2"></div>
          <div class="skeleton skeleton--text w-3/4 h-3"></div>
        </div>
        <div class="pt-4 border-t border-[#343434] flex justify-between">
          <div class="skeleton skeleton--text w-20 h-3"></div>
          <div class="skeleton skeleton--text w-16 h-3"></div>
        </div>
      `;
      skeletonContainer.appendChild(sk);
    }
    grid.parentNode.insertBefore(skeletonContainer, grid);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;

      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      // 1. Show skeleton transition
      grid.classList.add('hidden');
      skeletonContainer.classList.remove('hidden');

      setTimeout(() => {
        // 2. Hide skeletons and reveal filtered cards smoothly
        skeletonContainer.classList.add('hidden');
        grid.classList.remove('hidden');

        let visibleCount = 0;
        cards.forEach((card) => {
          const category = card.dataset.category;
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            visibleCount++;
            card.style.display = 'flex';
            gsap.fromTo(card, 
              { opacity: 0, scale: 0.96, y: 12 },
              { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
          } else {
            card.style.display = 'none';
          }
        });

        if (countBadge) {
          countBadge.textContent = `${visibleCount} instrumentos listados`;
        }
      }, 350);
    });
  });
}
