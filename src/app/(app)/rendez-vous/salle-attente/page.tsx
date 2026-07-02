"use client";

import Link from "next/link";
import { ChevronLeft, Check, Stethoscope, User2, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Badge, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";

function todayIso() { return new Date().toISOString().slice(0, 10); }

export default function SalleAttentePage() {
  const t = useT();
  const { rendezVous, patients, updateRdv, pushToast } = useApp();
  const today = todayIso();

  const waiting = rendezVous
    .filter((r) => r.date === today && (r.statut === "EN_ATTENTE" || r.statut === "CONFIRME"))
    .sort((a, b) => a.heure.localeCompare(b.heure));
  const done = rendezVous
    .filter((r) => r.date === today && r.statut === "TERMINE")
    .sort((a, b) => a.heure.localeCompare(b.heure));

  return (
    <div className="space-y-5">
      <Link href="/rendez-vous" className="inline-flex items-center gap-1 text-[12px] text-ink-500 hover:text-ink-800 cursor-pointer transition-colors">
        <ChevronLeft className="h-3.5 w-3.5 dir-icon" /> {t("rdv_title")}
      </Link>
      <SectionHeader eyebrow={t("waiting_queue")} title={t("wait_room_title")} description={`${waiting.length} ${t("waiting_today")}`} />

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-3">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp min-w-0 truncate">{t("waiting_status")}</div>
            <div className="shrink-0"><Badge tone="info" dot>{waiting.length}</Badge></div>
          </div>
          {waiting.length === 0 ? (
            <EmptyState icon={<User2 className="h-5 w-5" />} title={t("no_one_in_waiting_room")} description={t("all_patients_seen")} />
          ) : (
            <div className="divide-y divide-line">
              {waiting.map((r, i) => {
                const p = patients.find((x) => x.id === r.patient_id);
                if (!p) return null;
                return (
                  <div key={r.id} className="px-3 sm:px-4 py-2.5">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="h-8 w-8 rounded-md bg-ink-900 text-white grid place-items-center text-[12px] font-semibold shrink-0 tabular">{i + 1}</div>
                      <Avatar name={`${p.prenom} ${p.nom}`} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                        <div className="text-[11px] text-ink-500 truncate">
                          <span className="tabular font-medium">{r.heure}</span> · {r.motif}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        <Link href={`/consultations/nouveau?patient=${p.id}&rdv=${r.id}`}>
                          <Button size="sm" variant="dark" leftIcon={<Stethoscope className="h-3.5 w-3.5" />}>{t("consult")}</Button>
                        </Link>
                        <button
                          aria-label={t("mark_absent")}
                          title={t("mark_absent")}
                          onClick={() => { updateRdv(r.id, { statut: "ABSENT" }); pushToast({ title: t("marked_absent"), tone: "warning" }); }}
                          className="h-8 w-8 grid place-items-center rounded-md hover:bg-warning-soft text-warning cursor-pointer transition-colors"
                        >
                          <User2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label={t("cancel_action")}
                          title={t("cancel_rdv")}
                          onClick={() => { updateRdv(r.id, { statut: "ANNULE" }); pushToast({ title: t("rdv_cancelled"), tone: "danger" }); }}
                          className="h-8 w-8 grid place-items-center rounded-md hover:bg-danger-soft text-danger cursor-pointer transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 sm:hidden">
                      <Link href={`/consultations/nouveau?patient=${p.id}&rdv=${r.id}`} className="flex-1 min-w-0">
                        <Button size="sm" variant="dark" fullWidth leftIcon={<Stethoscope className="h-3.5 w-3.5" />}>{t("consult")}</Button>
                      </Link>
                      <button
                        aria-label={t("mark_absent")}
                        title={t("mark_absent")}
                        onClick={() => { updateRdv(r.id, { statut: "ABSENT" }); pushToast({ title: t("marked_absent"), tone: "warning" }); }}
                        className="h-8 w-8 shrink-0 grid place-items-center rounded-md border border-line hover:bg-warning-soft hover:border-warning-soft text-warning cursor-pointer transition-colors"
                      >
                        <User2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label={t("cancel_action")}
                        title={t("cancel_rdv")}
                        onClick={() => { updateRdv(r.id, { statut: "ANNULE" }); pushToast({ title: t("rdv_cancelled"), tone: "danger" }); }}
                        className="h-8 w-8 shrink-0 grid place-items-center rounded-md border border-line hover:bg-danger-soft hover:border-danger-soft text-danger cursor-pointer transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-3">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp min-w-0 truncate">{t("status_done_plural")}</div>
            <div className="shrink-0"><Badge tone="success" dot>{done.length}</Badge></div>
          </div>
          {done.length === 0 ? (
            <EmptyState icon={<Check className="h-5 w-5" />} title={t("no_consultation_done")} />
          ) : (
            <div className="divide-y divide-line">
              {done.map((r) => {
                const p = patients.find((x) => x.id === r.patient_id);
                if (!p) return null;
                return (
                  <div key={r.id} className="px-3 sm:px-4 py-2.5 flex items-center gap-2.5 sm:gap-3">
                    <div className="h-8 w-8 rounded-md bg-success-soft text-[#0f7a48] grid place-items-center shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                      <div className="text-[11px] text-ink-500 truncate tabular">{r.heure} · {r.motif}</div>
                    </div>
                    <Link href={`/patients/${p.id}`} className="shrink-0 text-[11px] text-brand-700 hover:text-brand-800 font-medium cursor-pointer">{t("record")}</Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
