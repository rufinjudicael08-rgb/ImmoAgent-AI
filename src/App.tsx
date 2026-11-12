/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Agency,
  Property,
  Lead,
  VisitAppointment,
  Transaction,
  OutboundProspect,
  Language,
  Currency,
  PropertyStatus,
  LeadStatus,
  AppointmentStatus,
  AgencySettings,
  AutomationLog,
} from './types';
import {
  mockAgencies,
  mockProperties,
  mockLeads,
  mockAppointments,
  mockTransactions,
  mockOutboundProspects,
  mockAutomationLogs,
} from './data/mockData';
import { detectBrowserLanguage, translations } from './i18n';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { ConversationsView } from './components/ConversationsView';
import { LeadsView } from './components/LeadsView';
import { AppointmentsView } from './components/AppointmentsView';
import { BillingView } from './components/BillingView';
import { AutomationCRMView } from './components/AutomationCRMView';
import { SuperAdminView } from './components/SuperAdminView';
import { AgencyCustomizerView } from './components/AgencyCustomizerView';
import { AutomationLogsView } from './components/AutomationLogsView';
import { LiveAgentWidgetModal } from './components/LiveAgentWidgetModal';
import { SetupGuideModal } from './components/SetupGuideModal';
import { LandingPageView } from './components/LandingPageView';
import { Sparkles, ShieldCheck, Building2 } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => detectBrowserLanguage());
  const [currency, setCurrency] = useState<Currency>('XOF');
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Multi-agency state
  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('agency-1');

  // Core entities state
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('lead-1');
  const [appointments, setAppointments] = useState<VisitAppointment[]>(mockAppointments);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [outboundProspects, setOutboundProspects] = useState<OutboundProspect[]>(mockOutboundProspects);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(mockAutomationLogs);

  // Modals state
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);

  const activeAgency = agencies.find((a) => a.id === selectedAgencyId) || agencies[0];

  // Auto-sync currency when switching agencies
  useEffect(() => {
    if (activeAgency?.currency) {
      setCurrency(activeAgency.currency);
    }
  }, [selectedAgencyId]);

  // Handler: Add new property to catalog
  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === newProperty.agencyId
          ? {
              ...a,
              quotaUsage: {
                ...a.quotaUsage,
                propertiesCount: a.quotaUsage.propertiesCount + 1,
              },
            }
          : a
      )
    );
  };

  // Handler: Update property status
  const handleUpdatePropertyStatus = (id: string, status: PropertyStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // Handler: Update lead status
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  // Handler: Validate visit appointment (Enforces strict human validation requirement)
  const handleValidateAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'confirme_par_agent',
              agentNotes: `Validé par le conseiller à ${new Date().toLocaleTimeString(
                [],
                { hour: '2-digit', minute: '2-digit' }
              )}. Confirmation WhatsApp/SMS expédiée.`,
            }
          : a
      )
    );
  };

  // Handler: Update appointment status
  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // Handler: New visit from visitor widget
  const handleNewAppointmentFromWidget = (newAppt: VisitAppointment) => {
    setAppointments((prev) => [newAppt, ...prev]);
    setAutomationLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        agencyId: newAppt.agencyId,
        timestamp: new Date().toISOString(),
        actionType: 'Visit Scheduled',
        status: 'pending',
        target: newAppt.propertyTitle,
        description: `Visite pré-enregistrée par l'agent IA pour ${newAppt.leadName} le ${newAppt.requestedDate} à ${newAppt.requestedTime}. Validation humaine requise.`,
        durationMs: 245,
        metadata: {
          leadPhone: newAppt.leadPhone,
          status: 'en_attente_validation',
        },
      },
      ...prev,
    ]);
  };

  // Handler: New lead from visitor widget
  const handleNewLeadFromWidget = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
    setAutomationLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        agencyId: newLead.agencyId,
        timestamp: new Date().toISOString(),
        actionType: 'Lead Qualified',
        status: 'success',
        target: newLead.fullName,
        description: `Nouveau prospect qualifié par l'IA : budget ${newLead.budget}, horizon ${newLead.timeframe}, score ${newLead.score}.`,
        durationMs: 380,
        metadata: {
          budget: newLead.budget,
          score: newLead.score,
          timeframe: newLead.timeframe,
        },
      },
      ...prev,
    ]);
  };

  // Handler: Trigger manual or simulated automation action
  const handleTriggerManualAction = (newLog: AutomationLog) => {
    setAutomationLogs((prev) => [newLog, ...prev]);
  };

  // Handler: Clear logs
  const handleClearLogs = () => {
    setAutomationLogs([]);
  };

  // Handler: Plan upgrade after verified payment
  const handleUpgradePlan = (planId: 'starter' | 'pro' | 'enterprise', newTx: Transaction) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === activeAgency.id
          ? {
              ...a,
              planId,
              billingStatus: 'active',
              quotaUsage: {
                ...a.quotaUsage,
                conversationsMax: planId === 'starter' ? 500 : planId === 'pro' ? 2500 : 999999,
                propertiesMax: planId === 'starter' ? 25 : 999999,
              },
            }
          : a
      )
    );
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Handler: Toggle agency status in SuperAdmin
  const handleToggleAgencyStatus = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === agencyId
          ? {
              ...a,
              billingStatus: a.billingStatus === 'active' ? 'suspended' : 'active',
            }
          : a
      )
    );
  };

  // Handler: Outbound cadence update
  const handleUpdateCadence = (id: string, step: OutboundProspect['cadenceStep']) => {
    setOutboundProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              cadenceStep: step,
              lastContactDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
  };

  // Handler: Update agency settings
  const handleUpdateAgencySettings = (agencyId: string, settings: AgencySettings) => {
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, settings } : a))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        agencies={agencies}
        selectedAgencyId={selectedAgencyId}
        setSelectedAgencyId={setSelectedAgencyId}
        onOpenWidget={() => setIsWidgetOpen(true)}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'landing' && (
          <LandingPageView
            onOpenWidget={() => setIsWidgetOpen(true)}
            onGoToDashboard={() => setCurrentTab('dashboard')}
            onGoToBilling={() => setCurrentTab('billing')}
            language={language}
            currency={currency}
            agency={activeAgency}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            agency={activeAgency}
            properties={properties}
            leads={leads}
            appointments={appointments}
            activityLogs={automationLogs}
            language={language}
            currency={currency}
            onOpenWidget={() => setIsWidgetOpen(true)}
            onSelectLead={(id) => {
              setSelectedLeadId(id);
              setCurrentTab('conversations');
            }}
            onValidateAppointment={handleValidateAppointment}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'properties' && (
          <PropertiesView
            agency={activeAgency}
            properties={properties}
            onAddProperty={handleAddProperty}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            currency={currency}
          />
        )}

        {currentTab === 'conversations' && (
          <ConversationsView
            agency={activeAgency}
            leads={leads.filter((l) => l.agencyId === activeAgency.id)}
            properties={properties.filter((p) => p.agencyId === activeAgency.id)}
            selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId}
            language={language}
          />
        )}

        {currentTab === 'leads' && (
          <LeadsView
            agency={activeAgency}
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onSelectLead={(id) => {
              setSelectedLeadId(id);
              setCurrentTab('conversations');
            }}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'appointments' && (
          <AppointmentsView
            agency={activeAgency}
            appointments={appointments}
            onValidateAppointment={handleValidateAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {currentTab === 'automationCrm' && (
          <AutomationCRMView
            prospects={outboundProspects}
            onAddProspect={(p) => setOutboundProspects((prev) => [p, ...prev])}
            onUpdateCadence={handleUpdateCadence}
            language={language}
          />
        )}

        {currentTab === 'billing' && (
          <BillingView
            agency={activeAgency}
            transactions={transactions}
            onUpgradePlan={handleUpgradePlan}
            currency={currency}
          />
        )}

        {currentTab === 'admin' && (
          <SuperAdminView
            agencies={agencies}
            transactions={transactions}
            onToggleAgencyStatus={handleToggleAgencyStatus}
            language={language}
          />
        )}

        {currentTab === 'customizer' && (
          <AgencyCustomizerView
            agency={activeAgency}
            onUpdateAgencySettings={handleUpdateAgencySettings}
            language={language}
          />
        )}

        {currentTab === 'logs' && (
          <AutomationLogsView
            logs={automationLogs}
            agencies={agencies}
            selectedAgencyId={selectedAgencyId}
            language={language}
            onTriggerManualAction={handleTriggerManualAction}
            onClearLogs={handleClearLogs}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">IMMOAGENT AI</span>
            <span>·</span>
            <span>Plateforme SaaS Commerciale Immobilière Internationale</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsSetupGuideOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Guide Déploiement & Clés API
            </button>
            <span>·</span>
            <span>Passerelles FedaPay & Paddle Certifiées</span>
            <span>·</span>
            <span>Intégration WhatsApp Business</span>
          </div>
        </div>
      </footer>

      {/* Live AI Visitor Widget Simulator Modal */}
      <LiveAgentWidgetModal
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
        agency={activeAgency}
        properties={properties.filter((p) => p.agencyId === activeAgency.id)}
        language={language}
        currency={currency}
        onNewAppointment={handleNewAppointmentFromWidget}
        onNewLead={handleNewLeadFromWidget}
      />

      {/* Step-by-Step Developer Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
}
