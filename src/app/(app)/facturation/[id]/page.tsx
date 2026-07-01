"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Printer, ReceiptText, Wallet } from "lucide-react";
import { useApp, formatDA, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { MethodePaiement, StatutFacture } from "@/lib/types";

function statutTone(s: StatutFacture) {
  return s === "PAYE" ? "success" : s === "PARTIEL" ? "warning" : s === "IMPAYE" ? "danger" : "neutral";
}
function statutLabel(s: StatutFacture) {
  return s === "PAYE" ? "Payé" : s === "PARTIEL" ? "Partiel" : s === "IMPAYE" ? "Impayé" : "Annulé";
}

export default function FactureDetailPage() {
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

  if (!f) {
    return (
      <Card padding="md">
        <EmptyState icon={<ReceiptText className="h-6 w-6" />} title="Facture introuvable" action={<Link href="/facturation"><Button variant="primary">Retour</Button></Link>} />
      </Card>
    );
  }
  const p = patients.find((x) => x.id === f.patient_id);
  const m = utilisateurs.find((x) => x.id === f.medecin_id);
  const reste = f.total_da - f.paye_da;
  const facturePaiements = paiements.filter((x) => x.facture_id === f.id);

  function pay() {
    const amt = Number(amount || 0);
    if (!amt || amt <= 0) { pushToast({ title: "Montant invalide", tone: "warning" }); return; }
    if (amt > reste) { pushToast({ title: "Montant supérieur au reste dû", tone: "warning" }); return; }
    addPaiement({
      facture_id: f.id, patient_id: f.patient_id, date: new Date().toISOString().slice(0, 10),
      montant_da: amt, methode, reference: reference || undefined,
    });
    pushToast({ title: "Paiement enregistré", tone: "success" });
    setOpenPay(false); setAmount(""); setReference("");
  }

  return (
    <div className="space-y-4">
      <Link href="/facturation" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Facturation
      </Link>
      <SectionHeader
        className="no-print"
        title={`Facture ${f.numero}`}
        description={p ? `${p.prenom} ${p.nom} • ${formatDate(f.date)}` : formatDate(f.date)}
        actions={
          <>
            {reste > 0 && f.statut !== "ANNULE" && (
              <Button variant="primary" leftIcon={<Wallet className="h-4 w-4" />} onClick={() => { setAmount(String(reste)); setOpenPay(true); }}>
                Encaisser
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Imprimer</Button>
            {f.statut !== "ANNULE" && (
              <Button
                variant="ghost"
                onClick={() => { updateFacture(f.id, { statut: "ANNULE" }); pushToast({ title: "Facture annulée", tone: "danger" }); }}
              >Annuler la facture</Button>
            )}
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padding="lg" className="lg:col-span-2 print-page">
          <div className="flex items-start justify-between pb-3 border-b border-line">
            <div>
              <div className="text-[18px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
              <div className="text-[12px] text-ink-500">{clinique.adresse}</div>
              <div className="text-[12px] text-ink-500">NIF: {clinique.nif} • RC: {clinique.rc}</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-ink-500">Facture</div>
              <div className="text-[16px] font-semibold text-ink-900 tabular">{f.numero}</div>
              <div className="text-[12px] text-ink-500">{formatDate(f.date)}</div>
            </div>
          </div>

          {p && (
            <div className="pt-4 pb-3 grid sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <div className="text-ink-500">Facturé à</div>
                <div className="font-semibold">{p.prenom} {p.nom}</div>
                <div className="text-ink-600">{p.adresse}, {p.commune}, {p.wilaya}</div>
                <div className="text-ink-600">{p.telephone}</div>
              </div>
              <div className="sm:text-right">
                <div className="text-ink-500">Prescripteur</div>
                <div className="font-semibold">{m ? `Dr. ${m.prenom} ${m.nom}` : "—"}</div>
                <div className="text-ink-600">{m?.specialite}</div>
              </div>
            </div>
          )}

          <table className="w-full text-[13px] mt-3">
            <thead className="bg-ink-50 text-ink-500 text-[11px] uppercase tracking-wide">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Code</th>
                <th className="text-left px-3 py-2 font-medium">Libellé</th>
                <th className="text-right px-3 py-2 font-medium">Qté</th>
                <th className="text-right px-3 py-2 font-medium">P.U.</th>
                <th className="text-right px-3 py-2 font-medium">Total</th>
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
            <RowKV label="Sous-total" value={formatDA(f.total_da)} />
            <RowKV label="Part assurance" value={formatDA(f.part_assurance_da)} />
            <RowKV label="Part patient" value={formatDA(f.part_patient_da)} />
            <div className="w-full sm:w-64 h-px bg-line my-2" />
            <RowKV label="Total" value={formatDA(f.total_da)} bold />
            <RowKV label="Payé" value={formatDA(f.paye_da)} class="text-emerald-700" />
            <RowKV label="Reste dû" value={formatDA(reste)} class="text-danger" bold />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Badge tone={statutTone(f.statut)}>{statutLabel(f.statut)}</Badge>
            <div className="text-[11px] text-ink-500">Merci pour votre confiance.</div>
          </div>
        </Card>

        <Card padding="md" className="space-y-3 no-print">
          <div className="text-[13px] font-semibold text-ink-800">Historique des paiements</div>
          {facturePaiements.length === 0 ? (
            <div className="text-[13px] text-ink-500">Aucun paiement enregistré.</div>
          ) : (
            <div className="divide-y divide-line">
              {facturePaiements.map((pay) => (
                <div key={pay.id} className="py-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-900 tabular">{formatDA(pay.montant_da)}</div>
                    <div className="text-[11px] text-ink-500">{formatDate(pay.date)} • {pay.methode}{pay.reference ? " • " + pay.reference : ""}</div>
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
        title="Encaisser un paiement"
        description={`Reste dû: ${formatDA(reste)}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenPay(false)}>Annuler</Button>
            <Button variant="primary" onClick={pay}>Enregistrer le paiement</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Montant (DA)" required>
            <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Méthode">
            <Select
              value={methode}
              onChange={(v) => setMethode(v as MethodePaiement)}
              options={[
                { value: "ESPECES", label: "Espèces" },
                { value: "CHEQUE", label: "Chèque" },
                { value: "CARTE", label: "Carte bancaire" },
                { value: "VIREMENT", label: "Virement" },
              ]}
            />
          </Field>
          <Field label="Référence (optionnel)">
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="N° chèque, référence…" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}

function RowKV({ label, value, bold, class: cls }: { label: string; value: string; bold?: boolean; class?: string }) {
  return (
    <div className="w-full sm:w-64 flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={"tabular " + (bold ? "font-semibold text-ink-900 " : "") + (cls ?? "")}>{value}</span>
    </div>
  );
}
