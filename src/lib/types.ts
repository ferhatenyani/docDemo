// -------------------------------------------------------------
// Domain types — designed to map cleanly to Supabase later.
// -------------------------------------------------------------

export type ISODate = string;   // e.g. "2026-07-01"
export type ISODateTime = string; // e.g. "2026-07-01T09:30:00"

export type Sexe = "M" | "F";
export type GroupeSanguin =
  | "A+" | "A-"
  | "B+" | "B-"
  | "AB+" | "AB-"
  | "O+" | "O-";

export type TypeAssurance =
  | "CNAS"
  | "CASNOS"
  | "ASSURE"
  | "AYANT_DROIT"
  | "NON_ASSURE";

export type Role = "MEDECIN" | "SECRETAIRE" | "ADMIN";

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  specialite?: string;
  telephone?: string;
  actif: boolean;
  cree_le: ISODate;
}

export interface Clinique {
  id: string;
  raison_sociale: string;
  adresse: string;
  wilaya: string;
  commune: string;
  telephone: string;
  email: string;
  nif?: string;
  rc?: string;
  ai?: string;
}

export interface Patient {
  id: string;
  code: string; // dossier n°
  nom: string;
  prenom: string;
  sexe: Sexe;
  date_naissance: ISODate;
  groupe_sanguin?: GroupeSanguin;
  telephone: string;
  email?: string;
  wilaya: string;
  commune: string;
  adresse: string;
  numero_securite_sociale?: string;
  numero_chifa?: string;
  type_assurance: TypeAssurance;
  antecedents: string[];
  allergies: string[];
  maladies_chroniques: MaladieChronique[];
  traitements_en_cours: string[];
  chronique_diabete?: boolean;
  chronique_hta?: boolean;
  cree_le: ISODate;
  notes?: string;
}

export type MaladieChronique =
  | "Diabète type 1"
  | "Diabète type 2"
  | "HTA"
  | "Asthme"
  | "Insuffisance rénale"
  | "Cardiopathie"
  | "Dyslipidémie"
  | "Hypothyroïdie";

export type StatutRDV =
  | "EN_ATTENTE"
  | "CONFIRME"
  | "TERMINE"
  | "ABSENT"
  | "ANNULE";

export interface RendezVous {
  id: string;
  patient_id: string;
  medecin_id: string;
  date: ISODate;
  heure: string;   // "HH:mm"
  duree_minutes: number;
  motif: string;
  statut: StatutRDV;
  notes?: string;
}

export interface SigneVital {
  tension_systolique?: number; // mmHg
  tension_diastolique?: number;
  temperature?: number; // °C
  poids_kg?: number;
  taille_cm?: number;
  frequence_cardiaque?: number; // bpm
  glycemie?: number; // g/L
  saturation?: number; // %
}

export interface Consultation {
  id: string;
  patient_id: string;
  medecin_id: string;
  rdv_id?: string;
  date: ISODateTime;
  motif: string;
  symptomes: string;
  examen_clinique: string;
  diagnostic: string;
  codes_cim10: string[];
  notes: string;
  signes_vitaux: SigneVital;
}

export interface Medicament {
  id: string;
  nom_commercial: string;
  dci: string; // dénomination commune internationale
  forme: string; // "Comprimé 500 mg", etc.
  laboratoire?: string;
  prix_da?: number;
  interactions?: string[]; // ids of medicaments that interact
  contre_indications?: string[]; // free text (allergies etc.)
}

export interface LignePrescription {
  medicament_id: string;
  nom: string;   // snapshot at prescription time
  dosage: string;
  posologie: string;
  duree: string;
  instructions?: string;
}

export interface Ordonnance {
  id: string;
  patient_id: string;
  medecin_id: string;
  consultation_id?: string;
  date: ISODateTime;
  lignes: LignePrescription[];
  remarques?: string;
}

export type TypeExamen = "ANALYSE" | "RADIO" | "ECHO" | "SCANNER" | "IRM" | "ECG" | "AUTRE";
export type StatutExamen = "DEMANDE" | "PRESCRIT" | "EN_ATTENTE_RESULTAT" | "RESULTAT_RECU";

export interface Examen {
  id: string;
  patient_id: string;
  medecin_id: string;
  consultation_id?: string;
  type: TypeExamen;
  intitule: string;
  laboratoire?: string;
  date_demande: ISODate;
  date_resultat?: ISODate;
  statut: StatutExamen;
  resultat_notes?: string;
  fichier_nom?: string;
}

export type TypeCertificat =
  | "MEDICAL"
  | "ARRET_TRAVAIL"
  | "BON_TRANSPORT"
  | "ORIENTATION"
  | "APTITUDE"
  | "AUTRE";

export interface Certificat {
  id: string;
  patient_id: string;
  medecin_id: string;
  type: TypeCertificat;
  date: ISODate;
  duree_jours?: number;
  motif: string;
  contenu: string;
}

export interface ActeNomenclature {
  code: string;   // e.g. "CONS-GEN"
  libelle: string;
  categorie: string;
  prix_da: number;
}

export type StatutFacture = "IMPAYE" | "PARTIEL" | "PAYE" | "ANNULE";
export type MethodePaiement = "ESPECES" | "CHEQUE" | "CARTE" | "VIREMENT";

export interface LigneFacture {
  code_acte: string;
  libelle: string;
  quantite: number;
  prix_unitaire_da: number;
}

export interface Facture {
  id: string;
  numero: string;
  patient_id: string;
  medecin_id: string;
  consultation_id?: string;
  date: ISODate;
  lignes: LigneFacture[];
  total_da: number;
  part_patient_da: number;
  part_assurance_da: number;
  paye_da: number;
  statut: StatutFacture;
  notes?: string;
}

export interface Paiement {
  id: string;
  facture_id: string;
  patient_id: string;
  date: ISODate;
  montant_da: number;
  methode: MethodePaiement;
  reference?: string;
}

export type CategorieDepense =
  | "LOYER"
  | "SALAIRES"
  | "FOURNITURES"
  | "PHARMACIE"
  | "MAINTENANCE"
  | "ELECTRICITE"
  | "INTERNET"
  | "AUTRE";

export interface Depense {
  id: string;
  date: ISODate;
  categorie: CategorieDepense;
  libelle: string;
  montant_da: number;
  fournisseur?: string;
  methode: MethodePaiement;
}

export interface ArticleStock {
  id: string;
  nom: string;
  categorie: "MEDICAMENT" | "CONSOMMABLE" | "MATERIEL";
  quantite: number;
  unite: string;
  seuil_alerte: number;
  date_peremption?: ISODate;
  prix_unitaire_da?: number;
  emplacement?: string;
}

export interface ReleveChronique {
  id: string;
  patient_id: string;
  date: ISODate;
  glycemie?: number;
  tension_sys?: number;
  tension_dia?: number;
  poids_kg?: number;
  imc?: number;
  notes?: string;
}

export interface CIM10 {
  code: string;
  libelle: string;
}
