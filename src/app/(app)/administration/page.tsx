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

const ROLE_OPTS: { value: Role; label: string }[] = [
  { value: "MEDECIN", label: "Médecin" },
  { value: "SECRETAIRE", label: "Assistante" },
  { value: "ADMIN", label: "Administrateur" },
];

export default function AdministrationPage() {
  const {
    utilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur,
    clinique, updateClinique, reseed, pushToast,
  } = useApp();

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
    if (!f.nom.trim() || !f.prenom.trim() || !f.email.trim()) { pushToast({ title: "Champs requis", tone: "warning" }); return; }
    if (editing) { updateUtilisateur(editing.id, f); pushToast({ title: "Utilisateur mis à jour", tone: "success" }); }
    else { addUtilisateur(f); pushToast({ title: "Utilisateur ajouté", tone: "success" }); }
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Configuration"
        title="Administration"
        description="Gestion des utilisateurs, du cabinet et des paramètres."
      />

      <Tabs
        tabs={[
          { key: "utilisateurs", label: "Utilisateurs" },
          { key: "cabinet", label: "Cabinet" },
          { key: "systeme", label: "Système" },
        ]}
        active={tab}
        onChange={setTab}
        variant="underline"
      />

      {tab === "utilisateurs" && (
        <>
          <div className="flex justify-end">
            <Button variant="dark" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openNew}>Nouvel utilisateur</Button>
          </div>
          {utilisateurs.length === 0 ? (
            <Card padding="md"><EmptyState icon={<User2 className="h-5 w-5" />} title="Aucun utilisateur" /></Card>
          ) : (
            <div className="bg-white rounded-lg border border-line shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="bg-surface-muted border-b border-line eyebrow">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Utilisateur</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Rôle</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Email</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Téléphone</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Statut</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-500">Créé</th>
                      <th className="w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {utilisateurs.map((u) => (
                      <tr key={u.id} className="hover:bg-ink-50/60 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={`${u.prenom} ${u.nom}`} size={30} />
                            <div>
                              <div className="font-medium text-ink-900">{u.prenom} {u.nom}</div>
                              {u.specialite && <div className="text-[11px] text-ink-500">{u.specialite}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge tone={u.role === "MEDECIN" ? "brand" : u.role === "ADMIN" ? "danger" : "info"} size="sm">
                            {u.role === "MEDECIN" ? "Médecin" : u.role === "SECRETAIRE" ? "Assistante" : "Admin"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-ink-700">{u.email}</td>
                        <td className="px-4 py-2.5 tabular text-ink-700">{u.telephone ?? "—"}</td>
                        <td className="px-4 py-2.5">
                          <Badge tone={u.actif ? "success" : "neutral"} size="sm" dot>{u.actif ? "Actif" : "Inactif"}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-ink-500">{formatDate(u.cree_le)}</td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-0.5 justify-end">
                            <button aria-label="Modifier" onClick={() => openEdit(u)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-500 hover:text-ink-800 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button aria-label="Supprimer" onClick={() => setConfirmId(u.id)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-danger-soft cursor-pointer text-ink-500 hover:text-danger transition-colors">
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
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">Informations du cabinet</div>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-3">
            <Field label="Raison sociale" className="sm:col-span-2">
              <Input value={clin.raison_sociale} onChange={(e) => setClin({ ...clin, raison_sociale: e.target.value })} />
            </Field>
            <Field label="Wilaya"><Input value={clin.wilaya} onChange={(e) => setClin({ ...clin, wilaya: e.target.value })} /></Field>
            <Field label="Commune"><Input value={clin.commune} onChange={(e) => setClin({ ...clin, commune: e.target.value })} /></Field>
            <Field label="Adresse" className="sm:col-span-2"><Input value={clin.adresse} onChange={(e) => setClin({ ...clin, adresse: e.target.value })} /></Field>
            <Field label="Téléphone"><Input value={clin.telephone} onChange={(e) => setClin({ ...clin, telephone: e.target.value })} /></Field>
            <Field label="Email"><Input value={clin.email} onChange={(e) => setClin({ ...clin, email: e.target.value })} /></Field>
            <Field label="NIF"><Input value={clin.nif ?? ""} onChange={(e) => setClin({ ...clin, nif: e.target.value })} /></Field>
            <Field label="RC"><Input value={clin.rc ?? ""} onChange={(e) => setClin({ ...clin, rc: e.target.value })} /></Field>
            <Field label="AI"><Input value={clin.ai ?? ""} onChange={(e) => setClin({ ...clin, ai: e.target.value })} /></Field>
          </div>
          <div className="px-4 py-3 border-t border-line flex justify-end bg-surface-muted">
            <Button variant="dark" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={() => { updateClinique(clin); pushToast({ title: "Cabinet mis à jour", tone: "success" }); }}>
              Enregistrer
            </Button>
          </div>
        </div>
      )}

      {tab === "systeme" && (
        <div className="bg-white rounded-lg border border-line shadow-xs">
          <div className="px-4 py-3 border-b border-line">
            <div className="text-[13px] font-semibold text-ink-800 tracking-crisp">Système</div>
          </div>
          <div className="p-4">
            <div className="text-[13px] text-ink-600 mb-4 max-w-2xl leading-relaxed">
              L'application stocke les données localement dans votre navigateur (mock backend). La couche
              de données est prête à être remplacée par Supabase — tous les accès passent par une couche typée unique.
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" leftIcon={<Database className="h-3.5 w-3.5" />} onClick={() => { reseed(); pushToast({ title: "Données réinitialisées", description: "Le jeu de démonstration a été rechargé.", tone: "success" }); }}>
                Réinitialiser les données de démo
              </Button>
              <Button variant="ghost" leftIcon={<Settings2 className="h-3.5 w-3.5" />} onClick={() => pushToast({ title: "Bientôt disponible", description: "Configuration avancée à venir." })}>
                Paramètres avancés
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
        size="md"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button variant="dark" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={save}>Enregistrer</Button></>}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nom" required><Input value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} /></Field>
          <Field label="Prénom" required><Input value={f.prenom} onChange={(e) => setF({ ...f, prenom: e.target.value })} /></Field>
          <Field label="Email" required className="sm:col-span-2"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field label="Rôle"><Select value={f.role} onChange={(v) => setF({ ...f, role: v as Role })} options={ROLE_OPTS} /></Field>
          <Field label="Statut"><Select value={f.actif ? "1" : "0"} onChange={(v) => setF({ ...f, actif: v === "1" })} options={[{ value: "1", label: "Actif" }, { value: "0", label: "Inactif" }]} /></Field>
          <Field label="Téléphone"><Input value={f.telephone ?? ""} onChange={(e) => setF({ ...f, telephone: e.target.value })} /></Field>
          <Field label="Spécialité"><Input value={f.specialite ?? ""} onChange={(e) => setF({ ...f, specialite: e.target.value })} /></Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        title="Supprimer l'utilisateur"
        description="Cette action est irréversible."
        destructive
        confirmLabel="Supprimer"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) { deleteUtilisateur(confirmId); pushToast({ title: "Utilisateur supprimé", tone: "danger" }); }
          setConfirmId(null);
        }}
      />
    </div>
  );
}
