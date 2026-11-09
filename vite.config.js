import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import site from './site.config.js';

const rootDir = import.meta.dirname || process.cwd();

/**
 * Publica os ficheiros SEO (sitemap.xml e robots.txt) com o domínio real.
 * Vivem em src/seo/ como modelos; o domínio é substituido no build, a partir
 * de site.config.js, para que trocar de domínio não exija editar HTML à mão.
 */
function seoFilesPlugin() {
  return {
    name: 'metrion-seo-files',
    generateBundle() {
      for (const [file, source] of [
        ['sitemap.xml', resolve(rootDir, 'src/seo/sitemap.xml')],
        ['robots.txt', resolve(rootDir, 'src/seo/robots.txt')],
      ]) {
        const template = readFileSync(source, 'utf8');
        this.emitFile({
          type: 'asset',
          fileName: file,
          source: template.replaceAll('{{SITE_URL}}', site.url),
        });
      }
    },
  };
}

/**
 * Substitui os placeholders %VITE_SITE_URL%, %VITE_SITE_DOMAIN% e
 * %VITE_CONTACT_EMAIL% nos ficheiros HTML emitidos pelo build, para que o
 * domínio real seja injectado nas tags SEO (canonical, JSON-LD, Open Graph).
 */
function siteUrlHtmlPlugin() {
  return {
    name: 'metrion-site-url-html',
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!fileName.endsWith('.html')) continue;
        const replace = (str) =>
          str
            .replaceAll('%VITE_SITE_URL%', site.url)
            .replaceAll('%VITE_SITE_DOMAIN%', site.domain)
            .replaceAll('%VITE_CONTACT_EMAIL%', site.contactEmail);
        if (chunk.type === 'asset') {
          chunk.source = replace(chunk.source);
        } else if (chunk.type === 'chunk') {
          chunk.code = replace(chunk.code);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    seoFilesPlugin(),
    siteUrlHtmlPlugin(),
  ],
  // Valores injectados no HTML (%VITE_SITE_URL%) e no JS
  // (import.meta.env.VITE_SITE_URL) durante o build.
  // `define` é usado em vez de `env` porque o Vite 8 só recolhe o `env` a
  // partir dos ficheiros .env — e o `define` é também lido pelo hook que
  // substitui as variáveis %VITE_*% no HTML.
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(site.url),
    'import.meta.env.VITE_SITE_DOMAIN': JSON.stringify(site.domain),
    'import.meta.env.VITE_CONTACT_EMAIL': JSON.stringify(site.contactEmail),
  },
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        about: resolve(rootDir, 'sobre.html'),
        calibracao: resolve(rootDir, 'servicos/calibracao.html'),
        manutencao: resolve(rootDir, 'servicos/manutencao.html'),
        qualificacao: resolve(rootDir, 'servicos/qualificacao-termica.html'),
        gestao: resolve(rootDir, 'servicos/gestao-calibracoes.html'),
        rastreabilidade: resolve(rootDir, 'servicos/rastreabilidade.html'),
        auditorias: resolve(rootDir, 'servicos/auditorias.html'),
        contactos: resolve(rootDir, 'contactos.html'),
        artigos: resolve(rootDir, 'artigos.html'),
        artigoIncerteza: resolve(rootDir, 'artigos/incerteza-medicao-tolerancia.html'),
        artigoAutoclaves: resolve(rootDir, 'artigos/qualificacao-termica-autoclaves.html'),
        artigoLegal: resolve(rootDir, 'artigos/calibracao-vs-verificacao-legal.html'),
        artigoIntervalos: resolve(rootDir, 'artigos/intervalos-calibracao-oiml-d10.html'),
        privacidade: resolve(rootDir, 'privacidade.html'),
        cookies: resolve(rootDir, 'cookies.html'),
        notfound: resolve(rootDir, '404.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
