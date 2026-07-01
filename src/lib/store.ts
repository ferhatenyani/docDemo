"use client";

// -------------------------------------------------------------
// Data access layer + client-side store.
// All mutations go through here so the mock backend can be
// swapped for Supabase without touching the UI.
// -------------------------------------------------------------

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  actesNomenclature, certificats, cim10, clinique, consultations, depenses,
  examens, factures, medicaments, ordonnances, paiements, patients,
  relevesChroniques, rendezVous, stock, utilisateurs,
} from "./seed";
import type {
  ActeNomenclature, ArticleStock, Certificat, CIM10, Clinique,
  Consultation, Depense, Examen, Facture, MethodePaiement,
  Medicament, Ordonnance, Paiement, Patient, ReleveChronique,
  RendezVous, Role, Utilisateur,
} from "./types";

// ------------------------------------------------------------
// Locale + role + toast state
// ------------------------------------------------------------
export type Locale = "fr" | "ar";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone?: "default" | "success" | "danger" | "warning";
}

// ------------------------------------------------------------
// Store shape
// ------------------------------------------------------------
interface AppState {
  // preferences
  locale: Locale;
  role: Role;
  setLocale: (l: Locale) => void;
  setRole: (r: Role) => void;

  // ui
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // data
  clinique: Clinique;
  utilisateurs: Utilisateur[];
  patients: Patient[];
  rendezVous: RendezVous[];
  consultations: Consultation[];
  medicaments: Medicament[];
  ordonnances: Ordonnance[];
  examens: Examen[];
  certificats: Certificat[];
  actesNomenclature: ActeNomenclature[];
  factures: Facture[];
  paiements: Paiement[];
  depenses: Depense[];
  stock: ArticleStock[];
  relevesChroniques: ReleveChronique[];
  cim10: CIM10[];

  // mutations - patients
  addPatient: (p: Omit<Patient, "id" | "code" | "cree_le">) => Patient;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // mutations - rdv
  addRdv: (r: Omit<RendezVous, "id">) => RendezVous;
  updateRdv: (id: string, patch: Partial<RendezVous>) => void;
  deleteRdv: (id: string) => void;

  // mutations - consultations
  addConsultation: (c: Omit<Consultation, "id">) => Consultation;
  updateConsultation: (id: string, patch: Partial<Consultation>) => void;

  // mutations - ordonnances
  addOrdonnance: (o: Omit<Ordonnance, "id">) => Ordonnance;

  // mutations - examens
  addExamen: (e: Omit<Examen, "id">) => Examen;
  updateExamen: (id: string, patch: Partial<Examen>) => void;

  // mutations - certificats
  addCertificat: (c: Omit<Certificat, "id">) => Certificat;

  // mutations - factures / paiements
  addFacture: (f: Omit<Facture, "id" | "numero">) => Facture;
  updateFacture: (id: string, patch: Partial<Facture>) => void;
  addPaiement: (p: Omit<Paiement, "id">) => Paiement;

  // mutations - actes / stock / depenses / releves
  upsertActe: (a: ActeNomenclature) => void;
  deleteActe: (code: string) => void;

  addDepense: (d: Omit<Depense, "id">) => Depense;
  deleteDepense: (id: string) => void;

  addArticleStock: (a: Omit<ArticleStock, "id">) => ArticleStock;
  updateArticleStock: (id: string, patch: Partial<ArticleStock>) => void;
  deleteArticleStock: (id: string) => void;

  addReleveChronique: (r: Omit<ReleveChronique, "id">) => ReleveChronique;

  // mutations - utilisateurs / clinique
  addUtilisateur: (u: Omit<Utilisateur, "id" | "cree_le">) => Utilisateur;
  updateUtilisateur: (id: string, patch: Partial<Utilisateur>) => void;
  deleteUtilisateur: (id: string) => void;
  updateClinique: (patch: Partial<Clinique>) => void;

  reseed: () => void;
}

// ------------------------------------------------------------
// Utility - generate ids and numbers
// ------------------------------------------------------------
const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const nowDate = () => new Date().toISOString().slice(0, 10);

function nextPatientCode(existing: Patient[]): string {
  const nums = existing.map((p) => Number(p.code.replace(/[^\d]/g, "")) || 0);
  const n = Math.max(0, ...nums) + 1;
  return `DOS-${n.toString().padStart(4, "0")}`;
}

function nextFactureNumero(existing: Facture[]): string {
  const y = new Date().getFullYear();
  const nums = existing
    .filter((f) => f.numero.includes(`${y}`))
    .map((f) => Number(f.numero.split("-").pop()) || 0);
  const n = Math.max(0, ...nums) + 1;
  return `FA-${y}-${n.toString().padStart(4, "0")}`;
}

// ------------------------------------------------------------
// Initial state
// ------------------------------------------------------------
const initial = {
  locale: "fr" as Locale,
  role: "MEDECIN" as Role,
  toasts: [] as Toast[],
  clinique,
  utilisateurs,
  patients,
  rendezVous,
  consultations,
  medicaments,
  ordonnances,
  examens,
  certificats,
  actesNomenclature,
  factures,
  paiements,
  depenses,
  stock,
  relevesChroniques,
  cim10,
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initial,

      setLocale: (l) => set({ locale: l }),
      setRole: (r) => set({ role: r }),

      pushToast: (t) => {
        const id = uid("toast");
        set({ toasts: [...get().toasts, { id, ...t }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((x) => x.id !== id) });
        }, 3500);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      addPatient: (p) => {
        const created: Patient = { ...p, id: uid("p"), code: nextPatientCode(get().patients), cree_le: nowDate() };
        set({ patients: [created, ...get().patients] });
        return created;
      },
      updatePatient: (id, patch) => set({
        patients: get().patients.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }),
      deletePatient: (id) => set({ patients: get().patients.filter((p) => p.id !== id) }),

      addRdv: (r) => {
        const created: RendezVous = { ...r, id: uid("rdv") };
        set({ rendezVous: [...get().rendezVous, created] });
        return created;
      },
      updateRdv: (id, patch) => set({
        rendezVous: get().rendezVous.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      }),
      deleteRdv: (id) => set({ rendezVous: get().rendezVous.filter((r) => r.id !== id) }),

      addConsultation: (c) => {
        const created: Consultation = { ...c, id: uid("c") };
        set({ consultations: [created, ...get().consultations] });
        return created;
      },
      updateConsultation: (id, patch) => set({
        consultations: get().consultations.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }),

      addOrdonnance: (o) => {
        const created: Ordonnance = { ...o, id: uid("ord") };
        set({ ordonnances: [created, ...get().ordonnances] });
        return created;
      },

      addExamen: (e) => {
        const created: Examen = { ...e, id: uid("e") };
        set({ examens: [created, ...get().examens] });
        return created;
      },
      updateExamen: (id, patch) => set({
        examens: get().examens.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      }),

      addCertificat: (c) => {
        const created: Certificat = { ...c, id: uid("cert") };
        set({ certificats: [created, ...get().certificats] });
        return created;
      },

      addFacture: (f) => {
        const created: Facture = { ...f, id: uid("f"), numero: nextFactureNumero(get().factures) };
        set({ factures: [created, ...get().factures] });
        return created;
      },
      updateFacture: (id, patch) => set({
        factures: get().factures.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      }),
      addPaiement: (p) => {
        const created: Paiement = { ...p, id: uid("pay") };
        const facture = get().factures.find((f) => f.id === p.facture_id);
        if (facture) {
          const nouveauPaye = facture.paye_da + p.montant_da;
          const statut = nouveauPaye >= facture.total_da ? "PAYE" : "PARTIEL";
          get().updateFacture(facture.id, { paye_da: nouveauPaye, statut });
        }
        set({ paiements: [created, ...get().paiements] });
        return created;
      },

      upsertActe: (a) => {
        const arr = get().actesNomenclature;
        const exists = arr.some((x) => x.code === a.code);
        set({
          actesNomenclature: exists
            ? arr.map((x) => (x.code === a.code ? a : x))
            : [...arr, a],
        });
      },
      deleteActe: (code) => set({
        actesNomenclature: get().actesNomenclature.filter((a) => a.code !== code),
      }),

      addDepense: (d) => {
        const created: Depense = { ...d, id: uid("d") };
        set({ depenses: [created, ...get().depenses] });
        return created;
      },
      deleteDepense: (id) => set({ depenses: get().depenses.filter((d) => d.id !== id) }),

      addArticleStock: (a) => {
        const created: ArticleStock = { ...a, id: uid("s") };
        set({ stock: [created, ...get().stock] });
        return created;
      },
      updateArticleStock: (id, patch) => set({
        stock: get().stock.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      }),
      deleteArticleStock: (id) => set({ stock: get().stock.filter((s) => s.id !== id) }),

      addReleveChronique: (r) => {
        const created: ReleveChronique = { ...r, id: uid("rc") };
        set({ relevesChroniques: [created, ...get().relevesChroniques] });
        return created;
      },

      addUtilisateur: (u) => {
        const created: Utilisateur = { ...u, id: uid("u"), cree_le: nowDate() };
        set({ utilisateurs: [...get().utilisateurs, created] });
        return created;
      },
      updateUtilisateur: (id, patch) => set({
        utilisateurs: get().utilisateurs.map((u) => (u.id === id ? { ...u, ...patch } : u)),
      }),
      deleteUtilisateur: (id) => set({ utilisateurs: get().utilisateurs.filter((u) => u.id !== id) }),

      updateClinique: (patch) => set({ clinique: { ...get().clinique, ...patch } }),

      reseed: () => set({
        ...initial,
        locale: get().locale,
        role: get().role,
      }),
    }),
    {
      name: "gestion-medicale-store",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as any))),
      // don't persist toasts
      partialize: (state) => {
        const { toasts, ...rest } = state as any;
        return rest;
      },
      version: 1,
    },
  ),
);

// ------------------------------------------------------------
// Formatters (currency, dates)
// ------------------------------------------------------------
export function formatDA(v: number): string {
  return new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(Math.round(v || 0)) + " DA";
}

export function formatDate(d: string, locale: Locale = "fr"): string {
  try {
    const date = new Date(d.length <= 10 ? d + "T00:00:00" : d);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      year: "numeric", month: "long", day: "2-digit",
    }).format(date);
  } catch {
    return d;
  }
}

export function formatShort(d: string, locale: Locale = "fr"): string {
  try {
    const date = new Date(d.length <= 10 ? d + "T00:00:00" : d);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(date);
  } catch { return d; }
}

export function ageFromDob(dob: string): number {
  const d = new Date(dob);
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}
