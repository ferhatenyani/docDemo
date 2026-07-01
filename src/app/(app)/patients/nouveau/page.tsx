"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PatientForm } from "@/components/forms/PatientForm";
import { SectionHeader } from "@/components/ui/misc";

export default function NouveauPatientPage() {
  return (
    <div className="space-y-4">
      <Link href="/patients" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Patients
      </Link>
      <SectionHeader
        title="Nouveau patient"
        description="Créez un dossier patient complet."
      />
      <PatientForm />
    </div>
  );
}
