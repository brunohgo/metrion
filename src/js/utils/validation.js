/**
 * Form Validation Utilities for Metrology Quote Requests (pt-PT)
 */

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePhonePT(phone) {
  if (!phone) return true; // Optional or validate if provided
  // Portuguese phone formats (+351 9xx xxx xxx or 2xx xxx xxx, etc.)
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return cleaned.length >= 9 && cleaned.length <= 15;
}

export function validateQuoteForm(formData) {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'Por favor, indique o seu nome completo (mínimo 3 caracteres).';
  }

  if (!formData.company || formData.company.trim().length < 2) {
    errors.company = 'Por favor, indique a designação da sua empresa ou organização.';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Por favor, introduza um endereço de email válido.';
  }

  if (!formData.service) {
    errors.service = 'Por favor, selecione o tipo de serviço pretendido.';
  }

  if (!formData.equipment || formData.equipment.trim().length < 2) {
    errors.equipment = 'Por favor, especifique o tipo ou modelo de equipamento.';
  }

  if (!formData.quantity || parseInt(formData.quantity, 10) < 1) {
    errors.quantity = 'A quantidade de instrumentos deve ser igual ou superior a 1.';
  }

  if (!formData.consent) {
    errors.consent = 'É obrigatório aceitar o tratamento de dados no âmbito do pedido de orçamento.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
