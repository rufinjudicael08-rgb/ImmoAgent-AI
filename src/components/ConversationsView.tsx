import React, { useState } from 'react';
import { Agency, Lead, Property, Language } from '../types';
import { translations } from '../i18n';
import {
  MessageSquare,
  UserCheck,
  UserX,
  Sparkles,
  Send,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Building,
  Target,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Bot,
  User,
} from 'lucide-react';

interface ConversationsViewProps {
  agency: Agency;
  leads: Lead[];
  properties: Property[];
  selectedLeadId: string;
  onSelectLead: (leadId: string) => void;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'human';
  text: string;
  timestamp: string;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  agency,
  leads,
  properties,
  selectedLeadId,
  onSelectLead,
  language,
}) => {
  const t = translations[language];

  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const [isHumanHandover, setIsHumanHandover] = useState(activeLead?.humanHandoverRequested || false);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'lead-1': [
      {
        id: 'm1',
        sender: 'user',
        text: 'Bonjour, je suis très intéressé par votre villa à Cannes avec vue mer et piscine. Quel est son prix exact ?',
        timestamp: '14:20',
      },
      {
        id: 'm2',
        sender: 'agent',
        text: `Bonjour Monsieur de Saint-Pierre ! Il s'agit de la Villa Contemporaine Baie de Cannes (Réf: CAN-VIL-2026), affichée à 1 850 000 €. Elle offre 340 m² habitables, 6 pièces et une piscine à débordement chauffée face à la mer. Avez-vous un délai particulier pour votre projet d'acquisition ?`,
        timestamp: '14:21',
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'Mon budget est autour de 1,9 M€ comptant. Nous souhaitons acheter d\'ici 1 mois maximum. Est-il possible de la visiter ce samedi à 14h30 ?',
        timestamp: '14:22',
      },
      {
        id: 'm4',
        sender: 'agent',
        text: `C'est un timing parfait et votre budget correspond parfaitement. J'ai pré-enregistré votre demande pour samedi à 14h30. Conformément à notre charte, notre conseiller Thomas va vérifier les accès et vous valider le créneau par WhatsApp au +33 6 12 90 44 21.`,
        timestamp: '14:23',
      },
    ],
    'lead-2': [
      {
        id: 'm20',
        sender: 'user',
        text: 'Bonjour, l\'appartement de 115 m² dans le 16ème dispose-t-il d\'un ascenseur privatif et d\'un balcon ?',
        timestamp: '18:08',
      },
      {
        id: 'm21',
        sender: 'agent',
        text: `Bonjour ! Oui, cet appartement d'exception au Trocadéro (Réf: PAR-APP-884, 920 000 €) dispose bien d'un ascenseur privé arrivant sur palier et d'un balcon filant avec vue Tour Eiffel. Recherchez-vous pour votre résidence principale ?`,
        timestamp: '18:09',
      },
      {
        id: 'm22',
        sender: 'user',
        text: 'Oui, mutation professionnelle d\'ici 2 mois. Mon budget bancaire est validé jusqu\'à 950 000 €.',
        timestamp: '18:10',
      },
    ],
    'lead-4': [
      {
        id: 'm40',
        sender: 'user',
        text: 'Bonjour, avez-vous une villa de standing disponible à Abidjan Riviera Golf ?',
        timestamp: '09:28',
      },
      {
        id: 'm41',
        sender: 'agent',
        text: `Bonjour Monsieur Kouamé ! Nous disposons exactement de la Résidence Moderne Riviera Golf 4 (Réf: ABJ-VIL-104), 7 pièces, 480 m² avec jardin tropical, piscine et groupe électrogène insonorisé, au prix de 380 000 000 FCFA. Souhaitez-vous recevoir la brochure complète ?`,
        timestamp: '09:29',
      },
      {
        id: 'm42',
        sender: 'user',
        text: 'Oui absolument sur mon WhatsApp +225 05 60 40 30 20. Pouvons-nous prévoir une visite avec notre directeur technique ?',
        timestamp: '09:30',
      },
    ],
  });

  const [inputText, setInputText] = useState('');
  const [followupLoading, setFollowupLoading] = useState(false);
  const [generatedFollowup, setGeneratedFollowup] = useState('');

  const currentChat = messages[activeLead?.id] || [];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isHumanHandover ? 'human' : 'agent',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeLead.id]: [...(prev[activeLead.id] || []), newMsg],
    }));

    setInputText('');
  };

  const handleGenerateSmartFollowup = async () => {
    setFollowupLoading(true);
    setGeneratedFollowup('');
    try {
      const response = await fetch('/api/ai/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: activeLead.fullName,
          propertyTitle: activeLead.propertyType || 'votre recherche immobilière',
          channel: 'whatsapp',
          language: language,
          reason: 'Prospect qualifié avec créneau de visite en attente de confirmation',
        }),
      });

      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      setGeneratedFollowup(data.message);
    } catch (err) {
      console.error(err);
      setGeneratedFollowup(
        `Bonjour ${activeLead.fullName}, c'est l'équipe de ${agency.name}. Nous avons bien vos critères de recherche en tête. Souhaitez-vous faire le point sur vos disponibilités pour visiter nos opportunités cette semaine ?`
      );
    } finally {
      setFollowupLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t.conversations.title}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">{t.conversations.subtitle}</p>
      </div>

      {/* Main Split Layout: Left List + Center Chat + Right Lead Qualification Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[750px] bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Left Col (3/12): Leads Conversation Threads */}
        <div className="lg:col-span-3 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Conversations en cours</span>
            <span className="text-[11px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
              {leads.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {leads.map((lead) => {
              const isSelected = lead.id === activeLead?.id;
              return (
                <button
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                    isSelected ? 'bg-white border-l-3 border-emerald-500 shadow-xs' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {lead.fullName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        lead.score === 'Chaud'
                          ? 'bg-rose-100 text-rose-700'
                          : lead.score === 'Tiède'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {lead.score}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mb-1">
                    {lead.propertyType || lead.preferredLocation}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{lead.lastActivity}</span>
                    <span className="font-mono">{lead.budget}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Col (6/12): Live Chat Message Thread */}
        <div className="lg:col-span-6 flex flex-col h-full">
          {/* Top Bar of Active Conversation */}
          <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {activeLead?.fullName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2) || 'CL'}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <span>{activeLead?.fullName}</span>
                  <span className="text-[10px] text-slate-400">({activeLead?.phone})</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {isHumanHandover ? (
                    <span className="text-purple-600 font-semibold flex items-center gap-1">
                      <User className="w-3 h-3" /> Conseiller humain en direct
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Bot className="w-3 h-3" /> Sarah (IA) gère l'échange 24/7
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Human Handover Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHumanHandover(!isHumanHandover)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isHumanHandover
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Transférer immédiatement la conversation entre l'IA et un agent humain"
              >
                {isHumanHandover ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rendre à l'IA</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Prendre la main</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
            {currentChat.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-start' : 'items-end'
                }`}
              >
                <div className="text-[10px] text-slate-400 mb-1 px-1">
                  {msg.sender === 'user'
                    ? activeLead.fullName
                    : msg.sender === 'human'
                    ? 'Vous (Conseiller Agence)'
                    : 'Sarah (Agent IA)'}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                      : msg.sender === 'human'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-[#0B132B] text-white shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right font-mono ${
                      msg.sender === 'user' ? 'text-slate-400' : 'text-slate-300'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                isHumanHandover
                  ? 'Répondre directement en tant que conseiller humain...'
                  : 'Injecter une réponse ou basculer en mode humain...'
              }
              className="flex-1 bg-slate-100 border border-slate-200 focus:bg-white focus:border-slate-400 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#0B132B] hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col (3/12): Real-Time Qualification Card & Follow-Up Generator */}
        <div className="lg:col-span-3 border-l border-slate-200 p-4 flex flex-col justify-between overflow-y-auto bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Qualification IA</span>
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeLead?.score === 'Chaud'
                    ? 'bg-rose-100 text-rose-800'
                    : activeLead?.score === 'Tiède'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Lead {activeLead?.score}
              </span>
            </div>

            {/* Qualification Criteria List */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Budget Validé</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {activeLead?.budget || 'Non précisé'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Localisation</span>
                <span className="text-slate-800 font-semibold">
                  {activeLead?.preferredLocation || 'Tout secteur'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Type de bien</span>
                <span className="text-slate-800 font-semibold">{activeLead?.propertyType}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Délai du projet</span>
                <span className="text-slate-800 font-semibold">
                  {activeLead?.timeframe || 'En cours d\'évaluation'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Consentement RGPD</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Accord explicite recueilli
                </span>
              </div>

              {activeLead?.scoreReason && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <strong>Synthèse IA :</strong> {activeLead.scoreReason}
                </div>
              )}
            </div>

            {/* Smart Follow-up Section (Relance anti-spam) */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900">Relance Intelligente</span>
                <span className="text-[10px] text-slate-400">Anti-spam</span>
              </div>

              <button
                onClick={handleGenerateSmartFollowup}
                disabled={followupLoading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-300 transition-colors cursor-pointer"
              >
                {followupLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>Générer un message de relance</span>
              </button>

              {generatedFollowup && (
                <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 space-y-2">
                  <p className="whitespace-pre-line leading-relaxed">{generatedFollowup}</p>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedFollowup);
                        setInputText(generatedFollowup);
                      }}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Copier dans l'envoi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="pt-4 border-t border-slate-200">
            <a
              href={`https://wa.me/${activeLead?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Bonjour ${activeLead?.fullName}, suite à votre échange avec notre conseillère IA Sarah chez ${agency.name}, je suis à votre écoute pour organiser votre visite.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir WhatsApp direct</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
