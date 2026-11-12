import React, { useState, useRef, useEffect } from 'react';
import { Agency, Property, Language, Currency, VisitAppointment, Lead } from '../types';
import { formatPrice } from '../i18n';
import {
  X,
  Send,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Phone,
  User,
  Mail,
  Loader2,
} from 'lucide-react';

interface LiveAgentWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency;
  properties: Property[];
  language: Language;
  currency: Currency;
  onNewAppointment: (appointment: VisitAppointment) => void;
  onNewLead: (lead: Lead) => void;
}

interface Message {
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
  suggestedPropertyId?: string;
}

export const LiveAgentWidgetModal: React.FC<LiveAgentWidgetModalProps> = ({
  isOpen,
  onClose,
  agency,
  properties,
  language,
  currency,
  onNewAppointment,
  onNewLead,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [visitDate, setVisitDate] = useState('2026-11-14');
  const [visitTime, setVisitTime] = useState('14:30');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [consentGdpr, setConsentGdpr] = useState(true);
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting in appropriate language
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings: Record<Language, string> = {
        fr: `Bonjour et bienvenue chez ${agency.name} ! Je suis Sarah, votre conseillère immobilière en ligne. Comment puis-je vous accompagner dans votre projet d'achat ou d'investissement aujourd'hui ?`,
        en: `Hello and welcome to ${agency.name}! I am Sarah, your online real estate commercial advisor. How can I assist you with your property search or investment today?`,
        es: `¡Hola y bienvenido a ${agency.name}! Soy Sarah, su asesora inmobiliaria virtual. ¿En qué tipo de propiedad o inversión está interesado hoy?`,
        pt: `Olá e seja bem-vindo à ${agency.name}! Sou a Sarah, a sua consultora imobiliária virtual. Como posso ajudar com a sua procura de imóveis hoje?`,
      };

      setMessages([
        {
          sender: 'agent',
          text: greetings[language] || greetings.fr,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, agency, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          agencyName: agency.name,
          agentName: agency.settings?.agentName || 'Sarah',
          agentPersona: agency.settings?.agentPersona || 'prestige',
          voiceTone: agency.settings?.voiceTone,
          language: language,
          propertyCatalog: properties,
          leadContext: {
            name: leadName || undefined,
            phone: leadPhone || undefined,
            email: leadEmail || undefined,
            consentGdpr,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Failed to get AI reply:', err);
      // Fallback message grounded on catalog
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text:
            language === 'fr'
              ? `Je vous remercie pour votre message. À l'agence ${agency.name}, nous avons actuellement ${properties.length} biens d'exception disponibles (villas, appartements, duplex). Souhaitez-vous que je vous détaille leurs caractéristiques ou que nous planifiions une visite avec un conseiller ?`
              : `Thank you for your message. At ${agency.name}, we currently have ${properties.length} verified listings available. Would you like me to share details on pricing and availability or schedule a visit?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !consentGdpr) return;

    const targetProp = properties.find((p) => p.id === selectedPropertyId) || properties[0];

    const newAppointment: VisitAppointment = {
      id: `appt-${Date.now()}`,
      agencyId: agency.id,
      leadId: `lead-${Date.now()}`,
      propertyId: targetProp.id,
      leadName,
      leadPhone,
      leadEmail,
      propertyTitle: targetProp.title,
      requestedDate: visitDate,
      requestedTime: visitTime,
      status: 'en_attente_validation',
      agentNotes: `Demande formulée via le widget en ligne par ${leadName}. Préférence: ${visitDate} à ${visitTime}.`,
      createdAt: new Date().toISOString(),
    };

    onNewAppointment(newAppointment);

    const newLead: Lead = {
      id: newAppointment.leadId,
      agencyId: agency.id,
      fullName: leadName,
      email: leadEmail || `${leadName.toLowerCase().replace(/\s+/g, '.')}@client.com`,
      phone: leadPhone,
      whatsapp: leadPhone.replace(/\s+/g, ''),
      propertyInterestId: targetProp.id,
      budget: formatPrice(targetProp.price, targetProp.currency),
      preferredLocation: targetProp.city,
      propertyType: targetProp.type,
      timeframe: 'Urgent (< 1 mois)',
      score: 'Chaud',
      scoreReason: 'A formulé une demande de visite en ligne avec téléphone et consentement validé.',
      consentGdpr: true,
      status: 'visite_demandee',
      createdAt: new Date().toISOString(),
      lastActivity: "À l'instant (demande de visite)",
    };

    onNewLead(newLead);
    setVisitSubmitted(true);

    // Add confirmation message to chat
    setMessages((prev) => [
      ...prev,
      {
        sender: 'agent',
        text:
          language === 'fr'
            ? `C'est bien noté, ${leadName} ! Votre demande de visite pour le bien "${targetProp.title}" le ${visitDate} à ${visitTime} a été transmise à l'équipe commerciale. Conformément à notre politique, notre conseiller va vérifier la disponibilité des clés et vous valider le créneau par SMS/WhatsApp au ${leadPhone}. À très bientôt !`
            : `Thank you ${leadName}! Your visit request for "${targetProp.title}" on ${visitDate} at ${visitTime} has been submitted to the team. Per our policy, our human advisor will verify availability and confirm the slot shortly via ${leadPhone}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setTimeout(() => {
      setShowVisitModal(false);
      setVisitSubmitted(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[90vh] max-h-[720px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header of Widget */}
        <div className="bg-[#0B132B] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/src/assets/images/immoagent_avatar_sarah_1794417278308.jpg"
                alt="Sarah - Conseillère Immobilière IA"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B132B] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Sarah</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                  Conseillère IA
                </span>
              </div>
              <div className="text-xs text-slate-300 truncate max-w-[260px] sm:max-w-md">
                {agency.name} · {agency.city}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVisitModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Demander une visite</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grounding Integrity Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Catalogue vérifié : <strong>{properties.length} biens</strong> en vente/location</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">IA connectée à Gemini 3.8 Flash</span>
        </div>

        {/* Conversation Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0B132B] text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono tabular-nums ${
                    msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Sarah analyse le catalogue officiel...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-slate-400 shrink-0">Suggestions :</span>
          <button
            onClick={() => handleSendMessage('Quels sont les biens disponibles dans votre agence ?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md whitespace-nowrap transition-colors cursor-pointer"
          >
            Quels biens disponibles ?
          </button>
          <button
            onClick={() => handleSendMessage('Avez-vous une villa avec piscine ? Quel est son prix ?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md whitespace-nowrap transition-colors cursor-pointer"
          >
            Villa avec piscine ?
          </button>
          <button
            onClick={() => handleSendMessage('Je souhaite visiter un bien cette semaine')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md whitespace-nowrap transition-colors cursor-pointer"
          >
            Demander une visite
          </button>
          <button
            onClick={() => handleSendMessage('Avez-vous des biens à New York ou Tokyo ?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md whitespace-nowrap transition-colors cursor-pointer"
            title="Teste le grounding strict : Sarah ne doit rien inventer"
          >
            Test hors catalogue (anti-hallucination)
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowVisitModal(true)}
            className="sm:hidden p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
            title="Demander une visite"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Posez une question sur un bien, un budget, une ville..."
            className="flex-1 bg-slate-100 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-[#0B132B] hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Modal: Schedule a Visit with Agent Validation Warning */}
        {showVisitModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Planifier une Visite</h3>
                </div>
                <button
                  onClick={() => setShowVisitModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {visitSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900">Demande de visite enregistrée !</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Votre créneau a été transmis à l'équipe commerciale. Un conseiller humain va vérifier les disponibilités et vous contacter par WhatsApp/SMS.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookVisitSubmit} className="mt-4 space-y-3.5 text-xs">
                  {/* Strict Rule Notice */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Règle de sécurité :</strong> Aucun créneau n'est confirmé automatiquement. Un agent humain de l'agence vérifiera et validera le rendez-vous.
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bien à visiter</label>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.city} - {formatPrice(p.price, p.currency)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date souhaitée</label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Heure souhaitée</label>
                      <input
                        type="time"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Votre Nom & Prénom</label>
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ex: Jean Dupont"
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Téléphone / WhatsApp</label>
                      <input
                        type="tel"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="Ex: +33 6 12 34 56 78"
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email (facultatif)</label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Ex: jean.dupont@email.com"
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* GDPR Consent Checkbox */}
                  <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentGdpr}
                      onChange={(e) => setConsentGdpr(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      required
                    />
                    <span>
                      J'accepte que l'agence me contacte par téléphone ou WhatsApp au sujet de cette visite et de ma recherche immobilière (conformément à la politique RGPD).
                    </span>
                  </label>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVisitModal(false)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-800"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={!leadName || !leadPhone || !consentGdpr}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Transmettre ma demande
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
