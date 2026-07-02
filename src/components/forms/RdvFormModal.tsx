"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
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
  const t = useT();
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
      pushToast({ title: t("required_fields"), description: t("select_patient_doctor_motif"), tone: "warning" });
      return;
    }
    addRdv({ ...f });
    pushToast({ title: t("rdv_created"), tone: "success" });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("rdv_new")}
      description={t("rdv_new_desc")}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{t("cancel")}</Button>
          <Button variant="primary" onClick={submit}>{t("create_rdv")}</Button>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={t("patient")} required className="sm:col-span-2">
          <Select
            value={f.patient_id}
            onChange={(v) => setF({ ...f, patient_id: v })}
            options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
            placeholder={t("choose_patient")}
          />
        </Field>
        <Field label={t("doctor")} required>
          <Select
            value={f.medecin_id}
            onChange={(v) => setF({ ...f, medecin_id: v })}
            options={medecins.map((m) => ({ value: m.id, label: `Dr. ${m.prenom} ${m.nom}`, hint: m.specialite }))}
          />
        </Field>
        <Field label={t("status")}>
          <Select
            value={f.statut}
            onChange={(v) => setF({ ...f, statut: v as StatutRDV })}
            options={[
              { value: "CONFIRME", label: t("status_confirmed") },
              { value: "EN_ATTENTE", label: t("status_pending") },
            ]}
          />
        </Field>
        <Field label={t("date")} required>
          <DatePicker value={f.date} onChange={(d) => setF({ ...f, date: d })} />
        </Field>
        <Field label={t("hour")} required>
          <Select value={f.heure} onChange={(v) => setF({ ...f, heure: v })} options={TIMES.map((tm) => ({ value: tm, label: tm }))} />
        </Field>
        <Field label={t("duration_minutes")}>
          <Select
            value={String(f.duree_minutes)}
            onChange={(v) => setF({ ...f, duree_minutes: Number(v) })}
            options={[15, 20, 30, 45, 60].map((d) => ({ value: String(d), label: `${d} ${t("min_abbr")}` }))}
          />
        </Field>
        <Field label={t("motif")} required className="sm:col-span-2">
          <Input value={f.motif} onChange={(e) => setF({ ...f, motif: e.target.value })} placeholder={t("motif_placeholder")} />
        </Field>
        <Field label={t("notes")} className="sm:col-span-2">
          <Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} />
        </Field>
      </div>
    </Modal>
  );
}
