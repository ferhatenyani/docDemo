"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Printer, ReceiptText, Wallet } from "lucide-react";
import { useApp, formatDA, formatDate } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { MethodePaiement, StatutFacture } from "@/lib/types";

function statutTone(s: StatutFacture) {
  return s === "PAYE" ? "success" : s === "PARTIEL" ? "warning" : s === "IMPAYE" ? "danger" : "neutral";
}

export default function FactureDetailPage() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const {
    factures, patients, utilisateurs, clinique, paiements,
    addPaiement, updateFacture, pushToast,
  } = useApp();
  const f = factures.find((x) => x.id === id);
  const [openPay, setOpenPay] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [methode, setMethode] = useState<MethodePaiement>("ESPECES");
  const [reference, setReference] = useState("");

  function statutLabel(s: StatutFacture) {
    return s === "PAYE" ? t("status_paid") : s === "PARTIEL" ? t("status_partial") : s === "IMPAYE" ? t("status_unpaid") : t("status_cancelled");
  }

  function methodeLabel(m: MethodePaiement | string) {
    return m === "ESPECES" ? t("pm_cash") : m === "CHEQUE" ? t("pm_check") : m === "CARTE" ? t("pm_card") : m === "VIREMENT" ? t("pm_transfer") : t("pm_other");
  }

  if (!f) {
    return (
      <Card padding="md">
        <EmptyState icon={<ReceiptText className="h-6 w-6" />} title={t("invoice_not_found")} action={<Link href="/facturation"><Button variant="primary">{t("back")}</Button></Link>} />
      </Card>
    );
  }
  const p = patients.find((x) => x.id === f.patient_id);
  const m = utilisateurs.find((x) => x.id === f.medecin_id);
  const reste = f.total_da - f.paye_da;
  const facturePaiements = paiements.filter((x) => x.facture_id === f.id);

  function pay() {
    if (!f) return;
    const amt = Number(amount || 0);
    if (!amt || amt <= 0) { pushToast({ title: t("invalid_amount"), tone: "warning" }); return; }
    if (amt > reste) { pushToast({ title: t("amount_exceeds_remaining"), tone: "warning" }); return; }
    addPaiement({
      facture_id: f.id, patient_id: f.patient_id, date: new Date().toISOString().slice(0, 10),
      montant_da: amt, methode, reference: reference || undefined,
    });
    pushToast({ title: t("payment_saved"), tone: "success" });
    setOpenPay(false); setAmount(""); setReference("");
  }

  return (
    <div className="space-y-4">
      <Link href="/facturation" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer min-w-0">
        <ChevronLeft className="h-4 w-4 dir-icon shrink-0" /> {t("facturation_title")}
      </Link>
      <SectionHeader
        className="no-print"
        title={`${t("facture")} ${f.numero}`}
        description={p ? `${p.prenom} ${p.nom} • ${formatDate(f.date, t.locale)}` : formatDate(f.date, t.locale)}
        actions={
          <>
            {reste > 0 && f.statut !== "ANNULE" && (
              <Button variant="primary" leftIcon={<Wallet className="h-4 w-4" />} onClick={() => { setAmount(String(reste)); setOpenPay(true); }}>
                {t("collect_payment")}
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>{t("print")}</Button>
            {f.statut !== "ANNULE" && (
              <Button
                variant="ghost"
                onClick={() => { updateFacture(f.id, { statut: "ANNULE" }); pushToast({ title: t("invoice_cancelled"), tone: "danger" }); }}
              >{t("cancel_invoice")}</Button>
            )}
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padding="lg" className="lg:col-span-2 print-page">
          <div className="flex items-start justify-between pb-3 border-b border-line gap-2">
            <div className="min-w-0">
              <div className="text-[18px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
              <div className="text-[12px] text-ink-500">{clinique.adresse}</div>
              <div className="text-[12px] text-ink-500">{t("nif")}: {clinique.nif} • {t("rc")}: {clinique.rc}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[12px] text-ink-500">{t("facture")}</div>
              <div className="text-[16px] font-semibold text-ink-900 tabular">{f.numero}</div>
              <div className="text-[12px] text-ink-500">{formatDate(f.date, t.locale)}</div>
            </div>
          </div>

          {p && (
            <div className="pt-4 pb-3 grid sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <div className="text-ink-500">{t("billed_to")}</div>
                <div className="font-semibold">{p.prenom} {p.nom}</div>
                <div className="text-ink-600">{p.adresse}, {p.commune}, {p.wilaya}</div>
                <div className="text-ink-600">{p.telephone}</div>
              </div>
              <div className="sm:text-right">
                <div className="text-ink-500">{t("prescriber")}</div>
                <div className="font-semibold">{m ? `Dr. ${m.prenom} ${m.nom}` : "—"}</div>
                <div className="text-ink-600">{m?.specialite}</div>
              </div>
            </div>
          )}

          <table className="w-full text-[13px] mt-3">
            <thead className="bg-ink-50 text-ink-500 text-[11px] uppercase tracking-wide">
              <tr>
                <th className="text-left px-3 py-2 font-medium">{t("acte_code")}</th>
                <th className="text-left px-3 py-2 font-medium">{t("acte_libelle")}</th>
                <th className="text-right px-3 py-2 font-medium">{t("qty_short")}</th>
                <th className="text-right px-3 py-2 font-medium">{t("unit_price_short")}</th>
                <th className="text-right px-3 py-2 font-medium">{t("total")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {f.lignes.map((l, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 tabular">{l.code_acte}</td>
                  <td className="px-3 py-2">{l.libelle}</td>
                  <td className="px-3 py-2 text-right tabular">{l.quantite}</td>
                  <td className="px-3 py-2 text-right tabular">{formatDA(l.prix_unitaire_da)}</td>
                  <td className="px-3 py-2 text-right tabular font-medium">{formatDA(l.quantite * l.prix_unitaire_da)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col items-end gap-1 text-[13px]">
            <RowKV label={t("subtotal")} value={formatDA(f.total_da)} />
            <RowKV label={t("insurance_share")} value={formatDA(f.part_assurance_da)} />
            <RowKV label={t("patient_share")} value={formatDA(f.part_patient_da)} />
            <div className="w-full sm:w-64 h-px bg-line my-2" />
            <RowKV label={t("total")} value={formatDA(f.total_da)} bold />
            <RowKV label={t("paid")} value={formatDA(f.paye_da)} class="text-emerald-700" />
            <RowKV label={t("remaining_due")} value={formatDA(reste)} class="text-danger" bold />
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            <Badge tone={statutTone(f.statut)}>{statutLabel(f.statut)}</Badge>
            <div className="text-[11px] text-ink-500 shrink-0">{t("thank_you_note")}</div>
          </div>
        </Card>

        <Card padding="md" className="space-y-3 no-print">
          <div className="text-[13px] font-semibold text-ink-800">{t("payment_history")}</div>
          {facturePaiements.length === 0 ? (
            <div className="text-[13px] text-ink-500">{t("no_payment_recorded")}</div>
          ) : (
            <div className="divide-y divide-line">
              {facturePaiements.map((pay) => (
                <div key={pay.id} className="py-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-900 tabular">{formatDA(pay.montant_da)}</div>
                    <div className="text-[11px] text-ink-500">{formatDate(pay.date, t.locale)} • {methodeLabel(pay.methode)}{pay.reference ? " • " + pay.reference : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={openPay}
        onClose={() => setOpenPay(false)}
        title={t("collect_payment")}
        description={`${t("remaining_due")}: ${formatDA(reste)}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenPay(false)}>{t("cancel")}</Button>
            <Button variant="primary" onClick={pay}>{t("save_payment")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label={`${t("amount")} (DA)`} required>
            <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label={t("payment_method")}>
            <Select
              value={methode}
              onChange={(v) => setMethode(v as MethodePaiement)}
              options={[
                { value: "ESPECES", label: t("pm_cash") },
                { value: "CHEQUE", label: t("pm_check") },
                { value: "CARTE", label: t("pm_card") },
                { value: "VIREMENT", label: t("pm_transfer") },
              ]}
            />
          </Field>
          <Field label={`${t("reference")} (${t("optional")})`}>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder={t("reference_placeholder")} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}

function RowKV({ label, value, bold, class: cls }: { label: string; value: string; bold?: boolean; class?: string }) {
  return (
    <div className="w-full sm:w-64 flex items-center justify-between gap-2">
      <span className="text-ink-500 min-w-0">{label}</span>
      <span className={"tabular shrink-0 " + (bold ? "font-semibold text-ink-900 " : "") + (cls ?? "")}>{value}</span>
    </div>
  );
}
