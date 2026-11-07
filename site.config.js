/**
 * Configuração do site — ponto único de verdade.
 *
 * Tudo o que depende do domínio final é injectado no build a partir daqui:
 *  - tags <link rel="canonical"> e JSON-LD (via %VITE_SITE_URL% no HTML)
 *  - sitemap.xml e robots.txt (via plugin em vite.config.js)
 *  - src/config/company.js (via import.meta.env)
 *
 * Para mudar de domínio: alterar este ficheiro e voltar a fazer o build.
 * Nenhum outro ficheiro precisa de ser tocado.
 */
export default {
  // URL pública do site (sem barra final). Usada nas tags SEO.
  url: 'https://www.exemplo.invalid',

  // Domínio sem esquema. Usado em mailto:, canonical e no sitemap.
  domain: 'exemplo.invalid',

  // Email de contacto publicado no site.
  contactEmail: 'contacto@exemplo.invalid',
};
