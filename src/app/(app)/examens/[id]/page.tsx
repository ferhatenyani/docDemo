"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, FlaskConical, Save, Printer, Paperclip } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import type { StatutExamen } from "@/lib/types";

export default function ExamenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { examens, patients, utilisateurs, updateExamen, pushToast, clinique } = useApp();
  const e = examens.find((x) => x.id === id);
  const [statut, setStatut] = useState<StatutExamen | undefined>(e?.statut);
  const [notes, setNotes] = useState(e?.resultat_notes ?? "");
  const [dateResultat, setDateResultat] = useState(e?.date_resultat ?? "");

  if (!e) {
    return (
      <Card padding="md">
        <EmptyState
          icon={<FlaskConical className="h-6 w-6" />}
          title="Examen introuvable"
          action={<Link href="/examens"><Button variant="primary">Retour</Button></Link>}
        />
      </Card>
    );
  }
  const p = patients.find((x) => x.id === e.patient_id);
  const m = utilisateurs.find((x) => x.id === e.medecin_id);

  return (
    <div className="space-y-4">
      <Link href="/examens" className="no-print inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Examens
      </Link>
      <SectionHeader
        className="no-print"
        title={e.intitule}
        description={`${e.type} • ${p ? p.prenom + " " + p.nom : ""}`}
        actions={
          <Button variant="secondary" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Imprimer</Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padding="lg" className="lg:col-span-2 print-page">
          <div className="flex items-start justify-between pb-3 border-b border-line">
            <div>
              <div className="text-[16px] font-semibold text-ink-900">{clinique.raison_sociale}</div>
              <div className="text-[12px] text-ink-500">{clinique.adresse}</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-ink-500">Demande d'examen</div>
              <div className="text-[13px] font-medium">{formatDate(e.date_demande)}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {p && <div className="text-[13px]"><span className="text-ink-500">Patient:</span> <span className="font-semibold">{p.prenom} {p.nom}</span></div>}
            {m && <div className="text-[13px]"><span className="text-ink-500">Prescripteur:</span> Dr. {m.prenom} {m.nom}</div>}
            <div className="text-[13px]"><span className="text-ink-500">Type:</span> {e.type}</div>
            <div className="text-[13px]"><span className="text-ink-500">Intitulé:</span> {e.intitule}</div>
            {e.laboratoire && <div className="text-[13px]"><span className="text-ink-500">Laboratoire:</span> {e.laboratoire}</div>}
          </div>
          {e.resultat_notes && (
            <div className="mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3">
              <div className="text-[11px] uppercase text-brand-700 font-semibold tracking-wide">Résultats / notes</div>
              <div className="text-[13px] text-ink-800 whitespace-pre-wrap mt-1">{e.resultat_notes}</div>
            </div>
          )}
          {e.fichier_nom && (
            <div className="mt-3 rounded-xl border border-line p-3 text-[13px] text-ink-700 flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-ink-500" />
              <span className="flex-1 truncate">{e.fichier_nom}</span>
              <span className="text-[11px] text-ink-500">Pièce jointe</span>
            </div>
          )}
        </Card>

        <Card padding="md" className="space-y-3 no-print">
          <div className="text-[13px] font-semibold text-ink-800">Mise à jour du résultat</div>
          <Field label="Statut">
            <Select
              value={statut ?? "DEMANDE"}
              onChange={(v) => setStatut(v as StatutExamen)}
              options={[
                { value: "DEMANDE", label: "Demandé" },
                { value: "PRESCRIT", label: "Prescrit" },
                { value: "EN_ATTENTE_RESULTAT", label: "En attente" },
                { value: "RESULTAT_RECU", label: "Résultat reçu" },
              ]}
            />
          </Field>
          <Field label="Date du résultat">
            <DatePicker value={dateResultat} onChange={setDateResultat} />
          </Field>
          <Field label="Notes de résultat">
            <Textarea value={notes} onChange={(ev) => setNotes(ev.target.value)} rows={4} />
          </Field>
          <Button
            variant="primary"
            fullWidth
            leftIcon={<Save className="h-4 w-4" />}
            onClick={() => {
              updateExamen(e.id, { statut, resultat_notes: notes, date_resultat: dateResultat || undefined });
              pushToast({ title: "Examen mis à jour", tone: "success" });
            }}
          >Enregistrer</Button>
          <div className="pt-2">
            <Badge tone={e.statut === "RESULTAT_RECU" ? "success" : e.statut === "EN_ATTENTE_RESULTAT" ? "warning" : "info"}>
              {e.statut === "RESULTAT_RECU" ? "Résultat reçu" : e.statut === "EN_ATTENTE_RESULTAT" ? "En attente" : e.statut === "DEMANDE" ? "Demandé" : "Prescrit"}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
