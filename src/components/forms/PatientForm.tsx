"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Card } from "@/components/ui/misc";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { WILAYAS } from "@/lib/seed";
import type { GroupeSanguin, Patient, Sexe, TypeAssurance, MaladieChronique } from "@/lib/types";
import { X, Plus, Save } from "lucide-react";

interface Props {
  patient?: Patient;
  onDone?: (p: Patient) => void;
}

const GROUPES: GroupeSanguin[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CHRONIQUES: MaladieChronique[] = [
  "Diabète type 1", "Diabète type 2", "HTA", "Asthme",
  "Insuffisance rénale", "Cardiopathie", "Dyslipidémie", "Hypothyroïdie",
];

function TagList({
  values, onChange, placeholder, removeLabel,
}: { values: string[]; onChange: (v: string[]) => void; placeholder: string; removeLabel: string }) {
  const [input, setInput] = useState("");
  return (
    <div className="rounded-xl border border-line bg-white p-2 flex flex-wrap gap-1.5 min-h-[44px] focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(0,122,255,0.15)] transition">
      {values.map((v, i) => (
        <span key={i} className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 rounded-full px-2.5 py-1 text-[12px]">
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((_, x) => x !== i))}
            className="hover:bg-brand-100 rounded-full h-4 w-4 grid place-items-center cursor-pointer shrink-0"
            aria-label={removeLabel}
          ><X className="h-3 w-3" /></button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();
            onChange([...values, input.trim()]);
            setInput("");
          }
        }}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] outline-none text-[13px] px-2 bg-transparent"
      />
    </div>
  );
}

export function PatientForm({ patient, onDone }: Props) {
  const t = useT();
  const router = useRouter();
  const addPatient = useApp((s) => s.addPatient);
  const updatePatient = useApp((s) => s.updatePatient);
  const pushToast = useApp((s) => s.pushToast);

  const SEXE_OPTS = [
    { value: "M" as Sexe, label: t("sex_male") },
    { value: "F" as Sexe, label: t("sex_female") },
  ];

  const ASSURANCE_OPTS: { value: TypeAssurance; label: string }[] = [
    { value: "CNAS", label: t("ins_cnas") },
    { value: "CASNOS", label: t("ins_casnos") },
    { value: "ASSURE", label: t("ins_assure") },
    { value: "AYANT_DROIT", label: t("ins_ayant_droit") },
    { value: "NON_ASSURE", label: t("ins_non_assure") },
  ];

  const [f, setF] = useState<Omit<Patient, "id" | "code" | "cree_le">>({
    nom: patient?.nom ?? "",
    prenom: patient?.prenom ?? "",
    sexe: patient?.sexe ?? "M",
    date_naissance: patient?.date_naissance ?? "",
    groupe_sanguin: patient?.groupe_sanguin,
    telephone: patient?.telephone ?? "",
    email: patient?.email ?? "",
    wilaya: patient?.wilaya ?? "Alger",
    commune: patient?.commune ?? "",
    adresse: patient?.adresse ?? "",
    numero_securite_sociale: patient?.numero_securite_sociale ?? "",
    numero_chifa: patient?.numero_chifa ?? "",
    type_assurance: patient?.type_assurance ?? "ASSURE",
    antecedents: patient?.antecedents ?? [],
    allergies: patient?.allergies ?? [],
    maladies_chroniques: patient?.maladies_chroniques ?? [],
    traitements_en_cours: patient?.traitements_en_cours ?? [],
    chronique_diabete: patient?.chronique_diabete ?? false,
    chronique_hta: patient?.chronique_hta ?? false,
    notes: patient?.notes ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof f, string>>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!f.nom.trim()) errs.nom = t("err_last_name_required");
    if (!f.prenom.trim()) errs.prenom = t("err_first_name_required");
    if (!f.date_naissance) errs.date_naissance = t("err_birth_date_required");
    if (!f.telephone.trim()) errs.telephone = t("err_phone_required");
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const chronique_diabete = f.maladies_chroniques.some((m) => m.startsWith("Diabète")) || !!f.chronique_diabete;
    const chronique_hta = f.maladies_chroniques.includes("HTA") || !!f.chronique_hta;

    const patch = { ...f, chronique_diabete, chronique_hta };
    if (patient) {
      updatePatient(patient.id, patch);
      pushToast({ title: t("patient_updated"), tone: "success" });
      onDone?.({ ...patient, ...patch });
      router.push(`/patients/${patient.id}`);
    } else {
      const created = addPatient(patch);
      pushToast({ title: t("patient_created"), description: `${created.prenom} ${created.nom}`, tone: "success" });
      onDone?.(created);
      router.push(`/patients/${created.id}`);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Card padding="md">
        <div className="text-[15px] font-semibold text-ink-900 mb-3">{t("identity")}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("last_name")} required error={errors.nom}>
            <Input value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} invalid={!!errors.nom} />
          </Field>
          <Field label={t("first_name")} required error={errors.prenom}>
            <Input value={f.prenom} onChange={(e) => setF({ ...f, prenom: e.target.value })} invalid={!!errors.prenom} />
          </Field>
          <Field label={t("patient_sex")} required>
            <Select value={f.sexe} onChange={(v) => setF({ ...f, sexe: v })} options={SEXE_OPTS} />
          </Field>
          <Field label={t("birth_date")} required error={errors.date_naissance}>
            <DatePicker value={f.date_naissance} onChange={(d) => setF({ ...f, date_naissance: d })} />
          </Field>
          <Field label={t("blood_group")}>
            <Select
              value={f.groupe_sanguin}
              onChange={(v) => setF({ ...f, groupe_sanguin: v as GroupeSanguin })}
              options={GROUPES.map((g) => ({ value: g, label: g }))}
              placeholder={t("not_specified")}
            />
          </Field>
          <Field label={t("phone")} required error={errors.telephone}>
            <Input value={f.telephone} onChange={(e) => setF({ ...f, telephone: e.target.value })} placeholder="0555 12 34 56" invalid={!!errors.telephone} inputMode="tel" />
          </Field>
          <Field label={t("email")} className="sm:col-span-2">
            <Input value={f.email ?? ""} onChange={(e) => setF({ ...f, email: e.target.value })} type="email" placeholder="patient@exemple.dz" />
          </Field>
        </div>
      </Card>

      <Card padding="md">
        <div className="text-[15px] font-semibold text-ink-900 mb-3">{t("address")}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("wilaya")}>
            <Select
              value={f.wilaya}
              onChange={(v) => setF({ ...f, wilaya: v })}
              options={WILAYAS.map((w) => ({ value: w, label: w }))}
            />
          </Field>
          <Field label={t("commune")}>
            <Input value={f.commune} onChange={(e) => setF({ ...f, commune: e.target.value })} />
          </Field>
          <Field label={t("address")} className="sm:col-span-2">
            <Input value={f.adresse} onChange={(e) => setF({ ...f, adresse: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card padding="md">
        <div className="text-[15px] font-semibold text-ink-900 mb-3">{t("social_security")}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("social_security_number")}>
            <Input value={f.numero_securite_sociale ?? ""} onChange={(e) => setF({ ...f, numero_securite_sociale: e.target.value })} inputMode="numeric" />
          </Field>
          <Field label={t("chifa_card_number")}>
            <Input value={f.numero_chifa ?? ""} onChange={(e) => setF({ ...f, numero_chifa: e.target.value })} />
          </Field>
          <Field label={t("insurance_type")} className="sm:col-span-2">
            <Select value={f.type_assurance} onChange={(v) => setF({ ...f, type_assurance: v })} options={ASSURANCE_OPTS} />
          </Field>
        </div>
      </Card>

      <Card padding="md">
        <div className="text-[15px] font-semibold text-ink-900 mb-3">{t("medical_history")}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("antecedents")}>
            <TagList values={f.antecedents} onChange={(v) => setF({ ...f, antecedents: v })} placeholder={t("enter_to_add")} removeLabel={t("remove")} />
          </Field>
          <Field label={t("allergies")}>
            <TagList values={f.allergies} onChange={(v) => setF({ ...f, allergies: v })} placeholder={t("allergies_placeholder")} removeLabel={t("remove")} />
          </Field>
          <Field label={t("current_treatments")} className="sm:col-span-2">
            <TagList values={f.traitements_en_cours} onChange={(v) => setF({ ...f, traitements_en_cours: v })} placeholder={t("treatments_placeholder")} removeLabel={t("remove")} />
          </Field>
          <Field label={t("chronic_diseases")} className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">
              {CHRONIQUES.map((c) => {
                const active = f.maladies_chroniques.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setF({
                      ...f,
                      maladies_chroniques: active
                        ? f.maladies_chroniques.filter((x) => x !== c)
                        : [...f.maladies_chroniques, c],
                    })}
                    className={
                      "h-9 px-3 rounded-full text-[13px] font-medium border cursor-pointer transition " +
                      (active
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-white text-ink-700 border-line hover:bg-ink-50")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label={t("notes")} className="sm:col-span-2">
            <Textarea value={f.notes ?? ""} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} placeholder={t("notes_placeholder")} />
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3">
        <Button variant="ghost" type="button" onClick={() => router.back()}>{t("cancel")}</Button>
        <Button type="submit" variant="primary" leftIcon={patient ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}>
          {patient ? t("save_changes") : t("create_patient")}
        </Button>
      </div>
    </form>
  );
}
