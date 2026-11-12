import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Database,
  CreditCard,
  MessageCircle,
  Cpu,
  Server,
  Key,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Download,
} from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const downloadWorkflowFile = () => {
    const blob = new Blob([n8nWorkflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'immoagent_n8n_workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const supabaseSqlSchema = `-- SCHEMA OFFICIEL IMMOAGENT AI (SUPABASE POSTGRESQL)
-- 1. Table des Agences Immobilières (Multi-entreprises)
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    plan_id TEXT DEFAULT 'starter',
    billing_status TEXT DEFAULT 'trial',
    currency TEXT DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des Biens Immobiliers (Catalogue strict d'ancrage IA)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    reference_number TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'villa', 'appartement', 'duplex', 'bureau', 'terrain'
    price NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    city TEXT NOT NULL,
    neighborhood TEXT,
    rooms INTEGER NOT NULL,
    surface NUMERIC NOT NULL,
    status TEXT DEFAULT 'disponible', -- 'disponible', 'sous_compromis', 'vendu'
    image_url TEXT,
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des Prospects Qualifiés (CRM)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    property_interest_id UUID REFERENCES properties(id),
    budget TEXT,
    preferred_location TEXT,
    property_type TEXT,
    timeframe TEXT,
    score TEXT DEFAULT 'Tiède', -- 'Chaud', 'Tiède', 'Froid'
    score_reason TEXT,
    consent_gdpr BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'nouveau',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des Demandes de Visites
CREATE TABLE visit_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    status TEXT DEFAULT 'en_attente_validation', -- 'en_attente_validation', 'confirme_par_agent', 'effectue'
    agent_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Activer Row Level Security (RLS) pour isoler les données par agence
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_appointments ENABLE ROW LEVEL SECURITY;`;

  const n8nWorkflowJson = `{
  "name": "ImmoAgent AI - Synchronisation Lead & Relance J+2",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "immoagent-lead",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "c1f7a0b3-1a2b-4c3d-9e4f-5a6b7c8d9e0f",
      "name": "Webhook Entrant ImmoAgent",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300],
      "webhookId": "c1f7a0b3-1a2b-4c3d-9e4f-5a6b7c8d9e0f"
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "",
          "mode": "name"
        },
        "options": {}
      },
      "id": "e2f8b1c4-2b3c-5d4e-0f5a-6b7c8d9e0f1a",
      "name": "Google Sheets CRM",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [480, 300]
    },
    {
      "parameters": {
        "amount": 48,
        "unit": "hours"
      },
      "id": "a3f9c2d5-3c4d-6e5f-1a6b-7c8d9e0f1a2b",
      "name": "Attente 48h (Relance J+2)",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [720, 300],
      "webhookId": "a3f9c2d5-3c4d-6e5f-1a6b-7c8d9e0f1a2b"
    },
    {
      "parameters": {
        "operation": "send",
        "phoneNumberId": "VOTRE_PHONE_ID_META",
        "recipientPhoneNumber": "={{ $json.body.phone }}",
        "template": "immoagent_suivi_visite"
      },
      "id": "b4f0d3e6-4d5e-7f6a-2b7c-8d9e0f1a2b3c",
      "name": "WhatsApp Cloud API",
      "type": "n8n-nodes-base.whatsApp",
      "typeVersion": 1,
      "position": [960, 300]
    }
  ],
  "connections": {
    "Webhook Entrant ImmoAgent": {
      "main": [
        [
          {
            "node": "Google Sheets CRM",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets CRM": {
      "main": [
        [
          {
            "node": "Attente 48h (Relance J+2)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Attente 48h (Relance J+2)": {
      "main": [
        [
          {
            "node": "WhatsApp Cloud API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[90vh] max-h-[820px] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0B132B] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight text-white">
                Guide de Déploiement & Connexions Externes
              </h2>
              <p className="text-xs text-slate-300">
                Instructions pas à pas pour connecter Supabase, FedaPay, Paddle, WhatsApp et n8n.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Steps */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          {[
            { id: 1, label: '1. Supabase (Base SQL)' },
            { id: 2, label: '2. FedaPay (Mobile Money)' },
            { id: 3, label: '3. Paddle (Monde)' },
            { id: 4, label: '4. WhatsApp API' },
            { id: 5, label: '5. Automatisations n8n' },
            { id: 6, label: '6. Déploiement Cloud' },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeStep === step.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* STEP 1: Supabase */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Étape 1 : Connexion de Supabase (Base de Données PostgreSQL)</span>
              </div>
              <p>
                Supabase fournit l'infrastructure PostgreSQL multi-entreprises avec isolation stricte des données de chaque agence immobilière.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <h4 className="font-bold text-slate-900">Procédure de configuration :</h4>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Rendez-vous sur <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">supabase.com</a> et créez un projet gratuit ou Pro.</li>
                  <li>Ouvrez l'onglet <strong>SQL Editor</strong> dans le tableau de bord Supabase.</li>
                  <li>Collez et exécutez le script SQL ci-dessous pour créer les tables et les règles d'isolation RLS :</li>
                </ol>

                <div className="relative mt-2">
                  <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-lg overflow-x-auto text-[11px] font-mono max-h-60">
                    {supabaseSqlSchema}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(supabaseSqlSchema, 'supabase-sql')}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === 'supabase-sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'supabase-sql' ? 'Copié !' : 'Copier SQL'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-lg">
                <strong>Variables à renseigner dans votre fichier d'environnement (.env) :</strong>
                <div className="mt-1 font-mono text-[11px]">
                  SUPABASE_URL="https://votre-projet.supabase.co"<br />
                  SUPABASE_ANON_KEY="eyJhbGciOi..."
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FedaPay */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Étape 2 : Configuration FedaPay (MTN Mobile Money, Moov Money & Cartes)</span>
              </div>
              <p>
                FedaPay est la solution de référence pour encaisser les abonnements SaaS d'agences immobilières en Afrique de l'Ouest et Centrale (Bénin, Togo, Côte d'Ivoire, Sénégal, etc.).
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-slate-900">1. Création et validation du compte marchand :</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Inscrivez-vous sur <a href="https://fedapay.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">fedapay.com</a>.</li>
                  <li>Commencez en mode <strong>Sandbox</strong> pour tester les paiements virtuels.</li>
                  <li><strong>Validation Marchande obligatoire :</strong> Pour activer les encaissements réels (cartes Visa/Mastercard et gros volumes Mobile Money), soumettez vos pièces justificatives d'entreprise (Registre de Commerce / RCCM, IFU fiscal, CNI du gérant, RIB bancaire).</li>
                </ul>

                <h4 className="font-bold text-slate-900 pt-2">2. Configuration du Webhook sécurisé :</h4>
                <p>
                  Dans les paramètres FedaPay &gt; <em>Webhooks</em>, ajoutez l'URL suivante de votre serveur ImmoAgent :
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-[11px]">
                  https://votre-domaine.com/api/webhooks/fedapay
                </div>
                <p className="text-[11px] text-slate-500">
                  Cochez l'événement : <code>transaction.approved</code>. Renseignez la clé secrète de signature dans <code>FEDAPAY_WEBHOOK_SECRET</code>.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-lg flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Sécurité Absolue :</strong> Ne validez jamais un abonnement manuellement sur simple réception d'une capture d'écran WhatsApp. Seul le webhook signé par les serveurs de FedaPay garantit que les fonds ont été réellement débités.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Paddle */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Étape 3 : Configuration Paddle (Ventes Internationales)</span>
              </div>
              <p>
                Paddle agit en tant que « Merchant of Record » (MoR), simplifiant la conformité fiscale, la TVA intra-communautaire européenne et les ventes aux agences en Europe, Amérique du Nord et Brésil.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <h4 className="font-bold text-slate-900">Procédure :</h4>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Inscrivez-vous sur <a href="https://paddle.com" target="_blank" rel="noreferrer" className="text-blue-700 font-bold underline">paddle.com</a>.</li>
                  <li>Créez vos 3 produits d'abonnement : <strong>Starter</strong> (49 €/m), <strong>Pro Agence</strong> (99 €/m) et <strong>Enterprise</strong> (249 €/m).</li>
                  <li>Dans l'onglet <em>Developer Tools &gt; Notifications</em>, ajoutez votre URL Webhook :
                    <div className="bg-slate-900 text-emerald-400 p-2 rounded font-mono text-[11px] mt-1">
                      https://votre-domaine.com/api/webhooks/paddle
                    </div>
                  </li>
                  <li>Activez les alertes <code>subscription_payment_succeeded</code> et <code>subscription_created</code>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* STEP 4: WhatsApp API */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Étape 4 : WhatsApp Business Cloud API (Meta for Developers)</span>
              </div>
              <p>
                Permet à Sarah (l'agent IA) d'interagir directement avec les prospects via WhatsApp officiel de l'agence.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <h4 className="font-bold text-slate-900">Étapes de raccordement :</h4>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Connectez-vous sur <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">developers.facebook.com</a>.</li>
                  <li>Créez une application de type <em>Business</em> et ajoutez le produit <strong>WhatsApp</strong>.</li>
                  <li>Associez un numéro de téléphone d'agence dédié (qui ne doit pas être déjà relié à un compte WhatsApp standard).</li>
                  <li>Générez un <strong>System User Permanent Access Token</strong> dans votre Meta Business Manager.</li>
                  <li>Dans la console ImmoAgent, renseignez votre <code>WHATSAPP_PHONE_ID</code> et <code>WHATSAPP_ACCESS_TOKEN</code>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* STEP 5: n8n */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Étape 5 : Blueprint Automatisations n8n (Prêt à l'Emploi)</span>
              </div>
              <p>
                n8n orchestre les flux d'arrière-plan : enregistrement des leads dans Google Sheets / CRM tiers et envoi automatique de la relance courtoise à J+2 et J+5.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900">Workflow n8n V1 Validé (avec Nœuds & Connexions) :</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadWorkflowFile}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Télécharger le fichier .json directement"
                    >
                      <Download className="w-3 h-3" />
                      <span>Télécharger immoagent_workflow.json</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(n8nWorkflowJson, 'n8n-json')}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedCode === 'n8n-json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'n8n-json' ? 'Copié !' : 'Copier le JSON n8n'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-emerald-950 text-[11px] space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Comment lier n8n et ImmoAgent en 3 clics simples :</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    <li>Dans n8n, double-cliquez sur le 1er nœud <strong>« Webhook Entrant ImmoAgent »</strong>.</li>
                    <li>Copiez l'URL affichée dans l'encadré <strong>« Production URL »</strong> (ex: <code>https://.../webhook/immoagent-lead</code>).</li>
                    <li>Allez dans l'onglet <strong>« Logs & Automatisations »</strong> d'ImmoAgent, collez l'URL dans le champ et cliquez sur <strong>« Tester l'Envoi vers n8n »</strong>. Le badge passera au vert 200 OK !</li>
                  </ol>
                </div>

                {/* WhatsApp Meta blocker explanation */}
                <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-amber-950 text-[11px] space-y-1.5">
                  <strong className="text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Important : Résolution du blocage Meta WhatsApp (« Numéro déjà associé »)
                  </strong>
                  <p className="text-slate-700">
                    Si Meta Developers affiche : <em>« Ce numéro de téléphone est déjà associé à un compte WhatsApp »</em>, c'est parce que Meta exige un numéro de téléphone vierge, non enregistré sur l'application WhatsApp de votre smartphone.
                  </p>
                  <p className="text-slate-800 font-semibold">
                    💡 La solution simplifiée & sans frais :
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    <li>Dans ImmoAgent, chaque prospect qualifié et chaque rendez-vous possède un bouton <strong>« WhatsApp direct »</strong> (protocole <code>wa.me</code>) qui ouvre votre WhatsApp existant avec le message de relance déjà rédigé. <strong>Aucun compte Meta Développeur ni validation d'entreprise n'est nécessaire !</strong></li>
                    <li>Dans n8n, vous pouvez aussi remplacer le bloc WhatsApp par un simple nœud <strong>Gmail ou Email</strong> pour notifier votre équipe gratuitement.</li>
                  </ul>
                </div>

                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg overflow-x-auto text-[11px] font-mono max-h-52">
                  {n8nWorkflowJson}
                </pre>
              </div>
            </div>
          )}

          {/* STEP 6: Cloud Deployment */}
          {activeStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Server className="w-4 h-4 text-slate-900" />
                <span>Étape 6 : Hébergement & Mise en Ligne sur Internet (Guide Pas à Pas)</span>
              </div>
              <p>
                Votre application ImmoAgent AI est complète et prête pour la production. Voici la méthode la plus rapide et économique pour l'héberger en 5 minutes :
              </p>

              {/* Method 1: Render */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Option 1 (Recommandée) : Déploiement en 1-clic sur Render.com</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Gratuit / 7$/mois
                  </span>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700">
                  <li>
                    <strong>Mettre votre code sur GitHub :</strong><br />
                    Créez un dépôt privé sur <a href="https://github.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">github.com</a> et poussez votre code avec les 3 commandes standard :
                    <pre className="mt-1 bg-slate-900 text-emerald-300 p-2 rounded text-[11px] font-mono">
                      git init{'\n'}git add .{'\n'}git commit -m "Launch ImmoAgent AI"{'\n'}git push -u origin main
                    </pre>
                  </li>
                  <li>
                    <strong>Connecter Render :</strong><br />
                    Rendez-vous sur <a href="https://render.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">render.com</a>, cliquez sur <strong>New +</strong> &gt; <strong>Web Service</strong> et choisissez votre dépôt GitHub.
                  </li>
                  <li>
                    <strong>Paramètres automatiques (déjà configurés via render.yaml) :</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-[11px] text-slate-600">
                      <li><strong>Build Command :</strong> <code>npm install && npm run build</code></li>
                      <li><strong>Start Command :</strong> <code>npm start</code></li>
                      <li><strong>Environment :</strong> Node 22</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Variables d'Environnement à renseigner dans l'onglet « Environment » de Render :</strong>
                    <div className="mt-1 bg-slate-900 text-emerald-300 p-2.5 rounded text-[11px] font-mono space-y-1">
                      <div>GEMINI_API_KEY = "votre_cle_gemini_api"</div>
                      <div>NODE_ENV = "production"</div>
                      <div>PORT = "3000"</div>
                    </div>
                  </li>
                  <li>
                    Cliquez sur <strong>Deploy Web Service</strong>. En 2 minutes, votre application est en ligne avec un lien sécurisé HTTPS (ex: <code>https://mon-immoagent.onrender.com</code>) accessible partout dans le monde !
                  </li>
                </ol>
              </div>

              {/* Method 2: Dockerfile */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-xs text-slate-700">
                <strong className="text-slate-900 block font-bold">Autre option (Railway / Google Cloud Run / VPS) :</strong>
                <p>
                  Un fichier <code>Dockerfile</code> optimisé a été généré à la racine du projet. Vous pouvez déployer directement l'image Docker sur Railway ou Google Cloud Run sans aucune configuration supplémentaire.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">Besoin d'aide technique ? Support SaaS ImmoAgent 7j/7</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
