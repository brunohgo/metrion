# MetriPrecision — Engenharia de Precisão & Metrologia em Portugal

Website empresarial de elevado padrão visual, cinematográfico, responsivo e interativo para serviços especializados de **calibração metrológica de instrumentos de medição**, **manutenção técnica** e **qualificação térmica industrial** em Portugal.

Conceito criativo: **PRECISION ENGINEERING — THE ART OF ACCURACY**  
Língua e mercado-alvo: **Português Europeu (pt-PT)**

---

## 🔬 Destaques do Projeto

- **Direção de Arte Premium Industrial**: Paleta cromática rigorosa (`#07111F`, `#0C2036`, `#2F80ED`, `#35E0E8`), tipografia técnica refinada (*Space Grotesk*, *Inter*, *Manrope*), glassmorphism subtil e iluminação de laboratório de alta precisão.
- **Hero Cinematográfica Imersiva**: Efeito de revelação em máscara, linha laser horizontal animada, parallax reativo ao ponteiro do rato, leitura micrométrica digital em tempo real com oscilação submicrométrica e ScrollTrigger scrub sincronizado.
- **Preloader com Manómetro SVG**: Animação SVG de instrumento de pressão com anel de progresso real e agulha indicadora, com saída suave e garantia de não bloqueio (failsafe).
- **Storytelling de Engenharia com Pinned Scroll**: Secção com painel técnico interativo fixo que atualiza especificações, grandezas e anéis de incerteza à medida que o utilizador percorre as 5 fases do ciclo metrológico.
- **Explorador Interativo de Equipamentos**: Filtro dinâmico por grandezas físicas (*Dimensional*, *Pressão*, *Temperatura & Humidade*, *Massa & Força*, *Grandeza Elétrica*).
- **Rigor Normativo Português & Europeu**:
  - **NP EN ISO/IEC 17025**: Requisitos gerais de competência para laboratórios de ensaio e calibração.
  - **Decreto-Lei n.º 29/2022** e **Portaria n.º 211/2022**: Regime geral e regulamento do controlo metrológico legal em Portugal.
  - **Regulamento (CE) n.º 765/2008**: Enquadramento europeu da acreditação (IPAC).
  - **EudraLex Volume 4, Anexo 15**: Qualificação e validação no contexto GMP farmacêutico.
  - **ISO 17665:2024**: Esterilização por calor húmido de dispositivos médicos.
  - **RGPD (Regulamento UE 2016/679)** e **Lei n.º 58/2019**: Proteção de dados pessoais.
  - **Lei n.º 41/2004**: Privacidade nas comunicações eletrónicas e cookies.
- **Modal de Orçamento com Modo de Demonstração Honesto**: Validação em tempo real em JavaScript, indicador de carregamento e mensagem explícita e transparente indicando que nenhuma transmissão para backend de produção é efetuada nesta fase.
- **Banner de Consentimento de Cookies**: Gestão de consentimento estrito vs analítico com persistência local.
- **Lenis Smooth Scroll**: Rolagem suave de luxo sincronizada nativamente com o `ScrollTrigger` do GSAP.

---

## 📁 Estrutura do Código-Fonte

```
precision-metrology-pt/
├── public/
│   ├── images/                     # Recursos fotográficos industriais gerados
│   │   ├── hero-laboratory.jpg     # Hero do laboratório
│   │   ├── calibration-service.jpg # Técnico em bancada de calibração
│   │   ├── thermal-qualification.jpg # Autoclave e sondas térmicas
│   │   ├── about-laboratory.jpg    # Instalações do laboratório
│   │   ├── maintenance-service.jpg # Manutenção de precisão
│   │   └── cta-precision.jpg       # Macro de tambor micrométrico
│   ├── robots.txt                  # Diretivas para motores de busca
│   └── sitemap.xml                 # Mapa do website com todas as rotas
├── src/
│   ├── config/
│   │   └── company.js              # Configuração centralizada da empresa (demonstrativa)
│   ├── styles/
│   │   └── main.css                # Sistema de design tokens, Tailwind v4 e componentes
│   └── js/
│       ├── main.js                 # Ponto de entrada, Lenis e orquestrador GSAP
│       ├── animations/
│       │   ├── heroAnimation.js    # Sequência de entrada da Hero e parallax
│       │   └── scrollStorytelling.js # Storytelling com ScrollTrigger fixo
│       ├── components/
│       │   ├── header.js           # Header dinâmico, menus e mobile drawer
│       │   ├── preloader.js        # Indicador SVG de manómetro e progresso
│       │   ├── equipmentExplorer.js # Filtro de equipamentos e grandezas
│       │   ├── faqAccordion.js     # Acordeão acessível ARIA
│       │   ├── quoteModal.js       # Modal interativo de pedido de proposta
│       │   ├── cookieBanner.js     # Banner de consentimento RGPD
│       │   └── backToTop.js        # Botão de retorno ao topo
│       └── utils/
│           └── validation.js       # Validação de formulários em pt-PT
├── servicos/
│   ├── calibracao.html             # Página do serviço de Calibração
│   ├── manutencao.html             # Página do serviço de Manutenção
│   ├── qualificacao-termica.html   # Página do serviço de Qualificação Térmica
│   ├── gestao-calibracoes.html     # Página de Gestão do Parque Instrumental
│   ├── rastreabilidade.html        # Página de Rastreabilidade Metrológica
│   └── auditorias.html             # Página de Apoio Técnico a Auditorias
├── index.html                      # Página principal (12 secções completas)
├── sobre.html                      # Página institucional e princípios éticos
├── contactos.html                  # Página de contactos e formulário alargado
├── privacidade.html                # Política de Privacidade (RGPD / Lei 58/2019)
├── cookies.html                    # Política de Cookies (Lei 41/2004)
├── 404.html                        # Página de erro 404 personalizada
├── vite.config.js                  # Configuração multi-página do Vite e Tailwind v4
└── package.json
```

---

## 🛠️ Tecnologias Utilizadas

- **Core**: HTML5 Semântico, CSS3 Moderno, JavaScript ES2022+ Modular.
- **Build Tool**: [Vite](https://vitejs.dev/) v8.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) com design system sob medida.
- **Motion**: [GSAP](https://greensock.com/gsap/) v3.15 com plugin [ScrollTrigger](https://greensock.com/scrolltrigger/).
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/).

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior.

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
npm run dev
```
O Vite iniciará o servidor local em `http://localhost:3000`.

### 3. Compilar para produção
```bash
npm run build
```
Os ficheiros estáticos otimizados serão gerados na diretoria `dist/`.

### 4. Testar a compilação de produção localmente
```bash
npm run preview
```

---

## ⚙️ Configuração Centralizada da Empresa

Todas as informações de identidade corporativa encontram-se isoladas em:
`src/config/company.js`

Antes do lançamento público, edite esse ficheiro para introduzir:
- `COMPANY.name`: Nome comercial definitivo.
- `COMPANY.legalName`: Razão social legal da empresa.
- `COMPANY.contact.email`: Endereço de correio eletrónico de produção.
- `COMPANY.contact.phone`: Contacto telefónico com indicativo nacional.
- `COMPANY.contact.address`: Morada fiscal e laboratorial em Portugal.
- `COMPANY.legal.nif`: Número de Identificação Fiscal português.

---

## 🧪 Qualidade, Acessibilidade e Performance

- **Acessibilidade (WCAG 2.2 AA)**: Navegação integral por teclado em modais, menus suspensos e acordeões com atributos ARIA adequados (`aria-expanded`, `aria-controls`, `aria-selected`).
- **Suporte a `prefers-reduced-motion`**: Desativação imediata de animações custosas, preloader encurtado e apresentação estática suave para utilizadores com sensibilidade a movimento.
- **Desempenho e Imagens Responsivas**: Fotografias industriais otimizadas com dimensões explícitas para prevenção de *Cumulative Layout Shift* (CLS).
- **Sem Dependências Desnecessárias**: Arquitetura leve em Vanilla JavaScript sem sobrecarga de frameworks monolíticos.
