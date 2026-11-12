export type Language = 'fr' | 'en' | 'es' | 'pt';
export type Currency = 'EUR' | 'USD' | 'XOF' | 'BRL' | 'GBP';

export type PropertyType = 'villa' | 'appartement' | 'duplex' | 'terrain' | 'bureau';
export type PropertyStatus = 'disponible' | 'sous_compromis' | 'vendu';

export interface Property {
  id: string;
  agencyId: string;
  title: string;
  type: PropertyType;
  price: number;
  currency: Currency;
  city: string;
  neighborhood?: string;
  rooms: number;
  surface: number; // m²
  status: PropertyStatus;
  imageUrl: string;
  description: string;
  features: string[];
  referenceNumber: string;
}

export type LeadScore = 'Chaud' | 'Tiède' | 'Froid';
export type LeadStatus = 'nouveau' | 'qualifié' | 'visite_demandee' | 'offre' | 'converti' | 'archive';

export interface Lead {
  id: string;
  agencyId: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  propertyInterestId?: string;
  budget?: string;
  preferredLocation?: string;
  propertyType?: string;
  timeframe?: string; // ex: "Urgent (< 1 mois)", "1 à 3 mois", "Projet 2026"
  score: LeadScore;
  scoreReason?: string;
  consentGdpr: boolean;
  status: LeadStatus;
  createdAt: string;
  lastActivity: string;
  notes?: string;
  humanHandoverRequested?: boolean;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'agent' | 'human';
  text: string;
  timestamp: string;
}

export type AppointmentStatus =
  | 'en_attente_validation'
  | 'confirme_par_agent'
  | 'reporte'
  | 'effectue'
  | 'annule';

export interface VisitAppointment {
  id: string;
  agencyId: string;
  leadId: string;
  propertyId: string;
  leadName: string;
  leadPhone: string;
  leadEmail?: string;
  propertyTitle: string;
  requestedDate: string; // YYYY-MM-DD
  requestedTime: string; // HH:mm
  status: AppointmentStatus;
  agentNotes?: string;
  createdAt: string;
}

export type AgentTone = 'professional' | 'friendly' | 'energetic' | 'expert' | 'persuasive';

export interface VoiceToneConfig {
  tone: AgentTone;
  formality: 'formal' | 'moderate' | 'casual';
  energyLevel: 'calm' | 'balanced' | 'high';
  emojiUsage: 'none' | 'subtle' | 'frequent';
  voiceGender?: 'female' | 'male' | 'neutral';
  speakingPace?: 'relaxed' | 'normal' | 'fast';
  customInstructions?: string;
}

export interface AgencySettings {
  agentName: string;
  agentPersona: 'prestige' | 'dynamique' | 'chaleureux' | 'technique' | 'commercial';
  voiceTone?: VoiceToneConfig;
  primaryColor: string;
  welcomeMessage: string;
  customFaqs: Array<{ id: string; question: string; answer: string }>;
  allowedVisitDays: string[];
  notificationWhatsapp: string;
  notificationEmail: string;
  n8nWebhookUrl?: string;
  autoPilotEnabled: boolean;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  planId: 'starter' | 'pro' | 'enterprise';
  billingStatus: 'active' | 'trial' | 'past_due' | 'suspended';
  currency: Currency;
  automationsEnabled: boolean;
  settings?: AgencySettings;
  quotaUsage: {
    conversationsUsed: number;
    conversationsMax: number;
    propertiesCount: number;
    propertiesMax: number;
    aiAgentsCount: number;
  };
}

export interface SubscriptionPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  targetAudience: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: Currency;
  features: string[];
  conversationsLimit: string;
  propertiesLimit: string;
  badge?: string;
  popular?: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  agencyId: string;
  agencyName: string;
  gateway: 'fedapay' | 'paddle';
  paymentMethod: 'mtn_money' | 'moov_money' | 'card' | 'paypal';
  amount: number;
  currency: Currency;
  status: 'confirmed' | 'pending' | 'failed';
  planName: string;
  invoiceNumber: string;
}

export interface OutboundProspect {
  id: string;
  agencyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  cadenceStep: 'nouveau' | 'email_j0' | 'relance_j2' | 'relance_j5' | 'demo_vue' | 'converti';
  lastContactDate?: string;
  notes?: string;
  language: Language;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: 'superadmin' | 'agency_admin' | 'commercial';
  agencyId: string;
}

export type AutomationActionType =
  | 'Email Sent'
  | 'Lead Updated'
  | 'Lead Qualified'
  | 'Visit Scheduled'
  | 'Follow-up Dispatched'
  | 'Catalogue Synced'
  | 'Webhook Processed';

export type AutomationLogStatus = 'success' | 'warning' | 'failed' | 'pending';

export interface AutomationLog {
  id: string;
  agencyId: string;
  timestamp: string; // ISO string
  actionType: AutomationActionType;
  status: AutomationLogStatus;
  target: string;
  description: string;
  metadata?: Record<string, any>;
  durationMs?: number;
}

export type ActivityActionType =
  | 'email_sent'
  | 'lead_qualified'
  | 'appointment_requested'
  | 'appointment_validated'
  | 'followup_generated'
  | 'status_updated'
  | 'auto_sync';

export interface ActivityLogItem {
  id: string;
  agencyId: string;
  timestamp: string;
  actionType: ActivityActionType;
  title: string;
  description: string;
  targetName?: string;
  targetContact?: string;
  channel?: 'email' | 'whatsapp' | 'sms' | 'system';
  status: 'success' | 'pending' | 'warning' | 'failed';
  metadata?: Record<string, any>;
}

