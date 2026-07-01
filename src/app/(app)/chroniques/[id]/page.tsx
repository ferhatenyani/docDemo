"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, HeartPulse, Plus, Save } from "lucide-react";
import { useApp, formatDate, ageFromDob } from "@/lib/store";
import { Card, Badge, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { ChartCard, chartAxisTick, chartGridStroke, chartTooltipStyle } from "@/components/ui/Charts";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";

export default function ChroniqueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { patients, relevesChroniques, addReleveChronique, pushToast } = useApp();
  const p = patients.find((x) => x.id === id);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    date: new Date().toISOString().slice(0, 10),
    glycemie: "" as any, tension_sys: "" as any, tension_dia: "" as any,
    poids_kg: "" as any, notes: "",
  });

  if (!p) {
    return (
      <Card padding="md">
        <EmptyState icon={<HeartPulse className="h-5 w-5" />} title="Patient introuvable" action={<Link href="/chroniques"><Button variant="dark">Retour</Button></Link>} />
      </Card>
    );
  }

  const releves = relevesChroniques
    .filter((r) => r.patient_id === p.id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({
      ...r,
      label: new Date(r.date + "T00:00:00").toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" }),
    }));

  function submit() {
    if (!p) return;
    if (!f.date) { pushToast({ title: "Date requise", tone: "warning" }); return; }
    const taille = p.chronique_hta || p.chronique_diabete ? 170 : undefined;
    const poids = Number(f.poids_kg || 0);
    const imc = poids && taille ? poids / Math.pow(taille / 100, 2) : undefined;
    addReleveChronique({
      patient_id: p.id, date: f.date,
      glycemie: f.glycemie ? Number(f.glycemie) : undefined,
      tension_sys: f.tension_sys ? Number(f.tension_sys) : undefined,
      tension_dia: f.tension_dia ? Number(f.tension_dia) : undefined,
      poids_kg: poids || undefined,
      imc,
      notes: f.notes || undefined,
    });
    pushToast({ title: "Relevé ajouté", tone: "success" });
    setOpen(false);
    setF({ date: new Date().toISOString().slice(0, 10), glycemie: "", tension_sys: "", tension_dia: "", poids_kg: "", notes: "" });
  }

  return (
    <div className="space-y-5">
      <Link href="/chroniques" className="inline-flex items-center gap-1 text-[12px] text-ink-500 hover:text-ink-800 cursor-pointer transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Suivi chronique
      </Link>

      <Card padding="md">
        <div className="flex items-center gap-3">
          <Avatar name={`${p.prenom} ${p.nom}`} size={52} />
          <div className="flex-1 min-w-0">
            <div className="text-[17px] font-semibold text-ink-900 truncate tracking-tightest">{p.prenom} {p.nom}</div>
            <div className="text-[12px] text-ink-500">{ageFromDob(p.date_naissance)} ans · {p.telephone}</div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {p.chronique_diabete && <Badge tone="warning" size="sm" dot>Diabète</Badge>}
              {p.chronique_hta && <Badge tone="danger" size="sm" dot>HTA</Badge>}
            </div>
          </div>
          <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setOpen(true)}>Nouveau relevé</Button>
        </div>
      </Card>

      {releves.length === 0 ? (
        <Card padding="md"><EmptyState icon={<HeartPulse className="h-5 w-5" />} title="Aucun relevé" description="Ajoutez le premier relevé de suivi." action={<Button variant="dark" onClick={() => setOpen(true)}>Ajouter</Button>} /></Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            <ChartCard title="Tension artérielle" subtitle="mmHg — cible: ≤140/90" height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={releves} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="label" tick={chartAxisTick} tickLine={false} axisLine={false} dy={4} />
                  <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} width={30} domain={[60, 180]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <ReferenceLine y={140} stroke="#dc2626" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <ReferenceLine y={90} stroke="#dc2626" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Line type="monotone" dataKey="tension_sys" stroke="#0071e3" strokeWidth={2} dot={{ r: 2.5 }} name="Systolique" />
                  <Line type="monotone" dataKey="tension_dia" stroke="#5a8ffa" strokeWidth={2} dot={{ r: 2.5 }} name="Diastolique" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Glycémie" subtitle="g/L — cible: ≤1.26" height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={releves} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="label" tick={chartAxisTick} tickLine={false} axisLine={false} dy={4} />
                  <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} width={30} domain={[0.6, 3]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <ReferenceLine y={1.26} stroke="#c67c00" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Line type="monotone" dataKey="glycemie" stroke="#0f9d58" strokeWidth={2} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="IMC & Poids" subtitle="Suivi pondéral" height={240} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={releves} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="label" tick={chartAxisTick} tickLine={false} axisLine={false} dy={4} />
                  <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="poids_kg" stroke="#0071e3" strokeWidth={2} dot={{ r: 2.5 }} name="Poids (kg)" />
                  <Line type="monotone" dataKey="imc" stroke="#c67c00" strokeWidth={2} dot={{ r: 2.5 }} name="IMC" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="bg-white rounded-lg border border-line shadow-xs">
            <div className="px-4 py-3 border-b border-line">
              <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">Historique des relevés</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-muted border-b border-line eyebrow">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Date</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">TA</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Glycémie</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Poids</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-ink-500">IMC</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {[...releves].reverse().map((r) => (
                    <tr key={r.id} className="hover:bg-ink-50/60">
                      <td className="px-4 py-2.5 text-ink-700">{formatDate(r.date)}</td>
                      <td className="px-4 py-2.5 text-right tabular">{r.tension_sys ? `${r.tension_sys}/${r.tension_dia}` : "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular">{r.glycemie ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular">{r.poids_kg ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular">{r.imc ? r.imc.toFixed(1) : "—"}</td>
                      <td className="px-4 py-2.5 text-ink-600 truncate max-w-[300px]">{r.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nouveau relevé de suivi"
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="dark" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={submit}>Enregistrer</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Date" required className="sm:col-span-2"><DatePicker value={f.date} onChange={(d) => setF({ ...f, date: d })} /></Field>
          <Field label="Tension systolique"><Input inputMode="numeric" value={String(f.tension_sys)} onChange={(e) => setF({ ...f, tension_sys: e.target.value })} /></Field>
          <Field label="Tension diastolique"><Input inputMode="numeric" value={String(f.tension_dia)} onChange={(e) => setF({ ...f, tension_dia: e.target.value })} /></Field>
          <Field label="Glycémie (g/L)"><Input inputMode="decimal" value={String(f.glycemie)} onChange={(e) => setF({ ...f, glycemie: e.target.value })} /></Field>
          <Field label="Poids (kg)"><Input inputMode="decimal" value={String(f.poids_kg)} onChange={(e) => setF({ ...f, poids_kg: e.target.value })} /></Field>
          <Field label="Notes" className="sm:col-span-2"><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={2} /></Field>
        </div>
      </Modal>
    </div>
  );
}
