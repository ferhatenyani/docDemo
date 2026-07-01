"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/store";
import { PatientForm } from "@/components/forms/PatientForm";
import { SectionHeader, Card, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";

export default function ModifierPatientPage() {
  const { id } = useParams<{ id: string }>();
  const patients = useApp((s) => s.patients);
  const p = patients.find((x) => x.id === id);

  if (!p) {
    return (
      <Card padding="md">
        <EmptyState
          title="Patient introuvable"
          action={<Link href="/patients"><Button variant="primary">Retour</Button></Link>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Link href={`/patients/${p.id}`} className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Fiche patient
      </Link>
      <SectionHeader title={`Modifier ${p.prenom} ${p.nom}`} description="Mettez à jour les informations du dossier." />
      <PatientForm patient={p} />
    </div>
  );
}
