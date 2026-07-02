"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PatientForm } from "@/components/forms/PatientForm";
import { SectionHeader } from "@/components/ui/misc";
import { useT } from "@/lib/i18n";

export default function NouveauPatientPage() {
  const t = useT();
  return (
    <div className="space-y-4">
      <Link href="/patients" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="dir-icon h-4 w-4" /> {t("patients_title")}
      </Link>
      <SectionHeader
        title={t("new_patient")}
        description={t("new_patient_desc")}
      />
      <PatientForm />
    </div>
  );
}
