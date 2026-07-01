"use client";

import { useMemo, useState } from "react";
import { Plus, Calculator, TrendingUp, TrendingDown, Save, Trash2 } from "lucide-react";
import { useApp, formatDA, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, Chip, EmptyState, StatCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { ChartCard, RefinedBarChart, ChartLegend } from "@/components/ui/Charts";
import type { CategorieDepense, MethodePaiement } from "@/lib/types";

const CAT_OPTS: { value: CategorieDepense; label: string }[] = [
  { value: "LOYER", label: "Loyer" },
  { value: "SALAIRES", label: "Salaires" },
  { value: "FOURNITURES", label: "Fournitures" },
  { value: "PHARMACIE", label: "Pharmacie" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "ELECTRICITE", label: "Électricité" },
  { value: "INTERNET", label: "Internet" },
  { value: "AUTRE", label: "Autre" },
];

export default function ComptabilitePage() {
  const { factures, depenses, addDepense, deleteDepense, pushToast } = useApp();

  const [open, setOpen] = useState(false);
  const [f, setF] = useState<{ date: string; categorie: CategorieDepense; libelle: string; montant_da: number; methode: MethodePaiement; fournisseur: string }>({
    date: new Date().toISOString().slice(0, 10),
    categorie: "AUTRE",
    libelle: "",
    montant_da: 0,
    methode: "ESPECES",
    fournisseur: "",
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const monthly = useMemo(() => {
    const arr: { label: string; key: string; recettes: number; depenses: number; net: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const key = `${year}-${String(i + 1).padStart(2, "0")}`;
      const label = new Date(year, i, 1).toLocaleDateString("fr-DZ", { month: "short" });
      const r = factures.filter((x) => x.date.startsWith(key)).reduce((s, x) => s + x.paye_da, 0);
      const d = depenses.filter((x) => x.date.startsWith(key)).reduce((s, x) => s + x.montant_da, 0);
      arr.push({ label, key, recettes: r, depenses: d, net: r - d });
    }
    return arr;
  }, [factures, depenses, year]);

  const yearTotal = {
    r: monthly.reduce((s, m) => s + m.recettes, 0),
    d: monthly.reduce((s, m) => s + m.depenses, 0),
  };
  const net = yearTotal.r - yearTotal.d;

  function save() {
    if (!f.libelle.trim() || !f.montant_da) { pushToast({ title: "Libellé et montant requis", tone: "warning" }); return; }
    addDepense({ date: f.date, categorie: f.categorie, libelle: f.libelle, montant_da: Number(f.montant_da), methode: f.methode, fournisseur: f.fournisseur || undefined });
    pushToast({ title: "Dépense ajoutée", tone: "success" });
    setOpen(false);
    setF({ date: new Date().toISOString().slice(0, 10), categorie: "AUTRE", libelle: "", montant_da: 0, methode: "ESPECES", fournisseur: "" });
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Finance"
        title="Comptabilité & dépenses"
        description="Suivi des recettes et dépenses en dinars algériens."
        actions={<Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setOpen(true)}>Nouvelle dépense</Button>}
      />

      <div className="flex flex-wrap gap-1.5">
        {[year - 1, year, year + 1].map((y) => (
          <Chip key={y} active={y === year} onClick={() => setYear(y)}>{y}</Chip>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard
          label={`Recettes ${year}`}
          value={formatDA(yearTotal.r)}
          icon={<TrendingUp className="h-4 w-4" />}
          sublabel="Total encaissé"
        />
        <StatCard
          label={`Dépenses ${year}`}
          value={formatDA(yearTotal.d)}
          icon={<TrendingDown className="h-4 w-4" />}
          sublabel="Charges cumulées"
        />
        <StatCard
          label={`Résultat ${year}`}
          value={formatDA(net)}
          icon={<Calculator className="h-4 w-4" />}
          delta={net >= 0 ? "Bénéfice" : "Perte"}
          deltaTone={net >= 0 ? "success" : "danger"}
        />
      </div>

      <ChartCard
        title="Bilan mensuel"
        subtitle={`Recettes vs dépenses ${year}`}
        actions={<ChartLegend items={[{ name: "Recettes", color: "#0071e3" }, { name: "Dépenses", color: "#c67c00" }]} />}
        height={320}
      >
        <RefinedBarChart
          data={monthly}
          xKey="label"
          bars={[
            { key: "recettes", name: "Recettes", color: "#0071e3" },
            { key: "depenses", name: "Dépenses", color: "#c67c00" },
          ]}
          yFormatter={(v) => `${Math.round(v / 1000)}k`}
          tooltipFormatter={(v) => formatDA(v)}
          height={290}
        />
      </ChartCard>

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="px-4 py-3 border-b border-line">
          <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">Toutes les dépenses</div>
        </div>
        {depenses.length === 0 ? (
          <EmptyState icon={<Calculator className="h-5 w-5" />} title="Aucune dépense" action={<Button variant="dark" onClick={() => setOpen(true)}>Ajouter</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-muted border-b border-line eyebrow">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Date</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Catégorie</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Libellé</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Fournisseur</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Méthode</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Montant</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...depenses].sort((a, b) => b.date.localeCompare(a.date)).map((d) => (
                  <tr key={d.id} className="hover:bg-ink-50/60 transition-colors">
                    <td className="px-4 py-2.5 text-ink-700">{formatDate(d.date)}</td>
                    <td className="px-4 py-2.5"><Badge tone="neutral" size="sm">{d.categorie}</Badge></td>
                    <td className="px-4 py-2.5 text-ink-800">{d.libelle}</td>
                    <td className="px-4 py-2.5 text-ink-600">{d.fournisseur ?? "—"}</td>
                    <td className="px-4 py-2.5 text-ink-600">{d.methode}</td>
                    <td className="px-4 py-2.5 text-right tabular font-medium text-warning">-{formatDA(d.montant_da)}</td>
                    <td className="px-1 py-2.5">
                      <button
                        aria-label="Supprimer"
                        onClick={() => { deleteDepense(d.id); pushToast({ title: "Dépense supprimée", tone: "danger" }); }}
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-danger-soft text-ink-400 hover:text-danger cursor-pointer transition-colors"
                      ><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nouvelle dépense"
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="dark" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={save}>Enregistrer</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Date"><DatePicker value={f.date} onChange={(d) => setF({ ...f, date: d })} /></Field>
          <Field label="Catégorie"><Select value={f.categorie} onChange={(v) => setF({ ...f, categorie: v as CategorieDepense })} options={CAT_OPTS} /></Field>
          <Field label="Libellé" required className="sm:col-span-2"><Input value={f.libelle} onChange={(e) => setF({ ...f, libelle: e.target.value })} /></Field>
          <Field label="Montant (DA)" required><Input inputMode="numeric" value={String(f.montant_da)} onChange={(e) => setF({ ...f, montant_da: Number(e.target.value || 0) })} /></Field>
          <Field label="Méthode"><Select value={f.methode} onChange={(v) => setF({ ...f, methode: v as MethodePaiement })} options={[{ value: "ESPECES", label: "Espèces" }, { value: "CHEQUE", label: "Chèque" }, { value: "CARTE", label: "Carte" }, { value: "VIREMENT", label: "Virement" }]} /></Field>
          <Field label="Fournisseur" className="sm:col-span-2"><Input value={f.fournisseur} onChange={(e) => setF({ ...f, fournisseur: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
