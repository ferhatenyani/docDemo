"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import { useApp } from "@/lib/store";
import { SectionHeader, Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import type { TypeCertificat } from "@/lib/types";

const TYPES: { value: TypeCertificat; label: string }[] = [
  { value: "MEDICAL", label: "Certificat médical" },
  { value: "ARRET_TRAVAIL", label: "Arrêt de travail" },
  { value: "BON_TRANSPORT", label: "Bon de transport" },
  { value: "ORIENTATION", label: "Lettre d'orientation" },
  { value: "APTITUDE", label: "Certificat d'aptitude" },
  { value: "AUTRE", label: "Autre" },
];

function templateFor(type: TypeCertificat, patientNom: string, prenomMed: string, nomMed: string, duree?: number) {
  const nom = patientNom || "…";
  const med = `${prenomMed} ${nomMed}`.trim();
  switch (type) {
    case "MEDICAL":
      return `Je soussigné(e) Dr. ${med} certifie avoir examiné ${nom} et n'avoir constaté aucune contre-indication médicale à ce jour.`;
    case "ARRET_TRAVAIL":
      return `Je soussigné(e) Dr. ${med} certifie que l'état de santé de ${nom} nécessite un arrêt de travail de ${duree ?? 3} jour(s) à compter de ce jour.`;
    case "BON_TRANSPORT":
      return `Je soussigné(e) Dr. ${med} certifie que ${nom} nécessite un transport médicalisé pour se rendre à ses soins.`;
    case "ORIENTATION":
      return `Je soussigné(e) Dr. ${med} adresse ${nom} au confrère spécialiste pour prise en charge complémentaire.`;
    case "APTITUDE":
      return `Je soussigné(e) Dr. ${med} certifie que ${nom} est apte à la pratique sportive.`;
    default:
      return `Je soussigné(e) Dr. ${med}, ${nom}.`;
  }
}

export default function NouveauCertificatPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { patients, utilisateurs, addCertificat, pushToast } = useApp();

  const medecin = utilisateurs.find((u) => u.role === "MEDECIN");
  const [patientId, setPatientId] = useState(params.get("patient") ?? patients[0]?.id ?? "");
  const [type, setType] = useState<TypeCertificat>("MEDICAL");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duree, setDuree] = useState<number | "">(3);
  const [motif, setMotif] = useState("");
  const [contenu, setContenu] = useState("");

  const patient = patients.find((p) => p.id === patientId);

  useEffect(() => {
    if (patient && medecin) {
      setContenu(templateFor(type, `${patient.prenom} ${patient.nom}`, medecin.prenom, medecin.nom, typeof duree === "number" ? duree : undefined));
    }
  }, [type, patientId, duree, medecin, patient]);

  function submit() {
    if (!patientId || !motif.trim()) {
      pushToast({ title: "Champs requis", description: "Patient et motif obligatoires.", tone: "warning" });
      return;
    }
    const created = addCertificat({
      patient_id: patientId,
      medecin_id: medecin?.id ?? utilisateurs[0]?.id ?? "u1",
      type, date,
      duree_jours: type === "ARRET_TRAVAIL" ? (typeof duree === "number" ? duree : 3) : undefined,
      motif, contenu,
    });
    pushToast({ title: "Certificat créé", tone: "success" });
    router.push(`/certificats/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <Link href="/certificats" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Certificats
      </Link>
      <SectionHeader title="Nouveau certificat" />

      <Card padding="md" className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Patient" required>
            <Select
              value={patientId}
              onChange={setPatientId}
              options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
            />
          </Field>
          <Field label="Type de certificat">
            <Select value={type} onChange={(v) => setType(v as TypeCertificat)} options={TYPES} />
          </Field>
          <Field label="Date">
            <DatePicker value={date} onChange={setDate} />
          </Field>
          {type === "ARRET_TRAVAIL" && (
            <Field label="Durée (jours)">
              <Input inputMode="numeric" value={String(duree)} onChange={(e) => setDuree(e.target.value === "" ? "" : Number(e.target.value))} />
            </Field>
          )}
          <Field label="Motif" required className="sm:col-span-2">
            <Input value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Ex: Grippe saisonnière" />
          </Field>
          <Field label="Contenu du certificat" className="sm:col-span-2">
            <Textarea value={contenu} onChange={(e) => setContenu(e.target.value)} rows={6} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>Annuler</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={submit}>Émettre le certificat</Button>
      </div>
    </div>
  );
}
