import { Language, Currency } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    properties: string;
    conversations: string;
    leads: string;
    appointments: string;
    automationCrm: string;
    billing: string;
    admin: string;
    setupGuide: string;
  };
  topBar: {
    testWidget: string;
    activeAgency: string;
    switchAgency: string;
    account: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    qualifiedLeads: string;
    conversionRate: string;
    pendingAppointments: string;
    pipelineEstimate: string;
    recentLeads: string;
    recentConversations: string;
    upcomingVisits: string;
    actionRequired: string;
    noPendingVisits: string;
    viewAll: string;
    leadScoreHot: string;
    leadScoreWarm: string;
    leadScoreCold: string;
  };
  properties: {
    title: string;
    subtitle: string;
    addProperty: string;
    filterAll: string;
    filterVillas: string;
    filterApartments: string;
    filterDuplex: string;
    filterOffices: string;
    available: string;
    underOffer: string;
    sold: string;
    rooms: string;
    surface: string;
    strictGroundingNotice: string;
  };
  conversations: {
    title: string;
    subtitle: string;
    agentOnline: string;
    humanHandover: string;
    humanHandoverActive: string;
    takeOver: string;
    returnToAi: string;
    qualificationTitle: string;
    budget: string;
    location: string;
    timeframe: string;
    consentGdpr: string;
    generateFollowup: string;
    typeMessage: string;
    send: string;
  };
  leads: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    statusNew: string;
    statusQualified: string;
    statusVisitRequested: string;
    statusOffer: string;
    statusConverted: string;
    statusArchived: string;
    whatsappDirect: string;
  };
  appointments: {
    title: string;
    subtitle: string;
    warningValidation: string;
    statusPending: string;
    statusConfirmed: string;
    statusPostponed: string;
    statusDone: string;
    validateAppointment: string;
    reschedule: string;
  };
  billing: {
    title: string;
    subtitle: string;
    monthly: string;
    annual: string;
    annualDiscount: string;
    choosePlan: string;
    currentPlan: string;
    fedapayMobileMoney: string;
    fedapayDesc: string;
    paddleCard: string;
    paddleDesc: string;
    transactionHistory: string;
    amount: string;
    status: string;
    date: string;
    invoice: string;
    securityNotice: string;
  };
  automation: {
    title: string;
    subtitle: string;
    targetAgencies: string;
    antiSpamNotice: string;
    sendPersonalizedEmail: string;
    cadence: string;
    stepNew: string;
    stepJ0: string;
    stepJ2: string;
    stepJ5: string;
  };
  admin: {
    title: string;
    subtitle: string;
    globalMrr: string;
    activeAgencies: string;
    killSwitchTitle: string;
    killSwitchDesc: string;
    pauseAll: string;
    resumeAll: string;
    webhookAudit: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: 'ImmoAgent AI',
    tagline: 'Agent Commercial IA pour Agences Immobilières',
    nav: {
      dashboard: 'Tableau de bord',
      properties: 'Biens immobiliers',
      conversations: 'Conversations IA',
      leads: 'Prospects CRM',
      appointments: 'Rendez-vous visites',
      automationCrm: 'Prospection B2B',
      billing: 'Abonnements & Paiements',
      admin: 'Super Admin',
      setupGuide: 'Guide & Intégrations',
    },
    topBar: {
      testWidget: 'Simuler le Widget Visiteur',
      activeAgency: 'Agence active',
      switchAgency: 'Changer',
      account: 'Mon Espace',
    },
    dashboard: {
      title: 'Performance Commerciale',
      subtitle: 'Surveillance en direct des prospects qualifiés et visites pré-enregistrées 24h/24.',
      qualifiedLeads: 'Prospects Qualifiés',
      conversionRate: 'Taux de Conversion',
      pendingAppointments: 'Visites à Valider',
      pipelineEstimate: 'Valeur du Pipeline',
      recentLeads: 'Derniers prospects qualifiés',
      recentConversations: 'Échanges en temps réel',
      upcomingVisits: 'Demandes de visites urgentes',
      actionRequired: 'Validation requise',
      noPendingVisits: 'Aucune visite en attente de validation',
      viewAll: 'Voir tout',
      leadScoreHot: 'Chaud',
      leadScoreWarm: 'Tiède',
      leadScoreCold: 'Froid',
    },
    properties: {
      title: 'Catalogue des Biens Immobiliers',
      subtitle: 'Catalogue officiel servant de source de vérité exclusive à l’IA (zéro hallucination).',
      addProperty: 'Ajouter un bien',
      filterAll: 'Tous les biens',
      filterVillas: 'Villas',
      filterApartments: 'Appartements',
      filterDuplex: 'Penthouses & Duplex',
      filterOffices: 'Bureaux',
      available: 'Disponible',
      underOffer: 'Sous compromis',
      sold: 'Vendu',
      rooms: 'pièces',
      surface: 'm²',
      strictGroundingNotice: 'Règle stricte : L’agent IA ne présentera jamais un prix, une disponibilité ou un bien absent de ce catalogue.',
    },
    conversations: {
      title: 'Historique des Échanges & Qualification',
      subtitle: 'Supervisez l’agent IA ou reprenez la main en direct avec le prospect.',
      agentOnline: 'Agent IA Sarah actif',
      humanHandover: 'Transfert Conseiller Humain',
      humanHandoverActive: 'Un conseiller humain est actuellement en ligne',
      takeOver: 'Prendre la main',
      returnToAi: 'Rendre la main à l’IA',
      qualificationTitle: 'Qualification automatique IA',
      budget: 'Budget estimé',
      location: 'Localisation souhaitée',
      timeframe: 'Délai projet',
      consentGdpr: 'Consentement RGPD / Contact',
      generateFollowup: 'Générer relance personnalisée',
      typeMessage: 'Écrivez votre message...',
      send: 'Envoyer',
    },
    leads: {
      title: 'Pipeline Prospects (CRM Immobilier)',
      subtitle: 'Suivi de chaque contact qualifié par l’agent IA selon sa maturité.',
      searchPlaceholder: 'Rechercher par nom, email, téléphone, ville...',
      statusNew: 'Nouveau',
      statusQualified: 'Qualifié Chaud',
      statusVisitRequested: 'Visite Demandée',
      statusOffer: 'Offre en cours',
      statusConverted: 'Converti / Acté',
      statusArchived: 'Archivé',
      whatsappDirect: 'WhatsApp direct',
    },
    appointments: {
      title: 'Planning des Rendez-vous & Visites',
      subtitle: 'Conformément aux exigences : aucun rendez-vous n’est validé sans accord humain.',
      warningValidation: 'Important : L’IA enregistre les demandes de créneaux mais ne confirme jamais sans votre validation explicite.',
      statusPending: 'En attente validation conseiller',
      statusConfirmed: 'Validé par l’agence',
      statusPostponed: 'Reporté',
      statusDone: 'Effectué',
      validateAppointment: 'Valider le créneau',
      reschedule: 'Reprogrammer',
    },
    billing: {
      title: 'Formules d’Abonnement & Facturation',
      subtitle: 'Passerelles de paiement vérifiées : FedaPay (MTN, Moov, Cartes) et Paddle (International).',
      monthly: 'Mensuel',
      annual: 'Annuel',
      annualDiscount: '-20% de remise annuelle',
      choosePlan: 'Souscrire maintenant',
      currentPlan: 'Formule Active',
      fedapayMobileMoney: 'FedaPay (Afrique de l’Ouest & Centrale)',
      fedapayDesc: 'MTN Mobile Money, Moov Money, Wave, Cartes Visa/Mastercard sécurisées par webhook.',
      paddleCard: 'Paddle (International)',
      paddleDesc: 'Paiements par Cartes Bancaires internationales, PayPal, Apple Pay & facturation conforme TVA.',
      transactionHistory: 'Historique des Transactions Vérifiées',
      amount: 'Montant',
      status: 'Statut',
      date: 'Date',
      invoice: 'Reçu / Facture',
      securityNotice: 'Activation stricte : les abonnements ne s’activent que sur confirmation cryptographique du webhook marchand.',
    },
    automation: {
      title: 'Automatisation Commerciale B2B (Prospection Agences)',
      subtitle: 'Identification d’agences immobilières cibles et envoi d’e-mails personnalisés conformes anti-spam.',
      targetAgencies: 'Agences Immobilières Prospects',
      antiSpamNotice: 'Conformité stricte : e-mails personnalisés B2B avec objet pertinent et lien de désinscription opt-out clair.',
      sendPersonalizedEmail: 'Générer l’e-mail de contact',
      cadence: 'Étape de séquence',
      stepNew: 'À contacter',
      stepJ0: 'E-mail J+0 envoyé',
      stepJ2: 'Relance J+2',
      stepJ5: 'Relance J+5',
    },
    admin: {
      title: 'Super-Administration Plateforme SaaS',
      subtitle: 'Vue globale des agences clientes, MRR, webhooks marchands et coupe-circuit d’urgence.',
      globalMrr: 'MRR Global Récurrent',
      activeAgencies: 'Agences Clientes Actives',
      killSwitchTitle: 'Coupe-circuit Automatisations',
      killSwitchDesc: 'Permet de suspendre immédiatement tous les flux automatiques en cas d’anomalie.',
      pauseAll: 'Suspendre toutes les automatisations',
      resumeAll: 'Réactiver les flux',
      webhookAudit: 'Journal d’Audit Webhooks Paiements',
    },
  },
  en: {
    appName: 'ImmoAgent AI',
    tagline: 'AI Commercial Agent for Real Estate Agencies',
    nav: {
      dashboard: 'Dashboard',
      properties: 'Properties',
      conversations: 'AI Conversations',
      leads: 'CRM Leads',
      appointments: 'Visits & Schedule',
      automationCrm: 'B2B Outreach',
      billing: 'Plans & Payments',
      admin: 'Super Admin',
      setupGuide: 'Setup & Integrations',
    },
    topBar: {
      testWidget: 'Simulate Visitor Widget',
      activeAgency: 'Active Agency',
      switchAgency: 'Switch',
      account: 'My Workspace',
    },
    dashboard: {
      title: 'Sales Performance',
      subtitle: 'Live monitoring of qualified real estate leads and visit requests 24/7.',
      qualifiedLeads: 'Qualified Leads',
      conversionRate: 'Conversion Rate',
      pendingAppointments: 'Visits to Validate',
      pipelineEstimate: 'Pipeline Value',
      recentLeads: 'Recent Qualified Leads',
      recentConversations: 'Live Conversations',
      upcomingVisits: 'Urgent Visit Inquiries',
      actionRequired: 'Approval required',
      noPendingVisits: 'No visits awaiting approval',
      viewAll: 'View all',
      leadScoreHot: 'Hot',
      leadScoreWarm: 'Warm',
      leadScoreCold: 'Cold',
    },
    properties: {
      title: 'Property Listings Catalog',
      subtitle: 'Official property catalog acting as strict grounding source for the AI agent (zero hallucinations).',
      addProperty: 'Add Property',
      filterAll: 'All properties',
      filterVillas: 'Villas',
      filterApartments: 'Apartments',
      filterDuplex: 'Penthouses & Duplexes',
      filterOffices: 'Offices',
      available: 'Available',
      underOffer: 'Under Offer',
      sold: 'Sold',
      rooms: 'rooms',
      surface: 'sqm',
      strictGroundingNotice: 'Strict rule: The AI agent will never invent a property, price, or availability absent from this catalog.',
    },
    conversations: {
      title: 'Chat History & Lead Qualification',
      subtitle: 'Monitor the AI agent in real-time or take over direct conversation with the lead.',
      agentOnline: 'Sarah AI Agent Online',
      humanHandover: 'Transfer to Human Advisor',
      humanHandoverActive: 'A human agent is currently handling this lead',
      takeOver: 'Take Over Chat',
      returnToAi: 'Return to AI Agent',
      qualificationTitle: 'Automatic AI Lead Qualification',
      budget: 'Estimated Budget',
      location: 'Desired Location',
      timeframe: 'Project Horizon',
      consentGdpr: 'Consent & Contact Status',
      generateFollowup: 'Generate Smart Follow-up',
      typeMessage: 'Type your message...',
      send: 'Send',
    },
    leads: {
      title: 'Leads Pipeline (Real Estate CRM)',
      subtitle: 'Track every lead qualified by the AI agent through every closing stage.',
      searchPlaceholder: 'Search by name, email, phone, city...',
      statusNew: 'New',
      statusQualified: 'Qualified Hot',
      statusVisitRequested: 'Visit Requested',
      statusOffer: 'Offer in Progress',
      statusConverted: 'Closed / Converted',
      statusArchived: 'Archived',
      whatsappDirect: 'Direct WhatsApp',
    },
    appointments: {
      title: 'Visit Inquiries & Scheduling',
      subtitle: 'In accordance with requirements: no visit is ever confirmed without human agent approval.',
      warningValidation: 'Crucial requirement: The AI logs visit preferences but never confirms without explicit agent approval.',
      statusPending: 'Awaiting Agent Approval',
      statusConfirmed: 'Approved by Agency',
      statusPostponed: 'Rescheduled',
      statusDone: 'Completed',
      validateAppointment: 'Confirm Visit Slot',
      reschedule: 'Reschedule',
    },
    billing: {
      title: 'Subscription Plans & Verified Billing',
      subtitle: 'Secured payment gateways: FedaPay (MTN, Moov, Cards) and Paddle (Global cards/PayPal).',
      monthly: 'Monthly',
      annual: 'Annual',
      annualDiscount: '-20% annual discount',
      choosePlan: 'Subscribe Now',
      currentPlan: 'Active Plan',
      fedapayMobileMoney: 'FedaPay (West & Central Africa)',
      fedapayDesc: 'MTN Mobile Money, Moov Money, Wave, Visa/Mastercard verified via webhooks.',
      paddleCard: 'Paddle (International)',
      paddleDesc: 'International credit cards, PayPal, Apple Pay & tax-compliant SaaS receipts.',
      transactionHistory: 'Verified Transaction Audit',
      amount: 'Amount',
      status: 'Status',
      date: 'Date',
      invoice: 'Receipt / Invoice',
      securityNotice: 'Strict security: Subscriptions only activate upon verified merchant webhook signature.',
    },
    automation: {
      title: 'B2B Sales Outreach Automation',
      subtitle: 'Identify prospective real estate agencies and generate compliant anti-spam personalized outreach.',
      targetAgencies: 'Prospective Real Estate Agencies',
      antiSpamNotice: 'Strict anti-spam compliance: personalized B2B outreach with clear opt-out unsubscribe link.',
      sendPersonalizedEmail: 'Draft Personalized Pitch',
      cadence: 'Cadence Step',
      stepNew: 'To Contact',
      stepJ0: 'Day 0 Email Sent',
      stepJ2: 'Day 2 Follow-up',
      stepJ5: 'Day 5 Follow-up',
    },
    admin: {
      title: 'SaaS Platform Super-Admin',
      subtitle: 'Global management of client agencies, recurring revenue, merchant webhooks, and emergency kill-switch.',
      globalMrr: 'Global Recurring MRR',
      activeAgencies: 'Active Client Agencies',
      killSwitchTitle: 'Automations Emergency Kill-Switch',
      killSwitchDesc: 'Instantly pause all background automated messaging and workflows.',
      pauseAll: 'Pause All Automations',
      resumeAll: 'Resume All Automations',
      webhookAudit: 'Payment Webhook Audit Log',
    },
  },
  es: {
    appName: 'ImmoAgent AI',
    tagline: 'Agente Comercial IA para Agencias Inmobiliarias',
    nav: {
      dashboard: 'Panel de Control',
      properties: 'Inmuebles',
      conversations: 'Conversaciones IA',
      leads: 'Prospectos CRM',
      appointments: 'Visitas y Citas',
      automationCrm: 'Prospección B2B',
      billing: 'Planes y Pagos',
      admin: 'Super Admin',
      setupGuide: 'Guía e Integraciones',
    },
    topBar: {
      testWidget: 'Simular Widget de Visita',
      activeAgency: 'Agencia activa',
      switchAgency: 'Cambiar',
      account: 'Mi Cuenta',
    },
    dashboard: {
      title: 'Rendimiento Comercial',
      subtitle: 'Monitoreo en tiempo real de prospectos calificados y visitas solicitadas 24h/24.',
      qualifiedLeads: 'Prospectos Calificados',
      conversionRate: 'Tasa de Conversión',
      pendingAppointments: 'Visitas por Validar',
      pipelineEstimate: 'Valor del Pipeline',
      recentLeads: 'Últimos prospectos',
      recentConversations: 'Conversaciones en vivo',
      upcomingVisits: 'Visitas que requieren aprobación',
      actionRequired: 'Aprobación requerida',
      noPendingVisits: 'No hay visitas pendientes',
      viewAll: 'Ver todo',
      leadScoreHot: 'Caliente',
      leadScoreWarm: 'Tibio',
      leadScoreCold: 'Frío',
    },
    properties: {
      title: 'Catálogo de Propiedades',
      subtitle: 'Catálogo oficial utilizado como fuente estricta por la IA (cero invenciones).',
      addProperty: 'Añadir Propiedad',
      filterAll: 'Todas las propiedades',
      filterVillas: 'Villas',
      filterApartments: 'Apartamentos',
      filterDuplex: 'Áticos y Dúplex',
      filterOffices: 'Oficinas',
      available: 'Disponible',
      underOffer: 'Bajo oferta',
      sold: 'Vendido',
      rooms: 'habitaciones',
      surface: 'm²',
      strictGroundingNotice: 'Regla estricta: El agente IA nunca inventará un precio o disponibilidad ausente de este catálogo.',
    },
    conversations: {
      title: 'Historial de Conversaciones',
      subtitle: 'Supervise el agente IA o tome el control directo con el cliente.',
      agentOnline: 'Agente Sarah en línea',
      humanHandover: 'Transferir a Asesor Humano',
      humanHandoverActive: 'Un asesor humano atiende esta conversación',
      takeOver: 'Tomar el control',
      returnToAi: 'Devolver a la IA',
      qualificationTitle: 'Calificación automática IA',
      budget: 'Presupuesto',
      location: 'Ubicación deseada',
      timeframe: 'Plazo del proyecto',
      consentGdpr: 'Consentimiento de contacto',
      generateFollowup: 'Generar mensaje de seguimiento',
      typeMessage: 'Escriba un mensaje...',
      send: 'Enviar',
    },
    leads: {
      title: 'Pipeline de Prospectos',
      subtitle: 'Gestión CRM de los prospectos calificados por la IA.',
      searchPlaceholder: 'Buscar por nombre, correo, teléfono...',
      statusNew: 'Nuevo',
      statusQualified: 'Calificado Caliente',
      statusVisitRequested: 'Visita Solicitada',
      statusOffer: 'Oferta en Curso',
      statusConverted: 'Cerrado / Convertido',
      statusArchived: 'Archivado',
      whatsappDirect: 'WhatsApp directo',
    },
    appointments: {
      title: 'Agenda de Citas y Visitas',
      subtitle: 'Ninguna visita se confirma sin validación humana del asesor.',
      warningValidation: 'Aviso importante: La IA recopila fechas pero nunca confirma sin su validación.',
      statusPending: 'Pendiente de aprobación',
      statusConfirmed: 'Confirmado por la agencia',
      statusPostponed: 'Pospuesto',
      statusDone: 'Completado',
      validateAppointment: 'Confirmar visita',
      reschedule: 'Reprogramar',
    },
    billing: {
      title: 'Planes de Suscripción y Facturación',
      subtitle: 'Pasarelas oficiales: FedaPay (Mobile Money & Tarjetas) y Paddle (Internacional).',
      monthly: 'Mensual',
      annual: 'Anual',
      annualDiscount: '-20% de descuento anual',
      choosePlan: 'Contratar Plan',
      currentPlan: 'Plan Activo',
      fedapayMobileMoney: 'FedaPay (África Occidental y Central)',
      fedapayDesc: 'MTN Mobile Money, Moov Money, Wave, Visa/Mastercard confirmados por webhook.',
      paddleCard: 'Paddle (Internacional)',
      paddleDesc: 'Tarjetas de crédito globales, PayPal y facturación con cumplimiento tributario.',
      transactionHistory: 'Historial de Transacciones Verificadas',
      amount: 'Monto',
      status: 'Estado',
      date: 'Fecha',
      invoice: 'Recibo',
      securityNotice: 'Seguridad estricta: Las suscripciones solo se activan mediante firma de webhook verificada.',
    },
    automation: {
      title: 'Automatización Comercial B2B',
      subtitle: 'Prospección de agencias inmobiliarias y correos respetando normas anti-spam.',
      targetAgencies: 'Agencias Objetivo',
      antiSpamNotice: 'Cumplimiento anti-spam: correos B2B personalizados con enlace para darse de baja.',
      sendPersonalizedEmail: 'Redactar correo comercial',
      cadence: 'Paso de cadencia',
      stepNew: 'Por contactar',
      stepJ0: 'Correo Día 0 enviado',
      stepJ2: 'Recordatorio Día 2',
      stepJ5: 'Recordatorio Día 5',
    },
    admin: {
      title: 'Super-Administración de la Plataforma',
      subtitle: 'Visión global de clientes, MRR, webhooks y botón de parada de emergencia.',
      globalMrr: 'MRR Global Recurrente',
      activeAgencies: 'Agencias Activas',
      killSwitchTitle: 'Interruptor de Emergencia',
      killSwitchDesc: 'Pausa instantáneamente todos los flujos automatizados.',
      pauseAll: 'Pausar automatizaciones',
      resumeAll: 'Reanudar automatizaciones',
      webhookAudit: 'Registro de Webhooks',
    },
  },
  pt: {
    appName: 'ImmoAgent AI',
    tagline: 'Agente Comercial IA para Imobiliárias',
    nav: {
      dashboard: 'Painel Geral',
      properties: 'Imóveis',
      conversations: 'Conversas IA',
      leads: 'Leads CRM',
      appointments: 'Visitas Agendadas',
      automationCrm: 'Prospecção B2B',
      billing: 'Planos & Pagamentos',
      admin: 'Super Admin',
      setupGuide: 'Guia & Integrações',
    },
    topBar: {
      testWidget: 'Simular Widget Visitante',
      activeAgency: 'Imobiliária ativa',
      switchAgency: 'Mudar',
      account: 'Minha Conta',
    },
    dashboard: {
      title: 'Performance Comercial',
      subtitle: 'Monitoramento em tempo real de leads qualificados e visitas pré-agendadas 24h por dia.',
      qualifiedLeads: 'Leads Qualificados',
      conversionRate: 'Taxa de Conversão',
      pendingAppointments: 'Visitas para Validar',
      pipelineEstimate: 'Valor do Pipeline',
      recentLeads: 'Leads Recentes',
      recentConversations: 'Conversas ao Vivo',
      upcomingVisits: 'Visitas aguardando validação',
      actionRequired: 'Aprovação necessária',
      noPendingVisits: 'Nenhuma visita pendente',
      viewAll: 'Ver todos',
      leadScoreHot: 'Quente',
      leadScoreWarm: 'Morno',
      leadScoreCold: 'Frio',
    },
    properties: {
      title: 'Catálogo de Imóveis',
      subtitle: 'Catálogo oficial utilizado como fonte exclusiva de verdade pela IA.',
      addProperty: 'Adicionar Imóvel',
      filterAll: 'Todos os imóveis',
      filterVillas: 'Casas & Vilas',
      filterApartments: 'Apartamentos',
      filterDuplex: 'Penthouses & Dúplex',
      filterOffices: 'Escritórios',
      available: 'Disponível',
      underOffer: 'Sob proposta',
      sold: 'Vendido',
      rooms: 'quartos',
      surface: 'm²',
      strictGroundingNotice: 'Regra estrita: O agente IA nunca inventará preços ou disponibilidade fora deste catálogo.',
    },
    conversations: {
      title: 'Histórico de Conversas & Qualificação',
      subtitle: 'Supervisione o agente IA ou assuma a conversa diretamente com o cliente.',
      agentOnline: 'Agente Sarah online',
      humanHandover: 'Transferir para Consultor Humano',
      humanHandoverActive: 'Um consultor humano está atendendo este lead',
      takeOver: 'Assumir Atendimento',
      returnToAi: 'Devolver para IA',
      qualificationTitle: 'Qualificação Automática IA',
      budget: 'Orçamento estimado',
      location: 'Localização desejada',
      timeframe: 'Prazo do projeto',
      consentGdpr: 'Consentimento de Contato',
      generateFollowup: 'Gerar mensagem de follow-up',
      typeMessage: 'Digite sua mensagem...',
      send: 'Enviar',
    },
    leads: {
      title: 'Funil de Vendas (CRM Imobiliário)',
      subtitle: 'Acompanhe cada lead qualificado pela IA até o fechamento do negócio.',
      searchPlaceholder: 'Buscar por nome, email, telefone, cidade...',
      statusNew: 'Novo',
      statusQualified: 'Qualificado Quente',
      statusVisitRequested: 'Visita Solicitada',
      statusOffer: 'Proposta em Andamento',
      statusConverted: 'Convertido / Fechado',
      statusArchived: 'Arquivado',
      whatsappDirect: 'WhatsApp direto',
    },
    appointments: {
      title: 'Agendamento de Visitas',
      subtitle: 'Nenhuma visita é confirmada sem aprovação prévia de um consultor humano.',
      warningValidation: 'Aviso crucial: A IA anota a preferência de data mas nunca confirma sem validação humana.',
      statusPending: 'Aguardando Aprovação do Consultor',
      statusConfirmed: 'Confirmado pela Imobiliária',
      statusPostponed: 'Reagendado',
      statusDone: 'Concluído',
      validateAppointment: 'Confirmar Visita',
      reschedule: 'Reagendar',
    },
    billing: {
      title: 'Planos de Assinatura & Faturamento',
      subtitle: 'Gateways oficiais: FedaPay (MTN, Moov, Cartões) e Paddle (Internacional).',
      monthly: 'Mensal',
      annual: 'Anual',
      annualDiscount: '-20% de desconto anual',
      choosePlan: 'Assinar Agora',
      currentPlan: 'Plano Ativo',
      fedapayMobileMoney: 'FedaPay (África Ocidental e Central)',
      fedapayDesc: 'MTN Mobile Money, Moov Money, Wave, cartões Visa/Mastercard confirmados por webhook.',
      paddleCard: 'Paddle (Internacional)',
      paddleDesc: 'Cartões internacionais, PayPal e recibos em conformidade fiscal.',
      transactionHistory: 'Histórico de Transações Verificadas',
      amount: 'Valor',
      status: 'Status',
      date: 'Data',
      invoice: 'Recibo',
      securityNotice: 'Segurança estrita: As assinaturas são ativadas apenas com confirmação por webhook verificado.',
    },
    automation: {
      title: 'Automação Comercial B2B',
      subtitle: 'Prospecção de imobiliárias e e-mails personalizados em conformidade anti-spam.',
      targetAgencies: 'Imobiliárias Alvo',
      antiSpamNotice: 'Conformidade anti-spam: e-mails B2B personalizados com link claro de descadastro.',
      sendPersonalizedEmail: 'Gerar e-mail de contato',
      cadence: 'Etapa da sequência',
      stepNew: 'Para contactar',
      stepJ0: 'E-mail Dia 0 enviado',
      stepJ2: 'Follow-up Dia 2',
      stepJ5: 'Follow-up Dia 5',
    },
    admin: {
      title: 'Super-Administração da Plataforma',
      subtitle: 'Visão global das imobiliárias clientes, MRR, webhooks e botão de parada emergencial.',
      globalMrr: 'MRR Global Recorrente',
      activeAgencies: 'Imobiliárias Ativas',
      killSwitchTitle: 'Interruptor de Emergência',
      killSwitchDesc: 'Pausa imediatamente todos os fluxos automatizados em caso de necessidade.',
      pauseAll: 'Pausar todas as automações',
      resumeAll: 'Reativar fluxos',
      webhookAudit: 'Registro de Webhooks de Pagamento',
    },
  },
};

export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined' || !navigator.language) return 'fr';
  const lang = navigator.language.slice(0, 2).toLowerCase();
  if (lang === 'fr') return 'fr';
  if (lang === 'en') return 'en';
  if (lang === 'es') return 'es';
  if (lang === 'pt') return 'pt';
  return 'fr';
}

export function formatPrice(amount: number, currency: Currency): string {
  switch (currency) {
    case 'EUR':
      return `${new Intl.NumberFormat('fr-FR').format(amount)} €`;
    case 'USD':
      return `$${new Intl.NumberFormat('en-US').format(amount)}`;
    case 'XOF':
      return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
    case 'BRL':
      return `R$ ${new Intl.NumberFormat('pt-BR').format(amount)}`;
    case 'GBP':
      return `£${new Intl.NumberFormat('en-GB').format(amount)}`;
    default:
      return `${amount} ${currency}`;
  }
}
