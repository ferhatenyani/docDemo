"use client";

import type { Role } from "./types";

export interface Permissions {
  canSeeAccounting: boolean;
  canManageUsers: boolean;
  canSeeAdministration: boolean;
  canWriteMedicalRecords: boolean;
  canManageCaisseAndStock: boolean;
  isAssistant: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
}

export function permissionsFor(role: Role): Permissions {
  const isAdmin = role === "ADMIN";
  const isDoctor = role === "MEDECIN";
  const isAssistant = role === "SECRETAIRE";
  return {
    isAdmin,
    isDoctor,
    isAssistant,
    canSeeAccounting: isAdmin,
    canManageUsers: isAdmin,
    canSeeAdministration: isAdmin,
    canWriteMedicalRecords: isAdmin || isDoctor,
    canManageCaisseAndStock: isAdmin || isAssistant,
  };
}

export function landingPathForRole(role: Role): string {
  return role === "SECRETAIRE" ? "/rendez-vous/salle-attente" : "/dashboard";
}

const RESTRICTED_PATHS: Record<Role, string[]> = {
  ADMIN: [],
  MEDECIN: ["/comptabilite", "/administration"],
  SECRETAIRE: [
    "/comptabilite",
    "/administration",
    "/consultations",
    "/ordonnances",
    "/certificats",
    "/chroniques",
  ],
};

export function isPathAllowed(role: Role, pathname: string): boolean {
  const blocked = RESTRICTED_PATHS[role] ?? [];
  return !blocked.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export const ALLOWED_NAV_KEYS: Record<Role, ReadonlySet<string>> = {
  ADMIN: new Set([
    "nav_dashboard", "nav_patients", "nav_rdv",
    "nav_consultations", "nav_ordonnances", "nav_examens", "nav_certificats", "nav_chroniques",
    "nav_facturation", "nav_caisse", "nav_stock", "nav_comptabilite", "nav_administration",
  ]),
  MEDECIN: new Set([
    "nav_dashboard", "nav_patients", "nav_rdv",
    "nav_consultations", "nav_ordonnances", "nav_examens", "nav_certificats", "nav_chroniques",
    "nav_facturation", "nav_caisse", "nav_stock",
  ]),
  SECRETAIRE: new Set([
    "nav_dashboard", "nav_patients", "nav_rdv",
    "nav_examens",
    "nav_facturation", "nav_caisse", "nav_stock",
  ]),
};
