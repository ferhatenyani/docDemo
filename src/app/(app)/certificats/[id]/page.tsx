"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Printer, FileBadge } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";

export default function CertificatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { certificats, patients, utilisateurs, clinique } = useApp();
  const c = certificats.find((x) => x.id === id);
  if (!c) {
    return (
      <Card padding="md">
        <EmptyState icon={<FileBadge className="h-6 w-6" />} title="Certificat introuvable" action={<Link href="/certificats"><Button variant="primary">Retour</Button></Link>} />
      </Card>
    );
  }
  const p = patients.find((x) => x.id === c.patient_id);
  const m = utilisateurs.find((x) => x.id === c.medecin_id);

  return (
    <div className="space-y-4">
      <Link href="/certificats" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Certificats
      </Link>
      <SectionHeader
        className="no-print"
        title="Certificat"
        description={p ? `${p.prenom} ${p.nom}` : ""}
        actions={<Button variant="primary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Imprimer</Button>}
      />

      <Card padding="lg" className="print-page">
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[18px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
            <div className="text-[12px] text-ink-500 mt-0.5">{clinique.adresse} — {clinique.commune}, {clinique.wilaya}</div>
            <div className="text-[12px] text-ink-500">Tél: {clinique.telephone}</div>
          </div>
          {m && (
            <div className="text-right">
              <div className="text-[14px] font-semibold text-ink-900">Dr. {m.prenom} {m.nom}</div>
              <div className="text-[12px] text-ink-500">{m.specialite}</div>
            </div>
          )}
        </div>

        <h2 className="text-center text-[20px] font-semibold text-ink-900 mt-6">
          {c.type === "ARRET_TRAVAIL" ? "Certificat d'arrêt de travail" : c.type === "MEDICAL" ? "Certificat médical" : c.type === "BON_TRANSPORT" ? "Bon de transport" : c.type === "ORIENTATION" ? "Lettre d'orientation" : c.type === "APTITUDE" ? "Certificat d'aptitude" : "Certificat"}
        </h2>

        <div className="text-[14px] text-ink-800 leading-7 whitespace-pre-wrap mt-6">{c.contenu}</div>

        {c.motif && (
          <div className="mt-4 text-[13px] text-ink-600"><span className="text-ink-500">Motif:</span> {c.motif}</div>
        )}

        <div className="mt-10 pt-6 border-t border-line grid sm:grid-cols-2">
          <div className="text-[12px] text-ink-500">Fait le {formatDate(c.date)}</div>
          <div className="text-right text-[12px] text-ink-500 mt-4 sm:mt-0">
            Cachet & Signature
            <div className="text-[13px] text-ink-800 mt-1">Dr. {m ? `${m.prenom} ${m.nom}` : ""}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
