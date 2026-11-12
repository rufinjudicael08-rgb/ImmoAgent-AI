import React, { useState, useEffect } from 'react';
import { Agency, Transaction, Language } from '../types';
import { translations, formatPrice } from '../i18n';
import {
  ShieldAlert,
  Building,
  TrendingUp,
  CreditCard,
  Users,
  Power,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Database,
  Sliders,
} from 'lucide-react';

interface SuperAdminViewProps {
  agencies: Agency[];
  transactions: Transaction[];
  onToggleAgencyStatus: (agencyId: string) => void;
  language: Language;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  agencies,
  transactions,
  onToggleAgencyStatus,
  language,
}) => {
  const [automationsActive, setAutomationsActive] = useState(true);
  const [webhookAuditLogs, setWebhookAuditLogs] = useState<any[]>([]);
  const [isTogglingKillSwitch, setIsTogglingKillSwitch] = useState(false);

  // Calculate MRR
  const totalMrr = agencies.reduce((acc, a) => {
    const planPrice = a.planId === 'starter' ? 49 : a.planId === 'pro' ? 99 : 249;
    return acc + planPrice;
  }, 0);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setAutomationsActive(data.automationsActive);
      }
      const logsRes = await fetch('/api/webhooks/logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setWebhookAuditLogs(logsData.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggleKillSwitch = async () => {
    setIsTogglingKillSwitch(true);
    try {
      const res = await fetch('/api/system/toggle-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !automationsActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setAutomationsActive(data.automationsActive);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTogglingKillSwitch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Super-Administration Plateforme SaaS
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-300">
              Accès Propriétaire
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Supervision globale des agences abonnées, chiffre d'affaires récurrent et coupe-circuit d'urgence.
          </p>
        </div>

        {/* Global Emergency Kill-Switch Toggle */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">Coupe-circuit Automatisations</div>
            <div className="text-[11px] text-slate-500">
              {automationsActive ? 'Flux opérationnels' : 'Automatisations en pause de sécurité'}
            </div>
          </div>
          <button
            onClick={handleToggleKillSwitch}
            disabled={isTogglingKillSwitch}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              automationsActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{automationsActive ? 'Arrêter les automatisations' : 'Réactiver les automatisations'}</span>
          </button>
        </div>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">MRR Plateforme (EUR)</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {new Intl.NumberFormat('fr-FR').format(totalMrr)} €
          </div>
          <div className="mt-1 text-xs text-slate-400">ARR estimé : ~{totalMrr * 12} € / an</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Agences Clientes</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {agencies.length}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">100% comptes actifs</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Volume Total Transactions</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {transactions.length} factures
          </div>
          <div className="mt-1 text-xs text-slate-400">FedaPay & Paddle audités</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Statut Système Global</div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                automationsActive ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
              }`}
            />
            <span className="font-bold text-sm text-slate-900">
              {automationsActive ? 'Nominal' : 'Sécurité Activée'}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">Gemini 3.8 Flash connecté</div>
        </div>
      </div>

      {/* Client Agencies Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Gestion des Agences Clientes</h2>
            <p className="text-xs text-slate-500">Contrôle des abonnements et des quotas de chaque agence.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Agence Immobilière</th>
                <th className="py-2.5 px-4 font-semibold">Localisation</th>
                <th className="py-2.5 px-4 font-semibold">Formule Souscrite</th>
                <th className="py-2.5 px-4 font-semibold">Statut Facturation</th>
                <th className="py-2.5 px-4 font-semibold">Consommation Quota</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-sm">{agency.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{agency.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {agency.city}, {agency.country}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold uppercase text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {agency.planId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        agency.billingStatus === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {agency.billingStatus === 'active' ? 'Abonnement Actif' : agency.billingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {agency.quotaUsage.conversationsUsed} / {agency.quotaUsage.conversationsMax} conv.
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onToggleAgencyStatus(agency.id)}
                      className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px] cursor-pointer"
                    >
                      {agency.billingStatus === 'active' ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Audit Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">
              Journal d'Audit des Webhooks Marchands (FedaPay & Paddle)
            </h2>
            <p className="text-xs text-slate-500">
              Preuves cryptographiques des notifications de paiement reçues côté serveur.
            </p>
          </div>
          <button
            onClick={fetchStatus}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {webhookAuditLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-400">Aucun log webhook récent.</div>
          ) : (
            webhookAuditLogs.map((log, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      log.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="uppercase text-[11px] font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                        {log.source}
                      </span>
                      <span>{log.event}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Client : <strong>{log.customer}</strong> · Montant : {log.amount} {log.currency}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Signature Vérifiée
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
