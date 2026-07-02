"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, ReceiptText, Search, Settings2, ChevronRight } from "lucide-react";
import { useApp, formatDA, formatDate } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Card, Badge, Chip, EmptyState, StatCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { StatutFacture } from "@/lib/types";

function statutTone(s: StatutFacture) {
  return s === "PAYE" ? "success" : s === "PARTIEL" ? "warning" : s === "IMPAYE" ? "danger" : "neutral";
}

export default function FacturationPage() {
  return (
    <Suspense fallback={null}>
      <FacturationPageInner />
    </Suspense>
  );
}

function FacturationPageInner() {
  const t = useT();
  const params = useSearchParams();
  const { factures, patients } = useApp();
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<string>(params.get("statut") ?? "Tous");

  function statutLabel(s: StatutFacture) {
    return s === "PAYE" ? t("status_paid") : s === "PARTIEL" ? t("status_partial") : s === "IMPAYE" ? t("status_unpaid") : t("status_cancelled");
  }

  const filtered = useMemo(() => {
    return factures
      .filter((f) => {
        const p = patients.find((x) => x.id === f.patient_id);
        const name = p ? `${p.prenom} ${p.nom}` : "";
        const q1 = !q.trim() || `${name} ${f.numero}`.toLowerCase().includes(q.toLowerCase());
        const s1 = statut === "Tous" || f.statut === statut;
        return q1 && s1;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [factures, patients, q, statut]);

  const totalHT = factures.reduce((s, f) => s + f.total_da, 0);
  const totalPaye = factures.reduce((s, f) => s + f.paye_da, 0);
  const totalImpaye = totalHT - totalPaye;

  const chipLabel = (s: string) => {
    if (s === "Tous") return t("all_f");
    if (s === "PAYE") return t("chip_paid");
    if (s === "PARTIEL") return t("chip_partial");
    if (s === "IMPAYE") return t("chip_unpaid");
    return t("chip_cancelled");
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={t("finance")}
        title={t("facturation_title")}
        description={`${factures.length} ${t("factures")} — ${t("total_billed")}: ${formatDA(totalHT)}`}
        actions={
          <>
            <Link href="/facturation/nomenclature">
              <Button variant="secondary" leftIcon={<Settings2 className="h-3.5 w-3.5" />}>{t("nomenclature")}</Button>
            </Link>
            <Link href="/facturation/nouveau">
              <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />}>{t("new_facture")}</Button>
            </Link>
          </>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label={t("total_billed")} value={formatDA(totalHT)} sublabel={`${factures.length} ${t("invoices_issued")}`} />
        <StatCard label={t("collected")} value={formatDA(totalPaye)} delta={`${Math.round((totalPaye / (totalHT || 1)) * 100)}% ${t("of_total")}`} deltaTone="success" />
        <StatCard label={t("remaining_to_collect")} value={formatDA(totalImpaye)} delta={`${factures.filter(f => f.statut !== "PAYE" && f.statut !== "ANNULE").length} ${t("in_progress")}`} deltaTone={totalImpaye > 0 ? "danger" : "success"} />
      </div>

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 flex flex-col lg:flex-row gap-3 lg:items-center border-b border-line">
          <Input
            className="flex-1 lg:max-w-md"
            placeholder={t("search_facture_patient")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
          <div className="flex flex-wrap gap-1.5">
            {["Tous", "PAYE", "PARTIEL", "IMPAYE", "ANNULE"].map((s) => (
              <Chip key={s} active={statut === s} onClick={() => setStatut(s)}>
                {chipLabel(s)}
              </Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<ReceiptText className="h-5 w-5" />} title={t("no_invoice")} action={<Link href="/facturation/nouveau"><Button variant="dark">{t("create_facture")}</Button></Link>} />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-muted border-b border-line eyebrow">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("facture_number_short")}</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("patient")}</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("date")}</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">{t("total")}</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">{t("paid")}</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">{t("remaining")}</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("status")}</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((f) => {
                    const p = patients.find((x) => x.id === f.patient_id);
                    const reste = f.total_da - f.paye_da;
                    return (
                      <tr key={f.id} className="hover:bg-ink-50/60 transition-colors">
                        <td className="px-4 py-2.5">
                          <Link href={`/facturation/${f.id}`} className="font-medium text-ink-900 tabular cursor-pointer hover:text-brand-700 transition-colors">{f.numero}</Link>
                        </td>
                        <td className="px-4 py-2.5 text-ink-700">{p ? `${p.prenom} ${p.nom}` : "—"}</td>
                        <td className="px-4 py-2.5 text-ink-500">{formatDate(f.date, t.locale)}</td>
                        <td className="px-4 py-2.5 text-right tabular font-medium text-ink-900">{formatDA(f.total_da)}</td>
                        <td className="px-4 py-2.5 text-right tabular text-[#0f7a48]">{formatDA(f.paye_da)}</td>
                        <td className={`px-4 py-2.5 text-right tabular ${reste > 0 ? "text-danger font-medium" : "text-ink-400"}`}>{formatDA(reste)}</td>
                        <td className="px-4 py-2.5"><Badge tone={statutTone(f.statut)} dot>{statutLabel(f.statut)}</Badge></td>
                        <td className="px-2 py-2.5">
                          <Link href={`/facturation/${f.id}`} aria-label={t("open")} className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-800 cursor-pointer transition-colors">
                            <ChevronRight className="h-4 w-4 dir-icon" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2.5 border-t border-line bg-surface-muted text-[11px] text-ink-500 flex items-center justify-between">
                <span>{filtered.length} {filtered.length > 1 ? t("factures") : t("facture")}</span>
                <span>{t("sorted_by_date_recent")}</span>
              </div>
            </div>

            <div className="grid gap-2 md:hidden p-3">
              {filtered.map((f) => {
                const p = patients.find((x) => x.id === f.patient_id);
                return (
                  <Link key={f.id} href={`/facturation/${f.id}`}>
                    <Card interactive padding="md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-ink-900 tabular">{f.numero}</div>
                          <div className="text-[12px] text-ink-700 truncate">{p ? `${p.prenom} ${p.nom}` : "—"}</div>
                          <div className="text-[11px] text-ink-500">{formatDate(f.date, t.locale)}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[15px] font-semibold text-ink-900 tabular">{formatDA(f.total_da)}</div>
                          <Badge tone={statutTone(f.statut)} size="sm" dot>{statutLabel(f.statut)}</Badge>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
