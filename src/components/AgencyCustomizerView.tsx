import React, { useState } from 'react';
import { Agency, AgencySettings, Language, AgentTone, VoiceToneConfig } from '../types';
import {
  Sliders,
  Bot,
  MessageSquare,
  HelpCircle,
  Code,
  Copy,
  Check,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Phone,
  Mail,
  Zap,
  Volume2,
  VolumeX,
  Award,
  HeartHandshake,
  Flame,
  BarChart3,
  SlidersHorizontal,
  CheckCircle2,
  Smile,
  User,
  Radio,
  Play,
  Square,
  Info,
} from 'lucide-react';

interface AgencyCustomizerViewProps {
  agency: Agency;
  onUpdateAgencySettings: (agencyId: string, settings: AgencySettings) => void;
  language: Language;
}

interface PersonalityPreset {
  id: AgentTone;
  personaKey: AgencySettings['agentPersona'];
  title: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  bgLight: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  idealFor: string;
  sampleResponses: {
    contact: string;
    outOfStock: string;
    visit: string;
    followup: string;
  };
}

export const AgencyCustomizerView: React.FC<AgencyCustomizerViewProps> = ({
  agency,
  onUpdateAgencySettings,
  language,
}) => {
  // Local state initialized from agency.settings or defaults
  const [agentName, setAgentName] = useState(agency.settings?.agentName || 'Sarah');
  const [agentPersona, setAgentPersona] = useState<AgencySettings['agentPersona']>(
    agency.settings?.agentPersona || 'prestige'
  );

  // Voice Tone fine-tuning config
  const [voiceTone, setVoiceTone] = useState<VoiceToneConfig>(
    agency.settings?.voiceTone || {
      tone: (agency.settings?.agentPersona === 'dynamique'
        ? 'energetic'
        : agency.settings?.agentPersona === 'chaleureux'
        ? 'friendly'
        : agency.settings?.agentPersona === 'technique'
        ? 'expert'
        : agency.settings?.agentPersona === 'commercial'
        ? 'persuasive'
        : 'professional') as AgentTone,
      formality: 'formal',
      energyLevel: 'balanced',
      emojiUsage: 'subtle',
      voiceGender: 'female',
      speakingPace: 'normal',
      customInstructions: '',
    }
  );

  const [primaryColor, setPrimaryColor] = useState(agency.settings?.primaryColor || '#10B981');
  const [welcomeMessage, setWelcomeMessage] = useState(
    agency.settings?.welcomeMessage ||
      `Bonjour et bienvenue chez ${agency.name} ! Je suis à votre service pour vous conseiller sur nos opportunités immobilières et organiser vos visites.`
  );
  const [notificationWhatsapp, setNotificationWhatsapp] = useState(
    agency.settings?.notificationWhatsapp || agency.phone
  );
  const [notificationEmail, setNotificationEmail] = useState(
    agency.settings?.notificationEmail || agency.email
  );
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(
    agency.settings?.autoPilotEnabled !== false
  );

  // Preview scenario tab (contact, outOfStock, visit, followup)
  const [previewScenario, setPreviewScenario] = useState<'contact' | 'outOfStock' | 'visit' | 'followup'>('contact');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Custom FAQs
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>(
    agency.settings?.customFaqs || [
      {
        id: 'faq-1',
        question: 'Quels sont vos honoraires d\'agence ?',
        answer:
          'Nos honoraires d\'agence s\'élèvent à 4% TTC à la charge du vendeur pour les ventes, et 1 mois de loyer charges comprises pour les locations, tous inclus dans nos prix affichés.',
      },
      {
        id: 'faq-2',
        question: 'Quelles sont les pièces nécessaires pour programmer une visite ?',
        answer:
          'Une simple pièce d\'identité valide et une confirmation de vos critères budgétaires suffisent. Pour une offre d\'achat, une simulation bancaire récente sera sollicitée.',
      },
      {
        id: 'faq-3',
        question: 'Proposez-vous un service de gestion locative ?',
        answer:
          'Absolument, notre agence gère l\'ensemble de vos biens avec assurance loyers impayés (GLI) et compte-rendu mensuel détaillé pour les propriétaires.',
      },
    ]
  );

  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 5 Personality Presets
  const personalityPresets: PersonalityPreset[] = [
    {
      id: 'professional',
      personaKey: 'prestige',
      title: 'Professionnel & Élégant',
      badge: 'Prestige & Haut Standing',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderColor: 'border-indigo-400 ring-2 ring-indigo-500/20',
      bgLight: 'bg-indigo-50/40',
      icon: Award,
      tagline: 'Courtois, soutenu, rassurant et respectueux des codes du luxe.',
      description: 'Vocabulaire immobilier raffiné, vouvoiement de rigueur, discrétion et élégance pour valoriser les plus beaux mandats.',
      idealFor: 'Biens de prestige, villas d\'exception, clientèle internationale & investisseurs avisés.',
      sampleResponses: {
        contact: `Bonjour Madame, Monsieur. C'est un privilège de vous accueillir chez ${agency.name}. Je suis ${agentName}, à votre entière disposition pour vous guider parmi nos demeures sélectionnées et organiser vos visites privées.`,
        outOfStock: `Cette typologie suscite une vive attention et notre portefeuille ne compte pas cette référence exacte aujourd'hui. Permettez-moi de noter vos critères exclusifs afin de vous avertir confidentiellement avant toute parution publique.`,
        visit: `Je note avec attention votre souhait pour une découverte des lieux ce samedi. Afin de garantir un accueil irréprochable, un conseiller dédié vous contactera pour valider définitivement ce créneau personnalisé.`,
        followup: `Madame, Monsieur. Faisant suite à notre récent échange au sujet de votre projet immobilier, avez-vous eu l'opportunité de consulter la brochure confidentielle transmise ?`,
      },
    },
    {
      id: 'friendly',
      personaKey: 'chaleureux',
      title: 'Chaleureux & Bienveillant',
      badge: 'Empathique & Convivial',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderColor: 'border-emerald-400 ring-2 ring-emerald-500/20',
      bgLight: 'bg-emerald-50/40',
      icon: HeartHandshake,
      tagline: 'Humain, accueillant, empathique et à l\'écoute des projets de vie.',
      description: 'Ton chaleureux et bienveillant, écoute active, mise en confiance immédiate pour déstresser les acquéreurs et locataires.',
      idealFor: 'Familles, primo-accédants, résidences principales, locations et projets de vie.',
      sampleResponses: {
        contact: `Bonjour et bienvenue chez ${agency.name} ! Je suis ${agentName}. Trouver un nouveau chez-soi est une magnifique aventure. Racontez-moi vos envies et vos critères idéaux, nous allons trouver votre bonheur ensemble !`,
        outOfStock: `Nous n'avons pas tout à fait cette perle rare aujourd'hui en vitrine, mais notre équipe rentre de nouveaux biens chaque semaine ! Laissez-moi vos critères, je vous préviens dès qu'une opportunité correspondante arrive.`,
        visit: `C'est super, je note tout de suite votre créneau pour samedi ! Un de nos conseillers va vous appeler très vite pour caler les derniers détails de la visite. On a hâte de vous faire découvrir les lieux !`,
        followup: `Bonjour ! J'espère que vous passez une excellente journée. Je voulais juste prendre de vos nouvelles concernant votre recherche de bien. Est-ce que la sélection vous plaît toujours ?`,
      },
    },
    {
      id: 'energetic',
      personaKey: 'dynamique',
      title: 'Dynamique & Énergique',
      badge: 'Punchy & Ultra-Réactif',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      borderColor: 'border-amber-400 ring-2 ring-amber-500/20',
      bgLight: 'bg-amber-50/40',
      icon: Sparkles,
      tagline: 'Enthousiaste, vif, percutant et orienté vers l\'action immédiate.',
      description: 'Rythme rapide, tournures stimulantes, engagement maximal pour créer un sentiment d\'opportunité et accélérer les échanges.',
      idealFor: 'Marchés tendus, studios, duplex modernes, primo-accédants et agences modernes.',
      sampleResponses: {
        contact: `Hello ! Bienvenue chez ${agency.name} ! Je suis ${agentName}, votre agent IA ultra-réactif. Dites-moi ce que vous recherchez et je vous déniche les meilleures opportunités en temps record !`,
        outOfStock: `Ce type de bien part à une vitesse folle ! On n'en a plus en stock à la minute où je vous parle, mais pas de panique : laissez-moi votre WhatsApp et je vous alerte en avant-première avant même la publication !`,
        visit: `Top chrono ! Créneau pré-enregistré pour samedi. Nos conseillers sont ultra-sollicités sur cette adresse, je passe le relais à l'équipe pour valider votre rendez-vous en priorité aujourd'hui !`,
        followup: `Bonjour ! Juste un petit flash : plusieurs visites viennent d'être programmées sur le bien qui vous intéressait. Si vous souhaitez vous positionner avant qu'il ne passe sous compromis, faites-moi signe !`,
      },
    },
    {
      id: 'expert',
      personaKey: 'technique',
      title: 'Conseiller Expert & Analytique',
      badge: 'Factuel & Rentabilité',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      borderColor: 'border-blue-400 ring-2 ring-blue-500/20',
      bgLight: 'bg-blue-50/40',
      icon: BarChart3,
      tagline: 'Factuel, précis, orienté chiffres, rendement locatif et diagnostics.',
      description: 'Analyse méthodique des surfaces, DPE, rentabilité brute/nette, fiscalité et données objectives pour rassurer les profils cartésiens.',
      idealFor: 'Investisseurs locatifs, locaux commerciaux, programmes neufs et patrimoine.',
      sampleResponses: {
        contact: `Bonjour. Je suis ${agentName}, conseiller IA spécialisé en analyse patrimoniale et transactions chez ${agency.name}. Je vous apporte un accompagnement technique rigoureux sur nos actifs disponibles.`,
        outOfStock: `D'après nos données de marché sur cette typologie, l'offre est actuellement restreinte sur cette tranche de prix. Je peux modéliser une recherche ciblée sur les secteurs limitrophes présentant un ratio locatif comparable.`,
        visit: `Demande de visite technique enregistrée pour le créneau sélectionné. Nos conseillers analyseront avec vous le dossier complet : DPE, charges de copropriété et historique des travaux.`,
        followup: `Bonjour. Faisant suite à notre étude sur votre projet d'acquisition, souhaitez-vous recevoir la synthèse financière détaillée ainsi que la simulation de rentabilité brute/nette de cet actif ?`,
      },
    },
    {
      id: 'persuasive',
      personaKey: 'commercial',
      title: 'Commercial Percutant & Closer',
      badge: 'Closing & Prise de RDV',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      borderColor: 'border-rose-400 ring-2 ring-rose-500/20',
      bgLight: 'bg-rose-50/40',
      icon: Flame,
      tagline: 'Proactif, valorise l\'exclusivité et déclenche la prise de rendez-vous.',
      description: 'Crée un sentiment d\'opportunité mesuré, relance de manière persuasive sans jamais forcer, orienté 100% conversion en visite réelle.',
      idealFor: 'Mandats exclusifs, ventes urgentes, négociations dynamiques et closing.',
      sampleResponses: {
        contact: `Bonjour et bienvenue. Je suis ${agentName}. Vous avez un projet ambitieux et le marché actuel offre des opportunités remarquables à qui sait se positionner avec réactivité. Que recherchez-vous en priorité ?`,
        outOfStock: `Cette typologie est extrêmement convoitée. Plutôt que d'attendre, je vous suggère de découvrir en exclusivité notre bien similaire à proximité qui coche 90% de vos critères avec un excellent potentiel de plus-value.`,
        visit: `Excellent choix. Ce bien fait partie de nos mandats les plus demandés ce mois-ci. Je bloque provisoirement votre option pour samedi afin qu'aucun autre acquéreur ne prenne le créneau d'ici la validation de notre conseiller.`,
        followup: `Bonjour. Une offre d'achat vient d'être déposée sur une propriété comparable dans le même quartier. Si vous souhaitez visiter avant la fin de semaine, répondez-moi simplement 'OUI' pour que je vous réserve la priorité.`,
      },
    },
  ];

  const currentPreset = personalityPresets.find((p) => p.id === voiceTone.tone) || personalityPresets[0];

  const handleSelectPersonality = (preset: PersonalityPreset) => {
    setVoiceTone((prev) => ({
      ...prev,
      tone: preset.id,
    }));
    setAgentPersona(preset.personaKey);
  };

  // Web Speech API Voice Preview
  const handleToggleVoicePlayback = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'fr-FR';

    // Fine-tune speech synthesis based on selected personality & energy
    if (voiceTone.energyLevel === 'high') {
      utterance.rate = 1.15;
      utterance.pitch = 1.1;
    } else if (voiceTone.energyLevel === 'calm') {
      utterance.rate = 0.9;
      utterance.pitch = 0.95;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    if (voiceTone.voiceGender === 'male') {
      utterance.pitch = 0.85;
    } else if (voiceTone.voiceGender === 'female') {
      utterance.pitch = 1.15;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    setFaqs((prev) => [
      ...prev,
      {
        id: `faq-${Date.now()}`,
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim(),
      },
    ]);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSaveAll = () => {
    const updatedSettings: AgencySettings = {
      agentName,
      agentPersona,
      voiceTone,
      primaryColor,
      welcomeMessage,
      customFaqs: faqs,
      allowedVisitDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      notificationWhatsapp,
      notificationEmail,
      autoPilotEnabled,
    };

    onUpdateAgencySettings(agency.id, updatedSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const embedScriptCode = `<!-- Intégration IMMOAGENT AI pour ${agency.name} -->
<script 
  src="https://immoagent.ai/widget.js" 
  data-agency-id="${agency.id}" 
  data-agent-name="${agentName}"
  data-agent-tone="${voiceTone.tone}"
  data-primary-color="${primaryColor}"
  async>
</script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentPreviewText = currentPreset.sampleResponses[previewScenario];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Paramètres & Personnalisation de l'Agence
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
              Espace Client en Libre-Service
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Sélectionnez la personnalité et la tonalité vocale de votre agent IA, vos règles d'agence et intégrez le widget à votre image.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isSaved ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Modifications Enregistrées !' : 'Enregistrer mes réglages'}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* NEW HERO SECTION: AI PERSONALITY & VOICE TONE STUDIO          */}
      {/* ============================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Section Title Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Personnalité & Tonalité Vocale de l'Agent IA
                </h2>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Moteur Cognitif Actif
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Définissez le tempérament commercial, le niveau de formalisme et l'énergie des réponses automatiques pour chaque interaction client.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-300">Agent en cours :</span>
            <span className="font-bold text-emerald-400">{agentName}</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-white">{currentPreset.title}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Identity Bar: Agent Name & Welcome Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-200 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Prénom de votre Agent IA</span>
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Ex: Sarah, Alexandre, Victoria..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Ce prénom sera utilisé dans toutes les présentations et relances.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Message d'accueil initial au visiteur</span>
              </label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Message qui engage la conversation dès l'ouverture du widget..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                S'affiche automatiquement dès qu'un visiteur ouvre le widget de discussion.
              </span>
            </div>
          </div>

          {/* 1. Selector of 5 Archetype Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  1. Choisissez l'Archétype de Personnalité Commerciale
                </h3>
                <p className="text-xs text-slate-500">
                  Cliquez sur un profil pour adapter instantanément le vocabulaire, la posture et la stratégie d'écoute de l'agent.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {personalityPresets.map((preset) => {
                const isSelected = voiceTone.tone === preset.id;
                const IconComponent = preset.icon;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPersonality(preset)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? `${preset.borderColor} ${preset.bgLight} shadow-sm`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      {/* Top row with icon & selection badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {preset.title}
                      </h4>

                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${preset.badgeColor}`}
                      >
                        {preset.badge}
                      </span>

                      <p className="mt-2 text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                        {preset.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                      <span className="text-slate-400 block mb-0.5">Cible idéale :</span>
                      <span className="line-clamp-2 text-slate-700">{preset.idealFor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Fine-Tuning Voice Knobs & Sliders */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                2. Réglages Fins de la Voix & Style d'Interaction
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Formality Level */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Niveau de Formalité & Politesse
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  {[
                    { id: 'formal', label: 'Soutenu', desc: 'Vouvoiement strict' },
                    { id: 'moderate', label: 'Équilibré', desc: 'Naturel' },
                    { id: 'casual', label: 'Convivial', desc: 'Proche' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setVoiceTone((prev) => ({ ...prev, formality: f.id as any }))}
                      className={`px-2 py-1.5 rounded-md font-medium text-center transition-colors cursor-pointer ${
                        voiceTone.formality === f.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{f.label}</div>
                      <div className="text-[9px] opacity-75">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Niveau d'Énergie & Dynamisme
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  {[
                    { id: 'calm', label: 'Posé', desc: 'Rassurant' },
                    { id: 'balanced', label: 'Naturel', desc: 'Équilibré' },
                    { id: 'high', label: 'Vif', desc: 'Énergique' },
                  ].map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setVoiceTone((prev) => ({ ...prev, energyLevel: e.id as any }))}
                      className={`px-2 py-1.5 rounded-md font-medium text-center transition-colors cursor-pointer ${
                        voiceTone.energyLevel === e.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{e.label}</div>
                      <div className="text-[9px] opacity-75">{e.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji Usage */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Usage des Émojis dans les Réponses
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  {[
                    { id: 'none', label: 'Aucun', desc: '100% sobre' },
                    { id: 'subtle', label: 'Subtil', desc: '1 discret (🏡)' },
                    { id: 'frequent', label: 'Expressif', desc: 'Chaleureux (✨)' },
                  ].map((em) => (
                    <button
                      key={em.id}
                      type="button"
                      onClick={() => setVoiceTone((prev) => ({ ...prev, emojiUsage: em.id as any }))}
                      className={`px-2 py-1.5 rounded-md font-medium text-center transition-colors cursor-pointer ${
                        voiceTone.emojiUsage === em.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{em.label}</div>
                      <div className="text-[9px] opacity-75">{em.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Instructions Field */}
            <div className="pt-2 text-xs">
              <label className="block font-bold text-slate-800 mb-1">
                Directives comportementales secrètes de l'agence (Instructions IA sur-mesure)
              </label>
              <input
                type="text"
                value={voiceTone.customInstructions || ''}
                onChange={(e) => setVoiceTone((prev) => ({ ...prev, customInstructions: e.target.value }))}
                placeholder="Ex: Toujours mentionner la proximité de la mer • Rappeler que nos mandats sont exclusifs • Privilégier les visites en matinée"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 bg-white placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Ces consignes sont injectées dans chaque prompt sans que le visiteur ne puisse les voir.
              </span>
            </div>
          </div>

          {/* 3. Live Interactive Voice & Dialogue Preview Studio */}
          <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    Studio de Prévisualisation & Test Vocal en Direct
                  </h3>
                  <p className="text-xs text-slate-400">
                    Découvrez comment votre agent s'exprime selon la personnalité active et écoutez le timbre vocal.
                  </p>
                </div>
              </div>

              {/* Audio Playback Button */}
              <button
                type="button"
                onClick={() => handleToggleVoicePlayback(currentPreviewText)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Arrêter la lecture</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Écouter la voix de {agentName}</span>
                  </>
                )}
              </button>
            </div>

            {/* Scenario switcher pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold mr-1">Scénario de test :</span>
              {[
                { id: 'contact', label: '1. Prise de contact' },
                { id: 'outOfStock', label: '2. Bien indisponible' },
                { id: 'visit', label: '3. Proposition visite' },
                { id: 'followup', label: '4. Relance J+2' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setPreviewScenario(sc.id as any);
                    if (isPlayingAudio) {
                      window.speechSynthesis?.cancel();
                      setIsPlayingAudio(false);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    previewScenario === sc.id
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Dialogue Preview Box */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 relative">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  <span className="font-semibold text-emerald-400">{agentName} ({currentPreset.title})</span>
                  <span className="text-slate-500 text-[11px]">| Réponse temps-réel</span>
                </div>

                {isPlayingAudio && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <span className="w-1 h-3 bg-emerald-400 animate-bounce" />
                    <span className="w-1 h-4 bg-emerald-400 animate-bounce delay-75" />
                    <span className="w-1 h-2 bg-emerald-400 animate-bounce delay-150" />
                    <span className="ml-1">Lecture vocale en cours...</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed italic bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                "{currentPreviewText}"
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span>Ton : <strong className="text-slate-200">{currentPreset.title}</strong></span>
                  <span>Formalisme : <strong className="text-slate-200">{voiceTone.formality}</strong></span>
                  <span>Énergie : <strong className="text-slate-200">{voiceTone.energyLevel}</strong></span>
                </div>
                <span className="text-slate-500">
                  Généré avec respect strict du catalogue et zero-hallucination.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECOND ROW: FAQ, EMBED SCRIPT, ALERTS & AUTOPILOT              */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12): Knowledge Base & Agency Custom FAQs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Base de Connaissances & FAQ Exclusives ({faqs.length})
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Enseignées directement à votre IA</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ajoutez vos règles d'agence (honoraires, caution, délais de compromis, secteurs géographiques). L'agent IA s'y référera automatiquement lors des conversations avec les prospects.
            </p>

            {/* Existing FAQs list */}
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs space-y-1 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">Q : {faq.question}</span>
                    <button
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Supprimer cette FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-600 leading-relaxed">R : {faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Add new FAQ form */}
            <form onSubmit={handleAddFaq} className="pt-2 border-t border-slate-100 space-y-2.5 text-xs">
              <span className="font-semibold text-slate-800 block">Ajouter une question/réponse :</span>
              <input
                type="text"
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                placeholder="Question (ex: Quels sont vos horaires de visite ?)"
                className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <textarea
                rows={2}
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                placeholder="Réponse exacte que l'agent IA doit donner..."
                className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter à la mémoire de l'IA</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5/12): Embed Script & Notifications & AutoPilot */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: 1-Click Embed Code for Agency Website */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Code className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-sm">Code d'Intégration sur votre Site</h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Copiez ce script et collez-le sur votre site web (WordPress, Wix, Webflow, Squarespace ou HTML). Le widget apparaîtra instantanément avec votre catalogue et la personnalité configurée.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Couleur d'accent du widget</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-slate-300 p-0.5"
                />
                <span className="font-mono text-xs font-semibold text-slate-700">{primaryColor}</span>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed">
                {embedScriptCode}
              </pre>
              <button
                onClick={copyEmbedCode}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

          {/* Card: Immediate Visit Alerts (WhatsApp & Email) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-sm">Alertes de Visite Immédiates</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Numéro WhatsApp pour recevoir les alertes de visite
                </label>
                <input
                  type="tel"
                  value={notificationWhatsapp}
                  onChange={(e) => setNotificationWhatsapp(e.target.value)}
                  placeholder="+33 6 12 34 56 78 ou +225 07..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Dès qu'un prospect demande une visite en ligne, vous recevez le récapitulatif sur ce WhatsApp.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-mail de contact commercial
                </label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card: Auto-Pilot 24/7 Switch */}
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-950 text-sm">Mode Pilote Automatique 24/7</h3>
              </div>
              <button
                type="button"
                onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  autoPilotEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoPilotEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Lorsque le pilote automatique est actif, l'agent IA répond jour et nuit, enregistre les critères de budget et prépare les relances intelligentes avec la voix et le tempérament sélectionnés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
