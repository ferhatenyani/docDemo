"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft, Pencil, Trash2, MapPin, Phone, Mail, Cake, User2,
  Stethoscope, PillBottle, FlaskConical, FileBadge, ReceiptText, HeartPulse,
  CalendarClock, Plus,
} from "lucide-react";
import { useApp, ageFromDob, formatDate, formatDA } from "@/lib/store";
import { SectionHeader, Card, Badge, Avatar, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    patients, consultations, ordonnances, examens, certificats,
    factures, rendezVous, relevesChroniques,
    deletePatient, pushToast,
  } = useApp();
  const p = patients.find((x) => x.id === id);
  const [tab, setTab] = useState("apercu");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!p) {
    return (
      <Card padding="md">
        <EmptyState
          icon={<User2 className="h-6 w-6" />}
          title="Patient introuvable"
          description="Ce dossier n'existe pas ou a été supprimé."
          action={<Link href="/patients"><Button variant="primary">Retour aux patients</Button></Link>}
        />
      </Card>
    );
  }

  const patientConsultations = consultations.filter((c) => c.patient_id === p.id);
  const patientOrdonnances = ordonnances.filter((o) => o.patient_id === p.id);
  const patientExamens = examens.filter((e) => e.patient_id === p.id);
  const patientCertificats = certificats.filter((c) => c.patient_id === p.id);
  const patientFactures = factures.filter((f) => f.patient_id === p.id);
  const patientRdv = rendezVous.filter((r) => r.patient_id === p.id);
  const patientReleves = relevesChroniques.filter((r) => r.patient_id === p.id);

  const tabs = [
    { key: "apercu", label: "Aperçu" },
    { key: "consultations", label: "Consultations", count: patientConsultations.length },
    { key: "ordonnances", label: "Ordonnances", count: patientOrdonnances.length },
    { key: "examens", label: "Examens", count: patientExamens.length },
    { key: "certificats", label: "Certificats", count: patientCertificats.length },
    { key: "factures", label: "Factures", count: patientFactures.length },
    { key: "rdv", label: "RDV", count: patientRdv.length },
  ];

  const chronic = p.chronique_diabete || p.chronique_hta;

  return (
    <div className="space-y-4">
      <Link href="/patients" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Patients
      </Link>

      {/* Header card */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar name={`${p.prenom} ${p.nom}`} size={64} className="text-lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] sm:text-[26px] font-semibold text-ink-900">{p.prenom} {p.nom}</h1>
              <Badge tone="info" size="sm">{p.code}</Badge>
              {p.groupe_sanguin && <Badge tone="danger" size="sm">Groupe {p.groupe_sanguin}</Badge>}
            </div>
            <div className="text-[13px] text-ink-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1"><Cake className="h-3.5 w-3.5" /> {ageFromDob(p.date_naissance)} ans • {p.sexe === "M" ? "Homme" : "Femme"}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> <span className="tabular">{p.telephone}</span></span>
              {p.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {p.email}</span>}
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.commune}, {p.wilaya}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link href={`/consultations/nouveau?patient=${p.id}`}>
              <Button variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>Consultation</Button>
            </Link>
            <Link href={`/patients/${p.id}/modifier`}>
              <Button variant="secondary" leftIcon={<Pencil className="h-4 w-4" />}>Modifier</Button>
            </Link>
            <Button variant="ghost" leftIcon={<Trash2 className="h-4 w-4 text-danger" />} onClick={() => setConfirmDelete(true)}>Supprimer</Button>
          </div>
        </div>

        {chronic && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-ink-500">Chronique:</span>
            {p.chronique_diabete && (
              <Link href={`/chroniques/${p.id}`}>
                <Badge tone="warning" size="sm">Diabète — suivi</Badge>
              </Link>
            )}
            {p.chronique_hta && (
              <Link href={`/chroniques/${p.id}`}>
                <Badge tone="danger" size="sm">HTA — suivi</Badge>
              </Link>
            )}
          </div>
        )}

        {p.allergies.length > 0 && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 flex items-center gap-2">
            <span className="text-[12px] font-semibold text-red-700">Allergies:</span>
            <div className="flex flex-wrap gap-1">
              {p.allergies.map((a) => <Badge key={a} tone="danger" size="sm">{a}</Badge>)}
            </div>
          </div>
        )}
      </Card>

      <Tabs tabs={tabs} active={tab} onChange={setTab} variant="underline" />

      {tab === "apercu" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card padding="md" className="lg:col-span-2 space-y-4">
            <div>
              <div className="text-[13px] font-semibold text-ink-800 mb-1">Antécédents</div>
              {p.antecedents.length === 0
                ? <div className="text-[13px] text-ink-500">Aucun antécédent renseigné.</div>
                : <ul className="text-[13px] text-ink-800 list-disc ps-5 space-y-0.5">
                    {p.antecedents.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
              }
            </div>
            <div>
              <div className="text-[13px] font-semibold text-ink-800 mb-1">Traitements en cours</div>
              {p.traitements_en_cours.length === 0
                ? <div className="text-[13px] text-ink-500">Aucun traitement en cours.</div>
                : <ul className="text-[13px] text-ink-800 list-disc ps-5 space-y-0.5">
                    {p.traitements_en_cours.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
              }
            </div>
            <div>
              <div className="text-[13px] font-semibold text-ink-800 mb-1">Maladies chroniques</div>
              {p.maladies_chroniques.length === 0
                ? <div className="text-[13px] text-ink-500">Aucune maladie chronique.</div>
                : <div className="flex flex-wrap gap-1.5">
                    {p.maladies_chroniques.map((m) => <Badge key={m} tone="brand" size="sm">{m}</Badge>)}
                  </div>
              }
            </div>
            {p.notes && (
              <div>
                <div className="text-[13px] font-semibold text-ink-800 mb-1">Notes</div>
                <div className="text-[13px] text-ink-700 whitespace-pre-wrap">{p.notes}</div>
              </div>
            )}
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="text-[13px] font-semibold text-ink-800">Sécurité sociale</div>
            <InfoRow label="Type d'assurance" value={p.type_assurance === "AYANT_DROIT" ? "Ayant droit" : p.type_assurance === "NON_ASSURE" ? "Non assuré" : p.type_assurance === "ASSURE" ? "Assuré" : p.type_assurance} />
            <InfoRow label="N° Sécurité sociale" value={p.numero_securite_sociale || "—"} />
            <InfoRow label="N° Carte Chifa" value={p.numero_chifa || "—"} />
            <InfoRow label="Date de naissance" value={formatDate(p.date_naissance)} />
            <InfoRow label="Adresse" value={`${p.adresse}, ${p.commune}, ${p.wilaya}`} />
            <InfoRow label="Dossier créé le" value={formatDate(p.cree_le)} />
          </Card>
        </div>
      )}

      {tab === "consultations" && (
        <TimelineList
          empty={{ icon: <Stethoscope className="h-6 w-6" />, title: "Aucune consultation", action: <Link href={`/consultations/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouvelle consultation</Button></Link> }}
          items={patientConsultations.map((c) => ({
            key: c.id,
            date: c.date,
            title: c.motif,
            subtitle: c.diagnostic,
            meta: c.codes_cim10.length ? c.codes_cim10.join(" • ") : undefined,
            href: `/consultations/${c.id}`,
          }))}
        />
      )}

      {tab === "ordonnances" && (
        <TimelineList
          empty={{ icon: <PillBottle className="h-6 w-6" />, title: "Aucune ordonnance", action: <Link href={`/ordonnances/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouvelle ordonnance</Button></Link> }}
          items={patientOrdonnances.map((o) => ({
            key: o.id,
            date: o.date,
            title: `${o.lignes.length} médicaments`,
            subtitle: o.lignes.map((l) => l.nom).join(", "),
            href: `/ordonnances/${o.id}`,
          }))}
        />
      )}

      {tab === "examens" && (
        <TimelineList
          empty={{ icon: <FlaskConical className="h-6 w-6" />, title: "Aucun examen", action: <Link href={`/examens/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Demander un examen</Button></Link> }}
          items={patientExamens.map((e) => ({
            key: e.id,
            date: e.date_demande,
            title: e.intitule,
            subtitle: e.laboratoire ?? e.type,
            meta: e.statut === "RESULTAT_RECU" ? "Résultat reçu" : e.statut === "EN_ATTENTE_RESULTAT" ? "En attente de résultat" : "Prescrit",
            href: `/examens/${e.id}`,
          }))}
        />
      )}

      {tab === "certificats" && (
        <TimelineList
          empty={{ icon: <FileBadge className="h-6 w-6" />, title: "Aucun certificat", action: <Link href={`/certificats/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouveau certificat</Button></Link> }}
          items={patientCertificats.map((c) => ({
            key: c.id,
            date: c.date,
            title: c.type === "ARRET_TRAVAIL" ? `Arrêt de travail (${c.duree_jours ?? "?"} j)` : c.type === "MEDICAL" ? "Certificat médical" : c.type,
            subtitle: c.motif,
            href: `/certificats/${c.id}`,
          }))}
        />
      )}

      {tab === "factures" && (
        <TimelineList
          empty={{ icon: <ReceiptText className="h-6 w-6" />, title: "Aucune facture", action: <Link href={`/facturation/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouvelle facture</Button></Link> }}
          items={patientFactures.map((f) => ({
            key: f.id,
            date: f.date,
            title: f.numero,
            subtitle: f.lignes.map((l) => l.libelle).join(", "),
            meta: `${formatDA(f.total_da)} • ${f.statut === "PAYE" ? "Payé" : f.statut === "PARTIEL" ? "Partiel" : f.statut === "IMPAYE" ? "Impayé" : "Annulé"}`,
            href: `/facturation/${f.id}`,
          }))}
        />
      )}

      {tab === "rdv" && (
        <TimelineList
          empty={{ icon: <CalendarClock className="h-6 w-6" />, title: "Aucun rendez-vous", action: <Link href={`/rendez-vous?patient=${p.id}&new=1`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouveau RDV</Button></Link> }}
          items={patientRdv.map((r) => ({
            key: r.id,
            date: r.date + "T" + r.heure,
            title: r.motif,
            subtitle: `${r.heure} • ${r.duree_minutes} min`,
            meta: r.statut,
            href: `/rendez-vous`,
          }))}
        />
      )}

      {tab === "apercu" && patientReleves.length > 0 && (
        <Card padding="md">
          <div className="text-[13px] font-semibold text-ink-800 mb-2 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-danger" /> Derniers relevés chroniques
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {patientReleves.slice(0, 6).map((r) => (
              <div key={r.id} className="rounded-xl border border-line p-3 text-[12px]">
                <div className="text-ink-500">{formatDate(r.date)}</div>
                <div className="tabular mt-1 space-y-0.5">
                  {r.tension_sys && <div>TA: <span className="font-semibold">{r.tension_sys}/{r.tension_dia}</span> mmHg</div>}
                  {r.glycemie && <div>Glycémie: <span className="font-semibold">{r.glycemie}</span> g/L</div>}
                  {r.poids_kg && <div>Poids: <span className="font-semibold">{r.poids_kg}</span> kg</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer le patient"
        description={`Le dossier de ${p.prenom} ${p.nom} sera supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          deletePatient(p.id);
          pushToast({ title: "Patient supprimé", tone: "danger" });
          router.push("/patients");
        }}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-ink-500 shrink-0">{label}</span>
      <span className="text-[13px] font-medium text-ink-800 text-right truncate">{value}</span>
    </div>
  );
}

interface TLItem { key: string; date: string; title: string; subtitle?: string; meta?: string; href: string; }
function TimelineList({ items, empty }: { items: TLItem[]; empty: { icon: React.ReactNode; title: string; action?: React.ReactNode } }) {
  if (items.length === 0) {
    return <Card padding="md"><EmptyState {...empty} /></Card>;
  }
  return (
    <Card padding="md">
      <div className="divide-y divide-line">
        {items.map((it) => (
          <Link key={it.key} href={it.href} className="flex items-center gap-3 py-3 hover:bg-ink-50 -mx-2 px-2 rounded-lg cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-ink-900 truncate">{it.title}</div>
              {it.subtitle && <div className="text-[12px] text-ink-500 truncate">{it.subtitle}</div>}
            </div>
            <div className="text-right shrink-0">
              <div className="text-[12px] text-ink-500">{formatDate(it.date)}</div>
              {it.meta && <div className="text-[11px] text-ink-500">{it.meta}</div>}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
