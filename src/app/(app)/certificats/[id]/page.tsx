"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Printer, FileBadge } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

export default function CertificatDetailPage() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const { certificats, patients, utilisateurs, clinique } = useApp();
  const c = certificats.find((x) => x.id === id);
  if (!c) {
    return (
      <Card padding="md">
        <EmptyState icon={<FileBadge className="h-6 w-6" />} title={t("cert_not_found")} action={<Link href="/certificats"><Button variant="primary">{t("back")}</Button></Link>} />
      </Card>
    );
  }
  const p = patients.find((x) => x.id === c.patient_id);
  const m = utilisateurs.find((x) => x.id === c.medecin_id);

  const title = c.type === "ARRET_TRAVAIL" ? t("cert_title_arret_travail")
    : c.type === "MEDICAL" ? t("cert_medical")
    : c.type === "BON_TRANSPORT" ? t("cert_bon_transport")
    : c.type === "ORIENTATION" ? t("cert_orientation")
    : c.type === "APTITUDE" ? t("cert_aptitude")
    : t("certificat");

  return (
    <div className="space-y-4">
      <Link href="/certificats" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="dir-icon h-4 w-4" /> {t("certificats_title")}
      </Link>
      <SectionHeader
        className="no-print"
        title={t("certificat")}
        description={p ? `${p.prenom} ${p.nom}` : ""}
        actions={<Button variant="primary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>{t("print")}</Button>}
      />

      <Card padding="lg" className="print-page">
        <div className="flex items-start justify-between pb-4 border-b border-line gap-3">
          <div className="min-w-0">
            <div className="text-[18px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
            <div className="text-[12px] text-ink-500 mt-0.5">{clinique.adresse} — {clinique.commune}, {clinique.wilaya}</div>
            <div className="text-[12px] text-ink-500">{t("phone")}: {clinique.telephone}</div>
          </div>
          {m && (
            <div className="text-right shrink-0">
              <div className="text-[14px] font-semibold text-ink-900">Dr. {m.prenom} {m.nom}</div>
              <div className="text-[12px] text-ink-500">{m.specialite}</div>
            </div>
          )}
        </div>

        <h2 className="text-center text-[20px] font-semibold text-ink-900 mt-6">
          {title}
        </h2>

        <div className="text-[14px] text-ink-800 leading-7 whitespace-pre-wrap mt-6">{c.contenu}</div>

        {c.motif && (
          <div className="mt-4 text-[13px] text-ink-600"><span className="text-ink-500">{t("cert_reason")}:</span> {c.motif}</div>
        )}

        <div className="mt-10 pt-6 border-t border-line grid sm:grid-cols-2">
          <div className="text-[12px] text-ink-500">{t("cert_done_on")} {formatDate(c.date, t.locale)}</div>
          <div className="text-right text-[12px] text-ink-500 mt-4 sm:mt-0">
            {t("cert_stamp_signature")}
            <div className="text-[13px] text-ink-800 mt-1">Dr. {m ? `${m.prenom} ${m.nom}` : ""}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
