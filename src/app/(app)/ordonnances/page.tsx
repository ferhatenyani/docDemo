"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, PillBottle, Search, ChevronRight } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, EmptyState, Avatar, Badge } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function OrdonnancesListPage() {
  const { ordonnances, patients } = useApp();
  const [q, setQ] = useState("");

  const filtered = ordonnances
    .filter((o) => {
      const p = patients.find((x) => x.id === o.patient_id);
      const name = p ? `${p.prenom} ${p.nom}` : "";
      const meds = o.lignes.map((l) => l.nom).join(" ");
      return !q.trim() || `${name} ${meds}`.toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Prescriptions"
        title="Ordonnances"
        description={`${ordonnances.length} ordonnances émises`}
        actions={
          <Link href="/ordonnances/nouveau">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />}>Nouvelle ordonnance</Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 border-b border-line">
          <Input
            placeholder="Rechercher patient, médicament…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<PillBottle className="h-5 w-5" />}
            title="Aucune ordonnance"
            action={<Link href="/ordonnances/nouveau"><Button variant="dark">Créer une ordonnance</Button></Link>}
          />
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((o) => {
              const p = patients.find((x) => x.id === o.patient_id);
              return (
                <Link key={o.id} href={`/ordonnances/${o.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-ink-50/60 transition-colors cursor-pointer">
                  {p && <Avatar name={`${p.prenom} ${p.nom}`} size={34} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[13px] font-semibold text-ink-900">{p ? `${p.prenom} ${p.nom}` : "—"}</div>
                      <span className="text-[11px] text-ink-400">·</span>
                      <div className="text-[11px] text-ink-500">{formatDate(o.date)}</div>
                      <Badge tone="brand" size="sm">{o.lignes.length} médicament{o.lignes.length > 1 ? "s" : ""}</Badge>
                    </div>
                    <div className="text-[12px] text-ink-600 mt-0.5 truncate">{o.lignes.map((l) => l.nom).join(" · ")}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink-300 shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
