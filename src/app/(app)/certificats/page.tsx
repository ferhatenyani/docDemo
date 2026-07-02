"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, FileBadge, Search, ChevronRight } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, EmptyState, Badge, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n";
import type { TypeCertificat } from "@/lib/types";

export default function CertificatsListPage() {
  const t = useT();
  const { certificats, patients } = useApp();
  const [q, setQ] = useState("");

  function label(ct: TypeCertificat) {
    return ct === "ARRET_TRAVAIL" ? t("cert_arret_travail")
      : ct === "MEDICAL" ? t("cert_medical")
        : ct === "BON_TRANSPORT" ? t("cert_bon_transport")
          : ct === "ORIENTATION" ? t("cert_orientation")
            : ct === "APTITUDE" ? t("cert_aptitude")
              : t("certificat");
  }

  const filtered = certificats
    .filter((c) => {
      const p = patients.find((x) => x.id === c.patient_id);
      const name = p ? `${p.prenom} ${p.nom}` : "";
      return !q.trim() || `${name} ${c.motif} ${c.type}`.toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={t("documents")}
        title={t("certificats_page_title")}
        description={`${certificats.length} ${t("certificats_issued")}`}
        actions={
          <Link href="/certificats/nouveau">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />}>{t("new_certificate_btn")}</Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 border-b border-line">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} leftIcon={<Search className="h-3.5 w-3.5" />} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<FileBadge className="h-5 w-5" />} title={t("no_certificate")} action={<Link href="/certificats/nouveau"><Button variant="dark">{t("create")}</Button></Link>} />
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((c) => {
              const p = patients.find((x) => x.id === c.patient_id);
              return (
                <Link key={c.id} href={`/certificats/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50/60 transition-colors cursor-pointer">
                  {p && <Avatar name={`${p.prenom} ${p.nom}`} size={34} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[13px] font-semibold text-ink-900">{label(c.type)}</div>
                      <Badge tone="brand" size="sm">{p ? `${p.prenom} ${p.nom}` : "—"}</Badge>
                      {c.type === "ARRET_TRAVAIL" && c.duree_jours && (
                        <Badge tone="warning" size="sm">{c.duree_jours} {t("days_short")}</Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5">{formatDate(c.date, t.locale)} · {c.motif}</div>
                  </div>
                  <ChevronRight className="dir-icon h-4 w-4 text-ink-300 shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
