"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Save, X, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Card, Badge } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function NouvelleConsultationPage() {
  return (
    <Suspense fallback={null}>
      <NouvelleConsultationPageInner />
    </Suspense>
  );
}

function NouvelleConsultationPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useT();
  const patientPrefill = params.get("patient") ?? "";
  const rdvPrefill = params.get("rdv") ?? undefined;
  const {
    patients, utilisateurs, cim10, addConsultation, updateRdv, pushToast,
  } = useApp();

  const [f, setF] = useState({
    patient_id: patientPrefill || patients[0]?.id || "",
    medecin_id: utilisateurs.find((u) => u.role === "MEDECIN")?.id ?? "",
    motif: "",
    symptomes: "",
    examen_clinique: "",
    diagnostic: "",
    notes: "",
  });
  const [codes, setCodes] = useState<string[]>([]);
  const [cimQ, setCimQ] = useState("");
  const [vitals, setVitals] = useState({
    tension_systolique: "" as any as number | "",
    tension_diastolique: "" as any as number | "",
    temperature: "" as any as number | "",
    poids_kg: "" as any as number | "",
    taille_cm: "" as any as number | "",
    frequence_cardiaque: "" as any as number | "",
    glycemie: "" as any as number | "",
    saturation: "" as any as number | "",
  });

  const patient = patients.find((p) => p.id === f.patient_id);

  const cimSuggestions = useMemo(() => {
    if (!cimQ.trim()) return cim10.slice(0, 6);
    const s = cimQ.toLowerCase();
    return cim10.filter((c) => c.code.toLowerCase().includes(s) || c.libelle.toLowerCase().includes(s)).slice(0, 8);
  }, [cimQ, cim10]);

  const imc = vitals.poids_kg && vitals.taille_cm
    ? (Number(vitals.poids_kg) / Math.pow(Number(vitals.taille_cm) / 100, 2))
    : null;

  function submit() {
    if (!f.patient_id || !f.medecin_id || !f.motif.trim() || !f.diagnostic.trim()) {
      pushToast({ title: t("required_fields_missing"), description: t("required_fields_cons_desc"), tone: "warning" });
      return;
    }
    const created = addConsultation({
      ...f,
      date: new Date().toISOString().slice(0, 16),
      codes_cim10: codes,
      rdv_id: rdvPrefill,
      signes_vitaux: {
        tension_systolique: vitals.tension_systolique ? Number(vitals.tension_systolique) : undefined,
        tension_diastolique: vitals.tension_diastolique ? Number(vitals.tension_diastolique) : undefined,
        temperature: vitals.temperature ? Number(vitals.temperature) : undefined,
        poids_kg: vitals.poids_kg ? Number(vitals.poids_kg) : undefined,
        taille_cm: vitals.taille_cm ? Number(vitals.taille_cm) : undefined,
        frequence_cardiaque: vitals.frequence_cardiaque ? Number(vitals.frequence_cardiaque) : undefined,
        glycemie: vitals.glycemie ? Number(vitals.glycemie) : undefined,
        saturation: vitals.saturation ? Number(vitals.saturation) : undefined,
      },
    });
    if (rdvPrefill) updateRdv(rdvPrefill, { statut: "TERMINE" });
    pushToast({ title: t("consultation_saved"), tone: "success" });
    router.push(`/consultations/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <Link href={patientPrefill ? `/patients/${patientPrefill}` : "/consultations"} className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="dir-icon h-4 w-4" /> {patientPrefill ? t("patient_detail") : t("consultations_title")}
      </Link>
      <SectionHeader title={t("new_consultation_btn")} description={patient ? `${t("for_patient")} ${patient.prenom} ${patient.nom}` : undefined} />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padding="md" className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={t("patient")} required>
              <Select
                value={f.patient_id}
                onChange={(v) => setF({ ...f, patient_id: v })}
                options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
              />
            </Field>
            <Field label={t("doctor")} required>
              <Select
                value={f.medecin_id}
                onChange={(v) => setF({ ...f, medecin_id: v })}
                options={utilisateurs.filter((u) => u.role === "MEDECIN").map((u) => ({ value: u.id, label: `Dr. ${u.prenom} ${u.nom}` }))}
              />
            </Field>
            <Field label={t("cons_motif")} required className="sm:col-span-2">
              <Input value={f.motif} onChange={(e) => setF({ ...f, motif: e.target.value })} placeholder={t("cons_motif_placeholder")} />
            </Field>
            <Field label={t("symptomes")} className="sm:col-span-2">
              <Textarea value={f.symptomes} onChange={(e) => setF({ ...f, symptomes: e.target.value })} rows={3} placeholder={t("symptomes_placeholder")} />
            </Field>
            <Field label={t("cons_examen")} className="sm:col-span-2">
              <Textarea value={f.examen_clinique} onChange={(e) => setF({ ...f, examen_clinique: e.target.value })} rows={3} placeholder={t("cons_examen_placeholder")} />
            </Field>
            <Field label={t("cons_diagnostic")} required className="sm:col-span-2">
              <Textarea value={f.diagnostic} onChange={(e) => setF({ ...f, diagnostic: e.target.value })} rows={2} placeholder={t("cons_diagnostic_placeholder")} />
            </Field>
            <Field label={t("notes")} className="sm:col-span-2">
              <Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} placeholder={t("cons_notes_placeholder")} />
            </Field>
          </div>

          <div>
            <div className="text-[13px] font-semibold text-ink-800 mb-2">{t("cim10_codes")}</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {codes.map((c) => {
                const info = cim10.find((x) => x.code === c);
                return (
                  <Badge key={c} tone="brand" size="sm">
                    <span className="tabular">{c}</span>
                    <button
                      type="button"
                      onClick={() => setCodes(codes.filter((x) => x !== c))}
                      className="ms-1 hover:bg-brand-100 rounded-full h-4 w-4 grid place-items-center cursor-pointer"
                      aria-label={`${t("remove")} ${c}`}
                    ><X className="h-3 w-3" /></button>
                    <span className="ms-1 truncate max-w-[220px]">{info?.libelle}</span>
                  </Badge>
                );
              })}
            </div>
            <Input
              value={cimQ}
              onChange={(e) => setCimQ(e.target.value)}
              placeholder={t("search_cim10_placeholder")}
            />
            <div className="mt-2 grid sm:grid-cols-2 gap-1.5">
              {cimSuggestions.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { if (!codes.includes(c.code)) setCodes([...codes, c.code]); }}
                  className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-left hover:bg-ink-50 cursor-pointer min-w-0"
                >
                  <Badge tone="brand" size="sm"><span className="tabular">{c.code}</span></Badge>
                  <span className="text-[12px] text-ink-700 truncate min-w-0">{c.libelle}</span>
                  <Plus className="h-3.5 w-3.5 text-brand-500 ms-auto shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="md" className="space-y-3">
          <div className="text-[13px] font-semibold text-ink-800">{t("vital_signs")}</div>

          <div className="grid grid-cols-2 gap-2">
            <Field label={t("ta_sys_label")}>
              <Input inputMode="numeric" value={String(vitals.tension_systolique)} onChange={(e) => setVitals({ ...vitals, tension_systolique: e.target.value as any })} />
            </Field>
            <Field label={t("ta_dia_label")}>
              <Input inputMode="numeric" value={String(vitals.tension_diastolique)} onChange={(e) => setVitals({ ...vitals, tension_diastolique: e.target.value as any })} />
            </Field>
            <Field label={t("temp_label")}>
              <Input inputMode="decimal" value={String(vitals.temperature)} onChange={(e) => setVitals({ ...vitals, temperature: e.target.value as any })} />
            </Field>
            <Field label={t("fc_label")}>
              <Input inputMode="numeric" value={String(vitals.frequence_cardiaque)} onChange={(e) => setVitals({ ...vitals, frequence_cardiaque: e.target.value as any })} />
            </Field>
            <Field label={t("weight_label")}>
              <Input inputMode="decimal" value={String(vitals.poids_kg)} onChange={(e) => setVitals({ ...vitals, poids_kg: e.target.value as any })} />
            </Field>
            <Field label={t("height_label")}>
              <Input inputMode="numeric" value={String(vitals.taille_cm)} onChange={(e) => setVitals({ ...vitals, taille_cm: e.target.value as any })} />
            </Field>
            <Field label={t("glycemie_label")}>
              <Input inputMode="decimal" value={String(vitals.glycemie)} onChange={(e) => setVitals({ ...vitals, glycemie: e.target.value as any })} />
            </Field>
            <Field label={t("spo2_label")}>
              <Input inputMode="numeric" value={String(vitals.saturation)} onChange={(e) => setVitals({ ...vitals, saturation: e.target.value as any })} />
            </Field>
          </div>
          {imc !== null && !isNaN(imc) && (
            <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-[11px] text-brand-700 font-semibold uppercase tracking-wide">{t("imc_calculated")}</div>
                <div className="text-[20px] font-semibold text-brand-800 tabular">{imc.toFixed(1)}</div>
              </div>
              <Badge tone={imc < 18.5 ? "info" : imc < 25 ? "success" : imc < 30 ? "warning" : "danger"}>
                {imc < 18.5 ? t("imc_underweight") : imc < 25 ? t("imc_normal") : imc < 30 ? t("imc_overweight") : t("imc_obese")}
              </Badge>
            </div>
          )}

          {patient && (patient.allergies.length > 0 || patient.maladies_chroniques.length > 0) && (
            <div className="rounded-xl border border-line p-3 space-y-2">
              <div className="text-[11px] uppercase text-ink-500 font-semibold tracking-wide">{t("patient_alerts")}</div>
              {patient.allergies.length > 0 && (
                <div>
                  <div className="text-[12px] text-ink-700 font-medium">{t("allergies")}:</div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {patient.allergies.map((a) => <Badge key={a} tone="danger" size="sm">{a}</Badge>)}
                  </div>
                </div>
              )}
              {patient.maladies_chroniques.length > 0 && (
                <div>
                  <div className="text-[12px] text-ink-700 font-medium">{t("chronic")}:</div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {patient.maladies_chroniques.map((m) => <Badge key={m} tone="warning" size="sm">{m}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>{t("cancel")}</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={submit}>{t("save_consultation")}</Button>
      </div>
    </div>
  );
}
