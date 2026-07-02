"use client";

import { useState } from "react";
import { Plus, Save, Trash2, Pencil, User2, Settings2, Database } from "lucide-react";
import { useApp, formatDate } from "@/lib/store";
import { SectionHeader, Card, Badge, EmptyState, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Tabs } from "@/components/ui/Tabs";
import type { Role, Utilisateur } from "@/lib/types";
import { useT } from "@/lib/i18n";

export default function AdministrationPage() {
  const t = useT();
  const {
    utilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur,
    clinique, updateClinique, reseed, pushToast,
  } = useApp();

  const ROLE_OPTS: { value: Role; label: string }[] = [
    { value: "MEDECIN", label: t("role_medecin") },
    { value: "SECRETAIRE", label: t("role_secretaire") },
    { value: "ADMIN", label: t("role_admin") },
  ];

  const [tab, setTab] = useState("utilisateurs");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Utilisateur | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [f, setF] = useState<Omit<Utilisateur, "id" | "cree_le">>({
    nom: "", prenom: "", email: "", role: "MEDECIN", specialite: "", telephone: "", actif: true,
  });

  const [clin, setClin] = useState(clinique);

  function openNew() {
    setEditing(null);
    setF({ nom: "", prenom: "", email: "", role: "MEDECIN", specialite: "", telephone: "", actif: true });
    setOpen(true);
  }
  function openEdit(u: Utilisateur) {
    setEditing(u);
    setF({ nom: u.nom, prenom: u.prenom, email: u.email, role: u.role, specialite: u.specialite, telephone: u.telephone, actif: u.actif });
    setOpen(true);
  }
  function save() {
    if (!f.nom.trim() || !f.prenom.trim() || !f.email.trim()) { pushToast({ title: t("required_fields"), tone: "warning" }); return; }
    if (editing) { updateUtilisateur(editing.id, f); pushToast({ title: t("user_updated"), tone: "success" }); }
    else { addUtilisateur(f); pushToast({ title: t("user_added"), tone: "success" }); }
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={t("configuration")}
        title={t("administration_title")}
        description={t("administration_desc")}
      />

      <Tabs
        tabs={[
          { key: "utilisateurs", label: t("admin_users") },
          { key: "cabinet", label: t("admin_cabinet") },
          { key: "systeme", label: t("admin_system") },
        ]}
        active={tab}
        onChange={setTab}
        variant="underline"
      />

      {tab === "utilisateurs" && (
        <>
          <div className="flex justify-end">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openNew}>{t("new_user")}</Button>
          </div>
          {utilisateurs.length === 0 ? (
            <Card padding="md"><EmptyState icon={<User2 className="h-5 w-5" />} title={t("no_users")} /></Card>
          ) : (
            <div className="bg-white rounded-lg border border-line shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="bg-surface-muted border-b border-line eyebrow">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("user")}</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("role")}</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("email")}</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("phone")}</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("status")}</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">{t("created")}</th>
                      <th className="w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {utilisateurs.map((u) => (
                      <tr key={u.id} className="hover:bg-ink-50/60 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar name={`${u.prenom} ${u.nom}`} size={30} />
                            <div className="min-w-0">
                              <div className="font-medium text-ink-900 truncate">{u.prenom} {u.nom}</div>
                              {u.specialite && <div className="text-[11px] text-ink-500 truncate">{u.specialite}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge tone={u.role === "MEDECIN" ? "brand" : u.role === "ADMIN" ? "danger" : "info"} size="sm">
                            {u.role === "MEDECIN" ? t("role_medecin") : u.role === "SECRETAIRE" ? t("role_secretaire") : t("role_admin_short")}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-ink-700">{u.email}</td>
                        <td className="px-4 py-2.5 tabular text-ink-700">{u.telephone ?? "—"}</td>
                        <td className="px-4 py-2.5">
                          <Badge tone={u.actif ? "success" : "neutral"} size="sm" dot>{u.actif ? t("active") : t("inactive")}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-ink-500">{formatDate(u.cree_le)}</td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-0.5 justify-end">
                            <button aria-label={t("edit")} onClick={() => openEdit(u)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-500 hover:text-ink-800 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button aria-label={t("delete")} onClick={() => setConfirmId(u.id)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-danger-soft cursor-pointer text-ink-500 hover:text-danger transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "cabinet" && (
        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">{t("cabinet_info")}</div>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-3">
            <Field label={t("raison_sociale")} className="sm:col-span-2">
              <Input value={clin.raison_sociale} onChange={(e) => setClin({ ...clin, raison_sociale: e.target.value })} />
            </Field>
            <Field label={t("wilaya")}><Input value={clin.wilaya} onChange={(e) => setClin({ ...clin, wilaya: e.target.value })} /></Field>
            <Field label={t("commune")}><Input value={clin.commune} onChange={(e) => setClin({ ...clin, commune: e.target.value })} /></Field>
            <Field label={t("address")} className="sm:col-span-2"><Input value={clin.adresse} onChange={(e) => setClin({ ...clin, adresse: e.target.value })} /></Field>
            <Field label={t("phone")}><Input value={clin.telephone} onChange={(e) => setClin({ ...clin, telephone: e.target.value })} /></Field>
            <Field label={t("email")}><Input value={clin.email} onChange={(e) => setClin({ ...clin, email: e.target.value })} /></Field>
            <Field label={t("nif")}><Input value={clin.nif ?? ""} onChange={(e) => setClin({ ...clin, nif: e.target.value })} /></Field>
            <Field label={t("rc")}><Input value={clin.rc ?? ""} onChange={(e) => setClin({ ...clin, rc: e.target.value })} /></Field>
            <Field label={t("ai")}><Input value={clin.ai ?? ""} onChange={(e) => setClin({ ...clin, ai: e.target.value })} /></Field>
          </div>
          <div className="px-4 py-3 border-t border-line flex justify-end bg-surface-muted">
            <Button variant="dark" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={() => { updateClinique(clin); pushToast({ title: t("cabinet_updated"), tone: "success" }); }}>
              {t("save")}
            </Button>
          </div>
        </div>
      )}

      {tab === "systeme" && (
        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">{t("system")}</div>
          </div>
          <div className="p-4">
            <div className="text-[13px] text-ink-600 mb-4 max-w-2xl leading-relaxed">
              {t("system_desc")}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" leftIcon={<Database className="h-3.5 w-3.5" />} onClick={() => { reseed(); pushToast({ title: t("reset_done_title"), description: t("reset_done_desc"), tone: "success" }); }}>
                {t("reset_demo")}
              </Button>
              <Button variant="ghost" leftIcon={<Settings2 className="h-3.5 w-3.5" />} onClick={() => pushToast({ title: t("soon_available"), description: t("advanced_config") })}>
                {t("advanced_settings")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("edit_user") : t("new_user")}
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button><Button variant="dark" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={save}>{t("save")}</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={t("last_name")} required><Input value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} /></Field>
          <Field label={t("first_name")} required><Input value={f.prenom} onChange={(e) => setF({ ...f, prenom: e.target.value })} /></Field>
          <Field label={t("email")} required className="sm:col-span-2"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field label={t("role")}><Select value={f.role} onChange={(v) => setF({ ...f, role: v as Role })} options={ROLE_OPTS} /></Field>
          <Field label={t("status")}><Select value={f.actif ? "1" : "0"} onChange={(v) => setF({ ...f, actif: v === "1" })} options={[{ value: "1", label: t("active") }, { value: "0", label: t("inactive") }]} /></Field>
          <Field label={t("phone")}><Input value={f.telephone ?? ""} onChange={(e) => setF({ ...f, telephone: e.target.value })} /></Field>
          <Field label={t("specialite")}><Input value={f.specialite ?? ""} onChange={(e) => setF({ ...f, specialite: e.target.value })} /></Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        title={t("delete_user")}
        description={t("confirm_delete_desc")}
        destructive
        confirmLabel={t("delete")}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) { deleteUtilisateur(confirmId); pushToast({ title: t("user_deleted"), tone: "danger" }); }
          setConfirmId(null);
        }}
      />
    </div>
  );
}
