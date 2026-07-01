"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Printer, PillBottle } from "lucide-react";
import { useApp, formatDate, ageFromDob } from "@/lib/store";
import { SectionHeader, Card, EmptyState, Badge } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";

export default function OrdonnanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ordonnances, patients, utilisateurs, clinique } = useApp();
  const o = ordonnances.find((x) => x.id === id);

  if (!o) {
    return (
      <Card padding="md">
        <EmptyState
          icon={<PillBottle className="h-6 w-6" />}
          title="Ordonnance introuvable"
          action={<Link href="/ordonnances"><Button variant="primary">Retour</Button></Link>}
        />
      </Card>
    );
  }

  const p = patients.find((x) => x.id === o.patient_id);
  const m = utilisateurs.find((x) => x.id === o.medecin_id);

  return (
    <div className="space-y-4">
      <Link href="/ordonnances" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Ordonnances
      </Link>
      <SectionHeader
        className="no-print"
        title="Ordonnance"
        description={`${formatDate(o.date)}${p ? " • " + p.prenom + " " + p.nom : ""}`}
        actions={
          <Button variant="primary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
            Imprimer
          </Button>
        }
      />

      <Card padding="lg" className="print-page">
        {/* Clinic header */}
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[18px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
            <div className="text-[12px] text-ink-500 mt-0.5">{clinique.adresse} — {clinique.commune}, {clinique.wilaya}</div>
            <div className="text-[12px] text-ink-500">Tél: {clinique.telephone} • {clinique.email}</div>
          </div>
          {m && (
            <div className="text-right">
              <div className="text-[14px] font-semibold text-ink-900">Dr. {m.prenom} {m.nom}</div>
              <div className="text-[12px] text-ink-500">{m.specialite}</div>
            </div>
          )}
        </div>

        {/* Patient block */}
        {p && (
          <div className="pt-4 pb-3 flex flex-wrap items-center gap-x-6 gap-y-1">
            <div className="text-[13px]"><span className="text-ink-500">Patient:</span> <span className="font-semibold text-ink-900">{p.prenom} {p.nom}</span></div>
            <div className="text-[13px]"><span className="text-ink-500">Âge:</span> {ageFromDob(p.date_naissance)} ans</div>
            <div className="text-[13px]"><span className="text-ink-500">Sexe:</span> {p.sexe === "M" ? "Homme" : "Femme"}</div>
            <div className="text-[13px] ms-auto"><span className="text-ink-500">Date:</span> {formatDate(o.date)}</div>
          </div>
        )}

        {/* Meds */}
        <ol className="space-y-3 mt-3">
          {o.lignes.map((l, i) => (
            <li key={i} className="rounded-xl border border-line p-3">
              <div className="text-[14px] font-semibold text-ink-900">{i + 1}. {l.nom}</div>
              <div className="text-[13px] text-ink-700 mt-1">
                <span className="me-3"><span className="text-ink-500">Dosage:</span> {l.dosage}</span>
                <span className="me-3"><span className="text-ink-500">Posologie:</span> {l.posologie}</span>
                <span><span className="text-ink-500">Durée:</span> {l.duree}</span>
              </div>
              {l.instructions && <div className="text-[12px] text-ink-500 mt-1">Instructions: {l.instructions}</div>}
            </li>
          ))}
        </ol>

        {o.remarques && (
          <div className="mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3">
            <div className="text-[11px] uppercase text-brand-700 font-semibold tracking-wide">Remarques</div>
            <div className="text-[13px] text-ink-800 mt-1 whitespace-pre-wrap">{o.remarques}</div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-line grid sm:grid-cols-2">
          <div className="text-[12px] text-ink-500">Cachet & Signature</div>
          <div className="text-right text-[12px] text-ink-500 mt-4 sm:mt-0">
            Dr. {m ? `${m.prenom} ${m.nom}` : ""}
          </div>
        </div>
      </Card>
    </div>
  );
}
