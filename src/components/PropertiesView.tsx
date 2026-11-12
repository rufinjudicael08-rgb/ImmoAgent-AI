import React, { useState } from 'react';
import { Property, Agency, PropertyType, PropertyStatus, Currency } from '../types';
import { translations, formatPrice } from '../i18n';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Home,
  Tag,
  Maximize2,
  Bed,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

interface PropertiesViewProps {
  agency: Agency;
  properties: Property[];
  onAddProperty: (newProp: Property) => void;
  onUpdatePropertyStatus: (id: string, status: PropertyStatus) => void;
  currency: Currency;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  agency,
  properties,
  onAddProperty,
  onUpdatePropertyStatus,
  currency,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('villa');
  const [price, setPrice] = useState<number>(450000);
  const [city, setCity] = useState(agency.city.split('&')[0].trim());
  const [neighborhood, setNeighborhood] = useState('');
  const [rooms, setRooms] = useState<number>(5);
  const [surface, setSurface] = useState<number>(180);
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('Piscine, Vue dégagée, Climatisation, Garage');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_modern_villa_1794417276389.jpg');

  // Filter properties by agency, type and search
  const filtered = properties.filter((p) => {
    const matchesAgency = p.agencyId === agency.id;
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.neighborhood && p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAgency && matchesType && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !city) return;

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      agencyId: agency.id,
      referenceNumber: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      type,
      price: Number(price),
      currency: agency.currency,
      city,
      neighborhood: neighborhood || undefined,
      rooms: Number(rooms),
      surface: Number(surface),
      status: 'disponible',
      imageUrl: imageUrl || '/src/assets/images/hero_modern_villa_1794417276389.jpg',
      description:
        description ||
        `Superbe opportunité immobilière proposée en exclusivité par ${agency.name}. Visite possible sur rendez-vous validé avec un conseiller.`,
      features: featuresInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    onAddProperty(newProperty);
    setIsModalOpen(false);

    // Reset fields
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Catalogue des Biens Immobiliers
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Source de vérité exclusive de l'agent IA Sarah pour {agency.name}.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un bien</span>
        </button>
      </div>

      {/* Strict Anti-Hallucination Policy Callout */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Règle d'or de l'IA ImmoAgent :</strong> L'agent conversationnel ne spécule
          jamais et n'invente aucun bien, prix ou délai. Il répond avec précision chirurgicale en
          se basant uniquement sur les <strong>{properties.filter((p) => p.agencyId === agency.id).length} biens</strong> enregistrés dans votre agence ci-dessous.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        {/* Type tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Tous les biens' },
            { id: 'villa', label: 'Villas' },
            { id: 'appartement', label: 'Appartements' },
            { id: 'duplex', label: 'Duplex & Penthouses' },
            { id: 'bureau', label: 'Bureaux' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par ville, titre, référence..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
          />
        </div>
      </div>

      {/* Property Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Aucun bien trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Aucun bien ne correspond à vos critères de recherche dans cette agence.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 cursor-pointer"
          >
            Enregistrer le premier bien
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Image & Price Overlay */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {property.referenceNumber}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs ${
                        property.status === 'disponible'
                          ? 'bg-emerald-500/90 text-white'
                          : property.status === 'sous_compromis'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-rose-500/90 text-white'
                      }`}
                    >
                      {property.status === 'disponible'
                        ? 'Disponible'
                        : property.status === 'sous_compromis'
                        ? 'Sous compromis'
                        : 'Vendu'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 px-2.5 py-1 rounded font-bold text-sm font-mono shadow-xs">
                    {formatPrice(property.price, property.currency)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {property.city}
                      {property.neighborhood ? ` · ${property.neighborhood}` : ''}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {property.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  {/* Surface and rooms */}
                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{property.rooms}</strong> pièces
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{property.surface}</strong> m²
                    </span>
                  </div>

                  {/* Features tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {property.features.slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {feat}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{property.features.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Statut disponibilité :</span>
                <select
                  value={property.status}
                  onChange={(e) =>
                    onUpdatePropertyStatus(property.id, e.target.value as PropertyStatus)
                  }
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium cursor-pointer focus:outline-none focus:border-slate-500"
                >
                  <option value="disponible">Disponible</option>
                  <option value="sous_compromis">Sous compromis</option>
                  <option value="vendu">Vendu</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Property */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Enregistrer un Bien dans le Catalogue Officiel
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Titre de l'annonce immobilière
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Villa d'architecte vue mer avec piscine à débordement"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type de bien</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="villa">Villa</option>
                    <option value="appartement">Appartement</option>
                    <option value="duplex">Duplex / Penthouse</option>
                    <option value="bureau">Bureau / Commerce</option>
                    <option value="terrain">Terrain</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prix de vente ({agency.currency})
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quartier (optionnel)</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: La Californie, Riviera Golf, 16ème"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre de pièces</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Surface (m²)</label>
                  <input
                    type="number"
                    value={surface}
                    onChange={(e) => setSurface(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description détaillée pour l'agent IA
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les atouts, l'exposition, l'étage, l'état général. L'IA utilisera ce texte pour répondre fidèlement aux questions."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Points forts (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Vue mer, Piscine chauffée, Domotique, Ascenseur..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sélection d'image d'illustration
                </label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="/src/assets/images/hero_modern_villa_1794417276389.jpg">
                    Villa Contemporaine avec Piscine (Haute Définition)
                  </option>
                  <option value="/src/assets/images/apartment_city_center_1794417277860.jpg">
                    Appartement Lumineux & Parquet Haussmannien
                  </option>
                  <option value="/src/assets/images/duplex_terrace_view_1794417278636.jpg">
                    Penthouse Duplex avec Terrasse Rooftop Couché de Soleil
                  </option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Ajouter au catalogue IA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
