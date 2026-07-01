"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, CalendarClock, ChevronLeft, ChevronRight, Users, Check, X, User2,
} from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, Chip, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Tabs } from "@/components/ui/Tabs";
import { RdvFormModal } from "@/components/forms/RdvFormModal";
import type { StatutRDV } from "@/lib/types";

function todayIso() { return new Date().toISOString().slice(0, 10); }

function statutTone(s: StatutRDV) {
  return s === "CONFIRME" ? "success" : s === "EN_ATTENTE" ? "info" : s === "TERMINE" ? "neutral" : s === "ABSENT" ? "warning" : "danger";
}
function statutLabel(s: StatutRDV) {
  return s === "CONFIRME" ? "Confirmé" : s === "EN_ATTENTE" ? "En attente" : s === "TERMINE" ? "Terminé" : s === "ABSENT" ? "Absent" : "Annulé";
}

export default function RendezVousPage() {
  const searchParams = useSearchParams();
  const {
    rendezVous, patients, utilisateurs, updateRdv,
  } = useApp();
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [selected, setSelected] = useState<string>(todayIso());
  const [openForm, setOpenForm] = useState(searchParams.get("new") === "1");
  const [medecinFilter, setMedecinFilter] = useState<string>("Tous");

  const medecins = utilisateurs.filter((u) => u.role === "MEDECIN");
  const rdvFiltered = useMemo(
    () => rendezVous.filter((r) => medecinFilter === "Tous" || r.medecin_id === medecinFilter),
    [rendezVous, medecinFilter],
  );

  const markers: Record<string, number> = {};
  rdvFiltered.forEach((r) => { markers[r.date] = (markers[r.date] ?? 0) + 1; });

  const dayRdv = rdvFiltered
    .filter((r) => r.date === selected)
    .sort((a, b) => a.heure.localeCompare(b.heure));

  const weekDays = useMemo(() => {
    const d = new Date(selected + "T00:00:00");
    const weekday = (d.getDay() + 6) % 7;
    const start = new Date(d); start.setDate(d.getDate() - weekday);
    return Array.from({ length: 7 }).map((_, i) => {
      const dd = new Date(start); dd.setDate(start.getDate() + i);
      return dd.toISOString().slice(0, 10);
    });
  }, [selected]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Agenda"
        title="Rendez-vous"
        description="Agenda, salle d'attente et prise de rendez-vous."
        actions={
          <>
            <Link href="/rendez-vous/salle-attente">
              <Button variant="secondary" leftIcon={<Users className="h-3.5 w-3.5" />}>Salle d'attente</Button>
            </Link>
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setOpenForm(true)}>
              Nouveau RDV
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <Tabs
          variant="segmented"
          tabs={[
            { key: "day", label: "Jour" },
            { key: "week", label: "Semaine" },
            { key: "month", label: "Mois" },
          ]}
          active={view}
          onChange={(k) => setView(k as any)}
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip active={medecinFilter === "Tous"} onClick={() => setMedecinFilter("Tous")}>Tous les médecins</Chip>
          {medecins.map((m) => (
            <Chip key={m.id} active={medecinFilter === m.id} onClick={() => setMedecinFilter(m.id)}>
              Dr. {m.nom}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4">
        <Calendar value={selected} onChange={setSelected} markers={markers} className="w-full" />

        <div className="space-y-4">
          {view === "day" && (
            <div className="bg-white rounded-lg border border-line shadow-xs">
              <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-ink-900 tracking-crisp">{formatDate(selected)}</div>
                  <div className="text-[11px] text-ink-500">{dayRdv.length} rendez-vous</div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    aria-label="Jour précédent"
                    className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-600"
                    onClick={() => {
                      const d = new Date(selected + "T00:00:00");
                      d.setDate(d.getDate() - 1);
                      setSelected(d.toISOString().slice(0, 10));
                    }}
                  ><ChevronLeft className="h-3.5 w-3.5" /></button>
                  <button
                    className="h-7 px-2.5 rounded-md text-[11px] font-medium hover:bg-ink-100 cursor-pointer text-ink-700"
                    onClick={() => setSelected(todayIso())}
                  >Aujourd'hui</button>
                  <button
                    aria-label="Jour suivant"
                    className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-600"
                    onClick={() => {
                      const d = new Date(selected + "T00:00:00");
                      d.setDate(d.getDate() + 1);
                      setSelected(d.toISOString().slice(0, 10));
                    }}
                  ><ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {dayRdv.length === 0 ? (
                <EmptyState
                  icon={<CalendarClock className="h-5 w-5" />}
                  title="Aucun rendez-vous ce jour"
                  description="Cette journée est libre."
                  action={<Button variant="dark" onClick={() => setOpenForm(true)}>Nouveau RDV</Button>}
                />
              ) : (
                <div className="divide-y divide-line">
                  {dayRdv.map((r) => {
                    const p = patients.find((x) => x.id === r.patient_id);
                    const m = utilisateurs.find((x) => x.id === r.medecin_id);
                    return (
                      <div key={r.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-ink-50/60 transition-colors">
                        <div className="w-14 shrink-0 text-center border-e border-line pe-3">
                          <div className="text-[14px] font-semibold tabular text-ink-900">{r.heure}</div>
                          <div className="text-[10px] text-ink-500">{r.duree_minutes}m</div>
                        </div>
                        {p ? (
                          <Link href={`/patients/${p.id}`} className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer">
                            <Avatar name={`${p.prenom} ${p.nom}`} size={30} />
                            <div className="min-w-0">
                              <div className="text-[13px] font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                              <div className="text-[11px] text-ink-500 truncate">{r.motif}</div>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex-1 text-[12px] text-ink-500">Patient supprimé</div>
                        )}
                        <div className="hidden md:block text-[11px] text-ink-500 shrink-0">
                          {m ? `Dr. ${m.nom}` : ""}
                        </div>
                        <Badge tone={statutTone(r.statut)} dot>{statutLabel(r.statut)}</Badge>
                        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
                          {r.statut !== "TERMINE" && (
                            <button
                              onClick={() => updateRdv(r.id, { statut: "TERMINE" })}
                              className="h-7 w-7 grid place-items-center rounded-md hover:bg-success-soft text-[#0f7a48] cursor-pointer transition-colors"
                              aria-label="Marquer terminé"
                              title="Marquer terminé"
                            ><Check className="h-3.5 w-3.5" /></button>
                          )}
                          {r.statut !== "ABSENT" && r.statut !== "TERMINE" && (
                            <button
                              onClick={() => updateRdv(r.id, { statut: "ABSENT" })}
                              className="h-7 w-7 grid place-items-center rounded-md hover:bg-warning-soft text-warning cursor-pointer transition-colors"
                              aria-label="Marquer absent"
                              title="Marquer absent"
                            ><User2 className="h-3.5 w-3.5" /></button>
                          )}
                          {r.statut !== "ANNULE" && r.statut !== "TERMINE" && (
                            <button
                              onClick={() => updateRdv(r.id, { statut: "ANNULE" })}
                              className="h-7 w-7 grid place-items-center rounded-md hover:bg-danger-soft text-danger cursor-pointer transition-colors"
                              aria-label="Annuler"
                              title="Annuler"
                            ><X className="h-3.5 w-3.5" /></button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {view === "week" && (
            <div className="bg-white rounded-lg border border-line shadow-xs p-3">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {weekDays.map((d) => {
                  const list = rdvFiltered.filter((r) => r.date === d).sort((a, b) => a.heure.localeCompare(b.heure));
                  const isToday = d === todayIso();
                  const isSel = d === selected;
                  const dObj = new Date(d + "T00:00:00");
                  return (
                    <button
                      key={d}
                      onClick={() => setSelected(d)}
                      className={
                        "rounded-md border p-2 text-left cursor-pointer transition-all min-h-[110px] " +
                        (isSel ? "bg-ink-900 border-ink-900 text-white" : "bg-white border-line hover:border-line-strong")
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={"text-[10px] " + (isSel ? "text-white/70" : "text-ink-500")}>
                          {dObj.toLocaleDateString("fr-DZ", { weekday: "short" })}
                        </div>
                        <div className={"text-[13px] font-semibold tabular " + (isSel ? "text-white" : isToday ? "text-brand-700" : "text-ink-800")}>
                          {dObj.getDate()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {list.slice(0, 3).map((r) => {
                          const p = patients.find((x) => x.id === r.patient_id);
                          return (
                            <div
                              key={r.id}
                              className={
                                "text-[10px] rounded-sm px-1.5 py-0.5 truncate " +
                                (isSel ? "bg-white/15 text-white" : "bg-brand-50 text-brand-800")
                              }
                            >
                              <span className="tabular font-semibold">{r.heure}</span> {p ? `${p.prenom} ${p.nom}` : ""}
                            </div>
                          );
                        })}
                        {list.length > 3 && (
                          <div className={"text-[10px] " + (isSel ? "text-white/60" : "text-ink-500")}>+{list.length - 3} autres</div>
                        )}
                        {list.length === 0 && (
                          <div className={"text-[10px] " + (isSel ? "text-white/40" : "text-ink-400")}>—</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === "month" && (
            <div className="bg-white rounded-lg border border-line shadow-xs">
              <div className="px-4 py-3 border-b border-line text-[12px] text-ink-500">
                Total ce mois: <span className="font-semibold text-ink-800 tabular">{rdvFiltered.filter((r) => r.date.startsWith(selected.slice(0, 7))).length}</span> RDV
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[520px] overflow-auto p-3">
                {rdvFiltered
                  .filter((r) => r.date.startsWith(selected.slice(0, 7)))
                  .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure))
                  .map((r) => {
                    const p = patients.find((x) => x.id === r.patient_id);
                    return (
                      <div key={r.id} className="rounded-md border border-line p-2.5 flex items-center gap-3 bg-white hover:border-line-strong transition-colors">
                        <div className="text-center shrink-0">
                          <div className="text-[13px] font-semibold text-ink-900 tabular">{r.heure}</div>
                          <div className="text-[10px] text-ink-500">
                            {new Date(r.date + "T00:00:00").toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" })}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-ink-900 truncate">{p ? `${p.prenom} ${p.nom}` : "—"}</div>
                          <div className="text-[11px] text-ink-500 truncate">{r.motif}</div>
                        </div>
                        <Badge tone={statutTone(r.statut)} size="sm" dot>{statutLabel(r.statut)}</Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      <RdvFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        defaultDate={selected}
        defaultPatientId={searchParams.get("patient") ?? undefined}
      />
    </div>
  );
}
