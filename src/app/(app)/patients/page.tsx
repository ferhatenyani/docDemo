"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Plus, Users, Phone, Filter, MoreHorizontal } from "lucide-react";
import { useApp, ageFromDob } from "@/lib/store";
import { SectionHeader, Card, Badge, Chip, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WILAYAS } from "@/lib/seed";

export default function PatientsPage() {
  const patients = useApp((s) => s.patients);
  const [q, setQ] = useState("");
  const [wilaya, setWilaya] = useState<string>("Toutes");
  const [assurance, setAssurance] = useState<string>("Toutes");
  const [tag, setTag] = useState<string>("Tous");

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const s = q.trim().toLowerCase();
      const matchesQuery = !s ||
        `${p.nom} ${p.prenom} ${p.code} ${p.telephone} ${p.numero_chifa ?? ""}`
          .toLowerCase()
          .includes(s);
      const matchesWilaya = wilaya === "Toutes" || p.wilaya === wilaya;
      const matchesAssurance = assurance === "Toutes" || p.type_assurance === assurance;
      const matchesTag =
        tag === "Tous"
        || (tag === "Chroniques" && (p.chronique_diabete || p.chronique_hta))
        || (tag === "Allergies" && p.allergies.length > 0)
        || (tag === "Enfants" && ageFromDob(p.date_naissance) < 18)
        || (tag === "Seniors" && ageFromDob(p.date_naissance) >= 60);
      return matchesQuery && matchesWilaya && matchesAssurance && matchesTag;
    });
  }, [patients, q, wilaya, assurance, tag]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Dossiers médicaux"
        title="Patients"
        description={`${patients.length} patients dans votre base`}
        actions={
          <Link href="/patients/nouveau">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />}>Nouveau patient</Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 flex flex-col lg:flex-row gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par nom, code, téléphone, Chifa…"
            leftIcon={<Search className="h-3.5 w-3.5" />}
            className="lg:max-w-md flex-1"
          />
          <div className="flex flex-wrap gap-1.5">
            {["Tous", "Chroniques", "Allergies", "Enfants", "Seniors"].map((t) => (
              <Chip key={t} active={t === tag} onClick={() => setTag(t)}>{t}</Chip>
            ))}
          </div>
        </div>
        <div className="border-t border-line p-3 flex flex-col sm:flex-row gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-500 me-1">
              <Filter className="h-3 w-3" /> Wilaya
            </span>
            {["Toutes", ...WILAYAS.slice(0, 6)].map((w) => (
              <Chip key={w} active={w === wilaya} onClick={() => setWilaya(w)}>{w}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:ms-auto">
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-500 me-1">
              <Filter className="h-3 w-3" /> Assurance
            </span>
            {["Toutes", "CNAS", "CASNOS", "ASSURE", "AYANT_DROIT", "NON_ASSURE"].map((a) => (
              <Chip key={a} active={a === assurance} onClick={() => setAssurance(a)}>
                {a === "AYANT_DROIT" ? "Ayant droit" : a === "NON_ASSURE" ? "Non assuré" : a === "ASSURE" ? "Assuré" : a}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card padding="md">
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="Aucun patient trouvé"
            description="Essayez d'ajuster votre recherche ou vos filtres."
            action={<Link href="/patients/nouveau"><Button variant="dark">Créer un patient</Button></Link>}
          />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg border border-line shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="bg-surface-muted border-b border-line eyebrow">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Patient</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Code</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Âge / Sexe</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Téléphone</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Wilaya</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Assurance</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Alertes</th>
                      <th className="w-14" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-ink-50/60 transition-colors">
                        <td className="px-4 py-2.5">
                          <Link href={`/patients/${p.id}`} className="flex items-center gap-2.5 cursor-pointer">
                            <Avatar name={`${p.prenom} ${p.nom}`} size={30} />
                            <div className="min-w-0">
                              <div className="font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                              <div className="text-[11px] text-ink-500 truncate">{p.commune}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 tabular text-ink-600">{p.code}</td>
                        <td className="px-4 py-2.5 tabular text-ink-700">{ageFromDob(p.date_naissance)} ans · {p.sexe === "M" ? "H" : "F"}</td>
                        <td className="px-4 py-2.5 tabular text-ink-700">{p.telephone}</td>
                        <td className="px-4 py-2.5 text-ink-700">{p.wilaya}</td>
                        <td className="px-4 py-2.5">
                          <Badge tone={p.type_assurance === "NON_ASSURE" ? "neutral" : "info"} size="sm">
                            {p.type_assurance === "AYANT_DROIT" ? "Ayant droit" : p.type_assurance === "NON_ASSURE" ? "Non assuré" : p.type_assurance === "ASSURE" ? "Assuré" : p.type_assurance}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap items-center gap-1">
                            {p.chronique_diabete && <Badge tone="warning" size="sm" dot>Diabète</Badge>}
                            {p.chronique_hta && <Badge tone="danger" size="sm" dot>HTA</Badge>}
                            {p.allergies.length > 0 && <Badge tone="danger" size="sm">Allergies</Badge>}
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <Link
                            href={`/patients/${p.id}`}
                            aria-label="Ouvrir"
                            className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 text-ink-500 hover:text-ink-800 cursor-pointer ms-auto transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2.5 border-t border-line flex items-center justify-between bg-surface-muted">
                <div className="text-[11px] text-ink-500">{filtered.length} patient{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</div>
                <div className="text-[11px] text-ink-500">Trié par nom · A → Z</div>
              </div>
            </div>
          </div>

          {/* Mobile / tablet: cards */}
          <div className="grid sm:grid-cols-2 gap-3 lg:hidden">
            {filtered.map((p) => (
              <Link key={p.id} href={`/patients/${p.id}`}>
                <Card interactive padding="md" className="h-full">
                  <div className="flex items-start gap-3">
                    <Avatar name={`${p.prenom} ${p.nom}`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                      <div className="text-[11px] text-ink-500 truncate">{p.code} · {ageFromDob(p.date_naissance)} ans</div>
                      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mt-1.5">
                        <Phone className="h-3 w-3" /> <span className="tabular">{p.telephone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    <Badge tone={p.type_assurance === "NON_ASSURE" ? "neutral" : "info"} size="sm">
                      {p.type_assurance === "AYANT_DROIT" ? "Ayant droit" : p.type_assurance === "NON_ASSURE" ? "Non assuré" : p.type_assurance === "ASSURE" ? "Assuré" : p.type_assurance}
                    </Badge>
                    {p.chronique_diabete && <Badge tone="warning" size="sm">Diabète</Badge>}
                    {p.chronique_hta && <Badge tone="danger" size="sm">HTA</Badge>}
                    {p.allergies.length > 0 && <Badge tone="danger" size="sm">Allergies</Badge>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
