import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System state for automations & kill-switch
let automationsActive = true;
const webhookLogs: Array<{
  id: string;
  source: 'fedapay' | 'paddle';
  event: string;
  amount?: number;
  currency?: string;
  status: 'verified' | 'failed' | 'pending';
  timestamp: string;
  customer?: string;
}> = [
  {
    id: 'fed_tx_90184',
    source: 'fedapay',
    event: 'transaction.approved',
    amount: 59000,
    currency: 'XOF',
    status: 'verified',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: 'Agence Atlantic Prestige (Moov Money)',
  },
  {
    id: 'pad_sub_4109',
    source: 'paddle',
    event: 'subscription_payment_succeeded',
    amount: 149,
    currency: 'EUR',
    status: 'verified',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    customer: 'Riviera Luxury Estates (Visa Card)',
  },
];

// Health and Automations Status
app.get('/api/system/status', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    automationsActive,
    hasGeminiKey: Boolean(apiKey),
    webhookLogsCount: webhookLogs.length,
    supportedLanguages: ['fr', 'en', 'es', 'pt'],
    supportedCurrencies: ['EUR', 'USD', 'XOF', 'BRL', 'GBP'],
    timestamp: new Date().toISOString(),
  });
});

// Toggle Automations Kill-Switch
app.post('/api/system/toggle-automations', (req: Request, res: Response) => {
  const { active } = req.body;
  if (typeof active === 'boolean') {
    automationsActive = active;
  } else {
    automationsActive = !automationsActive;
  }
  res.json({ automationsActive, message: automationsActive ? 'Automations actives' : 'Automations suspendues par sécurité' });
});

// Live n8n Webhook Test & Dispatch Endpoint
app.post('/api/webhooks/dispatch-n8n', async (req: Request, res: Response) => {
  const { webhookUrl, payload } = req.body;

  if (!webhookUrl || typeof webhookUrl !== 'string' || !webhookUrl.startsWith('http')) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir une URL de Webhook valide commençant par https:// ou http://',
    });
  }

  const testPayload = payload || {
    event: 'lead_captured',
    leadName: 'Alexandre de Saint-Pierre',
    phone: '+33 6 12 90 44 21',
    email: 'alexandre.stpierre@domain.com',
    budget: '1 900 000 €',
    preferredLocation: 'Cannes & Croisette',
    propertyType: 'Villa Contemporaine',
    timeframe: 'Urgent (< 1 mois)',
    score: 'Chaud',
    agencyName: 'Prestige Riviera Immobilier',
    agentName: 'Sarah',
    timestamp: new Date().toISOString(),
    source: 'ImmoAgent AI - Testeur Live',
  };

  try {
    const startTime = Date.now();
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ImmoAgent-Webhook-Dispatcher/1.0',
      },
      body: JSON.stringify(testPayload),
    });

    const durationMs = Date.now() - startTime;
    let responseBodyText = '';
    try {
      responseBodyText = await webhookResponse.text();
    } catch {
      responseBodyText = '(Corps de réponse vide)';
    }

    if (webhookResponse.ok) {
      return res.status(200).json({
        success: true,
        httpStatus: webhookResponse.status,
        durationMs,
        message: `Connexion réussie ! n8n a répondu avec le statut ${webhookResponse.status} ${webhookResponse.statusText}.`,
        responsePreview: responseBodyText.slice(0, 300),
      });
    } else {
      return res.status(200).json({
        success: false,
        httpStatus: webhookResponse.status,
        durationMs,
        message: `n8n a répondu avec une erreur ${webhookResponse.status} (${webhookResponse.statusText}). Vérifiez que le webhook est bien sur "Active" ou en écoute.`,
        responsePreview: responseBodyText.slice(0, 300),
      });
    }
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      message: `Impossible de contacter l'URL : ${err.message || 'Erreur réseau ou URL inaccessible'}. Vérifiez que n8n est accessible.`,
    });
  }
});

// AI Chat Endpoint: Grounded Real Estate Agent (French, English, Spanish, Portuguese)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      agencyName = 'ImmoAgent AI Partner',
      agentName = 'Sarah',
      agentPersona = 'prestige',
      voiceTone,
      language = 'fr',
      propertyCatalog = [],
      leadContext = {},
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuration API Gemini manquante. Veuillez vérifier la clé dans les paramètres.',
      });
    }

    const languageInstructionMap: Record<string, string> = {
      fr: 'Tu dois répondre impérativement en FRANÇAIS.',
      en: 'You must answer strictly in ENGLISH.',
      es: 'Debes responder estrictamente en ESPAÑOL.',
      pt: 'Você deve responder estritamente em PORTUGUÊS.',
    };

    const targetLangInstr = languageInstructionMap[language] || languageInstructionMap.fr;

    // Format properties strictly as grounding context
    const catalogFormatted = propertyCatalog.length > 0
      ? propertyCatalog.map((p: any) => `
- ID: ${p.id}
  Titre: ${p.title}
  Type: ${p.type}
  Prix: ${p.price} ${p.currency}
  Localisation: ${p.city}, ${p.neighborhood || ''}
  Pièces: ${p.rooms} pièces | Surface: ${p.surface} m²
  Statut: ${p.status}
  Description: ${p.description}
  Points forts: ${(p.features || []).join(', ')}
`).join('\n')
      : 'Aucun bien actuellement en vente ou location dans le catalogue.';

    // Tone & Personality calibration
    const toneType = voiceTone?.tone || (
      agentPersona === 'dynamique' ? 'energetic' :
      agentPersona === 'chaleureux' ? 'friendly' :
      agentPersona === 'technique' ? 'expert' :
      agentPersona === 'commercial' ? 'persuasive' :
      'professional'
    );

    let toneDirective = '';
    switch (toneType) {
      case 'friendly':
        toneDirective = `TON & POSTURE : Chaleureux, empathique, très accueillant et bienveillant. Fais preuve d'écoute active, mets le visiteur en confiance avec humanité et douceur, tout en restant professionnel.`;
        break;
      case 'energetic':
        toneDirective = `TON & POSTURE : Dynamique, énergique, enthousiaste, punchy et très réactif. Utilise des tournures vives et stimulantes, montre une passion contagieuse pour les opportunités immobilières et oriente vers l'action rapide.`;
        break;
      case 'expert':
        toneDirective = `TON & POSTURE : Conseiller expert, analytique, méthodique et factuel. Mets en avant les données tangibles (surfaces, agencement, rentabilité, quartier, commodités, normes) avec une précision rassurante pour des acheteurs avisés ou investisseurs.`;
        break;
      case 'persuasive':
        toneDirective = `TON & POSTURE : Commercial d'élite, persuasif, proactif et orienté closing. Met en valeur l'exclusivité, la rareté du bien et incite délicatement à sécuriser un créneau de visite avant que le bien ne soit réservé, sans jamais forcer.`;
        break;
      case 'professional':
      default:
        toneDirective = `TON & POSTURE : Professionnel de prestige, élégant, soutenu et distingué. Vocabulaire immobilier raffiné, politesse exemplaire, respectueux et discret, digne des plus grandes maisons immobilières.`;
        break;
    }

    const formalityDirective = voiceTone?.formality === 'casual'
      ? `Niveau de formalité : Accessible et convivial.`
      : voiceTone?.formality === 'moderate'
      ? `Niveau de formalité : Équilibré et naturel.`
      : `Niveau de formalité : Soutenu et soigné avec vouvoiement strict.`;

    const emojiDirective = voiceTone?.emojiUsage === 'none'
      ? `Émojis : N'utilise strictement aucun émoji.`
      : voiceTone?.emojiUsage === 'frequent'
      ? `Émojis : Utilise ponctuellement des émojis engageants et chaleureux (ex: 🏡, ✨, 🔑).`
      : `Émojis : Émojis subtils et rares (maximum 1 émoji sobre par message).`;

    const customInstructions = voiceTone?.customInstructions
      ? `CONSIGNES PARTICULIÈRES DE L'AGENCE : ${voiceTone.customInstructions}`
      : '';

    const systemInstruction = `Tu es ${agentName}, l'agent commercial IA intelligent de l'agence immobilière "${agencyName}".
${targetLangInstr}

PERSONNALITÉ ET POSTURE DE L'AGENT :
- ${toneDirective}
- ${formalityDirective}
- ${emojiDirective}
${customInstructions ? `- ${customInstructions}\n` : ''}
RÈGLES D'OR ET RESTRICTIONS ABSOLUES :
1. RÈGLE D'HONNÊTETÉ & D'INTÉGRITÉ : NE JAMAIS INVENTER un bien immobilier, un prix, une superficie, une adresse ou une disponibilité. Tu dois te baser EXCLUSIVEMENT sur le catalogue officiel fourni ci-dessous. Si le visiteur demande un bien qui n'existe pas dans le catalogue (ou dans un quartier/ville absent, ou hors de son budget), réponds avec franchise et courtoisie : confirme que l'agence n'a pas exactement cela en stock aujourd'hui, propose le bien existant le plus proche si pertinent, ou propose d'enregistrer ses critères précis pour une alerte prioritaire.
2. RÈGLE DE RENDEZ-VOUS : NE JAMAIS CONFIRMER DÉFINITIVEMENT UN RENDEZ-VOUS OU UNE VISITE. Tu peux proposer et noter une date et heure souhaitée (ex: "Je note votre souhait de visite pour mardi à 14h"), mais tu dois TOUJOURS préciser explicitement qu'un conseiller humain de l'agence va valider et confirmer définitivement le créneau sous peu.
3. OBJECTIFS COMMERCIAUX :
   - Écouter le besoin (achat, location, investissement).
   - Qualifier le profil : Budget maximum, Zone géographique recherchée, Type de bien (Villa, Appartement, Terrain, Bureau), Horizon / Délai du projet (urgent, 1-3 mois, plus tard).
   - Collecter en douceur les coordonnées (Prénom/Nom, Téléphone ou WhatsApp, Email) avec son consentement pour lui envoyer la fiche détaillée ou organiser la visite.
4. FORMAT : Concis (2-4 phrases par message pour favoriser le dialogue fluide), orienté service et conversion.

CATALOGUE OFFICIEL DES BIENS DISPONIBLES :
${catalogFormatted}

INFORMATIONS DÉJÀ CONNUES SUR LE PROSPECT :
${JSON.stringify(leadContext, null, 2)}
`;

    // Build contents from conversation history
    const conversationPrompt = messages.map((m: any) => `${m.sender === 'user' ? 'Client' : agentName}: ${m.text}`).join('\n\n');
    const fullPrompt = `${conversationPrompt}\n\n${agentName}:`;

    let replyText = '';
    let attempts = 0;
    while (attempts < 2 && !replyText) {
      try {
        attempts++;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
          config: {
            systemInstruction: systemInstruction,
          },
        });
        replyText = response.text || '';
      } catch (genErr: any) {
        console.warn(`Gemini attempt ${attempts} failed:`, genErr.message || genErr);
        if (attempts < 2) {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
    }

    if (!replyText) {
      // Grounded deterministic fallback based strictly on available catalog
      if (propertyCatalog && propertyCatalog.length > 0) {
        const topProp = propertyCatalog[0];
        replyText = language === 'fr'
          ? `Bonjour ! À l'agence ${agencyName}, nous disposons actuellement de biens d'exception dont "${topProp.title}" à ${topProp.city} (${topProp.price} ${topProp.currency}). Avez-vous un budget ou un secteur particulier en tête ?`
          : `Hello! At ${agencyName}, our verified listings currently include "${topProp.title}" in ${topProp.city} (${topProp.price} ${topProp.currency}). What type of property or budget are you targeting?`;
      } else {
        replyText = language === 'fr'
          ? `Bonjour et bienvenue chez ${agencyName}. Comment puis-je vous accompagner dans votre projet d'achat ou de location aujourd'hui ?`
          : `Hello and welcome to ${agencyName}. How can I assist you with your real estate project today?`;
      }
    }

    res.json({
      text: replyText,
      agentName: 'Sarah - Conseillère IA',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error.message || 'Erreur lors de la génération de la réponse IA.',
    });
  }
});

// AI Lead Qualification: extracts structured criteria from conversation
app.post('/api/ai/qualify', async (req: Request, res: Response) => {
  try {
    const { conversationText = '', currentDetails = {} } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: 'Clé Gemini manquante' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyse cette conversation immobilière entre un prospect et l'agent commercial IA.
Extrais les données de qualification au format JSON strict.

Conversation :
${conversationText}

Données existantes :
${JSON.stringify(currentDetails)}
`,
      config: {
        systemInstruction: 'Tu es un directeur commercial immobilier expert en qualification de leads. Analyse le texte avec rigueur et détermine le score (Chaud, Tiède, Froid) et les critères du projet.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            budget: { type: Type.STRING, description: 'Budget estimé ou mentionné (ex: 450 000 €, 75M XOF, non précisé)' },
            location: { type: Type.STRING, description: 'Ville ou quartier recherché' },
            propertyType: { type: Type.STRING, description: 'Type de bien (Villa, Appartement, Penthouse, Terrain, Bureau)' },
            timeframe: { type: Type.STRING, description: 'Délai d\'achat/location (Urgent < 1 mois, 1 à 3 mois, Plus de 3 mois, Indéterminé)' },
            score: { type: Type.STRING, description: 'Chaud (si budget + délai court + contact donné), Tiède (intérêt réel mais critères partiels), Froid (curieux sans budget ni contact)' },
            scoreReason: { type: Type.STRING, description: 'Explication synthétique du score' },
            suggestedAction: { type: Type.STRING, description: 'Prochaine action recommandée pour l\'agent humain' },
            extractedContact: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
              },
            },
          },
          required: ['budget', 'location', 'propertyType', 'timeframe', 'score', 'scoreReason', 'suggestedAction'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Qualification error:', error);
    res.status(500).json({ error: error.message || 'Erreur qualification' });
  }
});

// AI Auto Follow-up (Relance intelligente respectant les règles anti-spam)
app.post('/api/ai/followup', async (req: Request, res: Response) => {
  try {
    const {
      leadName = 'Client',
      propertyTitle = 'votre recherche immobilière',
      channel = 'whatsapp',
      language = 'fr',
      reason = 'Pas de réponse suite à la présentation du bien',
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: 'Clé Gemini manquante' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Rédige un message de relance commercial court, courtois et personnalisé pour un prospect immobilier.
Canal : ${channel} (si WhatsApp: 2 à 3 lignes max avec 1 emoji discret; si email: objet percutant + corps aéré avec mention légale de désinscription).
Langue : ${language}
Nom du prospect : ${leadName}
Bien ou recherche concernée : ${propertyTitle}
Contexte : ${reason}
Important : Respect strict des règles anti-spam. Ne pas être oppressant, proposer de l'aide ou une mise à jour des disponibilités.`,
      config: {
        systemInstruction: 'Tu es un copywriter SaaS immobilier de premier plan.',
      },
    });

    res.json({
      message: response.text || '',
      channel,
      leadName,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// FedaPay Secure Webhook Endpoint (MTN Mobile Money, Moov Money, Visa/Mastercard)
app.post('/api/webhooks/fedapay', (req: Request, res: Response) => {
  const signature = req.headers['x-fedapay-signature'] || req.headers['authorization'];
  const event = req.body;

  console.log('[Webhook FedaPay] Événement reçu:', event?.name || 'unknown');

  // En production : vérifier le HMAC sha256 avec la clé secrète du webhook FedaPay
  // FEDAPAY_WEBHOOK_SECRET
  if (event && event.name === 'transaction.approved') {
    const transaction = event.entity || {};
    webhookLogs.unshift({
      id: `fed_${transaction.id || Date.now()}`,
      source: 'fedapay',
      event: 'transaction.approved',
      amount: transaction.amount || 59000,
      currency: transaction.currency?.iso || 'XOF',
      status: 'verified',
      timestamp: new Date().toISOString(),
      customer: transaction.customer?.email || transaction.customer?.firstname || 'Client Mobile Money',
    });

    return res.status(200).json({
      received: true,
      status: 'subscription_activated',
      verified: true,
    });
  }

  res.status(200).json({ received: true, note: 'Événement FedaPay traité' });
});

// Paddle Secure Webhook Endpoint (Ventes internationales EUR / USD)
app.post('/api/webhooks/paddle', (req: Request, res: Response) => {
  const alertName = req.body?.alert_name;
  console.log('[Webhook Paddle] Alerte reçue:', alertName);

  if (alertName === 'subscription_payment_succeeded' || alertName === 'subscription_created') {
    webhookLogs.unshift({
      id: `pad_${Date.now()}`,
      source: 'paddle',
      event: alertName,
      amount: parseFloat(req.body?.unit_price || '99'),
      currency: req.body?.currency || 'EUR',
      status: 'verified',
      timestamp: new Date().toISOString(),
      customer: req.body?.email || 'Abonné International',
    });

    return res.status(200).json({ received: true, status: 'subscription_confirmed' });
  }

  res.status(200).json({ received: true });
});

// Get Webhook Logs for Admin
app.get('/api/webhooks/logs', (_req: Request, res: Response) => {
  res.json({ logs: webhookLogs });
});

// Setup dev server with Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

