"use client";

import Link from "next/link";
import { HeartPulse, ChevronRight } from "lucide-react";
import { useApp, ageFromDob } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState, Avatar, Chip } from "@/components/ui/misc";
import { useState } from "react";

export default function ChroniquesPage() {
  const { patients, relevesChroniques } = useApp();
  const [tab, setTab] = useState<"Tous" | "Diabète" | "HTA">("Tous");

  const chronic = patients.filter((p) => p.chronique_diabete || p.chronique_hta);
  const list = chronic.filter((p) => {
    if (tab === "Diabète") return p.chronique_diabete;
    if (tab === "HTA") return p.chronique_hta;
    return true;
  });

  const today = new Date();
  function isOverdue(patientId: string) {
    const last = relevesChroniques
      .filter((r) => r.patient_id === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!last) return true;
    const days = Math.floor((today.getTime() - new Date(last.date + "T00:00:00").getTime()) / 86400000);
    return days > 90;
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Suivi longitudinal"
        title="Maladies chroniques"
        description="Diabète et HTA — les deux pathologies les plus fréquentes."
      />

      <div className="flex flex-wrap gap-1.5">
        {(["Tous", "Diabète", "HTA"] as const).map((k) => (
          <Chip key={k} active={tab === k} onClick={() => setTab(k)}>{k}</Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <Card padding="md"><EmptyState icon={<HeartPulse className="h-5 w-5" />} title="Aucun patient chronique" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((p) => {
            const releves = relevesChroniques
              .filter((r) => r.patient_id === p.id)
              .sort((a, b) => b.date.localeCompare(a.date));
            const last = releves[0];
            const overdue = isOverdue(p.id);
            return (
              <Link key={p.id} href={`/chroniques/${p.id}`}>
                <Card interactive padding="md" className="h-full">
                  <div className="flex items-start gap-3">
                    <Avatar name={`${p.prenom} ${p.nom}`} size={38} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-ink-900 truncate tracking-crisp">{p.prenom} {p.nom}</div>
                      <div className="text-[11px] text-ink-500">{ageFromDob(p.date_naissance)} ans · {p.wilaya}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.chronique_diabete && <Badge tone="warning" size="sm" dot>Diabète</Badge>}
                        {p.chronique_hta && <Badge tone="danger" size="sm" dot>HTA</Badge>}
                        {overdue && <Badge tone="danger" size="sm">Suivi en retard</Badge>}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-300" />
                  </div>
                  {last && (
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-line">
                      {last.tension_sys ? (
                        <Mini label="TA" value={`${last.tension_sys}/${last.tension_dia}`} unit="mmHg" />
                      ) : <Mini label="TA" value="—" unit="mmHg" />}
                      {last.glycemie ? (
                        <Mini label="Glycémie" value={last.glycemie.toString()} unit="g/L" />
                      ) : <Mini label="Glycémie" value="—" unit="g/L" />}
                      {last.poids_kg ? (
                        <Mini label="Poids" value={last.poids_kg.toString()} unit="kg" />
                      ) : <Mini label="Poids" value="—" unit="kg" />}
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Mini({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="text-[13px] font-semibold text-ink-900 tabular mt-0.5">{value} <span className="text-[10px] text-ink-400 font-normal">{unit}</span></div>
    </div>
  );
}
