"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Plus, Save, Trash2, Pencil } from "lucide-react";
import { useApp, formatDA } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import type { ActeNomenclature } from "@/lib/types";

export default function NomenclaturePage() {
  const { actesNomenclature, upsertActe, deleteActe, pushToast } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ActeNomenclature | null>(null);
  const [f, setF] = useState<ActeNomenclature>({ code: "", libelle: "", categorie: "Consultation", prix_da: 0 });

  function openNew() { setEditing(null); setF({ code: "", libelle: "", categorie: "Consultation", prix_da: 0 }); setOpen(true); }
  function openEdit(a: ActeNomenclature) { setEditing(a); setF(a); setOpen(true); }
  function save() {
    if (!f.code.trim() || !f.libelle.trim()) { pushToast({ title: "Code et libellé requis", tone: "warning" }); return; }
    upsertActe(f);
    pushToast({ title: editing ? "Acte mis à jour" : "Acte ajouté", tone: "success" });
    setOpen(false);
  }

  const grouped = actesNomenclature.reduce<Record<string, ActeNomenclature[]>>((acc, a) => {
    (acc[a.categorie] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Link href="/facturation" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer">
        <ChevronLeft className="h-4 w-4" /> Facturation
      </Link>
      <SectionHeader
        title="Nomenclature des actes"
        description="Gérez les codes, libellés et tarifs des actes."
        actions={<Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={openNew}>Nouvel acte</Button>}
      />

      {actesNomenclature.length === 0 ? (
        <Card padding="md"><EmptyState title="Aucun acte défini" action={<Button variant="primary" onClick={openNew}>Ajouter</Button>} /></Card>
      ) : (
        <div className="grid gap-3">
          {Object.entries(grouped).map(([cat, list]) => (
            <Card key={cat} padding="md">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[13px] font-semibold text-ink-800">{cat}</div>
                <Badge tone="neutral" size="sm">{list.length}</Badge>
              </div>
              <div className="divide-y divide-line">
                {list.map((a) => (
                  <div key={a.code} className="py-2 flex items-center gap-3">
                    <div className="tabular text-[12px] text-ink-500 w-20 shrink-0">{a.code}</div>
                    <div className="flex-1 min-w-0 text-[13px] text-ink-800 truncate">{a.libelle}</div>
                    <div className="text-[13px] font-semibold text-ink-900 tabular w-24 text-right">{formatDA(a.prix_da)}</div>
                    <div className="flex items-center gap-1">
                      <button aria-label="Modifier" onClick={() => openEdit(a)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-ink-100 cursor-pointer text-ink-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button aria-label="Supprimer" onClick={() => { deleteActe(a.code); pushToast({ title: "Acte supprimé", tone: "danger" }); }} className="h-8 w-8 grid place-items-center rounded-full hover:bg-red-50 cursor-pointer text-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier l'acte" : "Nouvel acte"}
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="primary" onClick={save} leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Code" required>
            <Input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} disabled={!!editing} />
          </Field>
          <Field label="Catégorie">
            <Input value={f.categorie} onChange={(e) => setF({ ...f, categorie: e.target.value })} />
          </Field>
          <Field label="Libellé" required className="sm:col-span-2">
            <Input value={f.libelle} onChange={(e) => setF({ ...f, libelle: e.target.value })} />
          </Field>
          <Field label="Prix (DA)" required>
            <Input inputMode="numeric" value={String(f.prix_da)} onChange={(e) => setF({ ...f, prix_da: Number(e.target.value || 0) })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
