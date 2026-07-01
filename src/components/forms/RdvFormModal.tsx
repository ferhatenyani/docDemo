"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import type { StatutRDV } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultPatientId?: string;
}

const TIMES = Array.from({ length: 20 }).map((_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export function RdvFormModal({ open, onClose, defaultDate, defaultPatientId }: Props) {
  const { patients, utilisateurs, addRdv, pushToast } = useApp();
  const medecins = utilisateurs.filter((u) => u.role === "MEDECIN");
  const [f, setF] = useState({
    patient_id: defaultPatientId ?? patients[0]?.id ?? "",
    medecin_id: medecins[0]?.id ?? "",
    date: defaultDate ?? new Date().toISOString().slice(0, 10),
    heure: "09:00",
    duree_minutes: 20,
    motif: "",
    statut: "CONFIRME" as StatutRDV,
    notes: "",
  });

  function submit() {
    if (!f.patient_id || !f.medecin_id || !f.motif.trim()) {
      pushToast({ title: "Champs requis", description: "Sélectionnez patient, médecin et motif.", tone: "warning" });
      return;
    }
    addRdv({ ...f });
    pushToast({ title: "Rendez-vous créé", tone: "success" });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouveau rendez-vous"
      description="Planifiez un rendez-vous pour un patient existant."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={submit}>Créer le rendez-vous</Button>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Patient" required className="sm:col-span-2">
          <Select
            value={f.patient_id}
            onChange={(v) => setF({ ...f, patient_id: v })}
            options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
            placeholder="Choisir un patient"
          />
        </Field>
        <Field label="Médecin" required>
          <Select
            value={f.medecin_id}
            onChange={(v) => setF({ ...f, medecin_id: v })}
            options={medecins.map((m) => ({ value: m.id, label: `Dr. ${m.prenom} ${m.nom}`, hint: m.specialite }))}
          />
        </Field>
        <Field label="Statut">
          <Select
            value={f.statut}
            onChange={(v) => setF({ ...f, statut: v as StatutRDV })}
            options={[
              { value: "CONFIRME", label: "Confirmé" },
              { value: "EN_ATTENTE", label: "En attente" },
            ]}
          />
        </Field>
        <Field label="Date" required>
          <DatePicker value={f.date} onChange={(d) => setF({ ...f, date: d })} />
        </Field>
        <Field label="Heure" required>
          <Select value={f.heure} onChange={(v) => setF({ ...f, heure: v })} options={TIMES.map((t) => ({ value: t, label: t }))} />
        </Field>
        <Field label="Durée (minutes)">
          <Select
            value={String(f.duree_minutes)}
            onChange={(v) => setF({ ...f, duree_minutes: Number(v) })}
            options={[15, 20, 30, 45, 60].map((d) => ({ value: String(d), label: `${d} min` }))}
          />
        </Field>
        <Field label="Motif" required className="sm:col-span-2">
          <Input value={f.motif} onChange={(e) => setF({ ...f, motif: e.target.value })} placeholder="Ex: Suivi diabète" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} />
        </Field>
      </div>
    </Modal>
  );
}
