"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  Stethoscope,
  FilePlus2,
  Receipt,
  HeartPulse,
  Package,
  LayoutDashboard,
  Coins,
  ShieldCheck,
  Languages,
  WifiOff,
  ArrowRight,
  Check,
  Sparkles,
  Play,
  Loader2,
  AlertCircle,
} from "lucide-react";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

type Locale = "fr" | "en";

const DEMO_URL = "/dashboard";

const dict = {
  fr: {
    nav_features: "Fonctionnalités",
    nav_product: "Produit",
    nav_pricing: "Tarifs",
    nav_contact: "Contact",
    demo_short: "Démo",
    contact_us: "Nous contacter",
    contact_short: "Contact",
    see_demo: "Voir la démo",

    hero_eyebrow: "Conçu pour les cabinets d'Algérie",
    hero_title_a: "Gérez votre cabinet,",
    hero_title_b: "sans effort.",
    hero_subtitle:
      "Patients, rendez-vous, ordonnances et facturation en DA. Un seul outil, pensé pour les praticiens algériens.",
    hero_trust: "Utilisé à Alger, Oran, Constantine et Annaba.",

    features_title: "Tout ce qu'il vous faut pour tenir votre cabinet.",
    features_sub: "Huit modules connectés. Un seul login, un seul dossier patient, un seul journal comptable.",
    f_patients: "Dossiers patients",
    f_patients_desc: "Antécédents, Chifa, CNAS.",
    f_appointments: "Rendez-vous",
    f_appointments_desc: "Agenda et salle d'attente.",
    f_consultations: "Consultations",
    f_consultations_desc: "Motifs, examen, diagnostic.",
    f_prescriptions: "Ordonnances",
    f_prescriptions_desc: "Modèles + interactions.",
    f_billing: "Facturation DA",
    f_billing_desc: "Actes, reçus, impayés.",
    f_chronic: "Maladies chroniques",
    f_chronic_desc: "Diabète, HTA, suivi.",
    f_stock: "Pharmacie interne",
    f_stock_desc: "Stock et péremption.",
    f_dashboard: "Tableau de bord",
    f_dashboard_desc: "KPIs et statistiques.",

    product_title: "Chaque écran conçu pour cliquer moins.",
    product_sub: "Pas de menus à tiroir, pas de champs qu'on remplit deux fois.",
    product_b1: "Dossier patient complet sur un seul écran.",
    product_b2: "Ordonnance imprimable en 30 secondes.",
    product_b3: "Alertes d'interactions et d'allergies automatiques.",
    product_b4: "Suivi diabète et HTA avec courbes de tendance.",

    algeria_title: "Fait pour l'Algérie, jusque dans les détails.",
    algeria_sub: "Les choses qui rendent un logiciel étranger inutilisable ici sont natives chez nous.",
    algeria_da: "Dinar Algérien",
    algeria_da_desc: "Prix, factures, bilans en DA.",
    algeria_chifa: "CNAS / CASNOS / Chifa",
    algeria_chifa_desc: "Assurances intégrées.",
    algeria_arabic: "Français & العربية",
    algeria_arabic_desc: "Interface RTL native.",
    algeria_offline: "Hors ligne",
    algeria_offline_desc: "Fonctionne sans réseau.",

    stat_1_label: "cabinets équipés",
    stat_2_label: "consultations traitées",
    stat_3_label: "satisfaction",
    testimonial_quote:
      "« En deux semaines, mon secrétariat n'imprime plus de fiches papier. La facturation en DA est impeccable. »",
    testimonial_name: "Dr. Amina B.",
    testimonial_role: "Médecin généraliste, Alger",

    contact_title: "Parlons de votre cabinet.",
    contact_subtitle: "Devis sous 24 h. Installation et formation incluses.",
    contact_bullet_1: "Démo personnalisée pour votre équipe",
    contact_bullet_2: "Import de vos données existantes",
    contact_bullet_3: "Support en français et en arabe",
    form_name: "Nom complet",
    form_name_ph: "Dr. Karim H.",
    form_email: "Email professionnel",
    form_email_ph: "vous@cabinet.dz",
    form_clinic: "Nom du cabinet",
    form_clinic_ph: "Cabinet Central",
    form_message: "Message (optionnel)",
    form_message_ph: "Nombre de médecins, besoins spécifiques…",
    form_submit: "Envoyer la demande",
    form_sending: "Envoi…",
    form_success: "Merci. Nous vous répondons sous 24 h.",
    form_error: "L'envoi a échoué. Réessayez, ou écrivez-nous directement.",
    form_retry: "Réessayer",

    footer_tag: "Le système de gestion des cliniques modernes.",
    footer_copy: "Tous droits réservés.",
    footer_product: "Produit",
    footer_legal: "Mentions légales",
    footer_terms: "Conditions",
    footer_privacy: "Confidentialité",

    dash_kpi_patients: "Patients aujourd'hui",
    dash_kpi_revenue: "Recettes du jour",
    dash_kpi_rdv: "RDV à venir",
    dash_upcoming: "Prochains rendez-vous",
    dash_confirmed: "Confirmé",
    dash_waiting: "En attente",
  },
  en: {
    nav_features: "Features",
    nav_product: "Product",
    nav_pricing: "Pricing",
    nav_contact: "Contact",
    demo_short: "Demo",
    contact_us: "Contact us",
    contact_short: "Contact",
    see_demo: "See demo",

    hero_eyebrow: "Built for clinics in Algeria",
    hero_title_a: "Run your clinic,",
    hero_title_b: "effortlessly.",
    hero_subtitle:
      "Patients, appointments, prescriptions and billing in DA. One tool, made for Algerian practitioners.",
    hero_trust: "Used in Algiers, Oran, Constantine and Annaba.",

    features_title: "Everything you need to run the clinic.",
    features_sub: "Eight connected modules. One login, one patient file, one accounting journal.",
    f_patients: "Patient records",
    f_patients_desc: "History, Chifa, CNAS.",
    f_appointments: "Appointments",
    f_appointments_desc: "Calendar & waiting room.",
    f_consultations: "Consultations",
    f_consultations_desc: "Symptoms, exam, diagnosis.",
    f_prescriptions: "Prescriptions",
    f_prescriptions_desc: "Templates + interactions.",
    f_billing: "Billing in DA",
    f_billing_desc: "Acts, receipts, unpaid.",
    f_chronic: "Chronic care",
    f_chronic_desc: "Diabetes & HTN follow-up.",
    f_stock: "In-house pharmacy",
    f_stock_desc: "Stock & expiry alerts.",
    f_dashboard: "Dashboard",
    f_dashboard_desc: "KPIs & analytics.",

    product_title: "Every screen built for fewer clicks.",
    product_sub: "No hidden menus, no fields you fill twice.",
    product_b1: "Full patient file on a single screen.",
    product_b2: "Printable prescription in 30 seconds.",
    product_b3: "Automatic drug interaction and allergy alerts.",
    product_b4: "Diabetes and HTN follow-up with trend curves.",

    algeria_title: "Made for Algeria, down to the details.",
    algeria_sub: "The things that make foreign software unusable here are native for us.",
    algeria_da: "Algerian Dinar",
    algeria_da_desc: "Prices, invoices, reports in DA.",
    algeria_chifa: "CNAS / CASNOS / Chifa",
    algeria_chifa_desc: "Insurance types built in.",
    algeria_arabic: "French & العربية",
    algeria_arabic_desc: "Native RTL interface.",
    algeria_offline: "Offline-ready",
    algeria_offline_desc: "Works without connection.",

    stat_1_label: "clinics onboarded",
    stat_2_label: "consultations processed",
    stat_3_label: "satisfaction",
    testimonial_quote:
      "\"In two weeks, our front desk stopped printing paper files. Billing in DA is flawless.\"",
    testimonial_name: "Dr. Amina B.",
    testimonial_role: "General practitioner, Algiers",

    contact_title: "Let's talk about your clinic.",
    contact_subtitle: "Quote in 24h. Setup and training included.",
    contact_bullet_1: "Personalized demo for your team",
    contact_bullet_2: "Migration of your existing data",
    contact_bullet_3: "Support in French and Arabic",
    form_name: "Full name",
    form_name_ph: "Dr. Karim H.",
    form_email: "Work email",
    form_email_ph: "you@clinic.dz",
    form_clinic: "Clinic name",
    form_clinic_ph: "Central Clinic",
    form_message: "Message (optional)",
    form_message_ph: "Number of doctors, specific needs…",
    form_submit: "Send request",
    form_sending: "Sending…",
    form_success: "Thanks. We'll get back within 24h.",
    form_error: "Sending failed. Try again, or email us directly.",
    form_retry: "Try again",

    footer_tag: "The management system for modern clinics.",
    footer_copy: "All rights reserved.",
    footer_product: "Product",
    footer_legal: "Legal",
    footer_terms: "Terms",
    footer_privacy: "Privacy",

    dash_kpi_patients: "Patients today",
    dash_kpi_revenue: "Revenue today",
    dash_kpi_rdv: "Upcoming visits",
    dash_upcoming: "Upcoming appointments",
    dash_confirmed: "Confirmed",
    dash_waiting: "Waiting",
  },
} as const;

type Dict = { [K in keyof (typeof dict)["fr"]]: string };

type FormStatus = "idle" | "loading" | "success" | "error";

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [status, setStatus] = useState<FormStatus>("idle");
  const t = dict[locale];

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus("error");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot — if a bot filled this, silently succeed and drop.
    if (data.get("botcheck")) {
      setStatus("success");
      form.reset();
      return;
    }
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", "Nouvelle demande — docpilote");
    data.append("from_name", "docpilote landing");

    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const features = [
    { icon: Users, title: t.f_patients, desc: t.f_patients_desc, tone: "brand" as const },
    { icon: CalendarDays, title: t.f_appointments, desc: t.f_appointments_desc, tone: "success" as const },
    { icon: Stethoscope, title: t.f_consultations, desc: t.f_consultations_desc, tone: "brand" as const },
    { icon: FilePlus2, title: t.f_prescriptions, desc: t.f_prescriptions_desc, tone: "info" as const },
    { icon: Receipt, title: t.f_billing, desc: t.f_billing_desc, tone: "warning" as const },
    { icon: HeartPulse, title: t.f_chronic, desc: t.f_chronic_desc, tone: "brand" as const },
    { icon: Package, title: t.f_stock, desc: t.f_stock_desc, tone: "info" as const },
    { icon: LayoutDashboard, title: t.f_dashboard, desc: t.f_dashboard_desc, tone: "success" as const },
  ];

  const algeriaCards = [
    { icon: Coins, title: t.algeria_da, desc: t.algeria_da_desc },
    { icon: ShieldCheck, title: t.algeria_chifa, desc: t.algeria_chifa_desc },
    { icon: Languages, title: t.algeria_arabic, desc: t.algeria_arabic_desc },
    { icon: WifiOff, title: t.algeria_offline, desc: t.algeria_offline_desc },
  ];

  return (
    <div className="min-h-dvh bg-white text-ink-900 antialiased">
      {/* Ambient background — contained to viewport width so it never widens the page */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-[-160px] h-[420px] w-[min(820px,140%)] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-brand-100/70 via-brand-50/60 to-transparent blur-3xl" />
        <div className="absolute right-[-60px] top-[40px] h-[220px] w-[220px] rounded-full bg-success-soft/70 blur-3xl" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="docpilote">
            <BrandMark />
            <span className="text-[15px] font-semibold tracking-tightest text-ink-900">
              docpilote
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-ink-600 md:flex">
            <a href="#features" className="transition hover:text-ink-900">
              {t.nav_features}
            </a>
            <a href="#product" className="transition hover:text-ink-900">
              {t.nav_product}
            </a>
            <a href="#contact" className="transition hover:text-ink-900">
              {t.nav_contact}
            </a>
          </nav>

          <div className="flex items-center gap-1 shrink-0 sm:gap-2">
            <LocaleSwitch locale={locale} setLocale={setLocale} />
            <Link
              href={DEMO_URL}
              className="hidden h-9 items-center rounded-lg px-3 text-[13px] font-medium text-ink-700 transition hover:bg-ink-50 sm:inline-flex"
            >
              {t.demo_short}
            </Link>
            <a
              href="#contact"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink-900 px-2.5 text-[13px] font-semibold text-white transition hover:bg-ink-800 sm:px-4"
            >
              <span className="sm:hidden">{t.contact_short}</span>
              <span className="hidden sm:inline">{t.contact_us}</span>
              <ArrowRight className="hidden h-3.5 w-3.5 sm:inline" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-14 lg:pb-24 lg:pt-20">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 [&>*]:min-w-0">
              {/* Left column */}
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-700">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                  {t.hero_eyebrow}
                </div>

                <h1
                  className="mt-4 text-[28px] font-semibold leading-[1.08] tracking-tightest text-ink-900 sm:text-[44px] sm:leading-[1.04] lg:text-[58px] lg:leading-[1.02]"
                >
                  {t.hero_title_a}
                  <span className="block text-brand-600">{t.hero_title_b}</span>
                </h1>

                <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-base">
                  {t.hero_subtitle}
                </p>

                <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
                  <a
                    href="#contact"
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-ink-900 px-5 text-[15px] font-semibold text-white shadow-pop transition hover:bg-ink-800 active:scale-[0.98]"
                  >
                    {t.contact_us}
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </a>
                  <Link
                    href={DEMO_URL}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-5 text-[15px] font-semibold text-ink-800 shadow-xs transition hover:bg-ink-50 active:scale-[0.98]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    {t.see_demo}
                  </Link>
                </div>

                <p className="mt-5 flex items-center gap-2 text-[12px] text-ink-600 sm:mt-6">
                  <span className="flex -space-x-1">
                    <Avatar seed={1} />
                    <Avatar seed={2} />
                    <Avatar seed={3} />
                  </span>
                  {t.hero_trust}
                </p>
              </div>

              {/* Right column — dashboard mockup */}
              <div className="relative min-w-0">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-100/60 to-transparent blur-2xl" />
                <DashboardPreview t={t} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="border-t border-line/60 bg-surface-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-balance text-[26px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
                {t.features_title}
              </h2>
              <p className="mt-3 text-pretty text-[14px] leading-relaxed text-ink-600 sm:text-[15px]">
                {t.features_sub}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-xs transition duration-300 hover:-translate-y-0.5 hover:shadow-card sm:p-5"
                >
                  <FeatureIcon icon={f.icon} tone={f.tone} />
                  <h3 className="mt-3 text-[13px] font-semibold text-ink-900 sm:text-[15px]">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-snug text-ink-600 sm:text-[13px]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT HIGHLIGHT */}
        <section id="product" className="border-t border-line/60 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div>
                <h2 className="text-balance text-[26px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
                  {t.product_title}
                </h2>
                <p className="mt-3 text-pretty text-[14px] leading-relaxed text-ink-600 sm:text-[15px]">
                  {t.product_sub}
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:gap-4">
                  {[t.product_b1, t.product_b2, t.product_b3, t.product_b4].map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-success-soft text-success">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-[13.5px] leading-snug text-ink-800 sm:text-[15px]">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:gap-3">
                  <Link
                    href={DEMO_URL}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-4 text-[14px] font-semibold text-ink-800 shadow-xs transition hover:bg-ink-50"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    {t.see_demo}
                  </Link>
                </div>
              </div>

              {/* Visual — patient file mockup */}
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-brand-50 via-white to-success-soft/40 blur-2xl" />
                <PatientFilePreview locale={locale} />
              </div>
            </div>
          </div>
        </section>

        {/* MADE FOR ALGERIA */}
        <section className="border-t border-line/60 bg-surface-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-balance text-[26px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
                {t.algeria_title}
              </h2>
              <p className="mt-3 text-pretty text-[14px] leading-relaxed text-ink-600 sm:text-[15px]">
                {t.algeria_sub}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4">
              {algeriaCards.map((c) => (
                <div
                  key={c.title}
                  className="relative overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-xs sm:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-[0_6px_16px_-8px_rgba(0,113,227,0.6)]">
                    <c.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </div>
                  <h3 className="mt-3 text-[13px] font-semibold text-ink-900 sm:text-[15px]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-snug text-ink-600 sm:text-[13px]">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats + testimonial */}
            <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-[1.1fr_1fr]">
              <div className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-white p-4 sm:p-6">
                <Stat value="120+" label={t.stat_1_label} />
                <Stat value="85k" label={t.stat_2_label} />
                <Stat value="98%" label={t.stat_3_label} />
              </div>

              <figure className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-ink-900 to-ink-800 p-5 text-white sm:p-6">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-500/20 blur-2xl" />
                <blockquote className="text-[14px] leading-relaxed sm:text-[15px]">
                  {t.testimonial_quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5">
                  <Avatar seed={4} large />
                  <div className="text-[12px] sm:text-[13px]">
                    <div className="font-semibold">{t.testimonial_name}</div>
                    <div className="text-ink-300">{t.testimonial_role}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t border-line/60 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
                  {t.contact_title}
                </h2>
                <p className="mt-3 text-pretty text-[14px] leading-relaxed text-ink-600 sm:text-[15px]">
                  {t.contact_subtitle}
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-2.5">
                  {[t.contact_bullet_1, t.contact_bullet_2, t.contact_bullet_3].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[13px] text-ink-800 sm:text-[14px]">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-success" strokeWidth={2.5} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-line bg-surface-muted p-4 shadow-xs sm:p-6">
                {status === "success" ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center sm:min-h-[320px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
                      <Check className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <p className="text-[14px] font-medium text-ink-800 sm:text-[15px]">
                      {t.form_success}
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactSubmit}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
                  >
                    {/* Honeypot — must stay empty */}
                    <input
                      type="checkbox"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
                    />

                    <Field
                      label={t.form_name}
                      placeholder={t.form_name_ph}
                      name="name"
                      required
                    />
                    <Field
                      label={t.form_email}
                      placeholder={t.form_email_ph}
                      name="email"
                      type="email"
                      required
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label={t.form_clinic}
                        placeholder={t.form_clinic_ph}
                        name="clinic"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="block text-[12px] font-medium text-ink-700">
                        {t.form_message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        placeholder={t.form_message_ph}
                        className="mt-1 w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-[14px] text-ink-900 placeholder:text-ink-400 shadow-xs transition focus:border-brand-500 focus:shadow-ring"
                      />
                    </div>

                    {status === "error" && (
                      <div
                        role="alert"
                        className="sm:col-span-2 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-[13px] text-danger"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-none" strokeWidth={2.2} />
                        <span>{t.form_error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="sm:col-span-2 mt-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-ink-900 text-[14px] font-semibold text-white shadow-pop transition hover:bg-ink-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                          {t.form_sending}
                        </>
                      ) : (
                        <>
                          {status === "error" ? t.form_retry : t.form_submit}
                          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="grid gap-6 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <BrandMark />
                <span className="text-[15px] font-semibold tracking-tightest text-ink-900">
                  docpilote
                </span>
              </div>
              <p className="mt-2 max-w-xs text-[12px] leading-snug text-ink-600 sm:text-[13px]">
                {t.footer_tag}
              </p>
            </div>
            <FooterCol
              title={t.footer_product}
              items={[
                { label: t.nav_features, href: "#features" },
                { label: t.see_demo, href: DEMO_URL },
                { label: t.nav_contact, href: "#contact" },
              ]}
            />
            <FooterCol
              title={t.footer_legal}
              items={[
                { label: t.footer_terms, href: "#" },
                { label: t.footer_privacy, href: "#" },
              ]}
            />
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line/70 pt-5 text-[11px] text-ink-500 sm:flex-row sm:items-center sm:text-[12px]">
            <div>© {new Date().getFullYear()} docpilote. {t.footer_copy}</div>
            <div>Alger · Oran · Constantine</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------- Sub-components ---------------------- */

function BrandMark() {
  return (
    <span
      aria-hidden
      className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 shadow-[0_6px_14px_-6px_rgba(0,113,227,0.7)]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4v16M4 12h16" />
      </svg>
    </span>
  );
}

function LocaleSwitch({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-white p-0.5 text-[11px] font-semibold">
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`h-7 rounded-md px-2 uppercase tracking-wide transition ${
            locale === l
              ? "bg-ink-900 text-white"
              : "text-ink-500 hover:text-ink-800"
          }`}
          aria-pressed={locale === l}
          aria-label={`Switch to ${l === "fr" ? "French" : "English"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function FeatureIcon({
  icon: Icon,
  tone,
}: {
  icon: typeof Users;
  tone: "brand" | "success" | "info" | "warning";
}) {
  const toneMap = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    success: "bg-success-soft text-success ring-success/20",
    info: "bg-info-soft text-info ring-info/20",
    warning: "bg-warning-soft text-warning ring-warning/20",
  } as const;
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset sm:h-10 sm:w-10 ${toneMap[tone]}`}
    >
      <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
    </div>
  );
}

function Field({
  label,
  placeholder,
  name,
  type = "text",
  required,
}: {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[12px] font-medium text-ink-700">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-400 shadow-xs transition focus:border-brand-500 focus:shadow-ring"
      />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2 text-center sm:px-4">
      <div className="text-[22px] font-semibold tracking-tightest text-ink-900 sm:text-[28px]">
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.06em] text-ink-500 sm:text-[11px]">
        {label}
      </div>
    </div>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-500">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-[13px] text-ink-700">
        {items.map((it) => (
          <li key={it.label}>
            <a href={it.href} className="transition hover:text-ink-900">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Avatar({ seed, large }: { seed: number; large?: boolean }) {
  const bg = ["bg-brand-500", "bg-success", "bg-warning", "bg-brand-700"][seed % 4];
  const initials = ["KH", "AB", "SL", "MR"][seed % 4];
  const size = large ? "h-8 w-8 text-[11px]" : "h-6 w-6 text-[9px]";
  return (
    <span
      aria-hidden
      className={`inline-flex ${size} items-center justify-center rounded-full ${bg} font-bold text-white ring-2 ring-white`}
    >
      {initials}
    </span>
  );
}

/* ---------------------- Product mockups ---------------------- */

function DashboardPreview({ t }: { t: Dict }) {
  return (
    <div className="relative rounded-2xl border border-line bg-white p-2.5 shadow-pop sm:rounded-3xl sm:p-3">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-1.5 pb-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" aria-hidden />
        <div className="ml-3 h-4 flex-1 truncate rounded-md bg-surface-muted px-2 text-[9px] leading-4 text-ink-500">
          app.docpilote.dz/dashboard
        </div>
      </div>

      {/* Body */}
      <div className="overflow-hidden rounded-xl bg-surface-muted p-2.5 sm:p-4">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
          <MiniKPI label={t.dash_kpi_patients} value="28" delta="+12%" positive />
          <MiniKPI label={t.dash_kpi_revenue} value="94 500" suffix="DA" delta="+8%" positive />
          <MiniKPI label={t.dash_kpi_rdv} value="14" delta="—" />
        </div>

        {/* Chart + list */}
        <div className="mt-2.5 grid gap-2 sm:mt-3.5 sm:gap-2.5 sm:grid-cols-[1.15fr_1fr]">
          {/* Chart card */}
          <div className="rounded-lg border border-line bg-white p-2.5 sm:p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-semibold text-ink-700 sm:text-[11px]">
                Consultations
              </div>
              <div className="text-[9px] text-ink-500 sm:text-[10px]">7j</div>
            </div>
            <MiniSparkline />
          </div>

          {/* Upcoming */}
          <div className="rounded-lg border border-line bg-white p-2.5 sm:p-3">
            <div className="mb-2 text-[10px] font-semibold text-ink-700 sm:text-[11px]">
              {t.dash_upcoming}
            </div>
            <ul className="space-y-1.5">
              {[
                { time: "09:00", name: "K. Hamdaoui", status: t.dash_confirmed, ok: true },
                { time: "10:30", name: "L. Belkacem", status: t.dash_waiting, ok: false },
                { time: "11:15", name: "R. Mansouri", status: t.dash_confirmed, ok: true },
              ].map((r) => (
                <li key={r.time} className="flex items-center gap-2">
                  <span className="tabular font-mono text-[9px] text-ink-500 sm:text-[10px]">
                    {r.time}
                  </span>
                  <span className="flex-1 truncate text-[10px] text-ink-800 sm:text-[11px]">
                    {r.name}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold sm:text-[9px] ${
                      r.ok
                        ? "bg-success-soft text-success"
                        : "bg-warning-soft text-warning"
                    }`}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniKPI({
  label,
  value,
  suffix,
  delta,
  positive,
}: {
  label: string;
  value: string;
  suffix?: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-2 sm:p-2.5">
      <div className="truncate text-[8.5px] uppercase tracking-[0.05em] text-ink-500 sm:text-[9.5px]">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-[15px] font-semibold tracking-tightest text-ink-900 sm:text-[18px]">
          {value}
        </span>
        {suffix && (
          <span className="text-[8.5px] font-medium text-ink-500 sm:text-[10px]">{suffix}</span>
        )}
      </div>
      <div
        className={`mt-0.5 text-[9px] font-medium sm:text-[10px] ${
          positive ? "text-success" : "text-ink-500"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}

function MiniSparkline() {
  const points = [8, 12, 10, 16, 14, 22, 20, 28, 26, 34, 30, 38];
  const max = Math.max(...points);
  const w = 100;
  const h = 42;
  const step = w / (points.length - 1);
  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - (p / max) * h * 0.9).toFixed(1)}`
    )
    .join(" ");
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full sm:h-12" aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0071e3" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark)" />
      <path
        d={path}
        fill="none"
        stroke="#0071e3"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PatientFilePreview({ locale }: { locale: Locale }) {
  const labels =
    locale === "fr"
      ? {
          patient: "Dossier patient",
          age: "42 ans · F",
          insurance: "CNAS",
          tension: "Tension",
          glycemie: "Glycémie",
          poids: "Poids",
          alert: "Interaction médicamenteuse détectée",
          treat: "Traitement en cours",
          next: "Prochain RDV",
          next_val: "15 juil. · 10:30",
          next_note: "Contrôle glycémie",
        }
      : {
          patient: "Patient file",
          age: "42 y · F",
          insurance: "CNAS",
          tension: "BP",
          glycemie: "Glucose",
          poids: "Weight",
          alert: "Drug interaction detected",
          treat: "Current treatment",
          next: "Next visit",
          next_val: "Jul 15 · 10:30",
          next_note: "Glucose check",
        };

  return (
    <div className="relative rounded-2xl border border-line bg-white p-3 shadow-pop sm:rounded-3xl sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-[13px] font-bold text-brand-700 ring-1 ring-brand-100">
          AB
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-[13px] font-semibold text-ink-900">Amina Belkacem</div>
          <div className="text-[10.5px] text-ink-500 sm:text-[11px]">
            {labels.age} · {labels.insurance}
          </div>
        </div>
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[9.5px] font-semibold text-success">
          {labels.insurance}
        </span>
      </div>

      {/* Vitals grid */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <VitalCard label={labels.tension} value="128/82" unit="mmHg" tone="ok" />
        <VitalCard label={labels.glycemie} value="1.42" unit="g/L" tone="warn" />
        <VitalCard label={labels.poids} value="68" unit="kg" tone="ok" />
      </div>

      {/* Alert */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft/70 p-2.5">
        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-warning text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 9v4M12 17h.01" />
          </svg>
        </span>
        <div className="text-[11px] leading-snug text-ink-800">
          <div className="font-semibold">{labels.alert}</div>
          <div className="text-ink-600">Metformine + Contraste iodé</div>
        </div>
      </div>

      {/* Treatment + next */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-line p-2.5">
          <div className="text-[9.5px] uppercase tracking-[0.06em] text-ink-500">
            {labels.treat}
          </div>
          <div className="mt-1 text-[11px] font-medium text-ink-800">
            Metformine 500 mg · 2×/j
          </div>
          <div className="text-[10.5px] text-ink-600">Amlodipine 5 mg · 1×/j</div>
        </div>
        <div className="rounded-lg border border-line p-2.5">
          <div className="text-[9.5px] uppercase tracking-[0.06em] text-ink-500">
            {labels.next}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-ink-800">{labels.next_val}</div>
          <div className="text-[10.5px] text-ink-600">{labels.next_note}</div>
        </div>
      </div>
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "ok" | "warn";
}) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted/60 p-2">
      <div className="text-[9px] uppercase tracking-[0.06em] text-ink-500">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span
          className={`text-[13px] font-semibold tabular ${
            tone === "warn" ? "text-warning" : "text-ink-900"
          }`}
        >
          {value}
        </span>
        <span className="text-[9px] text-ink-500">{unit}</span>
      </div>
    </div>
  );
}
