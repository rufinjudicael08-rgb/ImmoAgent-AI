import React from 'react';
import { Language, Currency, Agency } from '../types';
import { translations } from '../i18n';
import {
  Sparkles,
  Globe,
  Building2,
  Shield,
  BookOpen,
  Layers,
  Activity,
  ArrowRight,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  agencies: Agency[];
  selectedAgencyId: string;
  setSelectedAgencyId: (id: string) => void;
  onOpenWidget: () => void;
  onOpenSetupGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  currency,
  setCurrency,
  agencies,
  selectedAgencyId,
  setSelectedAgencyId,
  onOpenWidget,
  onOpenSetupGuide,
}) => {
  const t = translations[language];
  const selectedAgency = agencies.find((a) => a.id === selectedAgencyId) || agencies[0];

  // Public visitor mode: only landing or pricing
  const isPublicMode = currentTab === 'landing' || currentTab === 'billing';

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B] text-white border-b border-slate-800 shadow-sm">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('landing')}
              className="text-left flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg group-hover:border-emerald-400 transition-colors">
                IA
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  IMMOAGENT <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-normal">
                  Agent Immobilier Autonome 24/7
                </span>
              </div>
            </button>
          </div>

          {/* PUBLIC MODE NAVIGATION */}
          {isPublicMode ? (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <button
                onClick={() => setCurrentTab('landing')}
                className={`hover:text-white transition-colors cursor-pointer ${
                  currentTab === 'landing' ? 'text-emerald-400 font-semibold' : ''
                }`}
              >
                Présentation
              </button>
              <button
                onClick={onOpenWidget}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Démonstration IA</span>
              </button>
              <button
                onClick={() => setCurrentTab('billing')}
                className={`hover:text-white transition-colors cursor-pointer ${
                  currentTab === 'billing' ? 'text-emerald-400 font-semibold' : ''
                }`}
              >
                Tarifs (FedaPay & Cartes)
              </button>
            </nav>
          ) : (
            /* AGENCY WORKSPACE NAVIGATION */
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'dashboard' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                {t.nav.dashboard}
              </button>
              <button
                onClick={() => setCurrentTab('properties')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'properties' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                {t.nav.properties}
              </button>
              <button
                onClick={() => setCurrentTab('conversations')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'conversations' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                {t.nav.conversations}
              </button>
              <button
                onClick={() => setCurrentTab('leads')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'leads' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                {t.nav.leads}
              </button>
              <button
                onClick={() => setCurrentTab('appointments')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'appointments' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                {t.nav.appointments}
              </button>
              <button
                onClick={() => setCurrentTab('automationCrm')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'automationCrm' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                Prospection B2B (Bénin & Monde)
              </button>
              <button
                onClick={() => setCurrentTab('logs')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'logs' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                Logs IA
              </button>
              <button
                onClick={() => setCurrentTab('customizer')}
                className={`hover:text-white transition-colors cursor-pointer py-1 ${
                  currentTab === 'customizer' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
                }`}
              >
                Personnaliser IA
              </button>
            </nav>
          )}

          {/* Top Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Currency selector */}
            <div className="flex items-center gap-1 text-xs">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-[#1b284f] text-white border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer font-mono"
                title="Choisir la devise"
              >
                <option value="XOF">XOF (FCFA · Bénin/Afrique)</option>
                <option value="EUR">EUR (€ · Europe)</option>
                <option value="USD">USD ($ · International)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BRL">BRL (R$)</option>
              </select>
            </div>

            {/* Language selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-[#1b284f] text-white border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="pt">PT</option>
              </select>
            </div>

            {/* Test Widget CTA */}
            <button
              onClick={onOpenWidget}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-950"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tester l'IA</span>
            </button>

            {/* Switch between Public Site & Agency Workspace */}
            {isPublicMode ? (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Accéder au tableau de bord agence"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Espace Agence</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('landing')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Revenir au site vitrine public"
              >
                <span>Site Public</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AGENCY WORKSPACE SUB-BAR (Only displayed inside Agency Workspace) */}
      {!isPublicMode && (
        <div className="bg-[#0f1b3b] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Active Agency Info & Switcher */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-400 hidden sm:inline">Agence connectée :</span>
              <select
                value={selectedAgencyId}
                onChange={(e) => setSelectedAgencyId(e.target.value)}
                className="bg-[#1b284f] text-white border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer font-medium"
              >
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name} ({agency.city})
                  </option>
                ))}
              </select>
              <span className="text-emerald-400 font-semibold text-[11px] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Forfait {selectedAgency.planId.toUpperCase()} ACTIF
              </span>
            </div>

            {/* Admin & Configuration Links */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setCurrentTab('billing')}
                className="text-slate-300 hover:text-white text-xs hover:underline cursor-pointer"
              >
                Gérer l'abonnement
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3 h-3 text-purple-400" />
                <span>Console Admin</span>
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={onOpenSetupGuide}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
              >
                <BookOpen className="w-3 h-3 text-blue-400" />
                <span>Guide API & Déploiement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-[#0a1127] border-t border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs">
        {isPublicMode ? (
          <>
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1.5 rounded whitespace-nowrap cursor-pointer ${
                currentTab === 'landing' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300'
              }`}
            >
              Présentation
            </button>
            <button
              onClick={() => setCurrentTab('billing')}
              className={`px-3 py-1.5 rounded whitespace-nowrap cursor-pointer ${
                currentTab === 'billing' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300'
              }`}
            >
              Tarifs
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-3 py-1.5 rounded whitespace-nowrap text-emerald-400 font-semibold cursor-pointer"
            >
              Espace Agence →
            </button>
          </>
        ) : (
          [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'properties', label: 'Biens' },
            { id: 'conversations', label: 'Conversations' },
            { id: 'leads', label: 'Prospects' },
            { id: 'appointments', label: 'Visites' },
            { id: 'automationCrm', label: 'Prospection B2B' },
            { id: 'logs', label: 'Logs IA' },
            { id: 'customizer', label: 'Réglages IA' },
            { id: 'landing', label: '← Site Public' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-1.5 rounded whitespace-nowrap cursor-pointer ${
                currentTab === item.id ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))
        )}
      </div>
    </header>
  );
};
