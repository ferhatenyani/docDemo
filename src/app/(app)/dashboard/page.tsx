"use client";

import Link from "next/link";
import {
  Users, CalendarClock, Wallet, AlertTriangle, TrendingUp, ArrowUpRight,
  Stethoscope, PillBottle, FileBadge, HeartPulse, PackageOpen, Receipt,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
import { useApp, formatDA, ageFromDob } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Badge, EmptyState, Avatar, StatCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { ChartCard, RefinedAreaChart, RefinedBarChart, Sparkline, ChartLegend, chartTooltipStyle } from "@/components/ui/Charts";

function todayIso() { return new Date().toISOString().slice(0, 10); }
function monthKey(iso: string) { return iso.slice(0, 7); }

export default function DashboardPage() {
  const t = useT();
  const {
    patients, rendezVous, consultations, factures, depenses, stock,
    utilisateurs,
  } = useApp();
  const locale = t.locale;
  const dateLocale = locale === "ar" ? "ar-DZ" : "fr-DZ";

  const today = todayIso();
  const nowMonth = monthKey(today);

  const rdvToday = rendezVous.filter((r) => r.date === today);
  const upcoming = rendezVous
    .filter((r) => r.date >= today && r.statut !== "ANNULE" && r.statut !== "TERMINE")
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));

  const recettesJour = factures.filter((f) => f.date === today).reduce((s, f) => s + f.paye_da, 0);
  const impayees = factures.filter((f) => f.statut === "IMPAYE" || f.statut === "PARTIEL");
  const totalImpaye = impayees.reduce((s, f) => s + (f.total_da - f.paye_da), 0);
  const recettesMois = factures.filter((f) => f.date.startsWith(nowMonth)).reduce((s, f) => s + f.paye_da, 0);
  const depensesMois = depenses.filter((d) => d.date.startsWith(nowMonth)).reduce((s, d) => s + d.montant_da, 0);
  const net = recettesMois - depensesMois;

  const lowStock = stock.filter((s) => s.quantite <= s.seuil_alerte);

  const months: { key: string; label: string; recettes: number; depenses: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString(dateLocale, { month: "short" });
    months.push({
      key, label,
      recettes: factures.filter((f) => f.date.startsWith(key)).reduce((s, f) => s + f.paye_da, 0),
      depenses: depenses.filter((x) => x.date.startsWith(key)).reduce((s, x) => s + x.montant_da, 0),
    });
  }

  const cSeries: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cSeries.push({
      day: d.toLocaleDateString(dateLocale, { day: "2-digit", month: "2-digit" }),
      count: consultations.filter((c) => c.date.startsWith(iso)).length
        + rendezVous.filter((r) => r.date === iso && r.statut === "TERMINE").length,
    });
  }

  const revSpark: { v: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    revSpark.push({ v: factures.filter((f) => f.date === iso).reduce((s, f) => s + f.paye_da, 0) });
  }
  const rdvSpark: { v: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    rdvSpark.push({ v: rendezVous.filter((r) => r.date === iso).length });
  }
  const patientSpark: { v: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    patientSpark.push({ v: Math.round(patients.length * (0.85 + Math.random() * 0.15)) });
  }

  const demog = [
    { label: "0-17", value: 0 }, { label: "18-40", value: 0 },
    { label: "41-60", value: 0 }, { label: "60+", value: 0 },
  ];
  patients.forEach((p) => {
    const a = ageFromDob(p.date_naissance);
    if (a < 18) demog[0].value++;
    else if (a <= 40) demog[1].value++;
    else if (a <= 60) demog[2].value++;
    else demog[3].value++;
  });
  const PIE_COLORS = ["#0071e3", "#2a6df1", "#5a8ffa", "#93b6fd"];

  const quickActions = [
    { href: "/patients/nouveau", label: t("new_patient"), icon: Users },
    { href: "/rendez-vous?new=1", label: t("new_rdv"), icon: CalendarClock },
    { href: "/consultations/nouveau", label: t("new_consultation"), icon: Stethoscope },
    { href: "/ordonnances/nouveau", label: t("new_ordonnance"), icon: PillBottle },
    { href: "/certificats/nouveau", label: t("new_certificate"), icon: FileBadge },
    { href: "/facturation/nouveau", label: t("new_invoice"), icon: Receipt },
  ];

  const nowLbl = new Intl.DateTimeFormat(dateLocale, { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  // Doctor greeting name — pull from utilisateurs, fallback to demo name
  const me = utilisateurs.find((u) => u.id === "u1");
  const doctorLastName = me?.nom ?? "Belkacem";

  const statutLabel = (s: string) =>
    s === "PAYE" ? t("status_paid")
    : s === "PARTIEL" ? t("status_partial")
    : s === "IMPAYE" ? t("status_unpaid")
    : t("status_cancelled");

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={<span className="capitalize">{nowLbl}</span>}
        title={`${t("greeting_doctor")} ${doctorLastName}`}
        description={t("dashboard_overview")}
        actions={
          <>
            <Link href="/rendez-vous/salle-attente"><Button variant="secondary">{t("waiting_room")}</Button></Link>
            <Link href="/rendez-vous"><Button variant="dark" leftIcon={<CalendarClock className="h-3.5 w-3.5" />}>{t("agenda")}</Button></Link>
          </>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <Link href="/patients">
          <StatCard
            label={t("patients_active")}
            value={patients.length}
            icon={<Users className="h-4 w-4" />}
            sublabel={`${rdvToday.length} ${t("expected_today")}`}
            sparkline={<Sparkline data={patientSpark} color="#0071e3" />}
          />
        </Link>
        <Link href="/rendez-vous">
          <StatCard
            label={t("rdv_upcoming")}
            value={upcoming.length}
            icon={<CalendarClock className="h-4 w-4" />}
            delta={`+2 ${t("rdv_this_week")}`}
            deltaTone="success"
            sparkline={<Sparkline data={rdvSpark} color="#2a6df1" />}
          />
        </Link>
        <Link href="/caisse">
          <StatCard
            label={t("revenue_today")}
            value={formatDA(recettesJour)}
            icon={<Wallet className="h-4 w-4" />}
            sublabel={t("last_7_days")}
            sparkline={<Sparkline data={revSpark} color="#0f9d58" />}
          />
        </Link>
        <Link href="/facturation?statut=IMPAYE">
          <StatCard
            label={t("outstanding")}
            value={formatDA(totalImpaye)}
            icon={<AlertTriangle className="h-4 w-4" />}
            sublabel={`${impayees.length} ${t("invoices_count")}`}
            delta={impayees.length > 0 ? t("invoices_to_collect") : t("all_ok")}
            deltaTone={impayees.length > 0 ? "danger" : "success"}
          />
        </Link>
        <Link href="/comptabilite">
          <StatCard
            label={t("revenue_month")}
            value={formatDA(recettesMois)}
            icon={<TrendingUp className="h-4 w-4" />}
            sublabel={new Date().toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}
          />
        </Link>
        <Link href="/comptabilite">
          <StatCard
            label={t("net_result")}
            value={formatDA(net)}
            icon={<TrendingUp className="h-4 w-4" />}
            delta={net >= 0 ? t("benefit") : t("loss")}
            deltaTone={net >= 0 ? "success" : "danger"}
          />
        </Link>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
          <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">{t("quick_actions")}</div>
          <div className="text-[11px] text-ink-500 hidden sm:block">{t("keyboard_shortcuts_soon")}</div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-line">
          {quickActions.map((q, i) => (
            <Link
              key={q.href}
              href={q.href}
              className={`group flex items-center gap-2.5 px-3 sm:px-4 py-3 hover:bg-brand-50 transition-colors cursor-pointer ${i >= 3 ? "sm:border-t-0" : ""}`}
            >
              <div className="h-8 w-8 rounded-md border border-line bg-surface-muted text-ink-500 grid place-items-center group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors shrink-0">
                <q.icon className="h-3.5 w-3.5" />
              </div>
              <div className="text-[12px] font-medium text-ink-800 group-hover:text-brand-700 truncate min-w-0">{q.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ChartCard
          className="lg:col-span-2"
          title={t("revenue_vs_expenses")}
          subtitle={t("last_6_months")}
          height={260}
          actions={<ChartLegend items={[{ name: t("revenue_series"), color: "#0071e3" }, { name: t("expenses_series"), color: "#c67c00" }]} />}
        >
          <RefinedAreaChart
            data={months}
            xKey="label"
            areas={[
              { key: "recettes", name: t("revenue_series"), color: "#0071e3" },
              { key: "depenses", name: t("expenses_series"), color: "#c67c00" },
            ]}
            yFormatter={(v) => `${Math.round(v / 1000)}k`}
            tooltipFormatter={(v) => formatDA(v)}
            height={230}
          />
        </ChartCard>

        <ChartCard title={t("demographics")} subtitle={t("age_range")} height={260}>
          <div className="grid grid-cols-[1fr_140px] h-full items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demog}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={2}
                  cornerRadius={2}
                >
                  {demog.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 py-1">
              {demog.map((d, i) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-[11px] text-ink-500 tabular">{d.label}</span>
                  <span className="ms-auto text-[12px] font-semibold text-ink-900 tabular">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard title={t("consultations_done")} subtitle={t("last_14_days")} height={220}>
        <RefinedBarChart
          data={cSeries}
          xKey="day"
          bars={[{ key: "count", name: t("consultations_title"), color: "#0071e3" }]}
          tooltipFormatter={(v) => `${v} ${t("consultations_title").toLowerCase()}`}
          height={190}
        />
      </ChartCard>

      {/* Data cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp truncate">{t("upcoming_rdv")}</div>
            <Link href="/rendez-vous" className="text-[12px] text-brand-700 hover:text-brand-800 font-medium cursor-pointer shrink-0">{t("view_all")}</Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon={<CalendarClock className="h-5 w-5" />} title={t("no_rdv")} description={t("free_day")} />
          ) : (
            <div className="divide-y divide-line">
              {upcoming.slice(0, 6).map((r) => {
                const p = patients.find((x) => x.id === r.patient_id);
                if (!p) return null;
                return (
                  <Link
                    key={r.id}
                    href={`/patients/${p.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 shrink-0 text-center">
                      <div className="text-[12px] font-semibold tabular text-ink-900">{r.heure}</div>
                    </div>
                    <Avatar name={`${p.prenom} ${p.nom}`} size={30} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                      <div className="text-[11px] text-ink-500 truncate">{r.motif}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-ink-500">{new Date(r.date + "T00:00:00").toLocaleDateString(dateLocale, { day: "2-digit", month: "short" })}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp truncate">{t("stock_alerts")}</div>
            <Link href="/stock" className="text-[12px] text-brand-700 hover:text-brand-800 font-medium cursor-pointer shrink-0">{t("see_stock")}</Link>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState icon={<PackageOpen className="h-5 w-5" />} title={t("all_in_order")} description={t("no_low_stock")} />
          ) : (
            <div className="divide-y divide-line">
              {lowStock.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="h-8 w-8 rounded-md bg-warning-soft text-warning grid place-items-center shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-900 truncate">{s.nom}</div>
                    <div className="text-[11px] text-ink-500">{t("threshold")}: {s.seuil_alerte} {s.unite}</div>
                  </div>
                  <Badge tone={s.quantite === 0 ? "danger" : "warning"} size="sm" dot>
                    {s.quantite} {s.unite}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp truncate">{t("chronic_patients")}</div>
            <Link href="/chroniques" className="text-[12px] text-brand-700 hover:text-brand-800 font-medium cursor-pointer shrink-0">{t("chronic_followup")}</Link>
          </div>
          <div className="divide-y divide-line">
            {patients.filter((p) => p.chronique_diabete || p.chronique_hta).slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/chroniques/${p.id}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 cursor-pointer transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-danger-soft text-danger grid place-items-center shrink-0">
                  <HeartPulse className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                  <div className="text-[11px] text-ink-500 flex items-center gap-1.5 flex-wrap">
                    {p.chronique_diabete && <Badge tone="warning" size="sm">{t("diabete")}</Badge>}
                    {p.chronique_hta && <Badge tone="danger" size="sm">{t("hta")}</Badge>}
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-ink-300 shrink-0 dir-icon" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp truncate">{t("recent_invoices")}</div>
            <Link href="/facturation" className="text-[12px] text-brand-700 hover:text-brand-800 font-medium cursor-pointer shrink-0">{t("view_all")}</Link>
          </div>
          <div className="divide-y divide-line">
            {factures.slice(0, 5).map((f) => {
              const p = patients.find((x) => x.id === f.patient_id);
              return (
                <Link
                  key={f.id}
                  href={`/facturation/${f.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 cursor-pointer transition-colors"
                >
                  <div className="h-8 w-8 rounded-md bg-brand-50 text-brand-700 grid place-items-center shrink-0">
                    <Receipt className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-900 truncate tabular">{f.numero}</div>
                    <div className="text-[11px] text-ink-500 truncate">{p ? `${p.prenom} ${p.nom}` : "—"}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-semibold text-ink-900 tabular">{formatDA(f.total_da)}</div>
                    <Badge
                      size="sm"
                      dot
                      tone={f.statut === "PAYE" ? "success" : f.statut === "PARTIEL" ? "warning" : f.statut === "IMPAYE" ? "danger" : "neutral"}
                    >
                      {statutLabel(f.statut)}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
