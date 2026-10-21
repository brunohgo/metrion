import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned Engineering Process Storytelling with dynamic interactive blueprint state
 */
export function initScrollStorytelling() {
  const section = document.querySelector('.storytelling');
  if (!section) return;

  const steps = section.querySelectorAll('.storytelling__step');
  const visualCard = section.querySelector('.storytelling__visual-card');
  const stepBadge = section.querySelector('#storytelling-step-badge');
  const stepName = section.querySelector('#storytelling-step-name');
  const stepSpec = section.querySelector('#storytelling-step-spec');
  const stepStatus = section.querySelector('#storytelling-step-status');
  const gaugePath = section.querySelector('#storytelling-gauge-path');

  if (!steps.length) return;

  const stepData = [
    {
      badge: 'ETAPA 01 / 05',
      name: 'Triagem & Diagnóstico Inicial',
      spec: 'Inspeção visual, integridade mecânica e verificação de desvio preliminar.',
      status: 'RECEÇÃO E REGISTO',
      dashoffset: 200,
    },
    {
      badge: 'ETAPA 02 / 05',
      name: 'Calibração em Ambiente Controlado',
      spec: 'Controlo estrito de temperatura (20°C ± 1°C) e humidade relativa conforme NP EN ISO/IEC 17025.',
      status: 'ENSAIO METROLÓGICO',
      dashoffset: 150,
    },
    {
      badge: 'ETAPA 03 / 05',
      name: 'Determinação da Incerteza (GUM)',
      spec: 'Avaliação estatística tipo A e tipo B, estimando a incerteza expandida com k = 2 (95,45%).',
      status: 'CÁLCULO ESTATÍSTICO',
      dashoffset: 95,
    },
    {
      badge: 'ETAPA 04 / 05',
      name: 'Emissão de Relatório e Certificado',
      spec: 'Documento técnico com cadeia ininterrupta de rastreabilidade a padrões primários.',
      status: 'DOCUMENTAÇÃO EMITIDA',
      dashoffset: 40,
    },
    {
      badge: 'ETAPA 05 / 05',
      name: 'Monitorização & Gestão de Prazos',
      spec: 'Registo em histórico metrológico com alertas automáticos para reapreciação e recalibração.',
      status: 'CICLO FECHADO',
      dashoffset: 0,
    },
  ];

  const updateVisualState = (index) => {
    const data = stepData[index];
    if (!data) return;

    if (stepBadge) stepBadge.textContent = data.badge;
    if (stepName) stepName.textContent = data.name;
    if (stepSpec) stepSpec.textContent = data.spec;
    if (stepStatus) stepStatus.textContent = data.status;

    if (gaugePath) {
      gsap.to(gaugePath, {
        strokeDashoffset: data.dashoffset,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (visualCard) {
      gsap.fromTo(visualCard, 
        { scale: 0.98, borderColor: 'rgba(53, 224, 232, 0.4)' },
        { scale: 1, borderColor: 'rgba(47, 128, 237, 0.2)', duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  const activateStep = (index) => {
    steps.forEach((s, i) => {
      if (i === index) {
        s.classList.add('is-active');
      } else {
        s.classList.remove('is-active');
      }
    });
    updateVisualState(index);
  };

  // Initialize with step 0 active
  activateStep(0);

  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => activateStep(index),
      onEnterBack: () => activateStep(index),
    });
  });
}
