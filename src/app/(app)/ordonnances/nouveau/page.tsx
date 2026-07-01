"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, X, Save, AlertTriangle, Search } from "lucide-react";
import { useApp } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { LignePrescription, Medicament } from "@/lib/types";

export default function NouvelleOrdonnancePage() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    patients, medicaments, utilisateurs, addOrdonnance, pushToast,
  } = useApp();

  const [patientId, setPatientId] = useState(params.get("patient") ?? patients[0]?.id ?? "");
  const [medecinId, setMedecinId] = useState(utilisateurs.find((u) => u.role === "MEDECIN")?.id ?? "");
  const [lignes, setLignes] = useState<LignePrescription[]>([]);
  const [remarques, setRemarques] = useState("");
  const [medQuery, setMedQuery] = useState("");

  const patient = patients.find((p) => p.id === patientId);

  const suggestions = useMemo(() => {
    if (!medQuery.trim()) return medicaments.slice(0, 6);
    const s = medQuery.toLowerCase();
    return medicaments.filter((m) =>
      `${m.nom_commercial} ${m.dci} ${m.forme}`.toLowerCase().includes(s)
    ).slice(0, 8);
  }, [medQuery, medicaments]);

  // Interaction and allergy alerts
  const alerts = useMemo(() => {
    const found: { tone: "danger" | "warning"; message: string }[] = [];
    if (!patient) return found;
    const usedIds = lignes.map((l) => l.medicament_id);
    const used = medicaments.filter((m) => usedIds.includes(m.id));

    // Allergies vs contre-indications
    used.forEach((m) => {
      m.contre_indications?.forEach((ci) => {
        if (patient.allergies.some((a) => a.toLowerCase() === ci.toLowerCase())) {
          found.push({ tone: "danger", message: `Allergie à ${ci} — contre-indication pour ${m.nom_commercial}` });
        }
      });
    });

    // Cross-interactions
    for (let i = 0; i < used.length; i++) {
      for (let j = i + 1; j < used.length; j++) {
        if (used[i].interactions?.includes(used[j].id) || used[j].interactions?.includes(used[i].id)) {
          found.push({ tone: "warning", message: `Interaction possible: ${used[i].nom_commercial} + ${used[j].nom_commercial}` });
        }
      }
    }
    return found;
  }, [patient, lignes, medicaments]);

  function addMedicament(m: Medicament) {
    setLignes([
      ...lignes,
      {
        medicament_id: m.id,
        nom: `${m.nom_commercial} ${m.forme}`,
        dosage: "1 comprimé",
        posologie: "1 fois par jour",
        duree: "7 jours",
      },
    ]);
    setMedQuery("");
  }

  function updateLine(i: number, patch: Partial<LignePrescription>) {
    setLignes(lignes.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }

  function submit() {
    if (!patientId || !medecinId || lignes.length === 0) {
      pushToast({ title: "Ordonnance incomplète", description: "Ajoutez au moins un médicament.", tone: "warning" });
      return;
    }
    const created = addOrdonnance({
      patient_id: patientId,
      medecin_id: medecinId,
      consultation_id: params.get("consultation") ?? undefined,
      date: new Date().toISOString().slice(0, 16),
      lignes,
      remarques,
    });
    pushToast({ title: "Ordonnance créée", tone: "success" });
    router.push(`/ordonnances/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <Link href={patientId ? `/patients/${patientId}` : "/ordonnances"} className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Retour
      </Link>
      <SectionHeader title="Nouvelle ordonnance" description={patient ? `Pour ${patient.prenom} ${patient.nom}` : undefined} />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Patient" required>
                <Select
                  value={patientId}
                  onChange={setPatientId}
                  options={patients.map((p) => ({ value: p.id, label: `${p.prenom} ${p.nom}`, hint: p.code }))}
                />
              </Field>
              <Field label="Médecin" required>
                <Select
                  value={medecinId}
                  onChange={setMedecinId}
                  options={utilisateurs.filter((u) => u.role === "MEDECIN").map((u) => ({ value: u.id, label: `Dr. ${u.prenom} ${u.nom}` }))}
                />
              </Field>
            </div>
          </Card>

          {alerts.length > 0 && (
            <Card padding="md" className="border-danger/40 bg-red-50/50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-[13px] font-semibold text-danger">Alertes cliniques</div>
                  {alerts.map((a, i) => (
                    <div key={i} className={"text-[13px] " + (a.tone === "danger" ? "text-danger" : "text-amber-700")}>• {a.message}</div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Card padding="md">
            <div className="text-[13px] font-semibold text-ink-800 mb-2">Médicaments prescrits</div>
            {lignes.length === 0 ? (
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title="Aucun médicament ajouté"
                description="Recherchez et ajoutez des médicaments ci-dessous."
              />
            ) : (
              <div className="space-y-2">
                {lignes.map((l, i) => (
                  <div key={i} className="rounded-xl border border-line p-3 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-ink-900 truncate">{l.nom}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                          <Field label="Dosage">
                            <Input value={l.dosage} onChange={(e) => updateLine(i, { dosage: e.target.value })} />
                          </Field>
                          <Field label="Posologie">
                            <Input value={l.posologie} onChange={(e) => updateLine(i, { posologie: e.target.value })} />
                          </Field>
                          <Field label="Durée">
                            <Input value={l.duree} onChange={(e) => updateLine(i, { duree: e.target.value })} />
                          </Field>
                        </div>
                      </div>
                      <button
                        onClick={() => setLignes(lignes.filter((_, x) => x !== i))}
                        className="h-9 w-9 grid place-items-center rounded-full hover:bg-red-50 text-danger cursor-pointer"
                        aria-label="Retirer"
                      ><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3">
              <Input
                placeholder="Rechercher un médicament (nom commercial ou DCI)…"
                value={medQuery}
                onChange={(e) => setMedQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
              <div className="mt-2 grid sm:grid-cols-2 gap-1.5">
                {suggestions.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => addMedicament(m)}
                    className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-left hover:bg-brand-50 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate">{m.nom_commercial}</div>
                      <div className="text-[11px] text-ink-500 truncate">{m.dci} • {m.forme}</div>
                    </div>
                    <Plus className="h-4 w-4 text-brand-500" />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card padding="md">
            <Field label="Remarques">
              <Textarea value={remarques} onChange={(e) => setRemarques(e.target.value)} rows={2} placeholder="Instructions générales, contrôles à prévoir…" />
            </Field>
          </Card>
        </div>

        <Card padding="md" className="space-y-2">
          <div className="text-[13px] font-semibold text-ink-800">Aperçu ordonnance</div>
          <div className="text-[13px] text-ink-500">
            Une fois enregistrée, cette ordonnance sera imprimable au format A4 avec en-tête du cabinet.
          </div>
          {patient && (
            <div className="rounded-xl border border-line p-3 space-y-1 text-[12px]">
              <div><span className="text-ink-500">Patient:</span> <span className="font-medium">{patient.prenom} {patient.nom}</span></div>
              <div><span className="text-ink-500">Âge:</span> {new Date().getFullYear() - new Date(patient.date_naissance).getFullYear()} ans</div>
              {patient.allergies.length > 0 && (
                <div>
                  <span className="text-ink-500">Allergies:</span>{" "}
                  <span className="text-danger font-medium">{patient.allergies.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="sticky bottom-0 bg-surface-muted/90 backdrop-blur-sm py-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>Annuler</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={submit}>Émettre l'ordonnance</Button>
      </div>
    </div>
  );
}
