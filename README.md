## 1. Contexte & Objectifs

- **Contexte :**
  Développement d’une application de facturation sur-mesure destinée à la gestion interne d’un client unique (principalement des entreprises, exceptionnellement des personnes).

- **Objectifs :**
  - Permettre la gestion des clients (entités), de leurs contrats et de la génération/manipulation des factures.
  - Assurer une historisation complète de toutes les modifications apportées aux contrats et factures pour garantir la traçabilité et la conformité (RGPD et obligations fiscales).
  - Offrir une interface web moderne, responsive et sécurisée (authentification JWT) avec une expérience utilisateur simple (un seul utilisateur final).

---

## 2. Architecture Technique & Technologies

- **Backend :**

  - Node.js avec TypeScript
  - ORM Prisma pour la gestion de la base de données
  - API déployée sous AWS Lambda via API Gateway (choix d’AWS pour la base de données à optimiser en fonction des coûts : RDS, Aurora Serverless ou autre)

- **Frontend :**

  - React avec TypeScript
  - Authentification par JWT (email/password classique)

- **Stockage & Envoi :**

  - Stockage des PDF générés sur AWS S3
  - Envoi d’emails via Nodemailer, avec template d’email éditable via l’interface
  - Génération du PDF basée sur un template in-code (non modifiable)

- **Infrastructure :**
  - Utilisation d’AWS pour l’hébergement de la base de données et le déploiement de l’API
  - L’application doit être conçue pour être performante et scalable (API en Lambda, architecture serverless)

---

## 3. Fonctionnalités & Workflow

### A. Gestion des Clients (Entités)

- **Définition :**
  Un client représente une entreprise (ou une personne dans un cas exceptionnel).
- **Relation :**
  Chaque client peut posséder plusieurs contrats.

### B. Gestion des Contrats

- **Informations contractuelles :**
  - Montant (HT/TTC) mensuel
  - Conditions de paiement (délai configurable en nombre de jours)
  - Date de fin de contrat
  - Description de la prestation et mentions éventuelles d’extras
- **Modification & Historisation :**
  - Possibilité de modifier toutes les données (montant, date de fin, conditions, etc.)
  - Chaque modification (y compris les augmentations) doit être loguée intégralement pour alimenter un tableau d’historique (incluant montant avant/après, date, utilisateur, etc.)
  - Les modifications n’impactent que les factures générées après la modification, les factures déjà générées et validées restent inchangées.

### C. Gestion des Factures

- **Génération :**
  - Initiée manuellement via l’interface sur le contrat sélectionné (1 facture par contrat par mois).
  - Les informations issues du contrat pré-remplissent la facture, avec possibilité de modification avant validation.
- **Modification & Workflow :**
  - **Sauvegarde :** Permet d’enregistrer la facture en mode brouillon.
  - **Validation :** Permet de verrouiller la facture, rendant toute modification impossible.
  - **Envoi :**
    - L’envoi d’un email via l’interface déclenche automatiquement la validation (si non déjà validée).
    - L’envoi n’est pas automatique lors de la validation seule.
- **Numérotation :**
  - Format : `AAAA-xxxxx` (ex. 2025-00001)
  - Numéro global incrémental, généré automatiquement par l’API en détectant l’année courante (réinitialisation annuelle).
  - La numérotation n’est pas modifiable manuellement.
- **Items Supplémentaires :**
  - Possibilité d’ajouter des items (ex. interventions) en supplément sur la facture, à développer ultérieurement.
- **Historique d’Envoi :**
  - Chaque facture stocke la date d’envoi de l’email afin d’assurer une traçabilité complète.

### D. Templates d’Email et Génération PDF

- **Email :**
  - Le template d’email est éditable via l’interface avec des variables (nom de l’entreprise, numéro de facture, etc.).
  - L’utilisateur peut ajuster le contenu avant envoi.
- **PDF :**
  - Le template PDF est codé en dur et ne sera pas modifiable.
  - Une fois la facture validée, le PDF est généré et stocké de façon permanente sur AWS S3.

---

## 4. Conformité & Normes

- **RGPD :**

  - Mise en œuvre de mesures garantissant la protection des données (historisation, sécurisation des accès, conservation limitée selon la réglementation).
  - Documentation des actions et modifications pour répondre aux exigences d’audit et de traçabilité.

- **Normes Fiscales Françaises :**
  - Respect des obligations légales en matière de facturation (mentions obligatoires : identification de l’émetteur, conditions de paiement, etc.).
  - Conservation des factures et contrats conformément aux règles en vigueur en France.
  - Veiller à intégrer dans le système les règles spécifiques (durée de conservation, obligations d’affichage, etc.) en s’appuyant sur des sources spécialisées et validées (par exemple, sites gouvernementaux et de référence fiscale).

---

## 5. Sécurité & Gestion Utilisateur

- **Authentification :**

  - Connexion via JWT (email/password).
  - Pas de gestion de rôles complexe puisque l’application est destinée à un seul utilisateur.

- **Journalisation :**
  - Enregistrement de toutes les actions sur les contrats et factures pour audit et conformité.

---

## 6. Exigences Non Fonctionnelles

- **Performance & Scalabilité :**

  - Utilisation d’une architecture serverless (AWS Lambda) pour une gestion dynamique de la charge.
  - Code modulaire et optimisé suivant les bonnes pratiques TypeScript et le guide de style Airbnb.

- **Maintenance & Évolutivité :**
  - Application conçue pour être facilement étendue (intégration future d’items supplémentaires, automatisation de certains flux, etc.).
  - Documentation technique complète (diagrammes d’architecture, guides de déploiement, tests unitaires et fonctionnels).

---

## 7. Livrables Attendus

- **Code source complet** (backend et frontend) conforme aux normes TypeScript et aux bonnes pratiques de développement.
- **Documentation technique** détaillée incluant :
  - Diagrammes d’architecture (relation entre clients, contrats et factures)
  - Description des workflows et des modèles de données
  - Instructions de déploiement (configuration AWS, gestion des Lambda, base de données et S3)
- **Jeu de tests** (unitaires et fonctionnels) pour garantir la robustesse et la conformité du système.
- **Guide de mise en conformité** précisant les mesures RGPD et les mentions obligatoires sur les factures.
