"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Wallet, Banknote, CreditCard, Coins, Landmark } from "lucide-react";
import { useApp, formatDA, formatDate } from "@/lib/store";
import { SectionHeader, Badge, Chip, EmptyState, StatCard } from "@/components/ui/misc";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";

function iso(d = new Date()) { return d.toISOString().slice(0, 10); }

export default function CaissePage() {
  const { paiements, factures, patients } = useApp();
  const [date, setDate] = useState<string>(iso());
  const [methode, setMethode] = useState<string>("Toutes");

  const day = useMemo(() => paiements.filter((p) => p.date === date), [paiements, date]);
  const filtered = methode === "Toutes" ? day : day.filter((p) => p.methode === methode);

  const total = filtered.reduce((s, p) => s + p.montant_da, 0);
  const totalByMethode: Record<string, number> = {};
  day.forEach((p) => { totalByMethode[p.methode] = (totalByMethode[p.methode] ?? 0) + p.montant_da; });

  const impayees = factures.filter((f) => f.statut === "IMPAYE" || f.statut === "PARTIEL");
  const totalImpaye = impayees.reduce((s, f) => s + (f.total_da - f.paye_da), 0);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Finance"
        title="Caisse"
        description="Encaissements et suivi de la caisse du jour."
        actions={<div className="w-56"><DatePicker value={date} onChange={setDate} /></div>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total encaissé" value={formatDA(day.reduce((s, p) => s + p.montant_da, 0))} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Espèces" value={formatDA(totalByMethode.ESPECES ?? 0)} icon={<Banknote className="h-4 w-4" />} />
        <StatCard label="Carte" value={formatDA(totalByMethode.CARTE ?? 0)} icon={<CreditCard className="h-4 w-4" />} />
        <StatCard label="Chèque / Virement" value={formatDA((totalByMethode.CHEQUE ?? 0) + (totalByMethode.VIREMENT ?? 0))} icon={<Coins className="h-4 w-4" />} />
      </div>

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="px-4 py-3 border-b border-line flex items-center justify-between flex-wrap gap-2">
          <div className="text-[14px] font-semibold text-ink-900 tracking-crisp">Paiements du {formatDate(date)}</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Toutes", "ESPECES", "CHEQUE", "CARTE", "VIREMENT"].map((m) => (
              <Chip key={m} active={methode === m} onClick={() => setMethode(m)}>
                {m === "Toutes" ? m : m === "ESPECES" ? "Espèces" : m === "CHEQUE" ? "Chèque" : m === "CARTE" ? "Carte" : "Virement"}
              </Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Wallet className="h-5 w-5" />} title="Aucun paiement" description="Aucun paiement pour la sélection." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-muted border-b border-line eyebrow">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Facture</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Patient</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Méthode</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Référence</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => {
                  const f = factures.find((x) => x.id === p.facture_id);
                  const pat = patients.find((x) => x.id === p.patient_id);
                  return (
                    <tr key={p.id} className="hover:bg-ink-50/60 transition-colors">
                      <td className="px-4 py-2.5 tabular font-medium">
                        {f ? <Link href={`/facturation/${f.id}`} className="text-brand-700 hover:text-brand-800 cursor-pointer">{f.numero}</Link> : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-ink-700">{pat ? `${pat.prenom} ${pat.nom}` : "—"}</td>
                      <td className="px-4 py-2.5"><Badge tone="neutral" size="sm">{p.methode}</Badge></td>
                      <td className="px-4 py-2.5 text-ink-500">{p.reference ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular font-semibold text-[#0f7a48]">{formatDA(p.montant_da)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right text-[12px] text-ink-500 font-medium border-t border-line">Total filtré:</td>
                  <td className="px-4 py-3 text-right tabular text-[14px] font-semibold text-ink-900 border-t border-line">{formatDA(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="px-4 py-3 border-b border-line flex items-center justify-between">
          <div>
            <div className="text-[14px] font-semibold text-ink-900 tracking-crisp">Factures impayées</div>
            <div className="text-[11px] text-ink-500">Total à encaisser: <span className="font-semibold text-danger tabular">{formatDA(totalImpaye)}</span></div>
          </div>
          <Link href="/facturation?statut=IMPAYE">
            <Button variant="secondary">Voir la facturation</Button>
          </Link>
        </div>
        {impayees.length === 0 ? (
          <EmptyState icon={<Landmark className="h-5 w-5" />} title="Toutes les factures sont réglées" />
        ) : (
          <div className="divide-y divide-line">
            {impayees.map((f) => {
              const pat = patients.find((x) => x.id === f.patient_id);
              const reste = f.total_da - f.paye_da;
              return (
                <Link
                  key={f.id}
                  href={`/facturation/${f.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 cursor-pointer transition-colors"
                >
                  <div className="h-8 w-8 rounded-md bg-danger-soft text-danger grid place-items-center shrink-0">
                    <Wallet className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-900 truncate">{f.numero} — {pat ? `${pat.prenom} ${pat.nom}` : "—"}</div>
                    <div className="text-[11px] text-ink-500">{formatDate(f.date)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-semibold text-ink-900 tabular">{formatDA(reste)}</div>
                    <Badge tone={f.statut === "PARTIEL" ? "warning" : "danger"} size="sm" dot>{f.statut === "PARTIEL" ? "Partiel" : "Impayé"}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
