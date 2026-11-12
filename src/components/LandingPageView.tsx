import React from 'react';
import { Language, Currency, Agency } from '../types';
import { translations, formatPrice } from '../i18n';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle,
  TrendingUp,
  Globe,
  CreditCard,
  ArrowRight,
  MessageSquare,
  Zap,
  Users,
} from 'lucide-react';

interface LandingPageViewProps {
  onOpenWidget: () => void;
  onGoToDashboard: () => void;
  onGoToBilling: () => void;
  language: Language;
  currency: Currency;
  agency: Agency;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenWidget,
  onGoToDashboard,
  onGoToBilling,
  language,
  currency,
  agency,
}) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0B132B] text-white p-8 md:p-14 border border-slate-800 shadow-xl">
        {/* Background decorative subtle gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plateforme SaaS d'Intelligence Artificielle Immobilière</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Votre Agent Commercial IA Immobilier actif <span className="text-emerald-400">24h/24 & 7j/7</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Recevez, qualifiez et convertissez automatiquement chaque visiteur en acheteur sérieux.
              Garantie <strong>zéro hallucination</strong> sur vos biens réels et <strong>validation humaine obligatoire</strong> pour tous les rendez-vous.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenWidget}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-950 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tester Sarah en direct (Démo interactive)</span>
              </button>

              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors cursor-pointer"
              >
                <span>Accéder à l'Espace Agence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                FedaPay & Mobile Money
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Paddle International
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                4 langues (FR, EN, ES, PT)
              </span>
            </div>
          </div>

          {/* Right Hero Image Card: Villa with agent badge */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
              <img
                src="/src/assets/images/hero_modern_villa_1794417276389.jpg"
                alt="Villa contemporaine"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-80" />

              {/* Floating Live AI Agent Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 text-slate-900 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <img
                    src="/src/assets/images/immoagent_avatar_sarah_1794417278308.jpg"
                    alt="Sarah Conseillère"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Sarah · Conseillère IA</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                        En ligne
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      « Bonjour ! Je peux vous présenter cette villa à 1 850 000 € ou planifier une visite. »
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars of ImmoAgent AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">01. Règle d'or : Zéro Hallucination</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            L'agent IA se connecte exclusivement à votre catalogue officiel. Si un bien ou un prix n'existe pas dans votre stock, l'IA ne l'inventera jamais.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">02. Validation Humaine Obligatoire</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aucun rendez-vous n'est confirmé sans votre accord. L'IA recueille les préférences du prospect, puis votre conseiller valide d'un simple clic.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">03. Paiements FedaPay & Paddle</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mobile Money (MTN, Moov) et cartes internationales vérifiés par webhooks cryptographiques. Aucun compte activé sur simple capture d'écran.
          </p>
        </div>
      </div>

      {/* Interactive Feature Showcase with Live Properties */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Catalogue en Direct
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Des Biens Haut de Gamme Qualifiés en Temps Réel
            </h2>
          </div>
          <button
            onClick={onOpenWidget}
            className="px-4 py-2 bg-[#0B132B] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            Tester l'interrogation IA
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl overflow-hidden border border-slate-200 group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/hero_modern_villa_1794417276389.jpg"
                alt="Villa Cannes"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Disponible
              </span>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">Villa Contemporaine Baie de Cannes</div>
              <div className="text-xs font-mono font-bold text-emerald-700">1 850 000 €</div>
              <div className="text-[11px] text-slate-500">Cannes · 6 pièces · 340 m² · Piscine infinity</div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/apartment_city_center_1794417277860.jpg"
                alt="Appartement Paris"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Disponible
              </span>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">Appartement Haussmannien Rénové</div>
              <div className="text-xs font-mono font-bold text-emerald-700">920 000 €</div>
              <div className="text-[11px] text-slate-500">Paris 16ème · 4 pièces · 115 m² · Vue Tour Eiffel</div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/duplex_terrace_view_1794417278636.jpg"
                alt="Penthouse Monaco"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Sous compromis
              </span>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">Penthouse Duplex d'Exception Rooftop</div>
              <div className="text-xs font-mono font-bold text-emerald-700">3 200 000 €</div>
              <div className="text-[11px] text-slate-500">Monaco · 5 pièces · 260 m² · Jacuzzi & terrasse</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#0B132B] text-white p-8 sm:p-12 text-center space-y-4 border border-slate-800">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Prêt à déployer votre Agent Commercial IA ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Activez votre formule dès 39 € / mois. Intégration en moins de 10 minutes avec votre site web et vos outils préférés (FedaPay, Paddle, WhatsApp & n8n).
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoToBilling}
            className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md"
          >
            Découvrir les Formules d'Abonnement
          </button>
          <button
            onClick={onOpenWidget}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors cursor-pointer"
          >
            Tester Sarah en direct
          </button>
        </div>
      </div>
    </div>
  );
};
