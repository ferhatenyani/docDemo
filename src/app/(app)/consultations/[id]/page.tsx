"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Printer, PillBottle, FlaskConical, FileBadge, ReceiptText, Stethoscope } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";

export default function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { consultations, patients, utilisateurs, cim10 } = useApp();
  const c = consultations.find((x) => x.id === id);

  if (!c) {
    return (
      <Card padding="md">
        <EmptyState
          icon={<Stethoscope className="h-6 w-6" />}
          title="Consultation introuvable"
          action={<Link href="/consultations"><Button variant="primary">Retour</Button></Link>}
        />
      </Card>
    );
  }

  const p = patients.find((x) => x.id === c.patient_id);
  const m = utilisateurs.find((x) => x.id === c.medecin_id);
  const v = c.signes_vitaux;
  const imc = v.poids_kg && v.taille_cm ? (v.poids_kg / Math.pow(v.taille_cm / 100, 2)) : null;

  return (
    <div className="space-y-4">
      <Link href="/consultations" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Consultations
      </Link>
      <SectionHeader
        title="Consultation"
        description={`${formatDate(c.date)}${m ? " • Dr. " + m.nom : ""}`}
        actions={
          <>
            <Link href={`/ordonnances/nouveau?patient=${c.patient_id}&consultation=${c.id}`}>
              <Button variant="secondary" leftIcon={<PillBottle className="h-4 w-4" />}>Ordonnance</Button>
            </Link>
            <Link href={`/examens/nouveau?patient=${c.patient_id}&consultation=${c.id}`}>
              <Button variant="secondary" leftIcon={<FlaskConical className="h-4 w-4" />}>Examen</Button>
            </Link>
            <Link href={`/certificats/nouveau?patient=${c.patient_id}`}>
              <Button variant="secondary" leftIcon={<FileBadge className="h-4 w-4" />}>Certificat</Button>
            </Link>
            <Link href={`/facturation/nouveau?patient=${c.patient_id}&consultation=${c.id}`}>
              <Button variant="secondary" leftIcon={<ReceiptText className="h-4 w-4" />}>Facturer</Button>
            </Link>
            <Button variant="ghost" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Imprimer</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padding="md" className="lg:col-span-2 space-y-3 print-page">
          {p && (
            <Link href={`/patients/${p.id}`} className="flex items-center gap-3 pb-3 border-b border-line cursor-pointer">
              <Avatar name={`${p.prenom} ${p.nom}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-ink-900">{p.prenom} {p.nom}</div>
                <div className="text-[12px] text-ink-500">{p.code} • {p.telephone}</div>
              </div>
            </Link>
          )}
          <Row label="Motif" value={c.motif} />
          <Row label="Symptômes" value={c.symptomes} multiline />
          <Row label="Examen clinique" value={c.examen_clinique} multiline />
          <Row label="Diagnostic" value={c.diagnostic} multiline />
          {c.codes_cim10.length > 0 && (
            <div>
              <div className="text-[11px] uppercase text-ink-500 font-semibold tracking-wide mb-1">Codes CIM-10</div>
              <div className="flex flex-wrap gap-1.5">
                {c.codes_cim10.map((code) => {
                  const info = cim10.find((x) => x.code === code);
                  return <Badge key={code} tone="brand" size="sm">
                    <span className="tabular">{code}</span> {info?.libelle}
                  </Badge>;
                })}
              </div>
            </div>
          )}
          {c.notes && <Row label="Notes" value={c.notes} multiline />}
        </Card>

        <Card padding="md" className="space-y-3">
          <div className="text-[13px] font-semibold text-ink-800">Signes vitaux</div>
          <div className="grid grid-cols-2 gap-2">
            <Vital label="TA" value={v.tension_systolique && v.tension_diastolique ? `${v.tension_systolique}/${v.tension_diastolique}` : "—"} unit="mmHg" />
            <Vital label="FC" value={v.frequence_cardiaque ?? "—"} unit="bpm" />
            <Vital label="Temp" value={v.temperature ?? "—"} unit="°C" />
            <Vital label="SpO₂" value={v.saturation ?? "—"} unit="%" />
            <Vital label="Poids" value={v.poids_kg ?? "—"} unit="kg" />
            <Vital label="Taille" value={v.taille_cm ?? "—"} unit="cm" />
            <Vital label="Glycémie" value={v.glycemie ?? "—"} unit="g/L" />
            <Vital label="IMC" value={imc ? imc.toFixed(1) : "—"} unit="kg/m²" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase text-ink-500 font-semibold tracking-wide mb-0.5">{label}</div>
      <div className={"text-[14px] text-ink-800 " + (multiline ? "whitespace-pre-wrap" : "")}>
        {value || <span className="text-ink-400">—</span>}
      </div>
    </div>
  );
}

function Vital({ label, value, unit }: { label: string; value: any; unit: string }) {
  return (
    <div className="rounded-xl bg-ink-50 p-2.5">
      <div className="text-[10px] text-ink-500 uppercase font-semibold tracking-wide">{label}</div>
      <div className="text-[16px] font-semibold text-ink-900 tabular mt-0.5">{value} <span className="text-[10px] text-ink-400 font-normal">{unit}</span></div>
    </div>
  );
}
