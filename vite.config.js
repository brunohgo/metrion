import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

const rootDir = import.meta.dirname || process.cwd();

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
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
