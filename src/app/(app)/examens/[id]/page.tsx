"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, FlaskConical, Save, Printer, Paperclip } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { useT } from "@/lib/i18n";
import type { StatutExamen } from "@/lib/types";

export default function ExamenDetailPage() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const { examens, patients, utilisateurs, updateExamen, pushToast, clinique } = useApp();
  const e = examens.find((x) => x.id === id);
  const [statut, setStatut] = useState<StatutExamen | undefined>(e?.statut);
  const [notes, setNotes] = useState(e?.resultat_notes ?? "");
  const [dateResultat, setDateResultat] = useState(e?.date_resultat ?? "");

  if (!e) {
    return (
      <Card padding="md">
        <EmptyState
          icon={<FlaskConical className="h-6 w-6" />}
          title={t("examen_not_found")}
          action={<Link href="/examens"><Button variant="primary">{t("back")}</Button></Link>}
        />
      </Card>
    );
  }
  const p = patients.find((x) => x.id === e.patient_id);
  const m = utilisateurs.find((x) => x.id === e.medecin_id);

  return (
    <div className="space-y-4">
      <Link href="/examens" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="dir-icon h-4 w-4" /> {t("examens_title")}
      </Link>
      <SectionHeader
        className="no-print"
        title={e.intitule}
        description={`${e.type} • ${p ? p.prenom + " " + p.nom : ""}`}
        actions={
          <Button variant="secondary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>{t("print")}</Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padding="lg" className="lg:col-span-2 print-page">
          <div className="flex items-start justify-between pb-3 border-b border-line gap-3">
            <div className="min-w-0">
              <div className="text-[16px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
              <div className="text-[12px] text-ink-500">{clinique.adresse}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[12px] text-ink-500">{t("examen_request_title")}</div>
              <div className="text-[13px] font-medium">{formatDate(e.date_demande, t.locale)}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {p && <div className="text-[13px]"><span className="text-ink-500">{t("patient")}:</span> <span className="font-semibold">{p.prenom} {p.nom}</span></div>}
            {m && <div className="text-[13px]"><span className="text-ink-500">{t("examen_prescriber")}:</span> Dr. {m.prenom} {m.nom}</div>}
            <div className="text-[13px]"><span className="text-ink-500">{t("examen_type")}:</span> {e.type}</div>
            <div className="text-[13px]"><span className="text-ink-500">{t("examen_intitule")}:</span> {e.intitule}</div>
            {e.laboratoire && <div className="text-[13px]"><span className="text-ink-500">{t("laboratory")}:</span> {e.laboratoire}</div>}
          </div>
          {e.resultat_notes && (
            <div className="mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3">
              <div className="text-[11px] uppercase text-brand-700 font-semibold tracking-wide">{t("examen_results_notes")}</div>
              <div className="text-[13px] text-ink-800 whitespace-pre-wrap mt-1">{e.resultat_notes}</div>
            </div>
          )}
          {e.fichier_nom && (
            <div className="mt-3 rounded-xl border border-line p-3 text-[13px] text-ink-700 flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-ink-500 shrink-0" />
              <span className="flex-1 min-w-0 truncate">{e.fichier_nom}</span>
              <span className="text-[11px] text-ink-500 shrink-0">{t("examen_attachment")}</span>
            </div>
          )}
        </Card>

        <Card padding="md" className="space-y-3 no-print">
          <div className="text-[13px] font-semibold text-ink-800">{t("examen_update_result")}</div>
          <Field label={t("status")}>
            <Select
              value={statut ?? "DEMANDE"}
              onChange={(v) => setStatut(v as StatutExamen)}
              options={[
                { value: "DEMANDE", label: t("examen_requested") },
                { value: "PRESCRIT", label: t("examen_prescribed") },
                { value: "EN_ATTENTE_RESULTAT", label: t("examen_pending") },
                { value: "RESULTAT_RECU", label: t("examen_result_received") },
              ]}
            />
          </Field>
          <Field label={t("examen_result_date")}>
            <DatePicker value={dateResultat} onChange={setDateResultat} />
          </Field>
          <Field label={t("examen_result_notes")}>
            <Textarea value={notes} onChange={(ev) => setNotes(ev.target.value)} rows={4} />
          </Field>
          <Button
            variant="primary"
            fullWidth
            leftIcon={<Save className="h-4 w-4" />}
            onClick={() => {
              updateExamen(e.id, { statut, resultat_notes: notes, date_resultat: dateResultat || undefined });
              pushToast({ title: t("examen_updated"), tone: "success" });
            }}
          >{t("save")}</Button>
          <div className="pt-2">
            <Badge tone={e.statut === "RESULTAT_RECU" ? "success" : e.statut === "EN_ATTENTE_RESULTAT" ? "warning" : "info"}>
              {e.statut === "RESULTAT_RECU" ? t("examen_result_received") : e.statut === "EN_ATTENTE_RESULTAT" ? t("examen_pending") : e.statut === "DEMANDE" ? t("examen_requested") : t("examen_prescribed")}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
