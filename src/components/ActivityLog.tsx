import React, { useState } from 'react';
import { ActivityLogItem, ActivityActionType, Language } from '../types';
import {
  Activity,
  Mail,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Zap,
  Filter,
  Search,
  Bot,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface ActivityLogProps {
  logs: ActivityLogItem[];
  agencyId: string;
  agencyName: string;
  onSimulateNewAction?: () => void;
  language: Language;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
  logs,
  agencyId,
  agencyName,
  onSimulateNewAction,
  language,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Format relative timestamp helper
  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return new Date(isoString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (type: ActivityActionType) => {
    switch (type) {
      case 'email_sent':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'lead_qualified':
        return <Target className="w-4 h-4 text-emerald-600" />;
      case 'appointment_requested':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'appointment_validated':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'followup_generated':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      case 'status_updated':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'auto_sync':
        return <Zap className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionBadgeColor = (type: ActivityActionType) => {
    switch (type) {
      case 'email_sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'lead_qualified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'appointment_requested':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'appointment_validated':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'followup_generated':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'status_updated':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'auto_sync':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Filter logs by agency & criteria
  const agencyLogs = logs.filter((l) => l.agencyId === agencyId || l.agencyId === 'all');

  const filteredLogs = agencyLogs.filter((log) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'emails' && log.actionType === 'email_sent') ||
      (filterType === 'leads' && (log.actionType === 'lead_qualified' || log.actionType === 'status_updated')) ||
      (filterType === 'appointments' && (log.actionType === 'appointment_requested' || log.actionType === 'appointment_validated')) ||
      (filterType === 'followups' && log.actionType === 'followup_generated');

    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetName && log.targetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.targetContact && log.targetContact.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">
                Journal d'Activité Autonome de l'Agent IA
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Temps Réel 24/7
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historique des actions autonomes exécutées par Sarah (qualifications, relances, e-mails et visites).
            </p>
          </div>
        </div>

        {onSimulateNewAction && (
          <button
            onClick={onSimulateNewAction}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            title="Simuler un événement autonome de l'agent en direct"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simuler une action IA</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50/70 border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Toutes les actions' },
            { id: 'leads', label: 'Qualifications Leads' },
            { id: 'appointments', label: 'Rendez-vous & Visites' },
            { id: 'emails', label: 'E-mails envoyés' },
            { id: 'followups', label: 'Relances WhatsApp' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par prospect, e-mail..."
            className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400 text-xs"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-2">
            <Activity className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Aucune action enregistrée pour ce filtre.</p>
            <p className="text-slate-400 text-[11px]">
              L'agent IA Sarah enregistre chaque interaction autonome ici en continu.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:px-5 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4 text-xs"
            >
              {/* Left Side: Icon + Title & Description */}
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200/80 shrink-0 mt-0.5">
                  {getActionIcon(log.actionType)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{log.title}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded border ${getActionBadgeColor(
                        log.actionType
                      )}`}
                    >
                      {log.actionType.replace('_', ' ').toUpperCase()}
                    </span>
                    {log.channel && (
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        via {log.channel}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed text-xs max-w-2xl">
                    {log.description}
                  </p>

                  {/* Target contact preview if available */}
                  {(log.targetName || log.targetContact) && (
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-500 font-medium">
                      {log.targetName && <span>Cible : <strong className="text-slate-800">{log.targetName}</strong></span>}
                      {log.targetContact && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-slate-600">{log.targetContact}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Relative Timestamp */}
              <div className="text-right shrink-0">
                <span
                  className="font-mono text-[11px] font-semibold text-slate-500 tabular-nums whitespace-nowrap"
                  title={new Date(log.timestamp).toLocaleString('fr-FR')}
                >
                  {formatRelativeTime(log.timestamp)}
                </span>
                <div className="mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Exécuté avec succès" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-5">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Toutes les actions sont tracées et vérifiées par la politique anti-hallucination.
        </span>
        <span className="font-mono tabular-nums">
          {filteredLogs.length} action{filteredLogs.length > 1 ? 's' : ''} affichée{filteredLogs.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
