"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Stethoscope, Search, ChevronRight } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Badge, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ConsultationsListPage() {
  const { consultations, patients, utilisateurs } = useApp();
  const [q, setQ] = useState("");

  const filtered = consultations
    .filter((c) => {
      const p = patients.find((x) => x.id === c.patient_id);
      const name = p ? `${p.prenom} ${p.nom}` : "";
      return !q.trim()
        || `${name} ${c.motif} ${c.diagnostic} ${c.codes_cim10.join(" ")}`.toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Dossier clinique"
        title="Consultations"
        description={`${consultations.length} consultations enregistrées`}
        actions={
          <Link href="/consultations/nouveau">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />}>Nouvelle consultation</Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 border-b border-line">
          <Input
            placeholder="Rechercher patient, motif, diagnostic, CIM-10…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Stethoscope className="h-5 w-5" />}
            title="Aucune consultation"
            action={<Link href="/consultations/nouveau"><Button variant="dark">Créer une consultation</Button></Link>}
          />
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((c) => {
              const p = patients.find((x) => x.id === c.patient_id);
              const m = utilisateurs.find((x) => x.id === c.medecin_id);
              return (
                <Link key={c.id} href={`/consultations/${c.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-ink-50/60 transition-colors cursor-pointer">
                  {p && <Avatar name={`${p.prenom} ${p.nom}`} size={34} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[13px] font-semibold text-ink-900">{p ? `${p.prenom} ${p.nom}` : "—"}</div>
                      <span className="text-[11px] text-ink-400">·</span>
                      <div className="text-[11px] text-ink-500">{formatDate(c.date)}</div>
                      {m && <><span className="text-[11px] text-ink-400">·</span><div className="text-[11px] text-ink-500">Dr. {m.nom}</div></>}
                    </div>
                    <div className="text-[12px] text-ink-700 mt-0.5"><span className="text-ink-500">Motif:</span> {c.motif}</div>
                    <div className="text-[12px] text-ink-700"><span className="text-ink-500">Diagnostic:</span> {c.diagnostic}</div>
                    {c.codes_cim10.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.codes_cim10.map((code) => <Badge key={code} tone="brand" size="sm"><span className="tabular">{code}</span></Badge>)}
                      </div>
                    )}
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
