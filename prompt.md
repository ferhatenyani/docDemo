# Prompt — Système de Gestion Médicale (Clinique / Cabinet — Algérie)

Build a complete **medical practice management system** ("système de gestion") for clinics and doctors in Algeria. One-shot it as a working web application. Focus on the features below — make every feature functional with realistic sample data.

## Core Requirements
- **Language:** Primary UI in **French**, with full **Arabic** support and an RTL toggle.
- **Currency:** All amounts in **Algerian Dinar (DA / DZD)**.
- **Roles & access:** Médecin, Secrétaire/Accueil, Administrateur — each with appropriate permissions.

## Features

### 1. Gestion des patients (Patient records)
- Patient file: nom, prénom, date de naissance, sexe, groupe sanguin, adresse (wilaya/commune), téléphone, email.
- **Numéro de sécurité sociale** and **carte Chifa** number; insurance type: **CNAS / CASNOS / assuré / ayant-droit / non-assuré**.
- Medical history: antécédents, allergies, chronic conditions, current treatments.
- Search and filter patients; quick patient lookup.

### 2. Rendez-vous (Appointments)
- Calendar view (day / week / month) per doctor.
- Book, reschedule, cancel; status (en attente, confirmé, terminé, absent).
- Waiting room / file d'attente view for the day.

### 3. Consultations
- New consultation linked to a patient: motif, symptômes, examen clinique, diagnostic, notes.
- Vital signs: tension, température, poids, taille, IMC (auto-calculated), fréquence cardiaque.
- Consultation history timeline per patient.

### 4. Ordonnances (Prescriptions)
- Create prescriptions with medications (nom, dosage, posologie, durée).
- Searchable medication list; reusable prescription templates.
- Printable/exportable ordonnance with clinic header, doctor info, and date.

### 5. Examens & résultats (Labs & imaging)
- Request lab tests / imaging (analyses, radio, etc.).
- Attach and store results (files/notes) per patient.

### 6. Certificats & documents
- Generate common documents: certificat médical, certificat d'arrêt de travail, bon de transport, lettre d'orientation.
- Printable / PDF export.

### 7. Facturation (Billing)
- Generate invoices in DA per consultation/acte.
- **Tarifs / nomenclature des actes** with editable prices.
- Track payment status (payé, impayé, partiel); patient part vs insurance part.
- Receipts (reçus) printable/exportable.

### 8. Caisse & paiements
- Daily cash register (caisse) summary: total encaissé, impayés.
- Payment methods (espèces, chèque, etc.).

### 9. Stock / pharmacie interne (optional inventory)
- Track medications and supplies: quantité, seuil d'alerte, date de péremption.
- Low-stock and expiry alerts.

### 10. Tableau de bord & statistiques
- KPIs: patients du jour, RDV à venir, recettes du jour/mois, impayés.
- Charts: consultations over time, revenue, patient demographics.

### 11. Administration
- Manage doctors, staff, clinic info (raison sociale, adresse, téléphone).
- User management with roles and login.

### 12. Sécurité clinique
- **Alertes interactions médicamenteuses & allergies**: flag contraindications when prescribing against the patient's recorded allergies and current treatments.
- **Codage CIM-10 (ICD-10)** for diagnoses, used in records and statistics.

### 13. Suivi des maladies chroniques
- Dedicated module for **diabète** and **hypertension (HTA)** — the most common cases.
- Track readings over time (glycémie, tension, IMC) with **trend graphs** and target ranges.
- Flag overdue follow-ups for enrolled chronic patients.

### 14. Comptabilité & dépenses
- Track clinic **dépenses** alongside revenue for a real net view (recettes – dépenses).
- Monthly and end-of-year fiscal summaries in DA.

## Technical notes
- **Initialize the project with Next.js.**
- **Use mock data only for now** (in-memory / local JSON) — no backend yet. The data layer will be wired up to **Supabase** later, so structure data access so it can be swapped to Supabase cleanly (typed models, a single data-access layer, no DB-specific assumptions in the UI).
- Pre-populate with realistic Algerian sample data (noms, wilayas, actes, tarifs in DA) so every screen is usable immediately.
- **Offline-friendly:** keep the app usable through connectivity drops (this matters in Algeria).
- Ensure printing/export works for ordonnances, certificats, and factures.

## Design & orchestration
- **Invoke the `ui-ux-pro-max` skill** to drive the design direction.
- **Orchestrate subagents**: loop over the feature/task list above, delegating to subagents, and keep iterating until all requirements are satisfied.