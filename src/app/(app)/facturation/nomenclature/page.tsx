"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Plus, Save, Trash2, Pencil } from "lucide-react";
import { useApp, formatDA } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SectionHeader, Card, Badge, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import type { ActeNomenclature } from "@/lib/types";

export default function NomenclaturePage() {
  const t = useT();
  const { actesNomenclature, upsertActe, deleteActe, pushToast } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ActeNomenclature | null>(null);
  const [f, setF] = useState<ActeNomenclature>({ code: "", libelle: "", categorie: "Consultation", prix_da: 0 });

  function openNew() { setEditing(null); setF({ code: "", libelle: "", categorie: "Consultation", prix_da: 0 }); setOpen(true); }
  function openEdit(a: ActeNomenclature) { setEditing(a); setF(a); setOpen(true); }
  function save() {
    if (!f.code.trim() || !f.libelle.trim()) { pushToast({ title: t("code_libelle_required"), tone: "warning" }); return; }
    upsertActe(f);
    pushToast({ title: editing ? t("acte_updated") : t("acte_added"), tone: "success" });
    setOpen(false);
  }

  const grouped = actesNomenclature.reduce<Record<string, ActeNomenclature[]>>((acc, a) => {
    (acc[a.categorie] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Link href="/facturation" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-800 cursor-pointer min-w-0">
        <ChevronLeft className="h-4 w-4 dir-icon shrink-0" /> {t("facturation_title")}
      </Link>
      <SectionHeader
        title={t("nomenclature_of_actes")}
        description={t("nomenclature_manage_desc")}
        actions={<Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={openNew}>{t("new_acte")}</Button>}
      />

      {actesNomenclature.length === 0 ? (
        <Card padding="md"><EmptyState title={t("no_acte_defined")} action={<Button variant="primary" onClick={openNew}>{t("add")}</Button>} /></Card>
      ) : (
        <div className="grid gap-3">
          {Object.entries(grouped).map(([cat, list]) => (
            <Card key={cat} padding="sm" className="sm:p-4">
              <div className="flex items-center gap-2 mb-2 px-1 sm:px-0">
                <div className="text-[13px] font-semibold text-ink-800 min-w-0 truncate">{cat}</div>
                <Badge tone="neutral" size="sm">{list.length}</Badge>
              </div>
              <div className="divide-y divide-line">
                {list.map((a) => (
                  <div key={a.code} className="py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="tabular text-[11px] sm:text-[12px] text-ink-500 shrink-0 sm:w-20">{a.code}</div>
                      <div className="min-w-0 text-[13px] text-ink-800 truncate flex-1">{a.libelle}</div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
                      <div className="text-[13px] font-semibold text-ink-900 tabular whitespace-nowrap sm:w-24 sm:text-right">{formatDA(a.prix_da)}</div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button aria-label={t("edit")} onClick={() => openEdit(a)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-ink-100 cursor-pointer text-ink-600">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button aria-label={t("delete")} onClick={() => { deleteActe(a.code); pushToast({ title: t("acte_deleted"), tone: "danger" }); }} className="h-8 w-8 grid place-items-center rounded-full hover:bg-red-50 cursor-pointer text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
        title={editing ? t("edit_acte") : t("new_acte")}
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button><Button variant="primary" onClick={save} leftIcon={<Save className="h-4 w-4" />}>{t("save")}</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("acte_code")} required>
            <Input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} disabled={!!editing} />
          </Field>
          <Field label={t("category")}>
            <Input value={f.categorie} onChange={(e) => setF({ ...f, categorie: e.target.value })} />
          </Field>
          <Field label={t("acte_libelle")} required className="sm:col-span-2">
            <Input value={f.libelle} onChange={(e) => setF({ ...f, libelle: e.target.value })} />
          </Field>
          <Field label={`${t("price")} (DA)`} required>
            <Input inputMode="numeric" value={String(f.prix_da)} onChange={(e) => setF({ ...f, prix_da: Number(e.target.value || 0) })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
