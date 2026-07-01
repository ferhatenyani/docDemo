"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, FlaskConical, Search, ChevronRight } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Badge, Chip, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { StatutExamen } from "@/lib/types";

function statutTone(s: StatutExamen) {
  return s === "RESULTAT_RECU" ? "success" : s === "EN_ATTENTE_RESULTAT" ? "warning" : "info";
}
function statutLabel(s: StatutExamen) {
  return s === "RESULTAT_RECU" ? "Résultat reçu" : s === "EN_ATTENTE_RESULTAT" ? "En attente" : s === "DEMANDE" ? "Demandé" : s === "PRESCRIT" ? "Prescrit" : s;
}

export default function ExamensListPage() {
  const { examens, patients } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"Tous" | "En attente" | "Reçus">("Tous");

  const filtered = useMemo(() => {
    return examens
      .filter((e) => {
        const p = patients.find((x) => x.id === e.patient_id);
        const name = p ? `${p.prenom} ${p.nom}` : "";
        const matchesQ = !q.trim() || `${name} ${e.intitule} ${e.type}`.toLowerCase().includes(q.toLowerCase());
        const matchesF =
          filter === "Tous" ||
          (filter === "En attente" && (e.statut === "DEMANDE" || e.statut === "EN_ATTENTE_RESULTAT")) ||
          (filter === "Reçus" && e.statut === "RESULTAT_RECU");
        return matchesQ && matchesF;
      })
      .sort((a, b) => b.date_demande.localeCompare(a.date_demande));
  }, [examens, patients, q, filter]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Analyses & imagerie"
        title="Examens & résultats"
        description="Analyses, radios, échographies, ECG…"
        actions={
          <Link href="/examens/nouveau">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />}>Nouvel examen</Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 flex flex-col sm:flex-row gap-3 sm:items-center border-b border-line">
          <Input
            className="flex-1 sm:max-w-md"
            placeholder="Rechercher patient, intitulé…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
          <div className="flex gap-1.5 flex-wrap">
            {(["Tous", "En attente", "Reçus"] as const).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FlaskConical className="h-5 w-5" />}
            title="Aucun examen"
            action={<Link href="/examens/nouveau"><Button variant="dark">Créer une demande</Button></Link>}
          />
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((e) => {
              const p = patients.find((x) => x.id === e.patient_id);
              return (
                <Link key={e.id} href={`/examens/${e.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50/60 transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-md bg-info-soft text-info grid place-items-center shrink-0">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[13px] font-semibold text-ink-900 truncate">{e.intitule}</div>
                      <Badge tone="info" size="sm">{e.type}</Badge>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5 truncate">
                      {p ? `${p.prenom} ${p.nom}` : "—"} · Demandé le {formatDate(e.date_demande)}
                      {e.laboratoire ? ` · ${e.laboratoire}` : ""}
                    </div>
                  </div>
                  <Badge tone={statutTone(e.statut)} dot>{statutLabel(e.statut)}</Badge>
                  <ChevronRight className="h-4 w-4 text-ink-300 shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
