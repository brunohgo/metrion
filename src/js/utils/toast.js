/**
 * Floating Toast Notification System
 */
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  
  const colors = {
    info: 'border-cyan-400/40 bg-[#242424]/95 text-cyan-300',
    success: 'border-emerald-400/40 bg-[#242424]/95 text-emerald-300',
    warning: 'border-amber-400/40 bg-[#242424]/95 text-amber-300',
    error: 'border-red-400/40 bg-[#242424]/95 text-red-300',
  };

  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕',
  };

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 text-xs font-mono ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <span class="text-base font-bold">${icons[type] || '•'}</span>
    <span class="text-white font-medium">${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
