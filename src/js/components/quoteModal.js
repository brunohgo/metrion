import { validateQuoteForm } from '../utils/validation.js';
import { showToast } from '../utils/toast.js';

/**
 * Quote Request Modal & Interactive Demonstration Form Handler
 */
export function initQuoteModal() {
  const modal = document.querySelector('#quote-modal');
  const openButtons = document.querySelectorAll('.btn-open-quote');
  const closeButton = modal ? modal.querySelector('.modal__close') : null;
  const backdrop = modal ? modal.querySelector('.modal__backdrop') : null;
  const form = modal ? modal.querySelector('#quote-form') : null;
  const fileInput = modal ? modal.querySelector('#quote-file') : null;
  const fileNameDisplay = modal ? modal.querySelector('#quote-file-name') : null;
  const feedbackContainer = modal ? modal.querySelector('#quote-feedback') : null;

  if (!modal) return;

  const openModal = (prefilledService = null) => {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    if (prefilledService && form) {
      const serviceSelect = form.querySelector('[name="service"]');
      if (serviceSelect) serviceSelect.value = prefilledService;
    }

    // Focus first input
    const firstInput = modal.querySelector('input, select');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.service || null;
      openModal(service);
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

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
          feedbackContainer.innerHTML = `
            <div class="p-4 rounded-xl bg-blue-950/60 border border-cyan-400/30 text-white text-sm my-4">
              <div class="flex items-start gap-3">
                <span class="text-cyan-400 text-xl font-bold">✓</span>
                <div>
                  <h4 class="font-bold text-cyan-300 mb-1">Pedido Submetido com Sucesso</h4>
                  <p class="text-gray-300 text-xs leading-relaxed">
                    Agradecemos o seu contacto. A nossa equipa de engenharia metrológica recebeu a sua solicitação para <strong>${formData.equipment}</strong> (${formData.quantity} un.) e enviará a respetiva proposta técnica e comercial no prazo de 24 horas úteis.
                  </p>
                </div>
              </div>
            </div>
          `;
        }

        // Reset inputs except service
        form.reset();
        showToast('Pedido de cotação submetido com sucesso. Responderemos em 24h úteis.', 'success');
      }, 700);
    });
  }
}
