import React from 'react';
import { Language, Currency, Agency } from '../types';
import { translations } from '../i18n';
import { Sparkles, Globe, Building2, Shield, BookOpen, Layers, Activity } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B] text-white border-b border-slate-800 shadow-sm">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
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
                  SaaS Immobilier
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'landing' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              Site Vitrine
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'dashboard' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.dashboard}
            </button>
            <button
              onClick={() => setCurrentTab('properties')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'properties' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.properties}
            </button>
            <button
              onClick={() => setCurrentTab('conversations')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'conversations' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.conversations}
            </button>
            <button
              onClick={() => setCurrentTab('leads')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'leads' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.leads}
            </button>
            <button
              onClick={() => setCurrentTab('appointments')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'appointments' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.appointments}
            </button>
            <button
              onClick={() => setCurrentTab('automationCrm')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'automationCrm' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.automationCrm}
            </button>
            <button
              onClick={() => setCurrentTab('billing')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'billing' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.billing}
            </button>
            <button
              onClick={() => setCurrentTab('customizer')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'customizer' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              Personnaliser IA & FAQ
            </button>
            <button
              onClick={() => setCurrentTab('logs')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'logs' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : ''
              }`}
            >
              Logs IA
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenWidget}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-950"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.topBar.testWidget}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Workspace Sub-Bar (Agency Switch, i18n, Currency, Setup Guide, Super Admin) */}
      <div className="bg-[#0f1b3b] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Agency Switcher */}
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400 hidden sm:inline">{t.topBar.activeAgency}:</span>
            <select
              value={selectedAgencyId}
              onChange={(e) => setSelectedAgencyId(e.target.value)}
              className="bg-[#1b284f] text-white border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name} ({agency.city})
                </option>
              ))}
            </select>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              Plan: <strong className="text-slate-200 capitalize">{selectedAgency.planId}</strong>
            </span>
          </div>

          {/* Controls: Setup Guide, Super Admin, Currency, Language */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSetupGuide}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded border border-slate-700 transition-colors"
              title="Guide d'installation étape par étape"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.nav.setupGuide}</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                currentTab === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 border-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.nav.admin}</span>
            </button>

            <button
              onClick={() => setCurrentTab('logs')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                currentTab === 'logs'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 border-slate-700'
              }`}
              title="Journal des logs d'automatisation IA"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Logs IA</span>
            </button>

            {/* Currency Selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 hidden sm:inline">Devise:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-[#1b284f] text-white border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer font-mono"
              >
                <option value="EUR">EUR (€)</option>
                <option value="XOF">XOF (FCFA)</option>
                <option value="USD">USD ($)</option>
                <option value="BRL">BRL (R$)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-[#1b284f] text-white border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="fr">FR · Français</option>
                <option value="en">EN · English</option>
                <option value="es">ES · Español</option>
                <option value="pt">PT · Português</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-[#0a1127] border-t border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs">
        {[
          { id: 'landing', label: 'Site Vitrine' },
          { id: 'dashboard', label: t.nav.dashboard },
          { id: 'properties', label: t.nav.properties },
          { id: 'conversations', label: t.nav.conversations },
          { id: 'leads', label: t.nav.leads },
          { id: 'appointments', label: t.nav.appointments },
          { id: 'automationCrm', label: t.nav.automationCrm },
          { id: 'billing', label: t.nav.billing },
          { id: 'customizer', label: 'Personnaliser IA & FAQ' },
          { id: 'logs', label: 'Logs IA' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`px-3 py-1.5 rounded whitespace-nowrap ${
              currentTab === item.id ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
