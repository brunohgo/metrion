import { validateQuoteForm } from '../utils/validation.js';
import { showToast } from '../utils/toast.js';
import { ensureQuoteModal } from './quoteModalTemplate.js';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[char]));

/**
 * Quote Request Modal & Interactive Demonstration Form Handler
 */
export function initQuoteModal() {
  const modal = ensureQuoteModal();
  if (!modal) return;

  const closeButton = modal.querySelector('.modal__close');
  const backdrop = modal.querySelector('.modal__backdrop');
  const card = modal.querySelector('.modal__card');
  const form = modal.querySelector('#quote-form');
  const fileInput = modal.querySelector('#quote-file');
  const fileNameDisplay = modal.querySelector('#quote-file-name');
  const feedbackContainer = modal.querySelector('#quote-feedback');

  // Also covers the homepage modal, which keeps its own markup.
  if (card && !card.hasAttribute('data-lenis-prevent')) {
    card.setAttribute('data-lenis-prevent', '');
  }
  if (card && !card.hasAttribute('tabindex')) {
    card.setAttribute('tabindex', '-1');
  }

  let isOpen = false;
  let lastFocusedElement = null;

  const getFocusableElements = () => Array.from(
    modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null);

  const openModal = (prefilledService = null) => {
    if (isOpen) {
      if (prefilledService && form) {
        const serviceSelect = form.querySelector('[name="service"]');
        if (serviceSelect) serviceSelect.value = prefilledService;
      }
      return;
    }

    isOpen = true;
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');

    // Lock the document and suspend Lenis while the modal is open.
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('mp:modal-open'));

    if (prefilledService && form) {
      const serviceSelect = form.querySelector('[name="service"]');
      if (serviceSelect) serviceSelect.value = prefilledService;
    }

    // Always start at the top of the form.
    if (card) card.scrollTop = 0;

    setTimeout(() => {
      if (!isOpen) return;
      const firstInput = form ? form.querySelector('input:not([type="hidden"]), select') : null;
      if (firstInput) {
        firstInput.focus({ preventScroll: true });
      } else if (card) {
        card.focus({ preventScroll: true });
      }
    }, 100);
  };

  const closeModal = () => {
    if (!isOpen) return;

    isOpen = false;
    modal.classList.remove('is-active');

    // Move focus out before hiding the dialog from assistive technologies.
    if (document.activeElement && modal.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('mp:modal-close'));

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  // Event delegation keeps dynamically rendered buttons (e.g. article CTAs)
  // working without re-binding after each render.
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-open-quote');
    if (!trigger) return;
    e.preventDefault();
    openModal(trigger.dataset.service || null);
  });

  // Allows other components to open the form programmatically.
  document.addEventListener('mp:open-quote', (e) => {
    openModal(e.detail && e.detail.service ? e.detail.service : null);
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Escape closes the modal; Tab is trapped inside the dialog.
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (!focusable.length) {
      e.preventDefault();
      if (card) card.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Clear a field error as soon as the user corrects it.
  if (form) {
    form.addEventListener('input', (e) => {
      const field = e.target;
      if (!field.name) return;
      field.classList.remove('border-red-500');
      const errEl = form.querySelector(`#error-${field.name}`);
      if (errEl) errEl.textContent = '';
    });
  }

  // File upload display
  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        fileNameDisplay.textContent = `Ficheiro selecionado: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024).toFixed(1)} KB)`;
        fileNameDisplay.classList.remove('hidden');
      } else {
        fileNameDisplay.textContent = '';
        fileNameDisplay.classList.add('hidden');
      }
    });
  }

  // Form submission handling
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous error states
      form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
      form.querySelectorAll('.form-input, .form-select').forEach((el) => el.classList.remove('border-red-500'));
      if (feedbackContainer) feedbackContainer.innerHTML = '';

      const formData = {
        name: form.querySelector('[name="name"]')?.value || '',
        company: form.querySelector('[name="company"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        phone: form.querySelector('[name="phone"]')?.value || '',
        service: form.querySelector('[name="service"]')?.value || '',
        equipment: form.querySelector('[name="equipment"]')?.value || '',
        quantity: form.querySelector('[name="quantity"]')?.value || '1',
        description: form.querySelector('[name="description"]')?.value || '',
        consent: form.querySelector('[name="consent"]')?.checked || false,
      };

      const result = validateQuoteForm(formData);

      if (!result.isValid) {
        // Highlight errors
        Object.entries(result.errors).forEach(([field, msg]) => {
          const input = form.querySelector(`[name="${field}"]`);
          const errEl = form.querySelector(`#error-${field}`);
          if (input) input.classList.add('border-red-500');
          if (errEl) errEl.textContent = msg;
        });

        // Bring the first invalid field into view inside the modal.
        const firstInvalid = form.querySelector('.border-red-500');
        if (firstInvalid) {
          firstInvalid.focus({ preventScroll: true });
          firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        return;
      }

      // Show simulated loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          A validar dados metrológicos...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Render transparent demonstration alert
        if (feedbackContainer) {
          const quantity = parseInt(formData.quantity, 10) || 1;
          feedbackContainer.innerHTML = `
            <div class="p-4 rounded-xl bg-blue-950/60 border border-cyan-400/30 text-white text-sm my-4">
              <div class="flex items-start gap-3">
                <span class="text-cyan-400 text-xl font-bold">✓</span>
                <div>
                  <h4 class="font-bold text-cyan-300 mb-1">Pedido Submetido com Sucesso</h4>
                  <p class="text-gray-300 text-xs leading-relaxed">
                    Agradecemos o seu contacto. A nossa equipa de engenharia metrológica recebeu a sua solicitação para <strong>${escapeHtml(formData.equipment)}</strong> (${quantity} un.) e enviará a respetiva proposta técnica e comercial no prazo de 24 horas úteis.
                  </p>
                </div>
              </div>
            </div>
          `;

          // Keep the confirmation visible without scrolling the page behind.
          feedbackContainer.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        // Reset inputs but keep the service the user came for.
        const selectedService = form.querySelector('[name="service"]')?.value || '';
        form.reset();
        const serviceSelect = form.querySelector('[name="service"]');
        if (serviceSelect && selectedService) serviceSelect.value = selectedService;

        if (fileNameDisplay) {
          fileNameDisplay.textContent = '';
          fileNameDisplay.classList.add('hidden');
        }

        showToast('Pedido de cotação submetido com sucesso. Responderemos em 24h úteis.', 'success');
      }, 700);
    });
  }
}
