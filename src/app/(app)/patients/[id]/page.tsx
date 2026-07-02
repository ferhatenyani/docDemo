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
import { useT } from "@/lib/i18n";
import { SectionHeader, Card, Badge, Avatar, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function PatientDetailPage() {
  const t = useT();
  const locale = t.locale;
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
          title={t("patient_not_found")}
          description={t("patient_not_found_desc")}
          action={<Link href="/patients"><Button variant="primary">{t("back_to_patients")}</Button></Link>}
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
    { key: "apercu", label: t("overview") },
    { key: "consultations", label: t("consultations_title"), count: patientConsultations.length },
    { key: "ordonnances", label: t("ordonnances_title"), count: patientOrdonnances.length },
    { key: "examens", label: t("examens_title"), count: patientExamens.length },
    { key: "certificats", label: t("certificats_title"), count: patientCertificats.length },
    { key: "factures", label: t("factures"), count: patientFactures.length },
    { key: "rdv", label: t("nav_rdv"), count: patientRdv.length },
  ];

  const assuranceLabel = (a: string) => {
    switch (a) {
      case "CNAS": return t("ins_cnas");
      case "CASNOS": return t("ins_casnos");
      case "ASSURE": return t("ins_assure");
      case "AYANT_DROIT": return t("ins_ayant_droit");
      case "NON_ASSURE": return t("ins_non_assure");
      default: return a;
    }
  };

  const factureStatusLabel = (s: string) => {
    switch (s) {
      case "PAYE": return t("status_paid");
      case "PARTIEL": return t("status_partial");
      case "IMPAYE": return t("status_unpaid");
      default: return t("status_cancelled");
    }
  };

  const chronic = p.chronique_diabete || p.chronique_hta;

  return (
    <div className="space-y-4">
      <Link href="/patients" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="dir-icon h-4 w-4" /> {t("patients_title")}
      </Link>

      {/* Header card */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar name={`${p.prenom} ${p.nom}`} size={64} className="text-lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] sm:text-[26px] font-semibold text-ink-900">{p.prenom} {p.nom}</h1>
              <Badge tone="info" size="sm">{p.code}</Badge>
              {p.groupe_sanguin && <Badge tone="danger" size="sm">{t("blood_group")} {p.groupe_sanguin}</Badge>}
            </div>
            <div className="text-[13px] text-ink-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1"><Cake className="h-3.5 w-3.5" /> {ageFromDob(p.date_naissance)} {t("age_years")} • {p.sexe === "M" ? t("sex_male") : t("sex_female")}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> <span className="tabular">{p.telephone}</span></span>
              {p.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {p.email}</span>}
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.commune}, {p.wilaya}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link href={`/consultations/nouveau?patient=${p.id}`}>
              <Button variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>{t("consultation")}</Button>
            </Link>
            <Link href={`/patients/${p.id}/modifier`}>
              <Button variant="secondary" leftIcon={<Pencil className="h-4 w-4" />}>{t("modify")}</Button>
            </Link>
            <Button variant="ghost" leftIcon={<Trash2 className="h-4 w-4 text-danger" />} onClick={() => setConfirmDelete(true)}>{t("delete")}</Button>
          </div>
        </div>

        {chronic && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-ink-500">{t("chronic")}:</span>
            {p.chronique_diabete && (
              <Link href={`/chroniques/${p.id}`}>
                <Badge tone="warning" size="sm">{t("diabete")} — {t("followup")}</Badge>
              </Link>
            )}
            {p.chronique_hta && (
              <Link href={`/chroniques/${p.id}`}>
                <Badge tone="danger" size="sm">{t("hta")} — {t("followup")}</Badge>
              </Link>
            )}
          </div>
        )}

        {p.allergies.length > 0 && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 flex items-center gap-2">
            <span className="text-[12px] font-semibold text-red-700">{t("allergies")}:</span>
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
              <div className="text-[13px] font-semibold text-ink-800 mb-1">{t("antecedents")}</div>
              {p.antecedents.length === 0
                ? <div className="text-[13px] text-ink-500">{t("no_antecedents")}</div>
                : <ul className="text-[13px] text-ink-800 list-disc ps-5 space-y-0.5">
                    {p.antecedents.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
              }
            </div>
            <div>
              <div className="text-[13px] font-semibold text-ink-800 mb-1">{t("current_treatments")}</div>
              {p.traitements_en_cours.length === 0
                ? <div className="text-[13px] text-ink-500">{t("no_current_treatment")}</div>
                : <ul className="text-[13px] text-ink-800 list-disc ps-5 space-y-0.5">
                    {p.traitements_en_cours.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
              }
            </div>
            <div>
              <div className="text-[13px] font-semibold text-ink-800 mb-1">{t("chronic_diseases")}</div>
              {p.maladies_chroniques.length === 0
                ? <div className="text-[13px] text-ink-500">{t("no_chronic_disease")}</div>
                : <div className="flex flex-wrap gap-1.5">
                    {p.maladies_chroniques.map((m) => <Badge key={m} tone="brand" size="sm">{m}</Badge>)}
                  </div>
              }
            </div>
            {p.notes && (
              <div>
                <div className="text-[13px] font-semibold text-ink-800 mb-1">{t("notes")}</div>
                <div className="text-[13px] text-ink-700 whitespace-pre-wrap">{p.notes}</div>
              </div>
            )}
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="text-[13px] font-semibold text-ink-800">{t("social_security")}</div>
            <InfoRow label={t("insurance_type")} value={assuranceLabel(p.type_assurance)} />
            <InfoRow label={t("social_security_number")} value={p.numero_securite_sociale || "—"} />
            <InfoRow label={t("chifa_card_number")} value={p.numero_chifa || "—"} />
            <InfoRow label={t("birth_date")} value={formatDate(p.date_naissance, locale)} />
            <InfoRow label={t("address")} value={`${p.adresse}, ${p.commune}, ${p.wilaya}`} />
            <InfoRow label={t("record_created_on")} value={formatDate(p.cree_le, locale)} />
          </Card>
        </div>
      )}

      {tab === "consultations" && (
        <TimelineList
          locale={locale}
          empty={{ icon: <Stethoscope className="h-6 w-6" />, title: t("no_consultation"), action: <Link href={`/consultations/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>{t("new_consultation_btn")}</Button></Link> }}
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
          locale={locale}
          empty={{ icon: <PillBottle className="h-6 w-6" />, title: t("no_ordonnance"), action: <Link href={`/ordonnances/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>{t("new_ordonnance_btn")}</Button></Link> }}
          items={patientOrdonnances.map((o) => ({
            key: o.id,
            date: o.date,
            title: `${o.lignes.length} ${t("medicaments").toLowerCase()}`,
            subtitle: o.lignes.map((l) => l.nom).join(", "),
            href: `/ordonnances/${o.id}`,
          }))}
        />
      )}

      {tab === "examens" && (
        <TimelineList
          locale={locale}
          empty={{ icon: <FlaskConical className="h-6 w-6" />, title: t("no_examen"), action: <Link href={`/examens/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>{t("request_examen")}</Button></Link> }}
          items={patientExamens.map((e) => ({
            key: e.id,
            date: e.date_demande,
            title: e.intitule,
            subtitle: e.laboratoire ?? e.type,
            meta: e.statut === "RESULTAT_RECU" ? t("result_received") : e.statut === "EN_ATTENTE_RESULTAT" ? t("awaiting_result") : t("prescribed"),
            href: `/examens/${e.id}`,
          }))}
        />
      )}

      {tab === "certificats" && (
        <TimelineList
          locale={locale}
          empty={{ icon: <FileBadge className="h-6 w-6" />, title: t("no_certificate"), action: <Link href={`/certificats/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>{t("new_certificate_btn")}</Button></Link> }}
          items={patientCertificats.map((c) => ({
            key: c.id,
            date: c.date,
            title: c.type === "ARRET_TRAVAIL" ? `${t("cert_arret_travail")} (${c.duree_jours ?? "?"} ${t("days_short")})` : c.type === "MEDICAL" ? t("cert_medical") : c.type,
            subtitle: c.motif,
            href: `/certificats/${c.id}`,
          }))}
        />
      )}

      {tab === "factures" && (
        <TimelineList
          locale={locale}
          empty={{ icon: <ReceiptText className="h-6 w-6" />, title: t("no_invoice"), action: <Link href={`/facturation/nouveau?patient=${p.id}`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>{t("new_facture")}</Button></Link> }}
          items={patientFactures.map((f) => ({
            key: f.id,
            date: f.date,
            title: f.numero,
            subtitle: f.lignes.map((l) => l.libelle).join(", "),
            meta: `${formatDA(f.total_da)} • ${factureStatusLabel(f.statut)}`,
            href: `/facturation/${f.id}`,
          }))}
        />
      )}

      {tab === "rdv" && (
        <TimelineList
          locale={locale}
          empty={{ icon: <CalendarClock className="h-6 w-6" />, title: t("no_rdv"), action: <Link href={`/rendez-vous?patient=${p.id}&new=1`}><Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>{t("rdv_new")}</Button></Link> }}
          items={patientRdv.map((r) => ({
            key: r.id,
            date: r.date + "T" + r.heure,
            title: r.motif,
            subtitle: `${r.heure} • ${r.duree_minutes} ${t("min_short")}`,
            meta: r.statut,
            href: `/rendez-vous`,
          }))}
        />
      )}

      {tab === "apercu" && patientReleves.length > 0 && (
        <Card padding="md">
          <div className="text-[13px] font-semibold text-ink-800 mb-2 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-danger" /> {t("latest_chronic_measures")}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {patientReleves.slice(0, 6).map((r) => (
              <div key={r.id} className="rounded-xl border border-line p-3 text-[12px]">
                <div className="text-ink-500">{formatDate(r.date, locale)}</div>
                <div className="tabular mt-1 space-y-0.5">
                  {r.tension_sys && <div>{t("blood_pressure_short")}: <span className="font-semibold">{r.tension_sys}/{r.tension_dia}</span> mmHg</div>}
                  {r.glycemie && <div>{t("glycemie")}: <span className="font-semibold">{r.glycemie}</span> g/L</div>}
                  {r.poids_kg && <div>{t("weight")}: <span className="font-semibold">{r.poids_kg}</span> kg</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title={t("delete_patient_title")}
        description={`${t("delete_patient_desc_prefix")} ${p.prenom} ${p.nom}${t("delete_patient_desc_suffix")}`}
        confirmLabel={t("delete")}
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          deletePatient(p.id);
          pushToast({ title: t("patient_deleted"), tone: "danger" });
          router.push("/patients");
        }}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 min-w-0">
      <span className="text-[12px] text-ink-500 shrink-0">{label}</span>
      <span className="text-[13px] font-medium text-ink-800 text-right truncate">{value}</span>
    </div>
  );
}

interface TLItem { key: string; date: string; title: string; subtitle?: string; meta?: string; href: string; }
function TimelineList({ items, empty, locale }: { items: TLItem[]; empty: { icon: React.ReactNode; title: string; action?: React.ReactNode }; locale: "fr" | "ar" }) {
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
              <div className="text-[12px] text-ink-500">{formatDate(it.date, locale)}</div>
              {it.meta && <div className="text-[11px] text-ink-500">{it.meta}</div>}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
