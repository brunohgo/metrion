/**
 * Configuração centralizada da empresa.
 * Substituir todos os valores antes do lançamento.
 * Os dados marcados como "A DEFINIR" são demonstrativos.
 */
export const COMPANY = {
  name: 'Metrion',
  legalName: 'NOME_DA_EMPRESA, Lda.',
  tagline: 'Precisão que Transforma Resultados',
  description: 'Soluções especializadas em calibração, metrologia e qualificação térmica para organizações que exigem rigor, fiabilidade e controlo dos seus processos.',
  
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'contacto@metrion.pt',
    phone: '+351 210 000 000', // A DEFINIR — número real do laboratório em Lisboa
    phoneDisplay: '+351 210 000 000',
    whatsapp: null,
    address: {
      street: 'Rua das Indústrias, 123',
      city: 'Lisboa',
      postalCode: '1000-000',
      country: 'Portugal',
    },
  },

  legal: {
    nif: null, // A DEFINIR — NIF da empresa em Lisboa
    registoComercial: null, // A DEFINIR — registo comercial
  },

  social: {
    linkedin: null,
    instagram: null,
    facebook: null,
  },

  website: {
    // Injectados no build a partir de site.config.js — não editar aqui.
    url: import.meta.env.VITE_SITE_URL || 'https://www.exemplo.invalid',
    domain: import.meta.env.VITE_SITE_DOMAIN || 'exemplo.invalid',
  },

  // Horário demonstrativo
  schedule: {
    weekdays: 'Segunda a Sexta: 09:00 – 18:00',
    weekend: 'Encerrado',
  },
};

/**
 * Serviços oferecidos pela empresa.
 */
export const SERVICES = [
  {
    id: 'calibracao',
    title: 'Calibração de Instrumentos',
    shortTitle: 'Calibração',
    slug: '/servicos/calibracao.html',
    icon: 'calibration',
    description: 'Calibração de instrumentos de medição com rastreabilidade metrológica, garantindo a fiabilidade e conformidade dos seus resultados.',
    equipment: [
      'Balanças', 'Micrómetros', 'Paquímetros', 'Manómetros',
      'Termómetros', 'Termohigrómetros', 'Multímetros', 'Torquímetros',
      'Equipamentos de pressão', 'Instrumentos dimensionais',
    ],
  },
  {
    id: 'manutencao',
    title: 'Manutenção de Instrumentos',
    shortTitle: 'Manutenção',
    slug: '/servicos/manutencao.html',
    icon: 'maintenance',
    description: 'Diagnóstico, manutenção preventiva e corretiva de instrumentos de medição, prolongando a vida útil e assegurando o desempenho dos equipamentos.',
    equipment: [
      'Equipamentos de pressão', 'Instrumentos dimensionais',
      'Equipamentos elétricos', 'Termómetros digitais',
      'Balanças analíticas', 'Equipamentos de ensaio',
    ],
  },
  {
    id: 'qualificacao-termica',
    title: 'Qualificação Térmica',
    shortTitle: 'Qualificação Térmica',
    slug: '/servicos/qualificacao-termica.html',
    icon: 'thermal',
    description: 'Qualificação térmica de equipamentos com mapeamento de temperatura, garantindo a uniformidade e estabilidade nos processos térmicos.',
    equipment: [
      'Autoclaves', 'Estufas', 'Câmaras frigoríficas',
      'Incubadoras', 'Sistemas de armazenamento térmico',
      'Equipamentos de esterilização', 'Estufas de secagem',
    ],
  },
  {
    id: 'gestao-calibracoes',
    title: 'Gestão de Calibrações',
    shortTitle: 'Gestão',
    slug: '/servicos/gestao-calibracoes.html',
    icon: 'management',
    description: 'Gestão completa do ciclo de calibração dos seus instrumentos: inventário, planeamento, acompanhamento de prazos e análise de resultados.',
    equipment: [],
  },
  {
    id: 'rastreabilidade',
    title: 'Rastreabilidade Metrológica',
    shortTitle: 'Rastreabilidade',
    slug: '/servicos/rastreabilidade.html',
    icon: 'traceability',
    description: 'Garantia da cadeia de rastreabilidade metrológica, assegurando que os resultados de medição são referenciáveis a padrões reconhecidos.',
    equipment: [],
  },
  {
    id: 'auditorias',
    title: 'Apoio a Auditorias',
    shortTitle: 'Auditorias',
    slug: '/servicos/auditorias.html',
    icon: 'audit',
    description: 'Preparação documental, análise de conformidade e acompanhamento técnico para auditorias de sistemas de gestão e processos metrológicos.',
    equipment: [],
  },
];

/**
 * Setores de atividade (exemplificativos).
 */
export const SECTORS = [
  {
    id: 'industrial',
    title: 'Indústria',
    description: 'Controlo dimensional, pressão, temperatura e força em processos industriais.',
    icon: '⚙️',
  },
  {
    id: 'farmaceutico',
    title: 'Farmacêutico',
    description: 'Qualificação de equipamentos e calibração em ambientes regulados por boas práticas de fabrico.',
    icon: '💊',
  },
  {
    id: 'hospitalar',
    title: 'Hospitalar',
    description: 'Calibração e qualificação de equipamentos críticos em ambiente hospitalar.',
    icon: '🏥',
  },
  {
    id: 'alimentar',
    title: 'Alimentar',
    description: 'Monitorização de temperatura em cadeias de frio e processos térmicos.',
    icon: '🍽️',
  },
  {
    id: 'laboratorial',
    title: 'Laboratorial',
    description: 'Calibração de instrumentos de medição em laboratórios de ensaio e análise.',
    icon: '🔬',
  },
  {
    id: 'logistico',
    title: 'Logística e Distribuição',
    description: 'Monitorização e qualificação de condições de armazenamento e transporte.',
    icon: '📦',
  },
];

/**
 * Normas e referências regulamentares.
 * NOTA: Estas referências devem ser validadas por um consultor técnico antes da publicação.
 */
export const STANDARDS = [
  {
    id: 'iso17025',
    code: 'NP EN ISO/IEC 17025',
    title: 'Requisitos gerais de competência de laboratórios de ensaio e calibração',
    description: 'Define os requisitos para que os laboratórios demonstrem competência técnica e capacidade de produzir resultados válidos.',
    url: 'https://www.iso.org/standard/66912.html',
    category: 'metrologia',
  },
  {
    id: 'iso9001',
    code: 'ISO 9001',
    title: 'Sistemas de gestão da qualidade — Requisitos',
    description: 'Norma internacional para sistemas de gestão da qualidade, aplicável quando os processos de medição integram o sistema de gestão.',
    url: 'https://www.iso.org/standard/62085.html',
    category: 'qualidade',
  },
  {
    id: 'reg765',
    code: 'Regulamento (CE) n.º 765/2008',
    title: 'Enquadramento europeu da acreditação e fiscalização do mercado',
    description: 'Estabelece o enquadramento europeu para acreditação de organismos de avaliação da conformidade.',
    url: 'https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=celex%3A32008R0765',
    category: 'acreditacao',
  },
  {
    id: 'dl29_2022',
    code: 'Decreto-Lei n.º 29/2022, de 7 de abril',
    title: 'Regime geral do controlo metrológico legal',
    description: 'Estabelece o regime jurídico do controlo metrológico legal de instrumentos de medição em Portugal.',
    url: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/29-2022-181984283',
    category: 'metrologia-legal',
  },
  {
    id: 'port211_2022',
    code: 'Portaria n.º 211/2022, de 23 de agosto',
    title: 'Regulamento geral do controlo metrológico legal',
    description: 'Regulamenta o Decreto-Lei n.º 29/2022, definindo os procedimentos e requisitos técnicos aplicáveis.',
    url: 'https://diariodarepublica.pt/dr/detalhe/portaria/211-2022-188497607',
    category: 'metrologia-legal',
  },
  {
    id: 'iso17665',
    code: 'ISO 17665:2024',
    title: 'Esterilização de produtos para cuidados de saúde — Calor húmido',
    description: 'Aplicável quando são realizados ensaios de qualificação de processos de esterilização por calor húmido.',
    url: 'https://www.iso.org/standard/86218.html',
    category: 'qualificacao',
  },
  {
    id: 'eudralex',
    code: 'EudraLex Volume 4, Anexo 15',
    title: 'Qualificação e Validação (GMP)',
    description: 'Diretrizes europeias de boas práticas de fabrico relativas à qualificação de equipamentos e validação de processos no setor farmacêutico.',
    url: 'https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en',
    category: 'qualificacao',
  },
  {
    id: 'rgpd',
    code: 'Regulamento (UE) 2016/679 — RGPD',
    title: 'Regulamento Geral sobre a Proteção de Dados',
    description: 'Regulamento europeu relativo à proteção das pessoas singulares no que diz respeito ao tratamento de dados pessoais.',
    url: 'https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX%3A32016R0679',
    category: 'privacidade',
  },
  {
    id: 'lei58_2019',
    code: 'Lei n.º 58/2019',
    title: 'Execução do RGPD em Portugal',
    description: 'Assegura a execução na ordem jurídica portuguesa do Regulamento Geral sobre a Proteção de Dados.',
    url: 'https://diariodarepublica.pt/dr/detalhe/lei/58-2019-123815982',
    category: 'privacidade',
  },
];

/**
 * Perguntas frequentes.
 */
export const FAQ = [
  {
    question: 'O que é a calibração de um instrumento de medição?',
    answer: 'A calibração é o conjunto de operações que estabelece, sob condições especificadas, a relação entre os valores indicados por um instrumento de medição e os valores correspondentes de uma grandeza, realizados por um padrão de referência. O resultado da calibração permite atribuir valores às indicações do instrumento e determinar a incerteza de medição associada.',
  },
  {
    question: 'Qual a diferença entre calibração e verificação metrológica legal?',
    answer: 'A calibração determina os erros e a incerteza de medição de um instrumento, sem decidir sobre a sua conformidade. A verificação metrológica legal é um procedimento regulamentar que avalia se um instrumento cumpre os erros máximos admissíveis definidos na legislação, sendo obrigatória para determinados instrumentos utilizados em transações comerciais e outras aplicações legalmente reguladas.',
  },
  {
    question: 'Com que periodicidade devo calibrar os meus instrumentos?',
    answer: 'A periodicidade de calibração depende de vários fatores: frequência de utilização, condições ambientais, requisitos do processo, criticidade da medição e histórico de desempenho do instrumento. Não existe uma periodicidade universal — cada organização deve definir os seus intervalos com base numa análise de risco e nos resultados anteriores.',
  },
  {
    question: 'O que é a rastreabilidade metrológica?',
    answer: 'Segundo o Vocabulário Internacional de Metrologia (VIM), a rastreabilidade metrológica é a propriedade de um resultado de medição pela qual este pode ser relacionado a uma referência, através de uma cadeia ininterrupta e documentada de calibrações, cada uma contribuindo para a incerteza de medição.',
  },
  {
    question: 'Em que consiste a qualificação térmica?',
    answer: 'A qualificação térmica envolve um conjunto de ensaios realizados em equipamentos que operam com temperatura controlada (autoclaves, estufas, câmaras frigoríficas, entre outros), com o objetivo de demonstrar que o equipamento cumpre os critérios de aceitação definidos para uniformidade, estabilidade e distribuição de temperatura.',
  },
  {
    question: 'Que normas são aplicáveis à calibração em Portugal?',
    answer: 'A norma de referência para competência de laboratórios de calibração é a NP EN ISO/IEC 17025. Para instrumentos sujeitos a controlo metrológico legal, aplica-se o Decreto-Lei n.º 29/2022 e a Portaria n.º 211/2022. Em setores específicos, como o farmacêutico, podem ser relevantes as boas práticas de fabrico (EudraLex Volume 4, Anexo 15).',
  },
  {
    question: 'Como posso solicitar um orçamento?',
    answer: 'Pode contactar-nos através do formulário disponível no website, indicando o tipo de serviço pretendido, os equipamentos envolvidos e uma breve descrição das necessidades. Responderemos com uma proposta personalizada.',
  },
  {
    question: 'Qual a diferença entre manutenção e calibração?',
    answer: 'A manutenção envolve operações de diagnóstico, limpeza, ajuste, reparação e substituição de componentes de um instrumento. A calibração é uma operação metrológica que determina os erros do instrumento. Após uma intervenção de manutenção que possa afetar o desempenho metrológico, recomenda-se a realização de uma nova calibração.',
  },
];
