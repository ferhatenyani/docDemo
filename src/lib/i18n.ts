"use client";

import type { Locale } from "./store";

// -------------------------------------------------------------
// Lightweight i18n dictionary. Primary FR, secondary AR.
// Any missing key falls back to French.
// -------------------------------------------------------------

type Dict = Record<string, string>;

const fr: Dict = {
  app_name: "Ibn Sina",
  app_tagline: "Gestion médicale",
  search: "Rechercher…",

  nav_dashboard: "Tableau de bord",
  nav_patients: "Patients",
  nav_rdv: "Rendez-vous",
  nav_consultations: "Consultations",
  nav_ordonnances: "Ordonnances",
  nav_examens: "Examens",
  nav_certificats: "Certificats",
  nav_facturation: "Facturation",
  nav_caisse: "Caisse",
  nav_stock: "Pharmacie",
  nav_chroniques: "Maladies chroniques",
  nav_comptabilite: "Comptabilité",
  nav_administration: "Administration",

  today: "Aujourd'hui",
  waiting_room: "Salle d'attente",
  new: "Nouveau",
  add: "Ajouter",
  save: "Enregistrer",
  cancel: "Annuler",
  close: "Fermer",
  delete: "Supprimer",
  edit: "Modifier",
  confirm: "Confirmer",
  yes: "Oui",
  no: "Non",
  print: "Imprimer",
  export: "Exporter",
  back: "Retour",
  view: "Voir",
  actions: "Actions",
  status: "Statut",
  date: "Date",
  time: "Heure",
  amount: "Montant",
  total: "Total",
  paid: "Payé",
  unpaid: "Impayé",
  partial: "Partiel",
  cancelled: "Annulé",
  loading: "Chargement…",
  no_results: "Aucun résultat",

  role_medecin: "Médecin",
  role_secretaire: "Secrétaire",
  role_admin: "Administrateur",

  kpi_today_patients: "Patients du jour",
  kpi_upcoming_rdv: "RDV à venir",
  kpi_today_revenue: "Recettes du jour",
  kpi_unpaid: "Factures impayées",
  kpi_month_revenue: "Recettes du mois",
  kpi_net_month: "Net du mois",
};

const ar: Dict = {
  app_name: "ابن سينا",
  app_tagline: "الإدارة الطبية",
  search: "بحث…",

  nav_dashboard: "لوحة القيادة",
  nav_patients: "المرضى",
  nav_rdv: "المواعيد",
  nav_consultations: "الاستشارات",
  nav_ordonnances: "الوصفات",
  nav_examens: "الفحوصات",
  nav_certificats: "الشهادات",
  nav_facturation: "الفوترة",
  nav_caisse: "الصندوق",
  nav_stock: "الصيدلية",
  nav_chroniques: "الأمراض المزمنة",
  nav_comptabilite: "المحاسبة",
  nav_administration: "الإدارة",

  today: "اليوم",
  waiting_room: "غرفة الانتظار",
  new: "جديد",
  add: "إضافة",
  save: "حفظ",
  cancel: "إلغاء",
  close: "إغلاق",
  delete: "حذف",
  edit: "تعديل",
  confirm: "تأكيد",
  yes: "نعم",
  no: "لا",
  print: "طباعة",
  export: "تصدير",
  back: "رجوع",
  view: "عرض",
  actions: "إجراءات",
  status: "الحالة",
  date: "التاريخ",
  time: "الوقت",
  amount: "المبلغ",
  total: "المجموع",
  paid: "مدفوع",
  unpaid: "غير مدفوع",
  partial: "جزئي",
  cancelled: "ملغى",
  loading: "جاري التحميل…",
  no_results: "لا توجد نتائج",

  role_medecin: "طبيب",
  role_secretaire: "سكرتير",
  role_admin: "مسؤول",

  kpi_today_patients: "مرضى اليوم",
  kpi_upcoming_rdv: "المواعيد القادمة",
  kpi_today_revenue: "إيرادات اليوم",
  kpi_unpaid: "فواتير غير مدفوعة",
  kpi_month_revenue: "إيرادات الشهر",
  kpi_net_month: "صافي الشهر",
};

export const dicts: Record<Locale, Dict> = { fr, ar };

export function t(locale: Locale, key: string): string {
  return dicts[locale]?.[key] ?? fr[key] ?? key;
}
