"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Save, X, Plus, Search } from "lucide-react";
import { useApp, formatDA } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Card, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import type { LigneFacture } from "@/lib/types";

export default function NouvelleFacturePage() {
  return (
    <Suspense fallback={null}>
      <NouvelleFacturePageInner />
    </Suspense>
  );
}

function NouvelleFacturePageInner() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const {
    patients, utilisateurs, actesNomenclature, addFacture, pushToast,
  } = useApp();

  const [patientId, setPatientId] = useState(params.get("patient") ?? patients[0]?.id ?? "");
  const [medecinId, setMedecinId] = useState(utilisateurs.find((u) => u.role === "MEDECIN")?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lignes, setLignes] = useState<LigneFacture[]>([]);
  const [partAssurance, setPartAssurance] = useState<number>(0);
  const [q, setQ] = useState("");

  const total = lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire_da, 0);
  const partPatient = Math.max(0, total - partAssurance);

  const suggestions = useMemo(() => {
    if (!q.trim()) return actesNomenclature.slice(0, 6);
    const s = q.toLowerCase();
    return actesNomenclature.filter((a) => `${a.code} ${a.libelle}`.toLowerCase().includes(s)).slice(0, 8);
  }, [q, actesNomenclature]);

  function addActe(code: string) {
    const a = actesNomenclature.find((x) => x.code === code);
    if (!a) return;
    setLignes([...lignes, { code_acte: a.code, libelle: a.libelle, quantite: 1, prix_unitaire_da: a.prix_da }]);
    setQ("");
  }
  function updLine(i: number, patch: Partial<LigneFacture>) {
    setLignes(lignes.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function submit() {
    if (!patientId || lignes.length === 0) {
      pushToast({ title: t("invoice_incomplete"), description: t("add_at_least_one_line"), tone: "warning" });
      return;
    }
    const created = addFacture({
      patient_id: patientId,
      medecin_id: medecinId,
      consultation_id: params.get("consultation") ?? undefined,
      date,
      lignes,
      total_da: total,
      part_patient_da: partPatient,
      part_assurance_da: partAssurance,
      paye_da: 0,
      statut: "IMPAYE",
    });
    pushToast({ title: t("invoice_created"), description: created.numero, tone: "success" });
    router.push(`/facturation/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <Link href="/facturation" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer min-w-0">
        <ChevronLeft className="h-4 w-4 dir-icon shrink-0" /> {t("facturation_title")}
      </Link>
      <SectionHeader title={t("new_facture")} />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label={t("patient")} required>
                <Select value={patientId} onChange={setPatientId} options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))} />
              </Field>
              <Field label={t("doctor")}>
                <Select value={medecinId} onChange={setMedecinId} options={utilisateurs.filter((u) => u.role === "MEDECIN").map((u) => ({ value: u.id, label: `Dr. ${u.prenom} ${u.nom}` }))} />
              </Field>
              <Field label={t("date")}>
                <DatePicker value={date} onChange={setDate} />
              </Field>
              <Field label={`${t("insurance_share")} (DA)`}>
                <Input inputMode="numeric" value={String(partAssurance)} onChange={(e) => setPartAssurance(Number(e.target.value || 0))} />
              </Field>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="text-[13px] font-semibold text-ink-800 min-w-0">{t("actes_lines")}</div>
              <div className="text-[12px] text-ink-500 shrink-0">{lignes.length} {lignes.length > 1 ? t("lines") : t("line")}</div>
            </div>
            {lignes.length === 0 ? (
              <EmptyState icon={<Search className="h-6 w-6" />} title={t("no_line")} description={t("add_acte_from_nomenclature")} />
            ) : (
              <div className="space-y-2">
                {lignes.map((l, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_120px_36px] gap-2 items-center rounded-xl border border-line p-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate">{l.libelle}</div>
                      <div className="text-[11px] text-ink-500 tabular">{l.code_acte}</div>
                    </div>
                    <Input inputMode="numeric" value={String(l.quantite)} onChange={(e) => updLine(i, { quantite: Number(e.target.value || 1) })} />
                    <Input inputMode="numeric" value={String(l.prix_unitaire_da)} onChange={(e) => updLine(i, { prix_unitaire_da: Number(e.target.value || 0) })} />
                    <button
                      aria-label={t("remove")}
                      onClick={() => setLignes(lignes.filter((_, idx) => idx !== i))}
                      className="h-9 w-9 grid place-items-center rounded-full hover:bg-red-50 text-danger cursor-pointer shrink-0"
                    ><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search_acte")} leftIcon={<Search className="h-4 w-4" />} />
              <div className="mt-2 grid sm:grid-cols-2 gap-1.5">
                {suggestions.map((a) => (
                  <button
                    type="button"
                    key={a.code}
                    onClick={() => addActe(a.code)}
                    className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-left hover:bg-brand-50 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate">{a.libelle}</div>
                      <div className="text-[11px] text-ink-500">{a.code} • {a.categorie}</div>
                    </div>
                    <div className="text-[12px] font-semibold text-brand-700 tabular whitespace-nowrap shrink-0">{formatDA(a.prix_da)}</div>
                    <Plus className="h-4 w-4 text-brand-500 ms-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card padding="md" className="space-y-3">
          <div className="text-[13px] font-semibold text-ink-800">{t("totals")}</div>
          <Row label={t("subtotal")} value={formatDA(total)} />
          <Row label={t("insurance_share")} value={formatDA(partAssurance)} />
          <Row label={t("patient_share")} value={formatDA(partPatient)} bold />
          <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 mt-2 flex items-center justify-between gap-2">
            <div className="text-[12px] text-brand-700 uppercase font-semibold tracking-wide min-w-0">{t("total")}</div>
            <div className="text-[20px] font-semibold text-brand-800 tabular shrink-0">{formatDA(total)}</div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>{t("cancel")}</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={submit}>{t("issue_invoice")}</Button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[13px] text-ink-500 min-w-0">{label}</span>
      <span className={"text-[13px] tabular shrink-0 " + (bold ? "font-semibold text-ink-900" : "text-ink-800")}>{value}</span>
    </div>
  );
}
