"use client";

import { useMemo, useState } from "react";
import { Plus, PackageOpen, Search, AlertTriangle, Pencil, Trash2, Save } from "lucide-react";
import { useApp, formatDA, formatDate } from "@/lib/store";
import { SectionHeader, Badge, Chip, EmptyState, StatCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import type { ArticleStock } from "@/lib/types";

const CAT_OPTS = [
  { value: "MEDICAMENT", label: "Médicament" },
  { value: "CONSOMMABLE", label: "Consommable" },
  { value: "MATERIEL", label: "Matériel" },
];

export default function StockPage() {
  const { stock, addArticleStock, updateArticleStock, deleteArticleStock, pushToast } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"Tous" | "Alerte" | "Périmés">("Tous");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleStock | null>(null);
  const [f, setF] = useState<Omit<ArticleStock, "id">>({
    nom: "", categorie: "MEDICAMENT", quantite: 0, unite: "unité", seuil_alerte: 0, prix_unitaire_da: 0, date_peremption: undefined, emplacement: "",
  });

  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => {
    return stock.filter((s) => {
      const q1 = !q.trim() || `${s.nom} ${s.emplacement ?? ""}`.toLowerCase().includes(q.toLowerCase());
      const f1 = filter === "Tous"
        || (filter === "Alerte" && s.quantite <= s.seuil_alerte)
        || (filter === "Périmés" && s.date_peremption && s.date_peremption <= today);
      return q1 && f1;
    });
  }, [stock, q, filter, today]);

  function openNew() {
    setEditing(null);
    setF({ nom: "", categorie: "MEDICAMENT", quantite: 0, unite: "unité", seuil_alerte: 0, prix_unitaire_da: 0, date_peremption: undefined, emplacement: "" });
    setOpen(true);
  }
  function openEdit(a: ArticleStock) {
    setEditing(a);
    setF({ ...a });
    setOpen(true);
  }
  function save() {
    if (!f.nom.trim()) { pushToast({ title: "Nom requis", tone: "warning" }); return; }
    if (editing) { updateArticleStock(editing.id, f); pushToast({ title: "Article mis à jour", tone: "success" }); }
    else { addArticleStock(f); pushToast({ title: "Article ajouté", tone: "success" }); }
    setOpen(false);
  }

  const enAlerte = stock.filter((s) => s.quantite <= s.seuil_alerte);
  const perimes = stock.filter((s) => s.date_peremption && s.date_peremption <= today);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Pharmacie interne"
        title="Stock"
        description={`${stock.length} articles suivis`}
        actions={<Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openNew}>Nouvel article</Button>}
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Articles totaux" value={stock.length} icon={<PackageOpen className="h-4 w-4" />} />
        <StatCard label="En alerte" value={enAlerte.length} icon={<AlertTriangle className="h-4 w-4" />} deltaTone={enAlerte.length > 0 ? "danger" : "success"} delta={enAlerte.length > 0 ? "Réapprovisionner" : "OK"} />
        <StatCard label="Périmés" value={perimes.length} deltaTone={perimes.length > 0 ? "danger" : "success"} delta={perimes.length > 0 ? "À retirer" : "OK"} />
      </div>

      <div className="bg-white rounded-lg border border-line shadow-xs">
        <div className="p-3 flex flex-col lg:flex-row gap-3 lg:items-center border-b border-line">
          <Input className="flex-1 lg:max-w-md" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un article…" leftIcon={<Search className="h-3.5 w-3.5" />} />
          <div className="flex flex-wrap gap-1.5">
            {(["Tous", "Alerte", "Périmés"] as const).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<PackageOpen className="h-5 w-5" />} title="Aucun article" action={<Button variant="dark" onClick={openNew}>Ajouter</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-muted border-b border-line eyebrow">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Article</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Catégorie</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Quantité</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Seuil</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-ink-500">Prix</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Péremption</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((s) => {
                  const alert = s.quantite <= s.seuil_alerte;
                  const expired = s.date_peremption && s.date_peremption <= today;
                  return (
                    <tr key={s.id} className="hover:bg-ink-50/60 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-ink-900 flex items-center gap-1.5">
                          {alert && <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />}
                          {s.nom}
                        </div>
                        {s.emplacement && <div className="text-[11px] text-ink-500">{s.emplacement}</div>}
                      </td>
                      <td className="px-4 py-2.5"><Badge tone="neutral" size="sm">{s.categorie}</Badge></td>
                      <td className={"px-4 py-2.5 text-right tabular font-medium " + (alert ? "text-warning" : "text-ink-800")}>{s.quantite} <span className="text-ink-400 font-normal">{s.unite}</span></td>
                      <td className="px-4 py-2.5 text-right tabular text-ink-500">{s.seuil_alerte}</td>
                      <td className="px-4 py-2.5 text-right tabular text-ink-700">{s.prix_unitaire_da ? formatDA(s.prix_unitaire_da) : "—"}</td>
                      <td className={"px-4 py-2.5 " + (expired ? "text-danger font-medium" : "text-ink-700")}>
                        {s.date_peremption ? formatDate(s.date_peremption) : "—"}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-0.5 justify-end">
                          <button onClick={() => openEdit(s)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-500 hover:text-ink-800 transition-colors" aria-label="Modifier">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => { deleteArticleStock(s.id); pushToast({ title: "Article supprimé", tone: "danger" }); }} className="h-7 w-7 grid place-items-center rounded-md hover:bg-danger-soft cursor-pointer text-ink-500 hover:text-danger transition-colors" aria-label="Supprimer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier l'article" : "Nouvel article"}
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="dark" onClick={save} leftIcon={<Save className="h-3.5 w-3.5" />}>Enregistrer</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nom" required className="sm:col-span-2">
            <Input value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} />
          </Field>
          <Field label="Catégorie">
            <Select value={f.categorie} onChange={(v) => setF({ ...f, categorie: v as any })} options={CAT_OPTS} />
          </Field>
          <Field label="Unité">
            <Input value={f.unite} onChange={(e) => setF({ ...f, unite: e.target.value })} placeholder="boîte, unité…" />
          </Field>
          <Field label="Quantité">
            <Input inputMode="numeric" value={String(f.quantite)} onChange={(e) => setF({ ...f, quantite: Number(e.target.value || 0) })} />
          </Field>
          <Field label="Seuil d'alerte">
            <Input inputMode="numeric" value={String(f.seuil_alerte)} onChange={(e) => setF({ ...f, seuil_alerte: Number(e.target.value || 0) })} />
          </Field>
          <Field label="Prix unitaire (DA)">
            <Input inputMode="numeric" value={String(f.prix_unitaire_da ?? 0)} onChange={(e) => setF({ ...f, prix_unitaire_da: Number(e.target.value || 0) })} />
          </Field>
          <Field label="Date de péremption">
            <DatePicker value={f.date_peremption ?? ""} onChange={(d) => setF({ ...f, date_peremption: d })} />
          </Field>
          <Field label="Emplacement" className="sm:col-span-2">
            <Input value={f.emplacement ?? ""} onChange={(e) => setF({ ...f, emplacement: e.target.value })} placeholder="Ex: Armoire A2" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
