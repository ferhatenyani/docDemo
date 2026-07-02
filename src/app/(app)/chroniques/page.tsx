"use client";

import Link from "next/link";
import { HeartPulse, ChevronRight } from "lucide-react";
import { useApp, ageFromDob } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState, Avatar, Chip } from "@/components/ui/misc";
import { useState } from "react";
import { useT } from "@/lib/i18n";

export default function ChroniquesPage() {
  const t = useT();
  const { patients, relevesChroniques } = useApp();
  const [tab, setTab] = useState<"Tous" | "Diabète" | "HTA">("Tous");

  const chronic = patients.filter((p) => p.chronique_diabete || p.chronique_hta);
  const list = chronic.filter((p) => {
    if (tab === "Diabète") return p.chronique_diabete;
    if (tab === "HTA") return p.chronique_hta;
    return true;
  });

  const tabLabels: Record<"Tous" | "Diabète" | "HTA", string> = {
    "Tous": t("tab_all"),
    "Diabète": t("diabete"),
    "HTA": t("hta"),
  };

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
        eyebrow={t("longitudinal_followup")}
        title={t("chroniques_title")}
        description={t("chroniques_desc_two_pathologies")}
      />

      <div className="flex flex-wrap gap-1.5">
        {(["Tous", "Diabète", "HTA"] as const).map((k) => (
          <Chip key={k} active={tab === k} onClick={() => setTab(k)}>{tabLabels[k]}</Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <Card padding="md"><EmptyState icon={<HeartPulse className="h-5 w-5" />} title={t("no_chronic_patient")} /></Card>
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
                      <div className="text-[11px] text-ink-500">{ageFromDob(p.date_naissance)} {t("age_years")} · {p.wilaya}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.chronique_diabete && <Badge tone="warning" size="sm" dot>{t("diabete")}</Badge>}
                        {p.chronique_hta && <Badge tone="danger" size="sm" dot>{t("hta")}</Badge>}
                        {overdue && <Badge tone="danger" size="sm">{t("followup_overdue")}</Badge>}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-300 dir-icon shrink-0" />
                  </div>
                  {last && (
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-line">
                      {last.tension_sys ? (
                        <Mini label={t("ta_short")} value={`${last.tension_sys}/${last.tension_dia}`} unit="mmHg" />
                      ) : <Mini label={t("ta_short")} value="—" unit="mmHg" />}
                      {last.glycemie ? (
                        <Mini label={t("glycemie")} value={last.glycemie.toString()} unit="g/L" />
                      ) : <Mini label={t("glycemie")} value="—" unit="g/L" />}
                      {last.poids_kg ? (
                        <Mini label={t("weight")} value={last.poids_kg.toString()} unit="kg" />
                      ) : <Mini label={t("weight")} value="—" unit="kg" />}
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
