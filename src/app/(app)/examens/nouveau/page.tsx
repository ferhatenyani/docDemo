"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import { useApp } from "@/lib/store";
import { SectionHeader, Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { useT } from "@/lib/i18n";
import type { TypeExamen, StatutExamen } from "@/lib/types";

export default function NouvelExamenPage() {
  return (
    <Suspense fallback={null}>
      <NouvelExamenPageInner />
    </Suspense>
  );
}

function NouvelExamenPageInner() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { patients, utilisateurs, addExamen, pushToast } = useApp();

  const TYPE_OPTS: { value: TypeExamen; label: string }[] = [
    { value: "ANALYSE", label: t("examen_type_analyse") },
    { value: "RADIO", label: t("examen_type_radio") },
    { value: "ECHO", label: t("examen_type_echo") },
    { value: "SCANNER", label: t("examen_type_scanner") },
    { value: "IRM", label: t("examen_type_irm") },
    { value: "ECG", label: t("examen_type_ecg") },
    { value: "AUTRE", label: t("examen_type_autre") },
  ];

  const STATUT_OPTS: { value: StatutExamen; label: string }[] = [
    { value: "DEMANDE", label: t("examen_requested") },
    { value: "PRESCRIT", label: t("examen_prescribed") },
    { value: "EN_ATTENTE_RESULTAT", label: t("examen_pending_full") },
    { value: "RESULTAT_RECU", label: t("examen_result_received") },
  ];

  const [f, setF] = useState({
    patient_id: params.get("patient") ?? patients[0]?.id ?? "",
    medecin_id: utilisateurs.find((u) => u.role === "MEDECIN")?.id ?? "",
    type: "ANALYSE" as TypeExamen,
    intitule: "",
    laboratoire: "",
    date_demande: new Date().toISOString().slice(0, 10),
    statut: "DEMANDE" as StatutExamen,
    resultat_notes: "",
  });

  function submit() {
    if (!f.patient_id || !f.intitule.trim()) {
      pushToast({ title: t("required_fields"), description: t("examen_required_desc"), tone: "warning" });
      return;
    }
    const created = addExamen({
      ...f,
      consultation_id: params.get("consultation") ?? undefined,
    });
    pushToast({ title: t("examen_created"), tone: "success" });
    router.push(`/examens/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <Link href="/examens" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="dir-icon h-4 w-4" /> {t("examens_title")}
      </Link>
      <SectionHeader title={t("examen_new_request")} />

      <Card padding="md">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("patient")} required>
            <Select
              value={f.patient_id}
              onChange={(v) => setF({ ...f, patient_id: v })}
              options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
            />
          </Field>
          <Field label={t("examen_prescriber")}>
            <Select
              value={f.medecin_id}
              onChange={(v) => setF({ ...f, medecin_id: v })}
              options={utilisateurs.filter((u) => u.role === "MEDECIN").map((u) => ({ value: u.id, label: `Dr. ${u.prenom} ${u.nom}` }))}
            />
          </Field>
          <Field label={t("examen_type")}>
            <Select value={f.type} onChange={(v) => setF({ ...f, type: v as TypeExamen })} options={TYPE_OPTS} />
          </Field>
          <Field label={t("status")}>
            <Select value={f.statut} onChange={(v) => setF({ ...f, statut: v as StatutExamen })} options={STATUT_OPTS} />
          </Field>
          <Field label={t("examen_intitule")} required className="sm:col-span-2">
            <Input value={f.intitule} onChange={(e) => setF({ ...f, intitule: e.target.value })} placeholder={t("examen_intitule_placeholder")} />
          </Field>
          <Field label={t("examen_lab_center")}>
            <Input value={f.laboratoire} onChange={(e) => setF({ ...f, laboratoire: e.target.value })} placeholder={t("examen_lab_placeholder")} />
          </Field>
          <Field label={t("examen_request_date")}>
            <DatePicker value={f.date_demande} onChange={(d) => setF({ ...f, date_demande: d })} />
          </Field>
          <Field label={t("examen_notes_results")} className="sm:col-span-2">
            <Textarea value={f.resultat_notes} onChange={(e) => setF({ ...f, resultat_notes: e.target.value })} rows={4} placeholder={t("examen_notes_placeholder")} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>{t("cancel")}</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={submit}>{t("save")}</Button>
      </div>
    </div>
  );
}
