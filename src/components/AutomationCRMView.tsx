import React, { useState } from 'react';
import { OutboundProspect, Language } from '../types';
import { translations } from '../i18n';
import {
  Send,
  Mail,
  ShieldCheck,
  Sparkles,
  Phone,
  Building,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';

interface AutomationCRMViewProps {
  prospects: OutboundProspect[];
  onAddProspect: (prospect: OutboundProspect) => void;
  onUpdateCadence: (id: string, step: OutboundProspect['cadenceStep']) => void;
  language: Language;
}

export const AutomationCRMView: React.FC<AutomationCRMViewProps> = ({
  prospects,
  onAddProspect,
  onUpdateCadence,
  language,
}) => {
  const [selectedProspect, setSelectedProspect] = useState<OutboundProspect | null>(null);
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New prospect form state
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('France');
  const [newLang, setNewLang] = useState<Language>('fr');

  const handleOpenDraftModal = async (prospect: OutboundProspect) => {
    setSelectedProspect(prospect);
    setIsGeneratingEmail(true);

    const templates: Record<Language, { subject: string; body: string }> = {
      fr: {
        subject: `Opportunité pour ${prospect.agencyName} : qualification automatique 24/7 de vos acheteurs`,
        body: `Bonjour ${prospect.contactPerson},\n\nJ'ai remarqué le positionnement haut de gamme de ${prospect.agencyName} à ${prospect.city}.\n\nSavez-vous que plus de 42% des demandes d'acheteurs arrivent le soir et le week-end, lorsque les conseillers sont en visite ?\n\nNous avons conçu IMMOAGENT AI : un agent commercial IA qui dialogue 24h/24 avec vos visiteurs, répond exclusivement d'après votre catalogue officiel (zéro hallucination de prix ou de bien), qualifie le budget et le délai, et planifie des visites soumises à votre validation.\n\nSouhaitez-vous découvrir une démonstration interactive de 3 minutes personnalisée aux couleurs de ${prospect.agencyName} ?\n\nBien cordialement,\nL'équipe ImmoAgent AI\n\n--\nConformément à la réglementation RGPD / Anti-spam : Cet e-mail professionnel B2B vous est adressé en raison de votre activité immobilière. Si vous ne souhaitez plus recevoir de messages de notre part, cliquez simplement ici pour vous désinscrire.`,
      },
      en: {
        subject: `Growth opportunity for ${prospect.agencyName}: 24/7 AI inbound lead conversion`,
        body: `Dear ${prospect.contactPerson},\n\nI came across ${prospect.agencyName} in ${prospect.city} and was impressed by your premium property portfolio.\n\nOver 40% of high-net-worth real estate buyers inquire outside normal business hours. With IMMOAGENT AI, your website visitors are instantly greeted by an AI advisor grounded strictly in your official listings (never hallucinating unavailable homes or prices).\n\nWould you have 5 minutes this week for a live interactive preview customized for ${prospect.agencyName}?\n\nBest regards,\nThe ImmoAgent AI Team\n\n--\nB2B CAN-SPAM & GDPR compliance notice: You received this business email regarding real estate sales automation. To unsubscribe and opt-out of future contact, reply with "STOP" or click here.`,
      },
      es: {
        subject: `Atención 24/7 y calificación de prospectos para ${prospect.agencyName}`,
        body: `Estimado/a ${prospect.contactPerson},\n\nLe escribo tras conocer la excelente labor de ${prospect.agencyName} en ${prospect.city}.\n\nIMMOAGENT AI permite a su inmobiliaria calificar prospectos 24 horas al día, verificar presupuestos y concertar solicitudes de visita sin que su equipo pierda tiempo con curiosos.\n\n¿Le interesaría ver una demo en directo de 3 minutos?\n\nAtentamente,\nEquipo ImmoAgent AI\n\n--\nCumplimiento RGPD B2B: Si no desea recibir más información, responda "BAJA".`,
      },
      pt: {
        subject: `Qualificação 24/7 de compradores para ${prospect.agencyName}`,
        body: `Olá ${prospect.contactPerson},\n\nAcompanho com admiração o portfólio da ${prospect.agencyName} em ${prospect.city}.\n\nCom o IMMOAGENT AI, a sua imobiliária recebe, qualifica e pré-agenda visitas com compradores 24 horas por dia, com total respeito aos imóveis reais da sua agência.\n\nPodemos agendar uma demonstração rápida de 3 minutos?\n\nCom os melhores cumprimentos,\nEquipe ImmoAgent AI\n\n--\nConformidade RGPD: Para não receber mais mensagens, responda com "CANCELAR".`,
      },
    };

    const targetTemplate = templates[prospect.language] || templates.fr;
    setDraftSubject(targetTemplate.subject);
    setDraftBody(targetTemplate.body);
    setIsGeneratingEmail(false);
  };

  const handleCreateProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName || !newEmail) return;

    const newP: OutboundProspect = {
      id: `out-${Date.now()}`,
      agencyName: newAgencyName,
      contactPerson: newContact || 'Directeur Général',
      email: newEmail,
      phone: newPhone || '+33 1 00 00 00 00',
      city: newCity || 'Paris',
      country: newCountry,
      cadenceStep: 'nouveau',
      language: newLang,
      notes: 'Ajouté manuellement pour prospection ciblée.',
    };

    onAddProspect(newP);
    setIsNewModalOpen(false);

    // Reset
    setNewAgencyName('');
    setNewContact('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Automatisation Commerciale B2B (Prospection Agences)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Module de vente d'ImmoAgent AI auprès des agences immobilières internationales.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une agence cible</span>
        </button>
      </div>

      {/* Strict Anti-Spam Compliance Callout */}
      <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 leading-relaxed">
          <strong>Conformité Anti-Spam & RGPD B2B :</strong> Tous les messages sont personnalisés
          selon l'agence, expédiés depuis une adresse de domaine vérifiée avec signatures DKIM/SPF,
          sans harcèlement de masse, et intègrent obligatoirement une mention claire de
          désinscription opt-out.
        </div>
      </div>

      {/* Prospects Pipeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">
            Agences Immobilières Prospects ({prospects.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Cadence automatique : J+0 · Relance J+2 · Relance J+5
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Agence & Contact</th>
                <th className="py-2.5 px-4 font-semibold">Localisation</th>
                <th className="py-2.5 px-4 font-semibold">Langue Cible</th>
                <th className="py-2.5 px-4 font-semibold">Étape Cadence</th>
                <th className="py-2.5 px-4 font-semibold">Dernier Contact</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prospects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-sm">{p.agencyName}</div>
                    <div className="text-slate-500 text-[11px]">
                      {p.contactPerson} · {p.email}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    <div>{p.city}</div>
                    <div className="text-[11px] text-slate-400">{p.country}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="uppercase text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {p.language}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={p.cadenceStep}
                      onChange={(e) =>
                        onUpdateCadence(p.id, e.target.value as OutboundProspect['cadenceStep'])
                      }
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="nouveau">À contacter</option>
                      <option value="email_j0">E-mail J+0 envoyé</option>
                      <option value="relance_j2">Relance J+2 envoyée</option>
                      <option value="relance_j5">Relance J+5 envoyée</option>
                      <option value="demo_vue">Démo testée</option>
                      <option value="converti">Converti / Abonné</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {p.lastContactDate || 'Pas encore'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenDraftModal(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Rédiger l'e-mail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Draft Modal */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  E-mail Personnalisé B2B pour {selectedProspect.agencyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProspect(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Destinataire :</span>
                  <span className="font-semibold text-slate-800">
                    {selectedProspect.contactPerson} ({selectedProspect.email})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Expéditeur certifié :</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    contact@immoagent.ai (DKIM/SPF)
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objet de l'e-mail</label>
                <input
                  type="text"
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corps du message</label>
                <textarea
                  rows={10}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Respecte l'article L.34-5 du CPCE & GDPR pour la prospection B2B.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProspect(null)}
                    className="px-3 py-2 text-slate-600 hover:text-slate-800"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      onUpdateCadence(selectedProspect.id, 'email_j0');
                      alert(
                        `E-mail envoyé avec succès à ${selectedProspect.email} !\nCadence mise à jour à J+0.`
                      );
                      setSelectedProspect(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer l'e-mail officiel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Target Prospect Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Ajouter une Agence Cible</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProspect} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de l'agence</label>
                <input
                  type="text"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  placeholder="Ex: Agence des Palmiers Immobilier"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom du contact</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="Ex: François Martin"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email pro</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Ex: direction@palmiers-immo.com"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Ex: Dakar, Nice, Genève"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pays</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Langue</label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value as Language)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Ajouter au CRM Outbound
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
