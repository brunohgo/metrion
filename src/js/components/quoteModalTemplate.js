/**
 * Canonical quote modal markup.
 *
 * Shared by every page so service pages (which previously had no modal)
 * and pages with incomplete legacy modals get the same functional form.
 * The `data-lenis-prevent` attribute is essential: without it the Lenis
 * smooth-scroll instance swallows wheel events and the card cannot scroll.
 */
export const QUOTE_MODAL_MARKUP = `
<div class="modal" id="quote-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
  <div class="modal__backdrop"></div>
  <div class="modal__card" data-lenis-prevent tabindex="-1">
    <button type="button" class="modal__close" aria-label="Fechar Modal">&times;</button>

    <div class="mb-6">
      <span class="text-xs font-mono font-bold text-[#35E0E8] uppercase tracking-wider">Formulário de Engenharia</span>
      <h3 id="modal-title" class="text-2xl font-bold font-heading text-white mt-1">Solicitar Orçamento Técnico</h3>
      <p class="text-xs text-[#93A4B5] mt-1">
        Indique as características dos instrumentos a calibrar ou qualificar.
      </p>
    </div>

    <form id="quote-form" novalidate>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label" for="q-name">Nome Completo *</label>
          <input type="text" id="q-name" name="name" class="form-input" placeholder="Ex.: Eng. Rui Silva" autocomplete="name" required>
          <div id="error-name" class="form-error"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="q-company">Empresa / Organização *</label>
          <input type="text" id="q-company" name="company" class="form-input" placeholder="Ex.: Indústrias Lda." autocomplete="organization" required>
          <div id="error-company" class="form-error"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label" for="q-email">Email Corporativo *</label>
          <input type="email" id="q-email" name="email" class="form-input" placeholder="rui.silva@empresa.pt" autocomplete="email" required>
          <div id="error-email" class="form-error"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="q-phone">Telefone / Contacto</label>
          <input type="tel" id="q-phone" name="phone" class="form-input" placeholder="+351 910 000 000" autocomplete="tel">
          <div id="error-phone" class="form-error"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label" for="q-service">Serviço Pretendido *</label>
          <select id="q-service" name="service" class="form-select" required>
            <option value="">Selecione uma especialidade...</option>
            <option value="calibracao">Calibração de Instrumentos</option>
            <option value="manutencao">Manutenção &amp; Ajuste</option>
            <option value="qualificacao-termica">Qualificação Térmica</option>
            <option value="gestao-calibracoes">Gestão do Parque Metrológico</option>
            <option value="rastreabilidade">Rastreabilidade Metrológica</option>
            <option value="auditorias">Apoio a Auditorias</option>
          </select>
          <div id="error-service" class="form-error"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="q-quantity">Quantidade de Instrumentos *</label>
          <input type="number" id="q-quantity" name="quantity" min="1" value="1" class="form-input" inputmode="numeric" required>
          <div id="error-quantity" class="form-error"></div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="q-equipment">Tipo / Modelo do Equipamento *</label>
        <input type="text" id="q-equipment" name="equipment" class="form-input" placeholder="Ex.: Manómetro digital 0-100 bar / Autoclave industrial 120L" required>
        <div id="error-equipment" class="form-error"></div>
      </div>

      <div class="form-group">
        <label class="form-label" for="q-desc">Descrição das Necessidades &amp; Tolerâncias</label>
        <textarea id="q-desc" name="description" class="form-textarea" placeholder="Indique pontos de ensaio desejados, tolerância de aceitação ou norma interna aplicável..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="quote-file">Upload de Caderno de Encargos / Ficha Técnica (Opcional)</label>
        <div class="border border-dashed border-[#2F80ED]/30 rounded-xl p-4 text-center hover:border-[#35E0E8]/60 transition-colors bg-[#07111F]/40 cursor-pointer">
          <input type="file" id="quote-file" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx">
          <label for="quote-file" class="cursor-pointer block text-xs text-[#93A4B5]">
            <span class="text-[#35E0E8] font-semibold">Clique para anexar</span> ficheiro PDF ou Excel (máx. 10MB)
          </label>
          <div id="quote-file-name" class="text-xs text-white font-mono mt-2 hidden"></div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-checkbox">
          <input type="checkbox" name="consent" required>
          <span class="form-checkbox-label">
            Autorizo o tratamento dos dados recolhidos para efeitos de elaboração e resposta à proposta comercial, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD). *
          </span>
        </label>
        <div id="error-consent" class="form-error"></div>
      </div>

      <div id="quote-feedback"></div>

      <div class="pt-2">
        <button type="submit" class="btn btn--primary w-full justify-center">
          Submeter Pedido de Orçamento
        </button>
      </div>
    </form>
  </div>
</div>
`;

/**
 * Returns the quote modal, creating it when absent and replacing legacy
 * modals that do not contain the full set of fields required by validation.
 */
export function ensureQuoteModal() {
  if (!document.body) return null;

  let modal = document.querySelector('#quote-modal');

  if (modal) {
    const hasRequiredFields = modal.querySelector('[name="name"]') &&
      modal.querySelector('[name="company"]') &&
      modal.querySelector('[name="email"]') &&
      modal.querySelector('[name="service"]') &&
      modal.querySelector('[name="quantity"]') &&
      modal.querySelector('[name="equipment"]') &&
      modal.querySelector('[name="consent"]');

    if (!hasRequiredFields) {
      modal.remove();
      modal = null;
    }
  }

  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', QUOTE_MODAL_MARKUP);
    modal = document.getElementById('quote-modal');
  }

  return modal;
}
