import React, { useState } from 'react';
import { Lead, Agency, LeadStatus, LeadScore } from '../types';
import { translations } from '../i18n';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

interface LeadsViewProps {
  agency: Agency;
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onSelectLead: (leadId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  agency,
  leads,
  onUpdateLeadStatus,
  onSelectLead,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  const agencyLeads = leads.filter((l) => l.agencyId === agency.id);

  const filtered = agencyLeads.filter((l) => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.preferredLocation && l.preferredLocation.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesScore = scoreFilter === 'all' || l.score === scoreFilter;

    return matchesSearch && matchesStatus && matchesScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pipeline Prospects (CRM Immobilier)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi des prospects collectés avec consentement et qualifiés 24h/24 par l'IA.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Total : <strong className="text-slate-900 font-mono">{agencyLeads.length} prospects</strong> qualifiés
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone, ville..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium cursor-pointer focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="qualifié">Qualifié Chaud</option>
            <option value="visite_demandee">Visite Demandée</option>
            <option value="offre">Offre en cours</option>
            <option value="converti">Converti / Signé</option>
            <option value="archive">Archivé</option>
          </select>

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium cursor-pointer focus:outline-none"
          >
            <option value="all">Tous les scores</option>
            <option value="Chaud">Score Chaud 🔥</option>
            <option value="Tiède">Score Tiède ☀️</option>
            <option value="Froid">Score Froid ❄️</option>
          </select>
        </div>
      </div>

      {/* Leads Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Prospect & Contact</th>
                <th className="py-3 px-4 font-semibold">Score IA</th>
                <th className="py-3 px-4 font-semibold">Budget & Critères</th>
                <th className="py-3 px-4 font-semibold">Délai Projet</th>
                <th className="py-3 px-4 font-semibold">Consentement RGPD</th>
                <th className="py-3 px-4 font-semibold">Étape Pipeline</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{lead.fullName}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                      <span>{lead.phone}</span>
                      <span>·</span>
                      <span className="truncate max-w-[150px]">{lead.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        lead.score === 'Chaud'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : lead.score === 'Tiède'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lead.score}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 font-mono">{lead.budget || 'Non précisé'}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {lead.preferredLocation} · {lead.propertyType}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {lead.timeframe || 'En cours'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Opt-in Validé
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="qualifié">Qualifié Chaud</option>
                      <option value="visite_demandee">Visite Demandée</option>
                      <option value="offre">Offre en cours</option>
                      <option value="converti">Converti / Acté</option>
                      <option value="archive">Archivé</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          onSelectLead(lead.id);
                          onNavigateTab('conversations');
                        }}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors cursor-pointer"
                        title="Voir la discussion avec l'IA"
                      >
                        Discussion
                      </button>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Bonjour ${lead.fullName}, je suis conseiller chez ${agency.name}. Je fais suite à vos critères pour votre recherche immobilière.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
