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
import type { TypeExamen, StatutExamen } from "@/lib/types";

const TYPE_OPTS: { value: TypeExamen; label: string }[] = [
  { value: "ANALYSE", label: "Analyse biologique" },
  { value: "RADIO", label: "Radiographie" },
  { value: "ECHO", label: "Échographie" },
  { value: "SCANNER", label: "Scanner (TDM)" },
  { value: "IRM", label: "IRM" },
  { value: "ECG", label: "ECG" },
  { value: "AUTRE", label: "Autre" },
];

const STATUT_OPTS: { value: StatutExamen; label: string }[] = [
  { value: "DEMANDE", label: "Demandé" },
  { value: "PRESCRIT", label: "Prescrit" },
  { value: "EN_ATTENTE_RESULTAT", label: "En attente de résultat" },
  { value: "RESULTAT_RECU", label: "Résultat reçu" },
];

export default function NouvelExamenPage() {
  return (
    <Suspense fallback={null}>
      <NouvelExamenPageInner />
    </Suspense>
  );
}

function NouvelExamenPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { patients, utilisateurs, addExamen, pushToast } = useApp();

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
      pushToast({ title: "Champs requis", description: "Patient et intitulé sont obligatoires.", tone: "warning" });
      return;
    }
    const created = addExamen({
      ...f,
      consultation_id: params.get("consultation") ?? undefined,
    });
    pushToast({ title: "Examen créé", tone: "success" });
    router.push(`/examens/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <Link href="/examens" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Examens
      </Link>
      <SectionHeader title="Nouvelle demande d'examen" />

      <Card padding="md">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Patient" required>
            <Select
              value={f.patient_id}
              onChange={(v) => setF({ ...f, patient_id: v })}
              options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
            />
          </Field>
          <Field label="Médecin prescripteur">
            <Select
              value={f.medecin_id}
              onChange={(v) => setF({ ...f, medecin_id: v })}
              options={utilisateurs.filter((u) => u.role === "MEDECIN").map((u) => ({ value: u.id, label: `Dr. ${u.prenom} ${u.nom}` }))}
            />
          </Field>
          <Field label="Type">
            <Select value={f.type} onChange={(v) => setF({ ...f, type: v as TypeExamen })} options={TYPE_OPTS} />
          </Field>
          <Field label="Statut">
            <Select value={f.statut} onChange={(v) => setF({ ...f, statut: v as StatutExamen })} options={STATUT_OPTS} />
          </Field>
          <Field label="Intitulé de l'examen" required className="sm:col-span-2">
            <Input value={f.intitule} onChange={(e) => setF({ ...f, intitule: e.target.value })} placeholder="Ex: HbA1c, bilan lipidique" />
          </Field>
          <Field label="Laboratoire / centre">
            <Input value={f.laboratoire} onChange={(e) => setF({ ...f, laboratoire: e.target.value })} placeholder="Ex: Labo Ibn Rochd" />
          </Field>
          <Field label="Date de la demande">
            <DatePicker value={f.date_demande} onChange={(d) => setF({ ...f, date_demande: d })} />
          </Field>
          <Field label="Notes / résultats" className="sm:col-span-2">
            <Textarea value={f.resultat_notes} onChange={(e) => setF({ ...f, resultat_notes: e.target.value })} rows={4} placeholder="Notes cliniques ou résultats reçus" />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>Annuler</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={submit}>Enregistrer</Button>
      </div>
    </div>
  );
}
