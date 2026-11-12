import React from 'react';
import { Agency, Property, Lead, VisitAppointment, Language, Currency, AutomationLog } from '../types';
import { translations, formatPrice } from '../i18n';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Building,
  Phone,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  agency: Agency;
  properties: Property[];
  leads: Lead[];
  appointments: VisitAppointment[];
  activityLogs?: AutomationLog[];
  language: Language;
  currency: Currency;
  onOpenWidget: () => void;
  onSelectLead: (leadId: string) => void;
  onValidateAppointment: (appointmentId: string) => void;
  onNavigateTab: (tab: string) => void;
  onSimulateNewAction?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  agency,
  properties,
  leads,
  appointments,
  activityLogs,
  language,
  currency,
  onOpenWidget,
  onSelectLead,
  onValidateAppointment,
  onNavigateTab,
  onSimulateNewAction,
}) => {
  const t = translations[language];

  const pendingAppointments = appointments.filter((a) => a.status === 'en_attente_validation');
  const hotLeads = leads.filter((l) => l.score === 'Chaud');
  const warmLeads = leads.filter((l) => l.score === 'Tiède');

  // Calculate estimated pipeline
  const totalPipelineValue = properties
    .filter((p) => p.status === 'disponible')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6">
      {/* Header section with Agency greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.dashboard.title}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
              IA 24h/24 Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{t.dashboard.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('properties')}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Gérer les biens ({properties.length})
          </button>
          <button
            onClick={onOpenWidget}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tester l'Agent Sarah</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Qualified Leads */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t.dashboard.qualifiedLeads}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {leads.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              {hotLeads.length} chauds
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {warmLeads.length} tièdes en cours de maturation
          </div>
        </div>

        {/* Metric 2: Conversion Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t.dashboard.conversionRate}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              28.4%
            </span>
            <span className="text-xs text-slate-500">visites / contacts</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Moyenne marché standard : 9.5%
          </div>
        </div>

        {/* Metric 3: Pending Appointments */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t.dashboard.pendingAppointments}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              pendingAppointments.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {pendingAppointments.length}
            </span>
            {pendingAppointments.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded">
                Validation requise
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Zéro confirmation automatique (règle stricte)
          </div>
        </div>

        {/* Metric 4: Estimated Pipeline Value */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t.dashboard.pipelineEstimate}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {formatPrice(totalPipelineValue, agency.currency)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {properties.filter((p) => p.status === 'disponible').length} biens disponibles en stock
          </div>
        </div>
      </div>

      {/* Critical Section: Pending Visit Requests Awaiting Human Validation */}
      {pendingAppointments.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">
                  {pendingAppointments.length} Demande{pendingAppointments.length > 1 ? 's' : ''} de visite en attente de validation humaine
                </h3>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  L’agent IA Sarah a recueilli le créneau et les coordonnées du prospect avec son consentement. Conformément aux consignes de sécurité, aucune confirmation n’a été transmise au client avant votre accord explicite.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs text-amber-900 font-semibold hover:underline shrink-0 hidden sm:inline"
            >
              Voir le planning complet →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-lg p-3.5 border border-amber-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{appt.leadName}</span>
                    <span className="font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">
                      {appt.requestedDate} à {appt.requestedTime}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-1 mb-2 font-medium">
                    {appt.propertyTitle}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {appt.leadPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onValidateAppointment(appt.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valider & Confirmer au client</span>
                  </button>
                  <a
                    href={`https://wa.me/${appt.leadPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${appt.leadName}, je suis votre conseiller chez ${agency.name}. Je fais suite à votre demande de visite pour "${appt.propertyTitle}".`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    title="Ouvrir WhatsApp direct"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Funnel & Commercial Automation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Recent Qualified Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">{t.dashboard.recentLeads}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chaque contact a été qualifié automatiquement par l’agent IA selon budget, zone et délai.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer"
            >
              {t.dashboard.viewAll} →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Prospect</th>
                  <th className="py-2.5 px-4 font-semibold">Score IA</th>
                  <th className="py-2.5 px-4 font-semibold">Budget</th>
                  <th className="py-2.5 px-4 font-semibold">Zone / Type</th>
                  <th className="py-2.5 px-4 font-semibold">Délai</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.slice(0, 4).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-400">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          lead.score === 'Chaud'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : lead.score === 'Tiède'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {lead.budget || 'Non précisé'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{lead.preferredLocation}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{lead.propertyType}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {lead.timeframe || 'En cours'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectLead(lead.id);
                            onNavigateTab('conversations');
                          }}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors cursor-pointer"
                          title="Voir la conversation IA"
                        >
                          Chat
                        </button>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded font-semibold transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Funnel Breakdown & Quotas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Entonnoir de Conversion</h3>
              <span className="text-[11px] text-slate-400">Ce mois</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>1. Visiteurs ayant engagé le dialogue IA</span>
                  <span className="font-mono font-bold text-slate-900">842</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>2. Critères budget & zone qualifiés</span>
                  <span className="font-mono font-bold text-slate-900">512 (60.8%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[60.8%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>3. Coordonnées & consentement validés</span>
                  <span className="font-mono font-bold text-slate-900">324 (38.5%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[38.5%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>4. Demandes de visite soumises</span>
                  <span className="font-mono font-bold text-slate-900">239 (28.4%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[28.4%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quota usage box */}
          <div className="mt-6 pt-4 border-t border-slate-200 bg-slate-50 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
              <span>Quota conversations Formule {agency.planId.toUpperCase()}</span>
              <span className="font-mono">
                {agency.quotaUsage.conversationsUsed} / {agency.quotaUsage.conversationsMax}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${Math.min(
                    100,
                    (agency.quotaUsage.conversationsUsed / agency.quotaUsage.conversationsMax) * 100
                  )}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Recharge automatique activée</span>
              <button
                onClick={() => onNavigateTab('billing')}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Gérer le forfait →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
