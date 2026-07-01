// -------------------------------------------------------------
// Realistic Algerian sample data — used by the mock data layer.
// Kept in one place so it can be moved to Supabase seed later.
// -------------------------------------------------------------

import type {
  ActeNomenclature,
  ArticleStock,
  CIM10,
  Certificat,
  Clinique,
  Consultation,
  Depense,
  Examen,
  Facture,
  Medicament,
  Ordonnance,
  Paiement,
  Patient,
  ReleveChronique,
  RendezVous,
  Utilisateur,
} from "./types";

export const WILAYAS = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Batna",
  "Tizi Ouzou", "Béjaïa", "Tlemcen", "Skikda", "Djelfa", "Biskra",
  "Ouargla", "Ghardaïa", "Tiaret", "Chlef", "Mostaganem", "Médéa", "Boumerdès",
];

export const clinique: Clinique = {
  id: "clinic-001",
  raison_sociale: "Cabinet Médical Ibn Sina",
  adresse: "12 Rue Didouche Mourad",
  wilaya: "Alger",
  commune: "Alger Centre",
  telephone: "021 63 45 12",
  email: "contact@cabinet-ibnsina.dz",
  nif: "099816010074521",
  rc: "16/00-0234567 B 22",
  ai: "16548921",
};

export const utilisateurs: Utilisateur[] = [
  { id: "u1", nom: "Belkacem", prenom: "Amine", email: "a.belkacem@ibnsina.dz", role: "MEDECIN", specialite: "Médecine générale", telephone: "0555 12 34 56", actif: true, cree_le: "2024-01-15" },
  { id: "u2", nom: "Haddad", prenom: "Yasmine", email: "y.haddad@ibnsina.dz", role: "MEDECIN", specialite: "Cardiologie", telephone: "0555 22 45 67", actif: true, cree_le: "2024-01-15" },
  { id: "u3", nom: "Merabet", prenom: "Souad", email: "s.merabet@ibnsina.dz", role: "SECRETAIRE", telephone: "0555 33 56 78", actif: true, cree_le: "2024-02-10" },
  { id: "u4", nom: "Kaddour", prenom: "Rachid", email: "r.kaddour@ibnsina.dz", role: "ADMIN", telephone: "0555 44 67 89", actif: true, cree_le: "2024-01-10" },
];

const ALLERGIES = ["Pénicilline", "Aspirine", "Iode", "Sulfamides", "Latex", "Fruits de mer", "Arachides"];
const ANTECEDENTS = [
  "Appendicectomie 2015",
  "Fracture tibia 2019",
  "Cholécystectomie 2020",
  "Césarienne 2018",
  "Amygdalectomie enfance",
];

function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
function nowIso(offsetMinutes = 0) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toISOString().slice(0, 16);
}

export const patients: Patient[] = [
  {
    id: "p1", code: "DOS-0001", nom: "Benaissa", prenom: "Karim", sexe: "M", date_naissance: "1978-04-12",
    groupe_sanguin: "O+", telephone: "0555 10 22 33", email: "k.benaissa@gmail.com",
    wilaya: "Alger", commune: "Bab El Oued", adresse: "24 Rue des Frères Bouadou",
    numero_securite_sociale: "780412061234567", numero_chifa: "CH-0000123456",
    type_assurance: "CNAS",
    antecedents: ["Appendicectomie 2015"],
    allergies: ["Pénicilline"],
    maladies_chroniques: ["HTA", "Diabète type 2"],
    traitements_en_cours: ["Metformine 850 mg 2x/j", "Amlodipine 5 mg 1x/j"],
    chronique_diabete: true, chronique_hta: true,
    cree_le: "2024-02-01", notes: "Suivi tous les 3 mois",
  },
  {
    id: "p2", code: "DOS-0002", nom: "Cherif", prenom: "Nadia", sexe: "F", date_naissance: "1992-11-03",
    groupe_sanguin: "A+", telephone: "0555 20 33 44", email: "n.cherif@outlook.com",
    wilaya: "Alger", commune: "Hydra", adresse: "5 Rue des Frères Djebbari",
    numero_securite_sociale: "921103061098765", numero_chifa: "CH-0000234567",
    type_assurance: "ASSURE",
    antecedents: ["Césarienne 2018"], allergies: [], maladies_chroniques: [],
    traitements_en_cours: [],
    cree_le: "2024-03-10",
  },
  {
    id: "p3", code: "DOS-0003", nom: "Zerrouki", prenom: "Ahmed", sexe: "M", date_naissance: "1965-06-25",
    groupe_sanguin: "B+", telephone: "0555 30 44 55",
    wilaya: "Blida", commune: "Blida", adresse: "8 Cité Ben Boulaid",
    numero_securite_sociale: "650625061554321", numero_chifa: "CH-0000345678",
    type_assurance: "CASNOS",
    antecedents: ["Infarctus 2020"],
    allergies: ["Aspirine"],
    maladies_chroniques: ["HTA", "Cardiopathie", "Dyslipidémie"],
    traitements_en_cours: ["Bisoprolol 5 mg", "Atorvastatine 20 mg", "Clopidogrel 75 mg"],
    chronique_hta: true,
    cree_le: "2024-01-20",
  },
  {
    id: "p4", code: "DOS-0004", nom: "Ouali", prenom: "Sabrina", sexe: "F", date_naissance: "1985-09-14",
    groupe_sanguin: "AB+", telephone: "0555 40 55 66", email: "s.ouali@yahoo.fr",
    wilaya: "Oran", commune: "Oran", adresse: "17 Rue Larbi Ben M'Hidi",
    type_assurance: "AYANT_DROIT",
    antecedents: [], allergies: ["Latex"], maladies_chroniques: ["Hypothyroïdie"],
    traitements_en_cours: ["Levothyrox 50 µg"],
    cree_le: "2024-04-05",
  },
  {
    id: "p5", code: "DOS-0005", nom: "Boumediene", prenom: "Salim", sexe: "M", date_naissance: "2001-02-18",
    groupe_sanguin: "O-", telephone: "0555 50 66 77",
    wilaya: "Alger", commune: "Kouba", adresse: "3 Rue Hassiba Ben Bouali",
    type_assurance: "AYANT_DROIT",
    antecedents: ["Amygdalectomie enfance"], allergies: [], maladies_chroniques: ["Asthme"],
    traitements_en_cours: ["Ventoline si besoin"],
    cree_le: "2024-05-11",
  },
  {
    id: "p6", code: "DOS-0006", nom: "Meziane", prenom: "Fatima", sexe: "F", date_naissance: "1959-12-30",
    groupe_sanguin: "A-", telephone: "0555 60 77 88",
    wilaya: "Tizi Ouzou", commune: "Tizi Ouzou", adresse: "Village Beni Yenni",
    numero_securite_sociale: "591230061112233", numero_chifa: "CH-0000456789",
    type_assurance: "CNAS",
    antecedents: ["Fracture col fémur 2022"], allergies: [], maladies_chroniques: ["HTA", "Diabète type 2"],
    traitements_en_cours: ["Insuline lente", "Losartan 50 mg"],
    chronique_diabete: true, chronique_hta: true,
    cree_le: "2024-01-30",
  },
  {
    id: "p7", code: "DOS-0007", nom: "Kaci", prenom: "Yacine", sexe: "M", date_naissance: "1990-07-07",
    telephone: "0555 70 88 99", email: "yacine.kaci@gmail.com",
    wilaya: "Béjaïa", commune: "Béjaïa", adresse: "Cité Ihaddaden",
    type_assurance: "ASSURE",
    antecedents: [], allergies: ["Fruits de mer"], maladies_chroniques: [],
    traitements_en_cours: [],
    cree_le: "2024-06-01",
  },
  {
    id: "p8", code: "DOS-0008", nom: "Djelloul", prenom: "Amina", sexe: "F", date_naissance: "1970-03-22",
    groupe_sanguin: "B-", telephone: "0555 80 99 00",
    wilaya: "Sétif", commune: "El Eulma", adresse: "Rue Emir Abdelkader",
    numero_securite_sociale: "700322061778899", numero_chifa: "CH-0000567890",
    type_assurance: "CNAS",
    antecedents: ["Hystérectomie 2018"], allergies: [], maladies_chroniques: ["HTA"],
    traitements_en_cours: ["Amlodipine 10 mg"],
    chronique_hta: true,
    cree_le: "2024-02-14",
  },
];

// ---------------- Rendez-vous ---------------------------------

export const rendezVous: RendezVous[] = [
  { id: "rdv1", patient_id: "p1", medecin_id: "u1", date: today(0), heure: "09:00", duree_minutes: 20, motif: "Suivi diabète", statut: "CONFIRME" },
  { id: "rdv2", patient_id: "p3", medecin_id: "u2", date: today(0), heure: "09:30", duree_minutes: 30, motif: "Contrôle cardio", statut: "EN_ATTENTE" },
  { id: "rdv3", patient_id: "p4", medecin_id: "u1", date: today(0), heure: "10:15", duree_minutes: 20, motif: "Consultation générale", statut: "CONFIRME" },
  { id: "rdv4", patient_id: "p2", medecin_id: "u1", date: today(0), heure: "11:00", duree_minutes: 20, motif: "Renouvellement ordonnance", statut: "CONFIRME" },
  { id: "rdv5", patient_id: "p6", medecin_id: "u1", date: today(0), heure: "14:00", duree_minutes: 30, motif: "Suivi HTA", statut: "CONFIRME" },
  { id: "rdv6", patient_id: "p5", medecin_id: "u1", date: today(1), heure: "09:00", duree_minutes: 20, motif: "Toux persistante", statut: "EN_ATTENTE" },
  { id: "rdv7", patient_id: "p7", medecin_id: "u2", date: today(1), heure: "10:00", duree_minutes: 20, motif: "Bilan lipidique", statut: "CONFIRME" },
  { id: "rdv8", patient_id: "p8", medecin_id: "u1", date: today(2), heure: "11:30", duree_minutes: 20, motif: "Suivi HTA", statut: "CONFIRME" },
  { id: "rdv9", patient_id: "p1", medecin_id: "u2", date: today(-1), heure: "15:00", duree_minutes: 20, motif: "Contrôle cardio", statut: "TERMINE" },
  { id: "rdv10", patient_id: "p6", medecin_id: "u1", date: today(-2), heure: "10:00", duree_minutes: 20, motif: "Suivi diabète", statut: "TERMINE" },
  { id: "rdv11", patient_id: "p4", medecin_id: "u1", date: today(-3), heure: "09:30", duree_minutes: 20, motif: "Consultation générale", statut: "ABSENT" },
];

// ---------------- Consultations -------------------------------

export const consultations: Consultation[] = [
  {
    id: "c1", patient_id: "p1", medecin_id: "u1", date: nowIso(-60 * 24 * 30),
    motif: "Suivi diabète type 2", symptomes: "Fatigue légère, soif accrue",
    examen_clinique: "Auscultation normale, pieds sans lésion",
    diagnostic: "Diabète type 2 équilibré, HTA stable",
    codes_cim10: ["E11.9", "I10"],
    notes: "Poursuivre traitement actuel, contrôle HbA1c dans 3 mois",
    signes_vitaux: { tension_systolique: 135, tension_diastolique: 82, poids_kg: 84, taille_cm: 172, temperature: 36.7, frequence_cardiaque: 78, glycemie: 1.42 },
  },
  {
    id: "c2", patient_id: "p6", medecin_id: "u1", date: nowIso(-60 * 24 * 15),
    motif: "Suivi HTA + diabète", symptomes: "Céphalées occasionnelles",
    examen_clinique: "Œdèmes des membres inférieurs discrets",
    diagnostic: "HTA non équilibrée",
    codes_cim10: ["I10", "E11.9"],
    notes: "Augmenter Losartan à 100 mg, contrôle dans 2 semaines",
    signes_vitaux: { tension_systolique: 158, tension_diastolique: 96, poids_kg: 72, taille_cm: 160, temperature: 36.6, frequence_cardiaque: 82, glycemie: 1.85 },
  },
  {
    id: "c3", patient_id: "p3", medecin_id: "u2", date: nowIso(-60 * 24 * 7),
    motif: "Douleur thoracique atypique", symptomes: "Douleur rétrosternale à l'effort",
    examen_clinique: "Auscultation cardiaque: rythme régulier, pas de souffle",
    diagnostic: "Angor stable — à explorer",
    codes_cim10: ["I20.9"],
    notes: "ECG demandé, épreuve d'effort à programmer",
    signes_vitaux: { tension_systolique: 145, tension_diastolique: 90, poids_kg: 78, taille_cm: 168, temperature: 36.5, frequence_cardiaque: 88 },
  },
];

// ---------------- Médicaments ---------------------------------

export const medicaments: Medicament[] = [
  { id: "m1", nom_commercial: "Metformine EG", dci: "Metformine", forme: "Comprimé 850 mg", laboratoire: "EG Labo", prix_da: 380 },
  { id: "m2", nom_commercial: "Amlodipine Sandoz", dci: "Amlodipine", forme: "Comprimé 5 mg", laboratoire: "Sandoz", prix_da: 420 },
  { id: "m3", nom_commercial: "Losartan Biogaran", dci: "Losartan", forme: "Comprimé 50 mg", laboratoire: "Biogaran", prix_da: 510 },
  { id: "m4", nom_commercial: "Bisoprolol Merck", dci: "Bisoprolol", forme: "Comprimé 5 mg", laboratoire: "Merck", prix_da: 490 },
  { id: "m5", nom_commercial: "Atorvastatine Zydus", dci: "Atorvastatine", forme: "Comprimé 20 mg", laboratoire: "Zydus", prix_da: 720 },
  { id: "m6", nom_commercial: "Clopidogrel Mylan", dci: "Clopidogrel", forme: "Comprimé 75 mg", laboratoire: "Mylan", prix_da: 980, interactions: ["m11"] },
  { id: "m7", nom_commercial: "Amoxicilline Saidal", dci: "Amoxicilline", forme: "Gélule 500 mg", laboratoire: "Saidal", prix_da: 240, contre_indications: ["Pénicilline"] },
  { id: "m8", nom_commercial: "Paracétamol Saidal", dci: "Paracétamol", forme: "Comprimé 1 g", laboratoire: "Saidal", prix_da: 60 },
  { id: "m9", nom_commercial: "Ventoline", dci: "Salbutamol", forme: "Aérosol 100 µg", laboratoire: "GSK", prix_da: 350 },
  { id: "m10", nom_commercial: "Levothyrox", dci: "Lévothyroxine", forme: "Comprimé 50 µg", laboratoire: "Merck", prix_da: 180 },
  { id: "m11", nom_commercial: "Aspégic 100", dci: "Acide acétylsalicylique", forme: "Sachet 100 mg", laboratoire: "Sanofi", prix_da: 120, contre_indications: ["Aspirine"], interactions: ["m6"] },
  { id: "m12", nom_commercial: "Ibuprofène EG", dci: "Ibuprofène", forme: "Comprimé 400 mg", laboratoire: "EG", prix_da: 150 },
  { id: "m13", nom_commercial: "Oméprazole Mylan", dci: "Oméprazole", forme: "Gélule 20 mg", laboratoire: "Mylan", prix_da: 340 },
  { id: "m14", nom_commercial: "Insuline lente Lantus", dci: "Insuline glargine", forme: "Stylo 100 UI/ml", laboratoire: "Sanofi", prix_da: 2400 },
];

// ---------------- Ordonnances ---------------------------------

export const ordonnances: Ordonnance[] = [
  {
    id: "ord1", patient_id: "p1", medecin_id: "u1", consultation_id: "c1", date: nowIso(-60 * 24 * 30),
    lignes: [
      { medicament_id: "m1", nom: "Metformine EG 850 mg", dosage: "1 comprimé", posologie: "2 fois par jour, au milieu des repas", duree: "3 mois" },
      { medicament_id: "m2", nom: "Amlodipine Sandoz 5 mg", dosage: "1 comprimé", posologie: "1 fois par jour, le matin", duree: "3 mois" },
    ],
  },
  {
    id: "ord2", patient_id: "p6", medecin_id: "u1", consultation_id: "c2", date: nowIso(-60 * 24 * 15),
    lignes: [
      { medicament_id: "m3", nom: "Losartan Biogaran 50 mg", dosage: "2 comprimés", posologie: "1 fois par jour", duree: "1 mois" },
      { medicament_id: "m14", nom: "Insuline lente Lantus", dosage: "20 UI", posologie: "1 injection le soir", duree: "1 mois" },
    ],
  },
];

// ---------------- Examens -------------------------------------

export const examens: Examen[] = [
  { id: "e1", patient_id: "p1", medecin_id: "u1", consultation_id: "c1", type: "ANALYSE", intitule: "HbA1c, glycémie à jeun, bilan lipidique", laboratoire: "Labo Ibn Rochd", date_demande: today(-25), date_resultat: today(-20), statut: "RESULTAT_RECU", resultat_notes: "HbA1c: 7.2%, LDL 1.35 g/L", fichier_nom: "resultat_p1_20250601.pdf" },
  { id: "e2", patient_id: "p3", medecin_id: "u2", consultation_id: "c3", type: "ECG", intitule: "ECG de repos + épreuve d'effort", date_demande: today(-6), statut: "EN_ATTENTE_RESULTAT" },
  { id: "e3", patient_id: "p6", medecin_id: "u1", type: "ANALYSE", intitule: "Fonction rénale, ionogramme", laboratoire: "Labo Central", date_demande: today(-14), date_resultat: today(-10), statut: "RESULTAT_RECU", resultat_notes: "Créatininémie 12 mg/L, DFG 68", fichier_nom: "resultat_p6.pdf" },
  { id: "e4", patient_id: "p5", medecin_id: "u1", type: "RADIO", intitule: "Radiographie thorax face + profil", date_demande: today(-2), statut: "DEMANDE" },
];

// ---------------- Certificats ---------------------------------

export const certificats: Certificat[] = [
  { id: "cert1", patient_id: "p4", medecin_id: "u1", type: "ARRET_TRAVAIL", date: today(-5), duree_jours: 3, motif: "Grippe saisonnière", contenu: "Je soussigné Dr Belkacem certifie que Mme Ouali Sabrina nécessite un arrêt de travail de 3 jours." },
  { id: "cert2", patient_id: "p1", medecin_id: "u1", type: "MEDICAL", date: today(-30), motif: "Attestation d'aptitude", contenu: "Je soussigné Dr Belkacem certifie que M. Benaissa Karim est apte à la pratique sportive modérée." },
];

// ---------------- Nomenclature des actes / tarifs --------------

export const actesNomenclature: ActeNomenclature[] = [
  { code: "CONS-GEN", libelle: "Consultation générale", categorie: "Consultation", prix_da: 1500 },
  { code: "CONS-SPE", libelle: "Consultation spécialiste", categorie: "Consultation", prix_da: 2500 },
  { code: "CONS-URG", libelle: "Consultation urgente", categorie: "Consultation", prix_da: 3000 },
  { code: "CONS-CTRL", libelle: "Consultation de contrôle", categorie: "Consultation", prix_da: 1000 },
  { code: "PANS", libelle: "Pansement simple", categorie: "Soins", prix_da: 800 },
  { code: "INJ", libelle: "Injection IM/IV", categorie: "Soins", prix_da: 500 },
  { code: "ECG", libelle: "Électrocardiogramme", categorie: "Examen", prix_da: 2000 },
  { code: "SUTURE", libelle: "Suture simple", categorie: "Petite chirurgie", prix_da: 3500 },
  { code: "VAC", libelle: "Vaccination", categorie: "Prévention", prix_da: 700 },
  { code: "CERT", libelle: "Certificat médical", categorie: "Administratif", prix_da: 500 },
];

// ---------------- Factures / paiements ------------------------

export const factures: Facture[] = [
  {
    id: "f1", numero: "FA-2026-0001", patient_id: "p1", medecin_id: "u1", consultation_id: "c1", date: today(-30),
    lignes: [{ code_acte: "CONS-GEN", libelle: "Consultation générale", quantite: 1, prix_unitaire_da: 1500 }],
    total_da: 1500, part_patient_da: 600, part_assurance_da: 900, paye_da: 1500, statut: "PAYE",
  },
  {
    id: "f2", numero: "FA-2026-0002", patient_id: "p3", medecin_id: "u2", consultation_id: "c3", date: today(-7),
    lignes: [
      { code_acte: "CONS-SPE", libelle: "Consultation cardiologue", quantite: 1, prix_unitaire_da: 2500 },
      { code_acte: "ECG", libelle: "Électrocardiogramme", quantite: 1, prix_unitaire_da: 2000 },
    ],
    total_da: 4500, part_patient_da: 4500, part_assurance_da: 0, paye_da: 2000, statut: "PARTIEL",
  },
  {
    id: "f3", numero: "FA-2026-0003", patient_id: "p6", medecin_id: "u1", consultation_id: "c2", date: today(-15),
    lignes: [{ code_acte: "CONS-CTRL", libelle: "Consultation de contrôle", quantite: 1, prix_unitaire_da: 1000 }],
    total_da: 1000, part_patient_da: 400, part_assurance_da: 600, paye_da: 0, statut: "IMPAYE",
  },
  {
    id: "f4", numero: "FA-2026-0004", patient_id: "p4", medecin_id: "u1", date: today(-2),
    lignes: [
      { code_acte: "CONS-GEN", libelle: "Consultation générale", quantite: 1, prix_unitaire_da: 1500 },
      { code_acte: "CERT", libelle: "Certificat médical", quantite: 1, prix_unitaire_da: 500 },
    ],
    total_da: 2000, part_patient_da: 2000, part_assurance_da: 0, paye_da: 2000, statut: "PAYE",
  },
];

export const paiements: Paiement[] = [
  { id: "pay1", facture_id: "f1", patient_id: "p1", date: today(-30), montant_da: 1500, methode: "ESPECES" },
  { id: "pay2", facture_id: "f2", patient_id: "p3", date: today(-7), montant_da: 2000, methode: "ESPECES", reference: "Acompte" },
  { id: "pay3", facture_id: "f4", patient_id: "p4", date: today(-2), montant_da: 2000, methode: "CARTE", reference: "CB **** 2341" },
];

// ---------------- Dépenses -----------------------------------

export const depenses: Depense[] = [
  { id: "d1", date: today(-30), categorie: "LOYER", libelle: "Loyer cabinet — Juin", montant_da: 65000, methode: "VIREMENT", fournisseur: "SCI Riadh" },
  { id: "d2", date: today(-25), categorie: "SALAIRES", libelle: "Salaire secrétaire", montant_da: 45000, methode: "VIREMENT" },
  { id: "d3", date: today(-15), categorie: "FOURNITURES", libelle: "Consommables médicaux", montant_da: 12500, methode: "ESPECES", fournisseur: "Pharma Distrib" },
  { id: "d4", date: today(-10), categorie: "ELECTRICITE", libelle: "Facture Sonelgaz", montant_da: 8400, methode: "VIREMENT" },
  { id: "d5", date: today(-5), categorie: "INTERNET", libelle: "Abonnement Fibre Algérie Télécom", montant_da: 3200, methode: "VIREMENT" },
  { id: "d6", date: today(-2), categorie: "PHARMACIE", libelle: "Réassort pharmacie interne", montant_da: 22000, methode: "CHEQUE", fournisseur: "Saidal" },
];

// ---------------- Stock ---------------------------------------

export const stock: ArticleStock[] = [
  { id: "s1", nom: "Paracétamol 1 g", categorie: "MEDICAMENT", quantite: 120, unite: "boîte", seuil_alerte: 30, date_peremption: "2027-04-30", prix_unitaire_da: 60 },
  { id: "s2", nom: "Amoxicilline 500 mg", categorie: "MEDICAMENT", quantite: 22, unite: "boîte", seuil_alerte: 25, date_peremption: "2026-11-15", prix_unitaire_da: 240 },
  { id: "s3", nom: "Seringues 5 ml", categorie: "CONSOMMABLE", quantite: 300, unite: "unité", seuil_alerte: 100, prix_unitaire_da: 15 },
  { id: "s4", nom: "Gants nitrile taille M", categorie: "CONSOMMABLE", quantite: 8, unite: "boîte", seuil_alerte: 10, prix_unitaire_da: 850 },
  { id: "s5", nom: "Bandes de gaze", categorie: "CONSOMMABLE", quantite: 45, unite: "rouleau", seuil_alerte: 20, prix_unitaire_da: 90 },
  { id: "s6", nom: "Insuline Lantus stylo", categorie: "MEDICAMENT", quantite: 15, unite: "stylo", seuil_alerte: 5, date_peremption: "2026-08-01", prix_unitaire_da: 2400 },
  { id: "s7", nom: "Tensiomètre électronique", categorie: "MATERIEL", quantite: 2, unite: "unité", seuil_alerte: 1, prix_unitaire_da: 8500 },
  { id: "s8", nom: "Bandelettes glycémie", categorie: "CONSOMMABLE", quantite: 4, unite: "boîte 50", seuil_alerte: 10, date_peremption: "2026-09-30", prix_unitaire_da: 1800 },
];

// ---------------- Suivi chronique -----------------------------

export const relevesChroniques: ReleveChronique[] = [
  { id: "rc1", patient_id: "p1", date: today(-120), glycemie: 1.55, tension_sys: 138, tension_dia: 84, poids_kg: 86, imc: 29.1 },
  { id: "rc2", patient_id: "p1", date: today(-90), glycemie: 1.48, tension_sys: 136, tension_dia: 82, poids_kg: 85, imc: 28.7 },
  { id: "rc3", patient_id: "p1", date: today(-60), glycemie: 1.44, tension_sys: 135, tension_dia: 82, poids_kg: 84, imc: 28.4 },
  { id: "rc4", patient_id: "p1", date: today(-30), glycemie: 1.42, tension_sys: 135, tension_dia: 80, poids_kg: 84, imc: 28.4 },
  { id: "rc5", patient_id: "p1", date: today(-7), glycemie: 1.38, tension_sys: 132, tension_dia: 78, poids_kg: 83, imc: 28.0 },

  { id: "rc6", patient_id: "p6", date: today(-120), glycemie: 1.90, tension_sys: 160, tension_dia: 100, poids_kg: 73, imc: 28.5 },
  { id: "rc7", patient_id: "p6", date: today(-90), glycemie: 1.86, tension_sys: 158, tension_dia: 98, poids_kg: 72, imc: 28.1 },
  { id: "rc8", patient_id: "p6", date: today(-60), glycemie: 1.85, tension_sys: 158, tension_dia: 96, poids_kg: 72, imc: 28.1 },
  { id: "rc9", patient_id: "p6", date: today(-30), glycemie: 1.80, tension_sys: 154, tension_dia: 92, poids_kg: 71, imc: 27.7 },
  { id: "rc10", patient_id: "p6", date: today(-7), glycemie: 1.75, tension_sys: 150, tension_dia: 90, poids_kg: 71, imc: 27.7 },

  { id: "rc11", patient_id: "p3", date: today(-90), tension_sys: 148, tension_dia: 92, poids_kg: 79, imc: 28.0 },
  { id: "rc12", patient_id: "p3", date: today(-60), tension_sys: 145, tension_dia: 90, poids_kg: 78, imc: 27.6 },
  { id: "rc13", patient_id: "p3", date: today(-30), tension_sys: 142, tension_dia: 88, poids_kg: 78, imc: 27.6 },
  { id: "rc14", patient_id: "p3", date: today(-7), tension_sys: 140, tension_dia: 88, poids_kg: 77, imc: 27.3 },
];

// ---------------- CIM-10 (extrait) ---------------------------

export const cim10: CIM10[] = [
  { code: "E11.9", libelle: "Diabète sucré de type 2, sans complication" },
  { code: "E10.9", libelle: "Diabète sucré de type 1, sans complication" },
  { code: "I10", libelle: "Hypertension essentielle (primitive)" },
  { code: "I20.9", libelle: "Angine de poitrine, sans précision" },
  { code: "I21.9", libelle: "Infarctus aigu du myocarde, sans précision" },
  { code: "J45.9", libelle: "Asthme, sans précision" },
  { code: "J06.9", libelle: "Infection aiguë des voies respiratoires supérieures" },
  { code: "K21.0", libelle: "Reflux gastro-œsophagien avec œsophagite" },
  { code: "N39.0", libelle: "Infection urinaire, siège non précisé" },
  { code: "M54.5", libelle: "Lombalgie basse" },
  { code: "R51", libelle: "Céphalées" },
  { code: "R50.9", libelle: "Fièvre, sans précision" },
  { code: "E03.9", libelle: "Hypothyroïdie, sans précision" },
  { code: "E78.5", libelle: "Hyperlipidémie, sans précision" },
  { code: "Z00.0", libelle: "Examen médical général" },
];
