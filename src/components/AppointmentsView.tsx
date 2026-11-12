import React, { useState } from 'react';
import { VisitAppointment, Agency, AppointmentStatus } from '../types';
import { translations } from '../i18n';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Building,
  User,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface AppointmentsViewProps {
  agency: Agency;
  appointments: VisitAppointment[];
  onValidateAppointment: (id: string) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  agency,
  appointments,
  onValidateAppointment,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  const agencyAppointments = appointments.filter((a) => a.agencyId === agency.id);
  const filtered = agencyAppointments.filter((a) => {
    if (filter === 'pending') return a.status === 'en_attente_validation';
    if (filter === 'confirmed') return a.status === 'confirme_par_agent';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Planning des Rendez-vous & Visites
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Validation des demandes de visites enregistrées par l'agent IA Sarah 24h/24.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes ({agencyAppointments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            À valider ({agencyAppointments.filter((a) => a.status === 'en_attente_validation').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filter === 'confirmed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Confirmées ({agencyAppointments.filter((a) => a.status === 'confirme_par_agent').length})
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice: Never confirm without human approval */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Règle de sécurité stricte :</strong> L'agent commercial IA n'a pas
          l'autorisation de confirmer unilatéralement un rendez-vous à un prospect. Il recueille
          le créneau souhaité et prévient le client qu'un conseiller humain de {agency.name} va
          valider les clés et l'agenda. Cliquez sur <strong>« Valider le créneau »</strong> pour
          officialiser le rendez-vous.
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((appt) => {
          const isPending = appt.status === 'en_attente_validation';
          const isConfirmed = appt.status === 'confirme_par_agent';

          return (
            <div
              key={appt.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between ${
                isPending ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isPending
                        ? 'bg-amber-100 text-amber-800'
                        : isConfirmed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isPending
                      ? 'En attente validation conseiller'
                      : isConfirmed
                      ? 'Validé par l\'agence'
                      : appt.status}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    {appt.requestedTime}
                  </span>
                </div>

                {/* Date & Property */}
                <div className="py-3 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{appt.requestedDate}</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-snug">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{appt.propertyTitle}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{appt.leadName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{appt.leadPhone}</span>
                  </div>

                  {appt.agentNotes && (
                    <div className="mt-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-600 leading-relaxed">
                      {appt.agentNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {isPending && (
                  <button
                    onClick={() => onValidateAppointment(appt.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider & Envoyer confirmation</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${appt.leadPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${appt.leadName}, votre visite pour "${appt.propertyTitle}" le ${appt.requestedDate} à ${appt.requestedTime} est confirmée par notre agence ${agency.name}. À très bientôt !`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Contacter WhatsApp</span>
                  </a>

                  {isConfirmed && (
                    <button
                      onClick={() => onUpdateStatus(appt.id, 'effectue')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-xs font-medium"
                    >
                      Marquer effectuée
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
